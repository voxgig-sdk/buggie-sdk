# Buggie Ruby SDK

Buggie API clients in TypeScript, Python, PHP, Go, Ruby and Lua, plus a CLI and an MCP server for AI agents. All generated from one OpenAPI definition of Buggie's token API and its reporter ingest API, so every surface stays in sync with the API.

The Ruby SDK for the Buggie API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Issue` — with named operations (`list`/`load`/`create`/`update`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/buggie-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/buggie-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-buggie-sdk", path: "./buggie-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "Buggie_sdk"

client = BuggieSDK.new({
  "apikey" => ENV["BUGGIE_APIKEY"],
})
```

### 2. List issue records

```ruby
begin
  # list returns an Array of Issue entities, one per record; data_get reads the record.
  issues = client.Issue.list
  issues.each do |item|
    record = item.data_get
    puts "#{record["id"]} #{record["assignee"]}"
  end
rescue => err
  warn "list failed: #{err}"
end
```

### 3. Load an issue

```ruby
begin
  # load returns the ENTITY — call data_get for the Issue record (raises on error).
  issue = client.Issue.load({ "id" => "example_id" })
  puts issue.data_get
rescue => err
  warn "load failed: #{err}"
end
```

### 4. Create, update, and remove

```ruby
# create returns the ENTITY — call data_get for the created Issue record.
created = client.Issue.create({ "project_id" => 1 })

# Update — index the record via data_get (created.data_get["id"]).
client.Issue.update({ "id" => created.data_get["id"], "assignee" => {}, "assignee_id" => 1 })

```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  projects = client.Project.list()
rescue => err
  warn "list failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = BuggieSDK.test

# list returns an Array of Project entities, one per mock record (raises on
# error); data_get reads each record.
projects = client.Project.list()
projects.each { |item| puts item.data_get }
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = BuggieSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
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
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### BuggieSDK

```ruby
require_relative "Buggie_sdk"
client = BuggieSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `String` | API key for authentication. |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = BuggieSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### BuggieSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `Issue` | `(data) -> IssueEntity` | Create an Issue entity instance. |
| `Project` | `(data) -> ProjectEntity` | Create a Project entity instance. |
| `Report` | `(data) -> ReportEntity` | Create a Report entity instance. |
| `Screenshot` | `(data) -> ScreenshotEntity` | Create a Screenshot entity instance. |
| `WidgetConfig` | `(data) -> WidgetConfigEntity` | Create a WidgetConfig entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity, and return it. Raises on error. |
| `update` | `(reqdata, ctrl) -> any` | Update an existing entity, and return it. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`BuggieError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

### Entities

#### Issue

| Field | Description |
| --- | --- |
| `assignee` |  |
| `assignee_id` | A member of the team. |
| `board_pinned` | A pinned card stays on the board whatever the filter says. |
| `client_audience` | Which clients see a client-visible issue. |
| `client_share_ids` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `closed_at` |  |
| `created_at` |  |
| `custom_fields` | Custom field values keyed by the field's key, e.g. |
| `description` | A rich-text document in Tiptap's JSON form, e.g. |
| `due_on` |  |
| `estimate_minutes` |  |
| `id` |  |
| `key` |  |
| `labels` | Label names. |
| `occurrences` | How many times this bug has been reported, counting the first. |
| `parent` | An issue key; the new issue is created as its subtask. |
| `phase_id` | A phase of the issue's project. |
| `priority` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `project` |  |
| `project_id` | The project's id, for a project the token's owner can see. |
| `reporter` |  |
| `start_on` |  |
| `status` |  |
| `status_id` | A status of the workspace. |
| `time_spent_minutes` |  |
| `title` |  |
| `type` |  |
| `updated_at` |  |
| `version_id` | A release of the issue's project. |
| `visibility` |  |

Operations: Create, List, Load, Update.

API path: `/v1/issues`

#### Project

| Field | Description |
| --- | --- |
| `description` |  |
| `key` |  |
| `name` |  |
| `slug` |  |

Operations: List.

API path: `/v1/projects`

#### Report

| Field | Description |
| --- | --- |
| `body` | What the reporter wrote. |
| `console` |  |
| `environment` | Where it happened. |
| `error` | The error, if there was one. |
| `id` |  |
| `network` |  |
| `reference` | The reference shown to the reporter. |
| `reporter` | Who is reporting. |
| `screenshot` | Ask for a screenshot upload URL in the response. |
| `title` |  |
| `upload_url` | A signed URL for the screenshot, valid for five minutes. |

Operations: Create.

API path: `/ingest/{publicKey}`

#### Screenshot

| Field | Description |
| --- | --- |
| `id` |  |
| `ok` |  |

Operations: Create.

API path: `/ingest/screenshot/{report}`

#### WidgetConfig

| Field | Description |
| --- | --- |
| `brand` |  |
| `capture_screenshot` |  |
| `mode` | How much the key trusts what a page says about the reporter. |
| `require_email` |  |

Operations: Load.

API path: `/ingest/{publicKey}/config`



## Entities


### Issue

Create an instance: `issue = client.Issue`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `assignee` | `Hash` |  |
| `assignee_id` | `Integer` | A member of the team. |
| `board_pinned` | `Boolean` | A pinned card stays on the board whatever the filter says. |
| `client_audience` | `String` | Which clients see a client-visible issue. |
| `client_share_ids` | `Array` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `closed_at` | `String` |  |
| `created_at` | `String` |  |
| `custom_fields` | `Object` | Custom field values keyed by the field's key, e.g. |
| `description` | `Hash` | A rich-text document in Tiptap's JSON form, e.g. |
| `due_on` | `String` |  |
| `estimate_minutes` | `Integer` |  |
| `id` | `String` |  |
| `key` | `String` |  |
| `labels` | `Array` | Label names. |
| `occurrences` | `Integer` | How many times this bug has been reported, counting the first. |
| `parent` | `String` | An issue key; the new issue is created as its subtask. |
| `phase_id` | `Integer` | A phase of the issue's project. |
| `priority` | `Integer` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `project` | `Hash` |  |
| `project_id` | `Integer` | The project's id, for a project the token's owner can see. |
| `reporter` | `Hash` |  |
| `start_on` | `String` |  |
| `status` | `Hash` |  |
| `status_id` | `Integer` | A status of the workspace. |
| `time_spent_minutes` | `Integer` |  |
| `title` | `String` |  |
| `type` | `String` |  |
| `updated_at` | `String` |  |
| `version_id` | `Integer` | A release of the issue's project. |
| `visibility` | `String` |  |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Issue record (raises on error).
issue = client.Issue.load({ "id" => "issue_id" })
```

#### Example: List

```ruby
# list returns an Array of Issue entities, one per record (raises on error).
issues = client.Issue.list
issues.each { |item| puts item.data_get }
```

#### Example: Create

```ruby
issue = client.Issue.create({
  "project_id" => 1, # Integer
})
```


### Project

Create an instance: `project = client.Project`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `description` | `String` |  |
| `key` | `String` |  |
| `name` | `String` |  |
| `slug` | `String` |  |

#### Example: List

```ruby
# list returns an Array of Project entities, one per record (raises on error).
projects = client.Project.list
projects.each { |item| puts item.data_get }
```


### Report

Create an instance: `report = client.Report`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `body` | `String` | What the reporter wrote. |
| `console` | `Array` |  |
| `environment` | `Hash` | Where it happened. |
| `error` | `Hash` | The error, if there was one. |
| `id` | `Integer` |  |
| `network` | `Array` |  |
| `reference` | `String` | The reference shown to the reporter. |
| `reporter` | `Hash` | Who is reporting. |
| `screenshot` | `Boolean` | Ask for a screenshot upload URL in the response. |
| `title` | `String` |  |
| `upload_url` | `String` | A signed URL for the screenshot, valid for five minutes. |

#### Example: Create

```ruby
report = client.Report.create({
  "public_key" => "example_public_key", # String
  "title" => "example_title", # String
})
```


### Screenshot

Create an instance: `screenshot = client.Screenshot`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `String` |  |
| `ok` | `Boolean` |  |

#### Example: Create

```ruby
screenshot = client.Screenshot.create({
  "id" => 1, # Integer
  "expire" => 1, # Integer
  "signature" => "example_signature", # String
})
```


### WidgetConfig

Create an instance: `widget_config = client.WidgetConfig`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `brand` | `Hash` |  |
| `capture_screenshot` | `Boolean` |  |
| `mode` | `String` | How much the key trusts what a page says about the reporter. |
| `require_email` | `Boolean` |  |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the WidgetConfig record (raises on error).
widget_config = client.WidgetConfig.load({ "public_key" => "public_key" })
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

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

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

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── Buggie_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`Buggie_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```ruby
project = client.Project
project.list()

# project.data_get now returns the project data from the last list
# project.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
