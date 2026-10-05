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
(0, node_test_1.describe)('ReportEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when BUGGIE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('BUGGIE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.BuggieSDK.test();
        const ent = testsdk.Report();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.BUGGIE_TEST_LIVE;
        for (const op of ['create']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'report.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "body": { "a": true, "h": "Body", "n": "body", "r": false, "sh": "What the reporter wrote.", "t": "`$STRING`", "key$": "body", "index$": 0 }, "console": { "a": true, "h": "Console", "n": "console", "r": false, "t": "`$ARRAY`", "key$": "console", "index$": 1 }, "environment": { "a": true, "h": "Environment", "n": "environment", "r": false, "sh": "Where it happened.", "t": "`$OBJECT`", "key$": "environment", "index$": 2 }, "error": { "a": true, "h": "Error", "n": "error", "r": false, "sh": "The error, if there was one.", "t": "`$OBJECT`", "key$": "error", "index$": 3 }, "id": { "a": true, "h": "Id", "n": "id", "r": false, "t": "`$INTEGER`", "key$": "id", "index$": 4 }, "network": { "a": true, "h": "Network", "n": "network", "r": false, "t": "`$ARRAY`", "key$": "network", "index$": 5 }, "reference": { "a": true, "h": "Reference", "n": "reference", "r": false, "sh": "The reference shown to the reporter.", "t": "`$STRING`", "key$": "reference", "index$": 6 }, "reporter": { "a": true, "h": "Reporter", "n": "reporter", "r": false, "sh": "Who is reporting.", "t": "`$OBJECT`", "key$": "reporter", "index$": 7 }, "screenshot": { "a": true, "h": "Screenshot", "n": "screenshot", "r": false, "sh": "Ask for a screenshot upload URL in the response.", "t": "`$BOOLEAN`", "key$": "screenshot", "index$": 8 }, "title": { "a": true, "h": "Title", "n": "title", "r": true, "t": "`$STRING`", "key$": "title", "index$": 9 }, "upload_url": { "a": true, "fo": "uri", "h": "Upload Url", "n": "upload_url", "r": false, "sh": "A signed URL for the screenshot, valid for five minutes.", "t": "`$STRING`", "key$": "upload_url", "index$": 10 } }, "id": { "field": "id", "name": "id" }, "name": "report", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /ingest/{publicKey}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "public_key", "or": "publicKey", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "POST", "o": "/ingest/{publicKey}", "q": { "exist": ["public_key"] }, "r": { "param": { "publicKey": "public_key" } }, "s": [{ "lit": "ingest" }, { "var": "public_key" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" } }, "relations": { "ancestors": [] }, "key$": "report", "name__orig": "report", "Name": "Report", "name_": "report", "name-": "report", "NAME": "REPORT", "index$": 2 }, { "active": true, "entity": "report", "key$": "BasicReportFlow", "kind": "basic", "name": "BasicReportFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "report_ref01" }, "m": { "public_key": "public_key01" }, "o": "create", "s": [], "v": [], "index$": 0 }] }, 'Report', { "POST /ingest/{publicKey}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "required": ["title"], "properties": { "title": { "type": "string", "maxLength": 255, "key$": "title" }, "body": { "type": "string", "maxLength": 5000, "nullable": true, "description": "What the reporter wrote.", "key$": "body" }, "reporter": { "type": "object", "description": "Who is reporting. What is kept depends on the key's identity mode.", "properties": { "name": { "type": "string", "maxLength": 120, "nullable": true }, "email": { "type": "string", "format": "email", "maxLength": 255, "nullable": true }, "ref": { "type": "string", "maxLength": 120, "nullable": true, "description": "Your own identifier for the person." }, "user_hash": { "type": "string", "nullable": true, "description": "HMAC-SHA256 of `{ref}:{email}` with the widget key's secret, computed on your server. Makes the report verified; one that does not verify is kept as identified." }, "source": { "type": "string", "enum": ["identify", "typed"], "description": "Whether the identity came from your application or was typed by the reporter." } }, "key$": "reporter" }, "environment": { "type": "object", "description": "Where it happened. Bounded and sanitised on arrival.", "properties": { "url": { "type": "string", "maxLength": 2048, "nullable": true, "description": "The page or screen. Only http(s) addresses are kept." }, "user_agent": { "type": "string", "maxLength": 512, "nullable": true }, "release": { "type": "string", "maxLength": 120, "nullable": true, "description": "The build that broke." } }, "additionalProperties": true, "key$": "environment" }, "error": { "type": "object", "nullable": true, "description": "The error, if there was one. Reports of the same error are grouped.", "properties": { "message": { "type": "string", "maxLength": 2000, "nullable": true }, "stack": { "type": "string", "maxLength": 8000, "nullable": true } }, "key$": "error" }, "console": { "type": "array", "maxItems": 50, "nullable": true, "items": { "type": "object", "properties": { "level": { "type": "string", "maxLength": 10, "example": "error" }, "message": { "type": "string", "maxLength": 2000 }, "at": { "type": "integer", "format": "int64", "description": "When, in milliseconds since the Unix epoch." } }, "x-ref": "#/components/schemas/ConsoleEntry" }, "key$": "console" }, "network": { "type": "array", "maxItems": 30, "nullable": true, "items": { "type": "object", "properties": { "method": { "type": "string", "maxLength": 10, "example": "POST" }, "url": { "type": "string", "maxLength": 2048 }, "status": { "description": "The response status, or a word such as `error` when there was no response." }, "duration": { "type": "number", "description": "Milliseconds." }, "at": { "type": "integer", "format": "int64", "description": "When, in milliseconds since the Unix epoch." } }, "x-ref": "#/components/schemas/NetworkEntry" }, "key$": "network" }, "screenshot": { "type": "boolean", "nullable": true, "description": "Ask for a screenshot upload URL in the response.", "key$": "screenshot" } }, "x-ref": "#/components/schemas/ReportCreate", "index$": 1 } } } }, "parameters": [{ "name": "publicKey", "in": "path", "required": true, "description": "The project's public widget key, e.g. `pk_live_9f3a2b`.", "schema": { "type": "string" }, "x-ref": "#/components/parameters/PublicKey", "index$": 0 }] } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const report_ref01_ent = client.Report();
        let report_ref01_data = setup.data.new.report['report_ref01'];
        report_ref01_data['public_key'] = setup.idmap['public_key01'];
        report_ref01_data = (await report_ref01_ent.create(report_ref01_data)).data();
        (0, node_assert_1.default)(null != report_ref01_data.id);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/report/ReportTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.BuggieSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['report01', 'report02', 'report03', 'public_key01'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'BUGGIE_TEST_REPORT_ENTID': idmap,
        'BUGGIE_TEST_LIVE': 'FALSE',
        'BUGGIE_TEST_EXPLAIN': 'FALSE',
        'BUGGIE_APIKEY': '',
        'BUGGIE_SERVER_WORKSPACE': "your-workspace",
    });
    idmap = env['BUGGIE_TEST_REPORT_ENTID'];
    const live = 'TRUE' === env.BUGGIE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['BUGGIE_TEST_REPORT_ENTID'];
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
//# sourceMappingURL=ReportEntity.test.js.map