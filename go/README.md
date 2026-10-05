# Buggie Golang SDK

Buggie API clients in TypeScript, Python, PHP, Go, Ruby and Lua, plus a CLI and an MCP server for AI agents. All generated from one OpenAPI definition of Buggie's token API and its reporter ingest API, so every surface stays in sync with the API.

The Golang SDK for the Buggie API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Issue(nil)` — each with the same small set of operations (`List`, `Load`, `Create`, `Update`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/buggie-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Releases](https://github.com/voxgig-sdk/buggie-sdk/releases) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/buggie-sdk/go=../buggie-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the data itself
(there is no `{ok, data}` wrapper), so check `err` and use the value
directly.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/buggie-sdk/go"
)

func main() {
    client := sdk.NewBuggieSDK(map[string]any{
        "apikey": os.Getenv("BUGGIE_APIKEY"),
    "server": map[string]any{
        "workspace": "<workspace>",
    },
    })

    // List issue records — the value is the array of records itself.
    issues, err := client.Issue(nil).List(nil, nil)
    if err != nil {
        panic(err)
    }
    for _, item := range issues.([]any) {
        fmt.Println(item)
    }

    // Load a single issue — the value is the loaded record.
    issue, err := client.Issue(nil).Load(map[string]any{"id": "example_id"}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(issue)

    // Create a issue.
    created, err := client.Issue(nil).Create(map[string]any{"project_id": 1}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(created)

    // Update a issue.
    updated, err := client.Issue(nil).Update(map[string]any{"id": "example_id", "assignee": map[string]any{}, "assignee_id": 1}, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(updated)
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
projects, err := client.Project(nil).List(nil, nil)
if err != nil {
    // handle err
    return
}
_ = projects
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

project, err := client.Project(nil).List(
    nil, nil,
)
if err != nil {
    panic(err)
}
fmt.Println(project) // the returned mock data
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewBuggieSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
    },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
BUGGIE_TEST_LIVE=TRUE
BUGGIE_APIKEY=<your-key>
```

Then run:

```bash
cd go && go test ./test/...
```


## Reference

### NewBuggieSDK

```go
func NewBuggieSDK(options map[string]any) *BuggieSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *BuggieSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### BuggieSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Issue` | `(data map[string]any) BuggieEntity` | Create an Issue entity instance. |
| `Project` | `(data map[string]any) BuggieEntity` | Create a Project entity instance. |
| `Report` | `(data map[string]any) BuggieEntity` | Create a Report entity instance. |
| `Screenshot` | `(data map[string]any) BuggieEntity` | Create a Screenshot entity instance. |
| `WidgetConfig` | `(data map[string]any) BuggieEntity` | Create a WidgetConfig entity instance. |

### Entity interface (BuggieEntity)

All entities implement the `BuggieEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity. |
| `Update` | `(reqdata, ctrl map[string]any) (any, error)` | Update an existing entity. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the
operation's data **directly** — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` / `Update` | the entity record (`map[string]any`) |
| `List` | a `[]any` of entity records |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    issue, err := client.Issue(nil).List(map[string]any{/* fields */}, nil)
    if err != nil { /* handle */ }
    // issue is the returned record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Issue

| Field | Description |
| --- | --- |
| `"assignee"` |  |
| `"assignee_id"` | A member of the team. |
| `"board_pinned"` | A pinned card stays on the board whatever the filter says. |
| `"client_audience"` | Which clients see a client-visible issue. |
| `"client_share_ids"` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `"closed_at"` |  |
| `"created_at"` |  |
| `"custom_fields"` | Custom field values keyed by the field's key, e.g. |
| `"description"` | A rich-text document in Tiptap's JSON form, e.g. |
| `"due_on"` |  |
| `"estimate_minutes"` |  |
| `"id"` |  |
| `"key"` |  |
| `"labels"` | Label names. |
| `"occurrences"` | How many times this bug has been reported, counting the first. |
| `"parent"` | An issue key; the new issue is created as its subtask. |
| `"phase_id"` | A phase of the issue's project. |
| `"priority"` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `"project"` |  |
| `"project_id"` | The project's id, for a project the token's owner can see. |
| `"reporter"` |  |
| `"start_on"` |  |
| `"status"` |  |
| `"status_id"` | A status of the workspace. |
| `"time_spent_minutes"` |  |
| `"title"` |  |
| `"type"` |  |
| `"updated_at"` |  |
| `"version_id"` | A release of the issue's project. |
| `"visibility"` |  |

Operations: Create, List, Load, Update.

API path: `/v1/issues`

#### Project

| Field | Description |
| --- | --- |
| `"description"` |  |
| `"key"` |  |
| `"name"` |  |
| `"slug"` |  |

Operations: List.

API path: `/v1/projects`

#### Report

| Field | Description |
| --- | --- |
| `"body"` | What the reporter wrote. |
| `"console"` |  |
| `"environment"` | Where it happened. |
| `"error"` | The error, if there was one. |
| `"id"` |  |
| `"network"` |  |
| `"reference"` | The reference shown to the reporter. |
| `"reporter"` | Who is reporting. |
| `"screenshot"` | Ask for a screenshot upload URL in the response. |
| `"title"` |  |
| `"upload_url"` | A signed URL for the screenshot, valid for five minutes. |

Operations: Create.

API path: `/ingest/{publicKey}`

#### Screenshot

| Field | Description |
| --- | --- |
| `"id"` |  |
| `"ok"` |  |

Operations: Create.

API path: `/ingest/screenshot/{report}`

#### WidgetConfig

| Field | Description |
| --- | --- |
| `"brand"` |  |
| `"capture_screenshot"` |  |
| `"mode"` | How much the key trusts what a page says about the reporter. |
| `"require_email"` |  |

Operations: Load.

API path: `/ingest/{publicKey}/config`



## Entities


### Issue

Create an instance: `issue := client.Issue(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Update(data, ctrl)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `assignee` | `map[string]any` |  |
| `assignee_id` | `int` | A member of the team. |
| `board_pinned` | `bool` | A pinned card stays on the board whatever the filter says. |
| `client_audience` | `string` | Which clients see a client-visible issue. |
| `client_share_ids` | `[]any` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `closed_at` | `string` |  |
| `created_at` | `string` |  |
| `custom_fields` | `any` | Custom field values keyed by the field's key, e.g. |
| `description` | `map[string]any` | A rich-text document in Tiptap's JSON form, e.g. |
| `due_on` | `string` |  |
| `estimate_minutes` | `int` |  |
| `id` | `string` |  |
| `key` | `string` |  |
| `labels` | `[]any` | Label names. |
| `occurrences` | `int` | How many times this bug has been reported, counting the first. |
| `parent` | `string` | An issue key; the new issue is created as its subtask. |
| `phase_id` | `int` | A phase of the issue's project. |
| `priority` | `int` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `project` | `map[string]any` |  |
| `project_id` | `int` | The project's id, for a project the token's owner can see. |
| `reporter` | `map[string]any` |  |
| `start_on` | `string` |  |
| `status` | `map[string]any` |  |
| `status_id` | `int` | A status of the workspace. |
| `time_spent_minutes` | `int` |  |
| `title` | `string` |  |
| `type` | `string` |  |
| `updated_at` | `string` |  |
| `version_id` | `int` | A release of the issue's project. |
| `visibility` | `string` |  |

#### Example: Load

```go
issue, err := client.Issue(nil).Load(map[string]any{"id": "issue_id"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(issue) // the loaded record
```

#### Example: List

```go
issues, err := client.Issue(nil).List(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(issues) // the array of records
```

#### Example: Create

```go
result, err := client.Issue(nil).Create(map[string]any{
    "project_id": 1,
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Project

Create an instance: `project := client.Project(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `description` | `string` |  |
| `key` | `string` |  |
| `name` | `string` |  |
| `slug` | `string` |  |

#### Example: List

```go
projects, err := client.Project(nil).List(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(projects) // the array of records
```


### Report

Create an instance: `report := client.Report(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` | What the reporter wrote. |
| `console` | `[]any` |  |
| `environment` | `map[string]any` | Where it happened. |
| `error` | `map[string]any` | The error, if there was one. |
| `id` | `int` |  |
| `network` | `[]any` |  |
| `reference` | `string` | The reference shown to the reporter. |
| `reporter` | `map[string]any` | Who is reporting. |
| `screenshot` | `bool` | Ask for a screenshot upload URL in the response. |
| `title` | `string` |  |
| `upload_url` | `string` | A signed URL for the screenshot, valid for five minutes. |

#### Example: Create

```go
result, err := client.Report(nil).Create(map[string]any{
    "public_key": "example_public_key",
    "title": "example_title",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### Screenshot

Create an instance: `screenshot := client.Screenshot(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |
| `ok` | `bool` |  |

#### Example: Create

```go
result, err := client.Screenshot(nil).Create(map[string]any{
    "id": 1,
    "expire": 1,
    "signature": "example_signature",
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result)
```


### WidgetConfig

Create an instance: `widgetConfig := client.WidgetConfig(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `brand` | `map[string]any` |  |
| `capture_screenshot` | `bool` |  |
| `mode` | `string` | How much the key trusts what a page says about the reporter. |
| `require_email` | `bool` |  |

#### Example: Load

```go
widgetConfig, err := client.WidgetConfig(nil).Load(map[string]any{"public_key": "public_key"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(widgetConfig) // the loaded record
```

## Features

This SDK ships 8 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`debug`](#debug) | Debug capture |
| [`idempotency`](#idempotency) | Idempotency |
| [`metrics`](#metrics) | Metrics |
| [`paging`](#paging) | Paging |
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### debug

Debug capture.

| Option | Default |
|---|---|
| `active` | `false` |
| `max` | `100` |
| `redact` | `['authorization', 'cookie', 'set-cookie', 'api-key', 'apikey', 'x-api-key', 'idempotency-key']` |

Set `feature.debug.active` to enable it, then override any of the options above.

### idempotency

Idempotency.

| Option | Default |
|---|---|
| `active` | `false` |
| `header` | `'Idempotency-Key'` |
| `methods` | `['POST', 'PUT', 'PATCH', 'DELETE']` |
| `ops` | `['create', 'update', 'remove']` |

Set `feature.idempotency.active` to enable it, then override any of the options above.

### metrics

Metrics.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.metrics.active` to enable it, then override any of the options above.

### paging

Paging.

| Option | Default |
|---|---|
| `active` | `false` |
| `afterVar` | `'after'` |
| `cursorParam` | `'cursor'` |
| `firstVar` | `'first'` |
| `limitParam` | `'limit'` |
| `pageParam` | `'page'` |
| `startPage` | `1` |

Set `feature.paging.active` to enable it, then override any of the options above.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **DebugFeature**: Debug capture
- **IdempotencyFeature**: Idempotency
- **MetricsFeature**: Metrics
- **PagingFeature**: Paging
- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

Use `core.ToMapAny()` to safely cast results and nested data.

### Package structure

```
github.com/voxgig-sdk/buggie-sdk/go/
├── buggie.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/buggie-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
project := client.Project(nil)
project.List(nil, nil)

// project.Data() now returns the project data from the last list
// project.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
