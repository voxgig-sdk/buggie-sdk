

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { BuggieSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('IssueEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when BUGGIE_TEST_LIVE=TRUE.
  afterEach(liveDelay('BUGGIE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = BuggieSDK.test()
    const ent = testsdk.Issue()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('issue hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of BuggieSDK.test(offline).Issue().stream('list')) { }
    }, /offline/)

    for await (const _item of BuggieSDK.test(offline).Issue()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = BuggieSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Issue().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of BuggieSDK.test().Issue().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new BuggieSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Issue().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Issue().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = BuggieSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Issue().list({"page":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.BUGGIE_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'issue.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"assignee":{"a":true,"h":"Assignee","n":"assignee","r":false,"t":"`$OBJECT`","key$":"assignee","index$":0},"assignee_id":{"a":true,"h":"Assignee Id","n":"assignee_id","r":false,"sh":"A member of the team.","t":"`$INTEGER`","key$":"assignee_id","index$":1},"board_pinned":{"a":true,"h":"Board Pinned","n":"board_pinned","r":false,"sh":"A pinned card stays on the board whatever the filter says.","t":"`$BOOLEAN`","key$":"board_pinned","index$":2},"client_audience":{"a":true,"h":"Client Audience","n":"client_audience","r":false,"sh":"Which clients see a client-visible issue.","t":"`$STRING`","key$":"client_audience","index$":3},"client_share_ids":{"a":true,"h":"Client Share Ids","n":"client_share_ids","r":false,"sh":"The clients an issue is shared with, by user id, when `client_audience` is `specific`.","t":"`$ARRAY`","key$":"client_share_ids","index$":4},"closed_at":{"a":true,"fo":"date-time","h":"Closed At","n":"closed_at","r":false,"t":"`$STRING`","key$":"closed_at","index$":5},"created_at":{"a":true,"fo":"date-time","h":"Created At","n":"created_at","r":false,"t":"`$STRING`","key$":"created_at","index$":6},"custom_fields":{"a":true,"h":"Custom Fields","n":"custom_fields","r":false,"sh":"Custom field values keyed by the field's key, e.g.","t":"`$ANY`","key$":"custom_fields","index$":7},"description":{"a":true,"h":"Description","n":"description","r":false,"sh":"A rich-text document in Tiptap's JSON form, e.g.","t":"`$OBJECT`","key$":"description","index$":8},"due_on":{"a":true,"fo":"date","h":"Due On","n":"due_on","r":false,"t":"`$STRING`","key$":"due_on","index$":9},"estimate_minutes":{"a":true,"h":"Estimate Minutes","n":"estimate_minutes","r":false,"t":"`$INTEGER`","key$":"estimate_minutes","index$":10},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":11},"key":{"a":true,"h":"Key","n":"key","r":false,"t":"`$STRING`","key$":"key","index$":12},"labels":{"a":true,"h":"Labels","n":"labels","r":false,"sh":"Label names.","t":"`$ARRAY`","key$":"labels","index$":13},"occurrences":{"a":true,"h":"Occurrences","n":"occurrences","r":false,"sh":"How many times this bug has been reported, counting the first.","t":"`$INTEGER`","key$":"occurrences","index$":14},"parent":{"a":true,"h":"Parent","n":"parent","r":false,"sh":"An issue key; the new issue is created as its subtask.","t":"`$STRING`","key$":"parent","index$":15},"phase_id":{"a":true,"h":"Phase Id","n":"phase_id","r":false,"sh":"A phase of the issue's project.","t":"`$INTEGER`","key$":"phase_id","index$":16},"priority":{"a":true,"h":"Priority","n":"priority","r":false,"sh":"0 none, 1 low, 2 medium, 3 high, 4 urgent.","t":"`$INTEGER`","key$":"priority","index$":17},"project":{"a":true,"h":"Project","n":"project","r":false,"t":"`$OBJECT`","key$":"project","index$":18},"project_id":{"a":true,"h":"Project Id","n":"project_id","r":true,"sh":"The project's id, for a project the token's owner can see.","t":"`$INTEGER`","key$":"project_id","index$":19},"reporter":{"a":true,"h":"Reporter","n":"reporter","r":false,"t":"`$OBJECT`","key$":"reporter","index$":20},"start_on":{"a":true,"fo":"date","h":"Start On","n":"start_on","r":false,"t":"`$STRING`","key$":"start_on","index$":21},"status":{"a":true,"h":"Status","n":"status","r":false,"t":"`$OBJECT`","key$":"status","index$":22},"status_id":{"a":true,"h":"Status Id","n":"status_id","r":false,"sh":"A status of the workspace.","t":"`$INTEGER`","key$":"status_id","index$":23},"time_spent_minutes":{"a":true,"h":"Time Spent Minutes","n":"time_spent_minutes","r":false,"t":"`$INTEGER`","key$":"time_spent_minutes","index$":24},"title":{"a":true,"h":"Title","n":"title","op":{"create":{"req":true,"type":"`$STRING`"}},"r":false,"t":"`$STRING`","key$":"title","index$":25},"type":{"a":true,"h":"Type","n":"type","r":false,"t":"`$STRING`","key$":"type","index$":26},"updated_at":{"a":true,"fo":"date-time","h":"Updated At","n":"updated_at","r":false,"t":"`$STRING`","key$":"updated_at","index$":27},"version_id":{"a":true,"h":"Version Id","n":"version_id","r":false,"sh":"A release of the issue's project.","t":"`$INTEGER`","key$":"version_id","index$":28},"visibility":{"a":true,"h":"Visibility","n":"visibility","r":false,"t":"`$STRING`","key$":"visibility","index$":29}},"id":{"field":"id","name":"id"},"name":"issue","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["assignee_id","custom_fields","description","labels","parent","priority","project_id","status_id","title","type","visibility"],"co":{"id":"POST /v1/issues","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/v1/issues","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"issues"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /v1/issues","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":1,"k":"query","n":"page","or":"page","r":false,"t":"`$INTEGER`","index$":0},{"a":true,"ex":50,"k":"query","n":"per_page","or":"per_page","r":false,"t":"`$INTEGER`","index$":1},{"a":true,"k":"query","n":"q","or":"q","r":false,"t":"`$STRING`","index$":2}]},"k":"http","m":"GET","o":"/v1/issues","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"issues"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /v1/issues/{key}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"key","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/v1/issues/{key}","q":{"exist":["id"]},"r":{"param":{"key":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"issues"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"},"update":{"input":"data","name":"update","points":[{"a":true,"bf":["assignee_id","board_pinned","client_audience","client_share_ids","custom_fields","description","due_on","labels","phase_id","priority","start_on","status_id","title","type","version_id","visibility"],"co":{"id":"PATCH /v1/issues/{key}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"key","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PATCH","o":"/v1/issues/{key}","q":{"exist":["id"]},"r":{"param":{"key":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"v1"},{"lit":"issues"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"issue","name__orig":"issue","Name":"Issue","name_":"issue","name-":"issue","NAME":"ISSUE","index$":0}, {"active":true,"entity":"issue","key$":"BasicIssueFlow","kind":"basic","name":"BasicIssueFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"issue_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"issue_ref01"}}],"index$":1},{"a":true,"d":{},"i":{"ref":"issue_ref01","srcdatavar":"issue_ref01_data","suffix":"_up0","textfield":"client_audience"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-issue_ref01"}}],"v":[],"index$":2},{"a":true,"d":{},"i":{"ref":"issue_ref01","srcdatavar":"issue_ref01_data","suffix":"_dt0"},"m":{"id":"issue01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-issue_ref01"}}],"index$":3}]}, 'Issue', {"POST /v1/issues":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["project_id","title"],"properties":{"project_id":{"type":"integer","description":"The project's id, for a project the token's owner can see. Note that no endpoint returns project ids: `GET /v1/projects` gives keys and slugs.","key$":"project_id"},"title":{"type":"string","maxLength":255,"key$":"title"},"parent":{"type":"string","maxLength":40,"description":"An issue key; the new issue is created as its subtask.","nullable":true,"key$":"parent"},"description":{"type":"object","nullable":true,"description":"A rich-text document in Tiptap's JSON form, e.g. `{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"Steps to reproduce\"}]}]}`.","additionalProperties":true,"key$":"description"},"type":{"type":"string","enum":["bug","feature","task","question"],"default":"bug","key$":"type"},"priority":{"type":"integer","enum":[0,1,2,3,4],"default":0,"description":"0 none, 1 low, 2 medium, 3 high, 4 urgent.","key$":"priority"},"status_id":{"type":"integer","nullable":true,"description":"A status of the workspace. Defaults to the project's default status, or its triage status when a client files the issue.","key$":"status_id"},"assignee_id":{"type":"integer","nullable":true,"description":"A member of the team. Clients cannot be assigned.","key$":"assignee_id"},"visibility":{"type":"string","enum":["internal","client"],"default":"internal","key$":"visibility"},"labels":{"type":"array","description":"Label ids.","items":{"type":"integer"},"key$":"labels"},"custom_fields":{"type":"object","description":"Values keyed by the field's key, checked against the project's fields.","additionalProperties":true,"key$":"custom_fields"}},"x-ref":"#/components/schemas/IssueCreate","index$":1}}}},"parameters":[]},"GET /v1/issues":{"protocol":"http","parameters":[{"name":"q","in":"query","required":false,"description":"A query in Buggie's issue query language, e.g. `is:open project:web -label:wontfix`. Defaults to open issues. The response echoes it back canonicalised under `meta.query`.","schema":{"type":"string"},"index$":0},{"name":"page","in":"query","required":false,"description":"The page to return, from 1.","schema":{"type":"integer","minimum":1,"default":1},"index$":1},{"name":"per_page","in":"query","required":false,"description":"Issues per page.","schema":{"type":"integer","minimum":1,"maximum":100,"default":50},"index$":2}]},"GET /v1/issues/{key}":{"protocol":"http","parameters":[{"name":"key","in":"path","required":true,"description":"The issue's key, e.g. `WEB-142`.","schema":{"type":"string"},"x-ref":"#/components/parameters/IssueKey","index$":0}]},"PATCH /v1/issues/{key}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"title":{"type":"string","maxLength":255,"key$":"title"},"description":{"type":"object","nullable":true,"description":"A rich-text document in Tiptap's JSON form, e.g. `{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"Steps to reproduce\"}]}]}`.","additionalProperties":true,"key$":"description"},"type":{"type":"string","enum":["bug","feature","task","question"],"key$":"type"},"priority":{"type":"integer","enum":[0,1,2,3,4],"description":"0 none, 1 low, 2 medium, 3 high, 4 urgent.","key$":"priority"},"visibility":{"type":"string","enum":["internal","client"],"key$":"visibility"},"client_audience":{"type":"string","enum":["default","project","specific"],"description":"Which clients see a client-visible issue.","key$":"client_audience"},"board_pinned":{"type":"boolean","description":"A pinned card stays on the board whatever the filter says.","key$":"board_pinned"},"client_share_ids":{"type":"array","maxItems":100,"description":"The clients an issue is shared with, by user id, when `client_audience` is `specific`.","items":{"type":"integer"},"key$":"client_share_ids"},"start_on":{"type":"string","format":"date","nullable":true,"key$":"start_on"},"due_on":{"type":"string","format":"date","nullable":true,"key$":"due_on"},"version_id":{"type":"integer","nullable":true,"description":"A release of the issue's project.","key$":"version_id"},"phase_id":{"type":"integer","nullable":true,"description":"A phase of the issue's project.","key$":"phase_id"},"status_id":{"type":"integer","description":"A status of the workspace.","key$":"status_id"},"assignee_id":{"type":"integer","nullable":true,"description":"A member of the team. Clients cannot be assigned.","key$":"assignee_id"},"labels":{"type":"array","description":"Label ids. Replaces the issue's labels.","items":{"type":"integer"},"key$":"labels"},"custom_fields":{"type":"object","description":"Values keyed by the field's key, checked against the project's fields.","additionalProperties":true,"key$":"custom_fields"}},"x-ref":"#/components/schemas/IssueUpdate","index$":1}}}},"parameters":[{"name":"key","in":"path","required":true,"description":"The issue's key, e.g. `WEB-142`.","schema":{"type":"string"},"x-ref":"#/components/parameters/IssueKey","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const issue_ref01_ent = client.Issue()
    let issue_ref01_data = setup.data.new.issue['issue_ref01']

    issue_ref01_data = (await issue_ref01_ent.create(issue_ref01_data)).data()
    assert(null != issue_ref01_data.id)


    // LIST
    const issue_ref01_match: any = {}

    const issue_ref01_list = (await issue_ref01_ent.list(issue_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(issue_ref01_list, { id: issue_ref01_data.id })))


    // UPDATE
    const issue_ref01_data_up0: any = {}
    issue_ref01_data_up0.id = issue_ref01_data.id

    const issue_ref01_markdef_up0 = { name: 'client_audience', value: 'Mark01-issue_ref01_' + setup.now }
    ;(issue_ref01_data_up0 as any)[issue_ref01_markdef_up0.name] = issue_ref01_markdef_up0.value

    const issue_ref01_resdata_up0 = (await issue_ref01_ent.update(issue_ref01_data_up0)).data()
    assert(issue_ref01_resdata_up0.id === issue_ref01_data_up0.id)

    assert((issue_ref01_resdata_up0 as any)[issue_ref01_markdef_up0.name] === issue_ref01_markdef_up0.value)


    // LOAD
    const issue_ref01_match_dt0: any = {}
    issue_ref01_match_dt0.id = issue_ref01_data.id
    const issue_ref01_data_dt0 = (await issue_ref01_ent.load(issue_ref01_match_dt0)).data()
    assert(issue_ref01_data_dt0.id === issue_ref01_data.id)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/issue/IssueTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = BuggieSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['issue01','issue02','issue03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'BUGGIE_TEST_ISSUE_ENTID': idmap,
    'BUGGIE_TEST_LIVE': 'FALSE',
    'BUGGIE_TEST_EXPLAIN': 'FALSE',
    'BUGGIE_APIKEY': '',
    'BUGGIE_SERVER_WORKSPACE': "your-workspace",
  })

  idmap = env['BUGGIE_TEST_ISSUE_ENTID']

  const live = 'TRUE' === env.BUGGIE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['BUGGIE_TEST_ISSUE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new BuggieSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.BUGGIE_APIKEY,
        server: {
          workspace: env.BUGGIE_SERVER_WORKSPACE,
        },
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.BUGGIE_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
