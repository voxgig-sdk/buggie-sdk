# Buggie PHP SDK

Buggie API clients in TypeScript, Python, PHP, Go, Ruby and Lua, plus a CLI and an MCP server for AI agents. All generated from one OpenAPI definition of Buggie's token API and its reporter ingest API, so every surface stays in sync with the API.

The PHP SDK for the Buggie API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->Issue()` — with named operations (`list`/`load`/`create`/`update`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`, see [Releases](https://github.com/voxgig-sdk/buggie-sdk/releases)), or
from a clone as a Composer path repository:

```bash
git clone https://github.com/voxgig-sdk/buggie-sdk
composer config repositories.buggie-sdk path ./buggie-sdk/php
composer require voxgig-sdk/buggie-sdk:@dev
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```php
<?php
require_once 'buggie_sdk.php';

$client = new BuggieSDK([
    "apikey" => getenv("BUGGIE_APIKEY"),
]);
```

### 2. List issue records

```php
try {
    // list() returns entity instances; data_get() reads each record.
    $issues = $client->Issue()->list();
    foreach ($issues as $record) {
        $item = $record->data_get();
        echo $item["id"] . " " . $item["assignee"] . "\n";
    }
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 3. Load an issue

```php
try {
    // load() returns the ENTITY — call data_get() for the Issue record (throws on error).
    $issue = $client->Issue()->load(["id" => "example_id"]);
    print_r($issue->data_get());
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

### 4. Create, update, and remove

```php
// create() returns the ENTITY — call data_get() for the created Issue record.
$created = $client->Issue()->create(["project_id" => 1]);

// Update — index the record via data_get() ($created->data_get()["id"]).
$client->Issue()->update(["id" => $created->data_get()["id"], "assignee" => [], "assignee_id" => 1]);

```


## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $projects = $client->Project()->list();
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required. Seed fixture
data via the `entity` option so offline calls resolve without a live server:

```php
$client = BuggieSDK::test([
    "entity" => ["issue" => ["test01" => ["id" => "test01"]]],
]);

// list() returns entity instances (throws on error);
// call data_get() for the mock record.
$issue = $client->Issue()->list();
print_r(array_map(fn($item) => $item->data_get(), $issue));
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new BuggieSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
BUGGIE_TEST_LIVE=TRUE
BUGGIE_APIKEY=<your-key>
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### BuggieSDK

```php
require_once 'buggie_sdk.php';
$client = new BuggieSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = BuggieSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### BuggieSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `Issue` | `($data): IssueEntity` | Create an Issue entity instance. |
| `Project` | `($data): ProjectEntity` | Create a Project entity instance. |
| `Report` | `($data): ReportEntity` | Create a Report entity instance. |
| `Screenshot` | `($data): ScreenshotEntity` | Create a Screenshot entity instance. |
| `WidgetConfig` | `($data): WidgetConfigEntity` | Create a WidgetConfig entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): array` | Load a single entity by match criteria. |
| `list` | `(?array $reqmatch = null, $ctrl): array` | List entities matching the criteria (call with no argument to list all). |
| `create` | `($reqdata, $ctrl): array` | Create a new entity. |
| `update` | `($reqdata, $ctrl): array` | Update an existing entity. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the ENTITY (call data_get() for the record) (an `array` for single-entity
ops, a `list` for `list`) and throw on error. Wrap calls in
`try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

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

Create an instance: `$issue = $client->Issue();`

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
| `assignee` | `array` |  |
| `assignee_id` | `int` | A member of the team. |
| `board_pinned` | `bool` | A pinned card stays on the board whatever the filter says. |
| `client_audience` | `string` | Which clients see a client-visible issue. |
| `client_share_ids` | `array` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `closed_at` | `string` |  |
| `created_at` | `string` |  |
| `custom_fields` | `mixed` | Custom field values keyed by the field's key, e.g. |
| `description` | `array` | A rich-text document in Tiptap's JSON form, e.g. |
| `due_on` | `string` |  |
| `estimate_minutes` | `int` |  |
| `id` | `string` |  |
| `key` | `string` |  |
| `labels` | `array` | Label names. |
| `occurrences` | `int` | How many times this bug has been reported, counting the first. |
| `parent` | `string` | An issue key; the new issue is created as its subtask. |
| `phase_id` | `int` | A phase of the issue's project. |
| `priority` | `int` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `project` | `array` |  |
| `project_id` | `int` | The project's id, for a project the token's owner can see. |
| `reporter` | `array` |  |
| `start_on` | `string` |  |
| `status` | `array` |  |
| `status_id` | `int` | A status of the workspace. |
| `time_spent_minutes` | `int` |  |
| `title` | `string` |  |
| `type` | `string` |  |
| `updated_at` | `string` |  |
| `version_id` | `int` | A release of the issue's project. |
| `visibility` | `string` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Issue record (throws on error).
$issue = $client->Issue()->load(["id" => "issue_id"]);
```

#### Example: List

```php
// list() returns an array of Issue records (throws on error).
$issues = $client->Issue()->list();
```

#### Example: Create

```php
$issue = $client->Issue()->create([
    "project_id" => null, // int
]);
```


### Project

Create an instance: `$project = $client->Project();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `description` | `string` |  |
| `key` | `string` |  |
| `name` | `string` |  |
| `slug` | `string` |  |

#### Example: List

```php
// list() returns an array of Project records (throws on error).
$projects = $client->Project()->list();
```


### Report

Create an instance: `$report = $client->Report();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` | What the reporter wrote. |
| `console` | `array` |  |
| `environment` | `array` | Where it happened. |
| `error` | `array` | The error, if there was one. |
| `id` | `int` |  |
| `network` | `array` |  |
| `reference` | `string` | The reference shown to the reporter. |
| `reporter` | `array` | Who is reporting. |
| `screenshot` | `bool` | Ask for a screenshot upload URL in the response. |
| `title` | `string` |  |
| `upload_url` | `string` | A signed URL for the screenshot, valid for five minutes. |

#### Example: Create

```php
$report = $client->Report()->create([
    "public_key" => null, // string
    "title" => null, // string
]);
```


### Screenshot

Create an instance: `$screenshot = $client->Screenshot();`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |
| `ok` | `bool` |  |

#### Example: Create

```php
$screenshot = $client->Screenshot()->create([
    "id" => null, // int
    "expire" => null, // int
    "signature" => null, // string
]);
```


### WidgetConfig

Create an instance: `$widget_config = $client->WidgetConfig();`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `brand` | `array` |  |
| `capture_screenshot` | `bool` |  |
| `mode` | `string` | How much the key trusts what a page says about the reporter. |
| `require_email` | `bool` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the WidgetConfig record (throws on error).
$widget_config = $client->WidgetConfig()->load(["public_key" => "public_key"]);
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

Features are the extension mechanism. A feature is a PHP class
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

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── buggie_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── schema.php                     -- Generated option + entity specs
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`buggie_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```php
$project = $client->Project();
$project->list();

// $project->data_get() now returns the project data from the last list
// $project->match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
