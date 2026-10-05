package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Buggie",
			"slug": "buggie",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"debug": map[string]any{
				"options": map[string]any{
					"active": false,
					"max": 100,
					"redact": []any{
						"authorization",
						"cookie",
						"set-cookie",
						"api-key",
						"apikey",
						"x-api-key",
						"idempotency-key",
					},
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"onEntry": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"idempotency": map[string]any{
				"options": map[string]any{
					"active": false,
					"header": "Idempotency-Key",
					"methods": []any{
						"POST",
						"PUT",
						"PATCH",
						"DELETE",
					},
					"ops": []any{
						"create",
						"update",
						"remove",
					},
				},
				"optspec": map[string]any{
					"keygen": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"metrics": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "none",
			},
			"paging": map[string]any{
				"options": map[string]any{
					"active": false,
					"afterVar": "after",
					"cursorParam": "cursor",
					"firstVar": "first",
					"limitParam": "limit",
					"pageParam": "page",
					"startPage": 1,
				},
				"optspec": map[string]any{
					"limit": "`$NUMBER`",
					"ops": "`$LIST`",
				},
				"strict": false,
				"transport": "none",
			},
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://{workspace}.buggie.eu/api",
			"server": map[string]any{
				"workspace": "your-workspace",
			},
			"auth": map[string]any{
				"prefix": "Bearer",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"issue": map[string]any{},
				"project": map[string]any{},
				"report": map[string]any{},
				"screenshot": map[string]any{},
				"widget_config": map[string]any{},
			},
		},
		"entity": map[string]any{
			"issue": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "assignee",
						"title": "Assignee",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "assignee_id",
						"title": "Assignee Id",
						"type": "`$INTEGER`",
						"short": "A member of the team.",
					},
					map[string]any{
						"name": "board_pinned",
						"title": "Board Pinned",
						"type": "`$BOOLEAN`",
						"short": "A pinned card stays on the board whatever the filter says.",
					},
					map[string]any{
						"name": "client_audience",
						"title": "Client Audience",
						"type": "`$STRING`",
						"short": "Which clients see a client-visible issue.",
					},
					map[string]any{
						"name": "client_share_ids",
						"title": "Client Share Ids",
						"type": "`$ARRAY`",
						"short": "The clients an issue is shared with, by user id, when `client_audience` is `specific`.",
					},
					map[string]any{
						"name": "closed_at",
						"title": "Closed At",
						"type": "`$STRING`",
						"format": "date-time",
					},
					map[string]any{
						"name": "created_at",
						"title": "Created At",
						"type": "`$STRING`",
						"format": "date-time",
					},
					map[string]any{
						"name": "custom_fields",
						"title": "Custom Fields",
						"type": "`$ANY`",
						"short": "Custom field values keyed by the field's key, e.g.",
					},
					map[string]any{
						"name": "description",
						"title": "Description",
						"type": "`$OBJECT`",
						"short": "A rich-text document in Tiptap's JSON form, e.g.",
					},
					map[string]any{
						"name": "due_on",
						"title": "Due On",
						"type": "`$STRING`",
						"format": "date",
					},
					map[string]any{
						"name": "estimate_minutes",
						"title": "Estimate Minutes",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "key",
						"title": "Key",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "labels",
						"title": "Labels",
						"type": "`$ARRAY`",
						"short": "Label names.",
					},
					map[string]any{
						"name": "occurrences",
						"title": "Occurrences",
						"type": "`$INTEGER`",
						"short": "How many times this bug has been reported, counting the first.",
					},
					map[string]any{
						"name": "parent",
						"title": "Parent",
						"type": "`$STRING`",
						"short": "An issue key; the new issue is created as its subtask.",
					},
					map[string]any{
						"name": "phase_id",
						"title": "Phase Id",
						"type": "`$INTEGER`",
						"short": "A phase of the issue's project.",
					},
					map[string]any{
						"name": "priority",
						"title": "Priority",
						"type": "`$INTEGER`",
						"short": "0 none, 1 low, 2 medium, 3 high, 4 urgent.",
					},
					map[string]any{
						"name": "project",
						"title": "Project",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "project_id",
						"title": "Project Id",
						"type": "`$INTEGER`",
						"req": true,
						"short": "The project's id, for a project the token's owner can see.",
					},
					map[string]any{
						"name": "reporter",
						"title": "Reporter",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "start_on",
						"title": "Start On",
						"type": "`$STRING`",
						"format": "date",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "status_id",
						"title": "Status Id",
						"type": "`$INTEGER`",
						"short": "A status of the workspace.",
					},
					map[string]any{
						"name": "time_spent_minutes",
						"title": "Time Spent Minutes",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "title",
						"title": "Title",
						"type": "`$STRING`",
						"op": map[string]any{
							"create": map[string]any{
								"req": true,
								"type": "`$STRING`",
							},
						},
					},
					map[string]any{
						"name": "type",
						"title": "Type",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "updated_at",
						"title": "Updated At",
						"type": "`$STRING`",
						"format": "date-time",
					},
					map[string]any{
						"name": "version_id",
						"title": "Version Id",
						"type": "`$INTEGER`",
						"short": "A release of the issue's project.",
					},
					map[string]any{
						"name": "visibility",
						"title": "Visibility",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "issue",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/v1/issues",
								"segments": []any{
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "issues",
									},
								},
								"parts": []any{
									"v1",
									"issues",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/v1/issues",
								"segments": []any{
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "issues",
									},
								},
								"parts": []any{
									"v1",
									"issues",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "page",
											"orig": "page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 1,
										},
										map[string]any{
											"name": "per_page",
											"orig": "per_page",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": 50,
										},
										map[string]any{
											"name": "q",
											"orig": "q",
											"type": "`$STRING`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"page",
										"per_page",
										"q",
									},
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/v1/issues/{key}",
								"segments": []any{
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "issues",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"v1",
									"issues",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"key": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "key",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"update": map[string]any{
						"input": "data",
						"name": "update",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "PATCH",
								"orig": "/v1/issues/{key}",
								"segments": []any{
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "issues",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"v1",
									"issues",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"key": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "key",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"project": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "description",
						"title": "Description",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "key",
						"title": "Key",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "name",
						"title": "Name",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "slug",
						"title": "Slug",
						"type": "`$STRING`",
					},
				},
				"name": "project",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/v1/projects",
								"segments": []any{
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "projects",
									},
								},
								"parts": []any{
									"v1",
									"projects",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"report": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "body",
						"title": "Body",
						"type": "`$STRING`",
						"short": "What the reporter wrote.",
					},
					map[string]any{
						"name": "console",
						"title": "Console",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "environment",
						"title": "Environment",
						"type": "`$OBJECT`",
						"short": "Where it happened.",
					},
					map[string]any{
						"name": "error",
						"title": "Error",
						"type": "`$OBJECT`",
						"short": "The error, if there was one.",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "network",
						"title": "Network",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "reference",
						"title": "Reference",
						"type": "`$STRING`",
						"short": "The reference shown to the reporter.",
					},
					map[string]any{
						"name": "reporter",
						"title": "Reporter",
						"type": "`$OBJECT`",
						"short": "Who is reporting.",
					},
					map[string]any{
						"name": "screenshot",
						"title": "Screenshot",
						"type": "`$BOOLEAN`",
						"short": "Ask for a screenshot upload URL in the response.",
					},
					map[string]any{
						"name": "title",
						"title": "Title",
						"type": "`$STRING`",
						"req": true,
					},
					map[string]any{
						"name": "upload_url",
						"title": "Upload Url",
						"type": "`$STRING`",
						"short": "A signed URL for the screenshot, valid for five minutes.",
						"format": "uri",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "report",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/ingest/{publicKey}",
								"segments": []any{
									map[string]any{
										"lit": "ingest",
									},
									map[string]any{
										"var": "public_key",
									},
								},
								"parts": []any{
									"ingest",
									"{public_key}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"publicKey": "public_key",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "public_key",
											"orig": "publicKey",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"public_key",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"screenshot": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "ok",
						"title": "Ok",
						"type": "`$BOOLEAN`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "screenshot",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/ingest/screenshot/{report}",
								"segments": []any{
									map[string]any{
										"lit": "ingest",
									},
									map[string]any{
										"lit": "screenshot",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"ingest",
									"screenshot",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"report": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "report",
											"type": "`$INTEGER`",
											"kind": "param",
											"reqd": true,
										},
									},
									"query": []any{
										map[string]any{
											"name": "expire",
											"orig": "expires",
											"type": "`$INTEGER`",
											"kind": "query",
											"reqd": true,
										},
										map[string]any{
											"name": "signature",
											"orig": "signature",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"expire",
										"id",
										"signature",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"widget_config": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "brand",
						"title": "Brand",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "capture_screenshot",
						"title": "Capture Screenshot",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "mode",
						"title": "Mode",
						"type": "`$STRING`",
						"short": "How much the key trusts what a page says about the reporter.",
					},
					map[string]any{
						"name": "require_email",
						"title": "Require Email",
						"type": "`$BOOLEAN`",
					},
				},
				"name": "widget_config",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/ingest/{publicKey}/config",
								"segments": []any{
									map[string]any{
										"lit": "ingest",
									},
									map[string]any{
										"var": "public_key",
									},
									map[string]any{
										"lit": "config",
									},
								},
								"parts": []any{
									"ingest",
									"{public_key}",
									"config",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"publicKey": "public_key",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "public_key",
											"orig": "publicKey",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"public_key",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "debug":
		if NewDebugFeatureFunc != nil {
			return NewDebugFeatureFunc()
		}
	case "idempotency":
		if NewIdempotencyFeatureFunc != nil {
			return NewIdempotencyFeatureFunc()
		}
	case "metrics":
		if NewMetricsFeatureFunc != nil {
			return NewMetricsFeatureFunc()
		}
	case "paging":
		if NewPagingFeatureFunc != nil {
			return NewPagingFeatureFunc()
		}
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
