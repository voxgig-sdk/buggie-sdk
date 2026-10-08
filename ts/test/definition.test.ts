import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "issue",
    "accessor": "Issue",
    "op": "create",
    "method": "POST",
    "path": "/v1/issues",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
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
          "name": "In progress",
          "category": "backlog",
          "open": true
        },
        "project": {
          "key": "WEB",
          "slug": "web",
          "name": "x"
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
      "page": 1,
      "per_page": 50,
      "q": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "q",
      "page",
      "per_page"
    ],
    "queryArgs": [
      {
        "name": "page",
        "wire": "page"
      },
      {
        "name": "per_page",
        "wire": "per_page"
      },
      {
        "name": "q",
        "wire": "q"
      }
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
          "key": "WEB-142",
          "title": "x",
          "type": "bug",
          "priority": 0,
          "status": {
            "name": "In progress",
            "category": "backlog",
            "open": true
          },
          "project": {
            "key": "WEB",
            "slug": "web",
            "name": "x"
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
          "updated_at": "2026-01-01T00:00:00Z"
        }
      ],
      "meta": {
        "page": 1,
        "per_page": 1,
        "total": 1,
        "last_page": 1,
        "query": "x"
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
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
          "name": "In progress",
          "category": "backlog",
          "open": true
        },
        "project": {
          "key": "WEB",
          "slug": "web",
          "name": "x"
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
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
          "name": "In progress",
          "category": "backlog",
          "open": true
        },
        "project": {
          "key": "WEB",
          "slug": "web",
          "name": "x"
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
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
          "key": "WEB",
          "slug": "web",
          "name": "x",
          "description": "x"
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "expires",
      "signature"
    ],
    "queryArgs": [],
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
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": [],
    "status": 200,
    "sample": {
      "require_email": true,
      "capture_screenshot": true,
      "mode": "anonymous",
      "brand": {
        "name": "x",
        "logo": "x",
        "color": "#4f46e5"
      }
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
