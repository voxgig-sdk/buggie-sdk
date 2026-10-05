

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { BuggieSDK, BaseFeature, stdutil } from '../../..'

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


describe('WidgetConfigEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when BUGGIE_TEST_LIVE=TRUE.
  afterEach(liveDelay('BUGGIE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = BuggieSDK.test()
    const ent = testsdk.WidgetConfig()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.BUGGIE_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'widget_config.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"brand":{"a":true,"h":"Brand","n":"brand","r":false,"t":"`$OBJECT`","key$":"brand","index$":0},"capture_screenshot":{"a":true,"h":"Capture Screenshot","n":"capture_screenshot","r":false,"t":"`$BOOLEAN`","key$":"capture_screenshot","index$":1},"mode":{"a":true,"h":"Mode","n":"mode","r":false,"sh":"How much the key trusts what a page says about the reporter.","t":"`$STRING`","key$":"mode","index$":2},"require_email":{"a":true,"h":"Require Email","n":"require_email","r":false,"t":"`$BOOLEAN`","key$":"require_email","index$":3}},"name":"widget_config","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /ingest/{publicKey}/config","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"public_key","or":"publicKey","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/ingest/{publicKey}/config","q":{"exist":["public_key"]},"r":{"param":{"publicKey":"public_key"}},"s":[{"lit":"ingest"},{"var":"public_key"},{"lit":"config"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"widget_config","name__orig":"widget_config","Name":"WidgetConfig","name_":"widget_config","name-":"widget-config","NAME":"WIDGET_CONFIG","index$":4}, {"active":true,"entity":"widget_config","key$":"BasicWidgetConfigFlow","kind":"basic","name":"BasicWidgetConfigFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"widget_config_ref01","srcdatavar":"widget_config_ref01_data","suffix":"_dt0"},"m":{"id":"widget_config01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-widget_config_ref01"}}],"index$":0}]}, 'WidgetConfig', {"GET /ingest/{publicKey}/config":{"protocol":"http","parameters":[{"name":"publicKey","in":"path","required":true,"description":"The project's public widget key, e.g. `pk_live_9f3a2b`.","schema":{"type":"string"},"x-ref":"#/components/parameters/PublicKey","index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let widget_config_ref01_data = Object.values(setup.data.existing.widget_config)[0] as any

    // LOAD: skipped — no entity id field and load requires path params.
    // Entity-var is declared here so later flow steps still compile.
    const widget_config_ref01_ent = client.WidgetConfig()


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/widget_config/WidgetConfigTestData.json')

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
    ['widget_config01','widget_config02','widget_config03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'BUGGIE_TEST_WIDGET_CONFIG_ENTID': idmap,
    'BUGGIE_TEST_LIVE': 'FALSE',
    'BUGGIE_TEST_EXPLAIN': 'FALSE',
    'BUGGIE_APIKEY': '',
    'BUGGIE_SERVER_WORKSPACE': "your-workspace",
  })

  idmap = env['BUGGIE_TEST_WIDGET_CONFIG_ENTID']

  const live = 'TRUE' === env.BUGGIE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['BUGGIE_TEST_WIDGET_CONFIG_ENTID']
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
  
