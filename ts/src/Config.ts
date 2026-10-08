
import { BaseFeature } from './feature/base/BaseFeature'
import { DebugFeature } from './feature/debug/DebugFeature'
import { IdempotencyFeature } from './feature/idempotency/IdempotencyFeature'
import { MetricsFeature } from './feature/metrics/MetricsFeature'
import { PagingFeature } from './feature/paging/PagingFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   debug: DebugFeature,
 idempotency: IdempotencyFeature,
 metrics: MetricsFeature,
 paging: PagingFeature,
 ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'Buggie',
        slug: "buggie",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     debug:     {
      "options": {
        "active": false,
        "max": 100,
        "redact": [
          "authorization",
          "cookie",
          "set-cookie",
          "api-key",
          "apikey",
          "x-api-key",
          "idempotency-key"
        ]
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "onEntry": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 idempotency:     {
      "options": {
        "active": false,
        "header": "Idempotency-Key",
        "methods": [
          "POST",
          "PUT",
          "PATCH",
          "DELETE"
        ],
        "ops": [
          "create",
          "update",
          "remove"
        ]
      },
      "optspec": {
        "keygen": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 metrics:     {
      "options": {
        "active": false
      },
      "optspec": {
        "now": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "none"
    },
 paging:     {
      "options": {
        "active": false,
        "afterVar": "after",
        "cursorParam": "cursor",
        "firstVar": "first",
        "limitParam": "limit",
        "pageParam": "page",
        "startPage": 1
      },
      "optspec": {
        "limit": "`$NUMBER`",
        "ops": "`$LIST`"
      },
      "strict": false,
      "transport": "none"
    },
 ratelimit:     {
      "options": {
        "active": false,
        "burst": 5,
        "rate": 5
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 retry:     {
      "options": {
        "active": false,
        "factor": 2,
        "maxDelay": 2000,
        "minDelay": 50,
        "retries": 2,
        "statuses": [
          408,
          425,
          429,
          500,
          502,
          503,
          504
        ]
      },
      "optspec": {
        "jitter": "`$BOOLEAN`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },
 timeout:     {
      "options": {
        "active": false,
        "ms": 30000
      },
      "optspec": {
        "clearTimer": "`$FUNCTION`",
        "now": "`$FUNCTION`",
        "setTimer": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },

  }


  options = {
    base: "https://{workspace}.buggie.eu/api",

    server: {
      "workspace": "your-workspace",
    },

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        issue: {
        },
  
        project: {
        },
  
        report: {
        },
  
        screenshot: {
        },
  
        widget_config: {
        },
  
    }
  }


  entity = {
    "issue": {
      "fields": [
        {
          "name": "assignee",
          "title": "Assignee",
          "type": "`$OBJECT`"
        },
        {
          "name": "assignee_id",
          "title": "Assignee Id",
          "type": "`$INTEGER`",
          "short": "A member of the team."
        },
        {
          "name": "board_pinned",
          "title": "Board Pinned",
          "type": "`$BOOLEAN`",
          "short": "A pinned card stays on the board whatever the filter says."
        },
        {
          "name": "client_audience",
          "title": "Client Audience",
          "type": "`$STRING`",
          "short": "Which clients see a client-visible issue."
        },
        {
          "name": "client_share_ids",
          "title": "Client Share Ids",
          "type": "`$ARRAY`",
          "short": "The clients an issue is shared with, by user id, when `client_audience` is `specific`."
        },
        {
          "name": "closed_at",
          "title": "Closed At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "created_at",
          "title": "Created At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "custom_fields",
          "title": "Custom Fields",
          "type": "`$ANY`",
          "short": "Custom field values keyed by the field's key, e.g."
        },
        {
          "name": "description",
          "title": "Description",
          "type": "`$OBJECT`",
          "short": "A rich-text document in Tiptap's JSON form, e.g."
        },
        {
          "name": "due_on",
          "title": "Due On",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "estimate_minutes",
          "title": "Estimate Minutes",
          "type": "`$INTEGER`"
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        },
        {
          "name": "key",
          "title": "Key",
          "type": "`$STRING`"
        },
        {
          "name": "labels",
          "title": "Labels",
          "type": "`$ARRAY`",
          "short": "Label names."
        },
        {
          "name": "occurrences",
          "title": "Occurrences",
          "type": "`$INTEGER`",
          "short": "How many times this bug has been reported, counting the first."
        },
        {
          "name": "parent",
          "title": "Parent",
          "type": "`$STRING`",
          "short": "An issue key; the new issue is created as its subtask."
        },
        {
          "name": "phase_id",
          "title": "Phase Id",
          "type": "`$INTEGER`",
          "short": "A phase of the issue's project."
        },
        {
          "name": "priority",
          "title": "Priority",
          "type": "`$INTEGER`",
          "short": "0 none, 1 low, 2 medium, 3 high, 4 urgent."
        },
        {
          "name": "project",
          "title": "Project",
          "type": "`$OBJECT`"
        },
        {
          "name": "project_id",
          "title": "Project Id",
          "type": "`$INTEGER`",
          "req": true,
          "short": "The project's id, for a project the token's owner can see."
        },
        {
          "name": "reporter",
          "title": "Reporter",
          "type": "`$OBJECT`"
        },
        {
          "name": "start_on",
          "title": "Start On",
          "type": "`$STRING`",
          "format": "date"
        },
        {
          "name": "status",
          "title": "Status",
          "type": "`$OBJECT`"
        },
        {
          "name": "status_id",
          "title": "Status Id",
          "type": "`$INTEGER`",
          "short": "A status of the workspace."
        },
        {
          "name": "time_spent_minutes",
          "title": "Time Spent Minutes",
          "type": "`$INTEGER`"
        },
        {
          "name": "title",
          "title": "Title",
          "type": "`$STRING`",
          "op": {
            "create": {
              "req": true,
              "type": "`$STRING`"
            }
          }
        },
        {
          "name": "type",
          "title": "Type",
          "type": "`$STRING`"
        },
        {
          "name": "updated_at",
          "title": "Updated At",
          "type": "`$STRING`",
          "format": "date-time"
        },
        {
          "name": "version_id",
          "title": "Version Id",
          "type": "`$INTEGER`",
          "short": "A release of the issue's project."
        },
        {
          "name": "visibility",
          "title": "Visibility",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "issue",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/v1/issues",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "issues"
                }
              ],
              "parts": [
                "v1",
                "issues"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/issues",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "issues"
                }
              ],
              "parts": [
                "v1",
                "issues"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "query": [
                  {
                    "name": "page",
                    "orig": "page",
                    "type": "`$INTEGER`",
                    "kind": "query",
                    "example": 1
                  },
                  {
                    "name": "per_page",
                    "orig": "per_page",
                    "type": "`$INTEGER`",
                    "kind": "query",
                    "example": 50
                  },
                  {
                    "name": "q",
                    "orig": "q",
                    "type": "`$STRING`",
                    "kind": "query"
                  }
                ]
              },
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/issues/{key}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "issues"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "v1",
                "issues",
                "{id}"
              ],
              "rename": {
                "param": {
                  "key": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "key",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        },
        "update": {
          "input": "data",
          "name": "update",
          "points": [
            {
              "kind": "http",
              "method": "PATCH",
              "orig": "/v1/issues/{key}",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "issues"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "v1",
                "issues",
                "{id}"
              ],
              "rename": {
                "param": {
                  "key": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "key",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "project": {
      "fields": [
        {
          "name": "description",
          "title": "Description",
          "type": "`$STRING`"
        },
        {
          "name": "key",
          "title": "Key",
          "type": "`$STRING`"
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`"
        },
        {
          "name": "slug",
          "title": "Slug",
          "type": "`$STRING`"
        }
      ],
      "name": "project",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/v1/projects",
              "segments": [
                {
                  "lit": "v1"
                },
                {
                  "lit": "projects"
                }
              ],
              "parts": [
                "v1",
                "projects"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "report": {
      "fields": [
        {
          "name": "body",
          "title": "Body",
          "type": "`$STRING`",
          "short": "What the reporter wrote."
        },
        {
          "name": "console",
          "title": "Console",
          "type": "`$ARRAY`"
        },
        {
          "name": "environment",
          "title": "Environment",
          "type": "`$OBJECT`",
          "short": "Where it happened."
        },
        {
          "name": "error",
          "title": "Error",
          "type": "`$OBJECT`",
          "short": "The error, if there was one."
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$INTEGER`"
        },
        {
          "name": "network",
          "title": "Network",
          "type": "`$ARRAY`"
        },
        {
          "name": "reference",
          "title": "Reference",
          "type": "`$STRING`",
          "short": "The reference shown to the reporter."
        },
        {
          "name": "reporter",
          "title": "Reporter",
          "type": "`$OBJECT`",
          "short": "Who is reporting."
        },
        {
          "name": "screenshot",
          "title": "Screenshot",
          "type": "`$BOOLEAN`",
          "short": "Ask for a screenshot upload URL in the response."
        },
        {
          "name": "title",
          "title": "Title",
          "type": "`$STRING`",
          "req": true
        },
        {
          "name": "upload_url",
          "title": "Upload Url",
          "type": "`$STRING`",
          "short": "A signed URL for the screenshot, valid for five minutes.",
          "format": "uri"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "report",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/ingest/{publicKey}",
              "segments": [
                {
                  "lit": "ingest"
                },
                {
                  "var": "public_key"
                }
              ],
              "parts": [
                "ingest",
                "{public_key}"
              ],
              "rename": {
                "param": {
                  "publicKey": "public_key"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "public_key",
                    "orig": "publicKey",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "public_key"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "screenshot": {
      "fields": [
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        },
        {
          "name": "ok",
          "title": "Ok",
          "type": "`$BOOLEAN`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "screenshot",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/ingest/screenshot/{report}",
              "segments": [
                {
                  "lit": "ingest"
                },
                {
                  "lit": "screenshot"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "ingest",
                "screenshot",
                "{id}"
              ],
              "rename": {
                "param": {
                  "report": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "report",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true
                  }
                ],
                "query": [
                  {
                    "name": "expire",
                    "orig": "expires",
                    "type": "`$INTEGER`",
                    "kind": "query",
                    "reqd": true
                  },
                  {
                    "name": "signature",
                    "orig": "signature",
                    "type": "`$STRING`",
                    "kind": "query",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "expire",
                  "id",
                  "signature"
                ]
              },
              "body": {
                "fields": [
                  {
                    "binary": true,
                    "name": "screenshot"
                  }
                ],
                "kind": "multipart",
                "media": "multipart/form-data"
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "widget_config": {
      "fields": [
        {
          "name": "brand",
          "title": "Brand",
          "type": "`$OBJECT`"
        },
        {
          "name": "capture_screenshot",
          "title": "Capture Screenshot",
          "type": "`$BOOLEAN`"
        },
        {
          "name": "mode",
          "title": "Mode",
          "type": "`$STRING`",
          "short": "How much the key trusts what a page says about the reporter."
        },
        {
          "name": "require_email",
          "title": "Require Email",
          "type": "`$BOOLEAN`"
        }
      ],
      "name": "widget_config",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/ingest/{publicKey}/config",
              "segments": [
                {
                  "lit": "ingest"
                },
                {
                  "var": "public_key"
                },
                {
                  "lit": "config"
                }
              ],
              "parts": [
                "ingest",
                "{public_key}",
                "config"
              ],
              "rename": {
                "param": {
                  "publicKey": "public_key"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "public_key",
                    "orig": "publicKey",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true
                  }
                ]
              },
              "select": {
                "exist": [
                  "public_key"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

