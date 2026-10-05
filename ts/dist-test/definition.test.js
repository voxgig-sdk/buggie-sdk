"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "issue",
        "accessor": "Issue",
        "op": "create",
        "method": "POST",
        "path": "/v1/issues",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 201,
        "sample": {
            "data": {
                "key": "WEB-142",
                "title": "x",
                "type": "bug",
                "priority": 0,
                "status": {
                    "category": "backlog",
                    "name": "In progress",
                    "open": true
                },
                "project": {
                    "key": "WEB",
                    "name": "x",
                    "slug": "web"
                },
                "assignee": {
                    "id": 1,
                    "name": "x"
                },
                "labels": [
                    "x"
                ],
                "occurrences": 1,
                "created_at": "2026-01-01T00:00:00Z",
                "updated_at": "2026-01-01T00:00:00Z",
                "description": {},
                "reporter": {
                    "id": 1,
                    "name": "x"
                },
                "visibility": "internal",
                "due_on": "2026-01-01",
                "closed_at": "2026-01-01T00:00:00Z",
                "estimate_minutes": 1,
                "time_spent_minutes": 1
            }
        },
        "idField": "id"
    },
    {
        "entity": "issue",
        "accessor": "Issue",
        "op": "list",
        "method": "GET",
        "path": "/v1/issues",
        "args": [],
        "select": {
            "page": "v1",
            "per_page": "v1",
            "q": "v1"
        },
        "headers": [],
        "query": [
            "q",
            "page",
            "per_page"
        ],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": [
                {
                    "assignee": {
                        "id": 1,
                        "name": "x"
                    },
                    "created_at": "2026-01-01T00:00:00Z",
                    "key": "WEB-142",
                    "labels": [
                        "x"
                    ],
                    "occurrences": 1,
                    "priority": 0,
                    "project": {
                        "key": "WEB",
                        "name": "x",
                        "slug": "web"
                    },
                    "status": {
                        "category": "backlog",
                        "name": "In progress",
                        "open": true
                    },
                    "title": "x",
                    "type": "bug",
                    "updated_at": "2026-01-01T00:00:00Z"
                }
            ],
            "meta": {
                "last_page": 1,
                "page": 1,
                "per_page": 1,
                "query": "x",
                "total": 1
            }
        },
        "idField": "id"
    },
    {
        "entity": "issue",
        "accessor": "Issue",
        "op": "load",
        "method": "GET",
        "path": "/v1/issues/{key}",
        "args": [
            {
                "name": "id",
                "wire": "key",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "key": "WEB-142",
                "title": "x",
                "type": "bug",
                "priority": 0,
                "status": {
                    "category": "backlog",
                    "name": "In progress",
                    "open": true
                },
                "project": {
                    "key": "WEB",
                    "name": "x",
                    "slug": "web"
                },
                "assignee": {
                    "id": 1,
                    "name": "x"
                },
                "labels": [
                    "x"
                ],
                "occurrences": 1,
                "created_at": "2026-01-01T00:00:00Z",
                "updated_at": "2026-01-01T00:00:00Z",
                "description": {},
                "reporter": {
                    "id": 1,
                    "name": "x"
                },
                "visibility": "internal",
                "due_on": "2026-01-01",
                "closed_at": "2026-01-01T00:00:00Z",
                "estimate_minutes": 1,
                "time_spent_minutes": 1
            }
        },
        "idField": "id"
    },
    {
        "entity": "issue",
        "accessor": "Issue",
        "op": "update",
        "method": "PATCH",
        "path": "/v1/issues/{key}",
        "args": [
            {
                "name": "id",
                "wire": "key",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": {
                "key": "WEB-142",
                "title": "x",
                "type": "bug",
                "priority": 0,
                "status": {
                    "category": "backlog",
                    "name": "In progress",
                    "open": true
                },
                "project": {
                    "key": "WEB",
                    "name": "x",
                    "slug": "web"
                },
                "assignee": {
                    "id": 1,
                    "name": "x"
                },
                "labels": [
                    "x"
                ],
                "occurrences": 1,
                "created_at": "2026-01-01T00:00:00Z",
                "updated_at": "2026-01-01T00:00:00Z",
                "description": {},
                "reporter": {
                    "id": 1,
                    "name": "x"
                },
                "visibility": "internal",
                "due_on": "2026-01-01",
                "closed_at": "2026-01-01T00:00:00Z",
                "estimate_minutes": 1,
                "time_spent_minutes": 1
            }
        },
        "idField": "id"
    },
    {
        "entity": "project",
        "accessor": "Project",
        "op": "list",
        "method": "GET",
        "path": "/v1/projects",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "data": [
                {
                    "description": "x",
                    "key": "WEB",
                    "name": "x",
                    "slug": "web"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "report",
        "accessor": "Report",
        "op": "create",
        "method": "POST",
        "path": "/ingest/{publicKey}",
        "args": [
            {
                "name": "public_key",
                "wire": "publicKey",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [],
        "status": 202,
        "sample": {
            "id": 1,
            "reference": "R-1042",
            "upload_url": "x"
        },
        "idField": "id"
    },
    {
        "entity": "screenshot",
        "accessor": "Screenshot",
        "op": "create",
        "method": "POST",
        "path": "/ingest/screenshot/{report}",
        "args": [
            {
                "name": "id",
                "wire": "report",
                "value": "p1"
            }
        ],
        "select": {
            "expire": "v1",
            "signature": "v1"
        },
        "headers": [],
        "query": [
            "expires",
            "signature"
        ],
        "auth": [],
        "status": 200,
        "sample": {
            "ok": true
        },
        "idField": "id"
    },
    {
        "entity": "widget_config",
        "accessor": "WidgetConfig",
        "op": "load",
        "method": "GET",
        "path": "/ingest/{publicKey}/config",
        "args": [
            {
                "name": "public_key",
                "wire": "publicKey",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": [],
        "status": 200,
        "sample": {
            "require_email": true,
            "capture_screenshot": true,
            "mode": "anonymous",
            "brand": {
                "color": "#4f46e5",
                "logo": "x",
                "name": "x"
            }
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map