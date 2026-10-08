

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


describe('ScreenshotEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when BUGGIE_TEST_LIVE=TRUE.
  afterEach(liveDelay('BUGGIE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = BuggieSDK.test()
    const ent = testsdk.Screenshot()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = BuggieSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Screenshot().create({"id":"x","expire":1,"signature":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.BUGGIE_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'screenshot.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":0},"ok":{"a":true,"h":"Ok","n":"ok","r":false,"t":"`$BOOLEAN`","key$":"ok","index$":1}},"id":{"field":"id","name":"id"},"name":"screenshot","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /ingest/screenshot/{report}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"report","r":true,"t":"`$INTEGER`","index$":0}],"query":[{"a":true,"k":"query","n":"expire","or":"expires","r":true,"t":"`$INTEGER`","index$":0},{"a":true,"k":"query","n":"signature","or":"signature","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"POST","o":"/ingest/screenshot/{report}","q":{"exist":["expire","id","signature"]},"r":{"param":{"report":"id"}},"rb":{"fields":[{"binary":true,"name":"screenshot"}],"kind":"multipart","media":"multipart/form-data"},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"ingest"},{"lit":"screenshot"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"screenshot","name__orig":"screenshot","Name":"Screenshot","name_":"screenshot","name-":"screenshot","NAME":"SCREENSHOT","index$":3}, {"active":true,"entity":"screenshot","key$":"BasicScreenshotFlow","kind":"basic","name":"BasicScreenshotFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"screenshot_ref01"},"m":{"report":"report01"},"o":"create","s":[],"v":[],"unreachable":true}]}, 'Screenshot', {"POST /ingest/screenshot/{report}":{"protocol":"http","requestBody":{"required":true,"content":{"multipart/form-data":{"schema":{"type":"object","required":["screenshot"],"properties":{"screenshot":{"type":"string","format":"binary","description":"A JPEG, PNG or WebP image of at most 2 MB."}}}}}},"parameters":[{"name":"report","in":"path","required":true,"description":"The report's id, from the filing response.","schema":{"type":"integer"},"index$":0},{"name":"expires","in":"query","required":true,"description":"Part of the signed `upload_url`.","schema":{"type":"integer"},"index$":1},{"name":"signature","in":"query","required":true,"description":"Part of the signed `upload_url`.","schema":{"type":"string"},"index$":2}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let screenshot_ref01_data = Object.values(setup.data.existing.screenshot)[0] as any

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
      '../../../../.sdk/test/entity/screenshot/ScreenshotTestData.json')

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
    ['screenshot01','screenshot02','screenshot03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'BUGGIE_TEST_SCREENSHOT_ENTID': idmap,
    'BUGGIE_TEST_LIVE': 'FALSE',
    'BUGGIE_TEST_EXPLAIN': 'FALSE',
    'BUGGIE_APIKEY': '',
    'BUGGIE_SERVER_WORKSPACE': "your-workspace",
  })

  idmap = env['BUGGIE_TEST_SCREENSHOT_ENTID']

  const live = 'TRUE' === env.BUGGIE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['BUGGIE_TEST_SCREENSHOT_ENTID']
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
  
