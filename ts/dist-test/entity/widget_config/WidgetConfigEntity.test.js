"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('WidgetConfigEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when BUGGIE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('BUGGIE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.BuggieSDK.test();
        const ent = testsdk.WidgetConfig();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.BuggieSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.WidgetConfig().load({ "public_key": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.BUGGIE_TEST_LIVE;
        for (const op of []) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'widget_config.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "brand": { "a": true, "h": "Brand", "n": "brand", "r": false, "t": "`$OBJECT`", "key$": "brand", "index$": 0 }, "capture_screenshot": { "a": true, "h": "Capture Screenshot", "n": "capture_screenshot", "r": false, "t": "`$BOOLEAN`", "key$": "capture_screenshot", "index$": 1 }, "mode": { "a": true, "h": "Mode", "n": "mode", "r": false, "sh": "How much the key trusts what a page says about the reporter.", "t": "`$STRING`", "key$": "mode", "index$": 2 }, "require_email": { "a": true, "h": "Require Email", "n": "require_email", "r": false, "t": "`$BOOLEAN`", "key$": "require_email", "index$": 3 } }, "name": "widget_config", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /ingest/{publicKey}/config", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "public_key", "or": "publicKey", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/ingest/{publicKey}/config", "q": { "exist": ["public_key"] }, "r": { "param": { "publicKey": "public_key" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "ingest" }, { "var": "public_key" }, { "lit": "config" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "widget_config", "name__orig": "widget_config", "Name": "WidgetConfig", "name_": "widget_config", "name-": "widget-config", "NAME": "WIDGET_CONFIG", "index$": 4 }, { "active": true, "entity": "widget_config", "key$": "BasicWidgetConfigFlow", "kind": "basic", "name": "BasicWidgetConfigFlow", "param": {}, "step": [{ "a": false, "d": {}, "i": { "ref": "widget_config_ref01", "srcdatavar": "widget_config_ref01_data", "suffix": "_dt0" }, "m": { "id": "widget_config01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-widget_config_ref01" } }], "unreachable": true }] }, 'WidgetConfig', { "GET /ingest/{publicKey}/config": { "protocol": "http", "parameters": [{ "name": "publicKey", "in": "path", "required": true, "description": "The project's public widget key, e.g. `pk_live_9f3a2b`.", "schema": { "type": "string" }, "x-ref": "#/components/parameters/PublicKey", "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let widget_config_ref01_data = Object.values(setup.data.existing.widget_config)[0];
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/widget_config/WidgetConfigTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.BuggieSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['widget_config01', 'widget_config02', 'widget_config03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'BUGGIE_TEST_WIDGET_CONFIG_ENTID': idmap,
        'BUGGIE_TEST_LIVE': 'FALSE',
        'BUGGIE_TEST_EXPLAIN': 'FALSE',
        'BUGGIE_APIKEY': '',
        'BUGGIE_SERVER_WORKSPACE': "your-workspace",
    });
    idmap = env['BUGGIE_TEST_WIDGET_CONFIG_ENTID'];
    const live = 'TRUE' === env.BUGGIE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['BUGGIE_TEST_WIDGET_CONFIG_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.BuggieSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
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
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=WidgetConfigEntity.test.js.map