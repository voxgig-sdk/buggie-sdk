# Buggie TypeScript SDK

Buggie API clients in TypeScript, Python, PHP, Go, Ruby and Lua, plus a CLI and an MCP server for AI agents. All generated from one OpenAPI definition of Buggie's token API and its reporter ingest API, so every surface stays in sync with the API.

The TypeScript SDK for the Buggie API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Issue()` — each with a small set of operations (`list`, `load`, `create`, `update`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Releases](https://github.com/voxgig-sdk/buggie-sdk/releases)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/buggie-sdk
npm install ./buggie-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { BuggieSDK } from '@voxgig-sdk/buggie-sdk'

const client = new BuggieSDK({
  apikey: process.env.BUGGIE_APIKEY,
  // Required: this API's server URL is templated on these.
  server: {
    workspace: '<workspace>',
  },
})
```

### 2. List issue records

`list()` resolves to an array of Issue ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const issues = await client.Issue().list()

for (const issue of issues) {
  console.log(issue)
}
```

### 3. Load an issue

`load()` returns the entity directly and throws on failure:

```ts
try {
  const issue = await client.Issue().load({ id: 'example_id' })
  console.log(issue)
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Create — returns the created Issue ENTITY (.data() for the record)
const created = await client.Issue().create({
  project_id: 1,
})

// Update — the id comes off the returned entity's data()
const updated = await client.Issue().update({
  id: created.data().id!,
  assignee: {},
  assignee_id: 1,
})

```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const projects = await client.Project().list()
  console.log(projects)
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
value or an `Error`, so check the result before using it:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (result instanceof Error) {
  throw result
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result instanceof Error) {
  throw result
}
if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = BuggieSDK.test()

const project = await client.Project().list()
// project is the entity, populated with mock response data
// — call project.data() for the record itself
console.log(project)
```

You can also use the instance method:

```ts
const client = new BuggieSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Project()

// First call runs the operation and stores its result
await entity.list()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new BuggieSDK({
  apikey: '...',
  extend: [logger],
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
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### BuggieSDK

#### Constructor

```ts
new BuggieSDK(options?: {
  apikey?: string
  server?: { workspace: string }
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `server` | `object` | **Required.** Values for the server-URL variables: `workspace`. The API base URL is a template over them. |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Issue(data?)` | `IssueEntity` | Create an Issue entity instance. |
| `Project(data?)` | `ProjectEntity` | Create a Project entity instance. |
| `Report(data?)` | `ReportEntity` | Create a Report entity instance. |
| `Screenshot(data?)` | `ScreenshotEntity` | Create a Screenshot entity instance. |
| `WidgetConfig(data?)` | `WidgetConfigEntity` | Create a WidgetConfig entity instance. |
| `tester(testopts?, sdkopts?)` | `BuggieSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `BuggieSDK.test(testopts?, sdkopts?)` | `BuggieSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): BuggieSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity data directly — there is no
result envelope:

- `load`, `create` and `update` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

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

Operations: create, list, load, update.

API path: `/v1/issues`

#### Project

| Field | Description |
| --- | --- |
| `description` |  |
| `key` |  |
| `name` |  |
| `slug` |  |

Operations: list.

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

Operations: create.

API path: `/ingest/{publicKey}`

#### Screenshot

| Field | Description |
| --- | --- |
| `id` |  |
| `ok` |  |

Operations: create.

API path: `/ingest/screenshot/{report}`

#### WidgetConfig

| Field | Description |
| --- | --- |
| `brand` |  |
| `capture_screenshot` |  |
| `mode` | How much the key trusts what a page says about the reporter. |
| `require_email` |  |

Operations: load.

API path: `/ingest/{publicKey}/config`



## Entities


### Issue

Create an instance: `const issue = client.Issue()`

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
| `assignee` | `Record<string, any>` |  |
| `assignee_id` | `number` | A member of the team. |
| `board_pinned` | `boolean` | A pinned card stays on the board whatever the filter says. |
| `client_audience` | `string` | Which clients see a client-visible issue. |
| `client_share_ids` | `any[]` | The clients an issue is shared with, by user id, when `client_audience` is `specific`. |
| `closed_at` | `string` |  |
| `created_at` | `string` |  |
| `custom_fields` | `any` | Custom field values keyed by the field's key, e.g. |
| `description` | `Record<string, any>` | A rich-text document in Tiptap's JSON form, e.g. |
| `due_on` | `string` |  |
| `estimate_minutes` | `number` |  |
| `id` | `string` |  |
| `key` | `string` |  |
| `labels` | `any[]` | Label names. |
| `occurrences` | `number` | How many times this bug has been reported, counting the first. |
| `parent` | `string` | An issue key; the new issue is created as its subtask. |
| `phase_id` | `number` | A phase of the issue's project. |
| `priority` | `number` | 0 none, 1 low, 2 medium, 3 high, 4 urgent. |
| `project` | `Record<string, any>` |  |
| `project_id` | `number` | The project's id, for a project the token's owner can see. |
| `reporter` | `Record<string, any>` |  |
| `start_on` | `string` |  |
| `status` | `Record<string, any>` |  |
| `status_id` | `number` | A status of the workspace. |
| `time_spent_minutes` | `number` |  |
| `title` | `string` |  |
| `type` | `string` |  |
| `updated_at` | `string` |  |
| `version_id` | `number` | A release of the issue's project. |
| `visibility` | `string` |  |

#### Example: Load

```ts
const issue = await client.Issue().load({ id: 'issue_id' })
```

#### Example: List

```ts
const issues = await client.Issue().list()
```

#### Example: Create

```ts
const issue = await client.Issue().create({
  project_id: 1,
})
```


### Project

Create an instance: `const project = client.Project()`

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

```ts
const projects = await client.Project().list()
```


### Report

Create an instance: `const report = client.Report()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` | What the reporter wrote. |
| `console` | `any[]` |  |
| `environment` | `Record<string, any>` | Where it happened. |
| `error` | `Record<string, any>` | The error, if there was one. |
| `id` | `number` |  |
| `network` | `any[]` |  |
| `reference` | `string` | The reference shown to the reporter. |
| `reporter` | `Record<string, any>` | Who is reporting. |
| `screenshot` | `boolean` | Ask for a screenshot upload URL in the response. |
| `title` | `string` |  |
| `upload_url` | `string` | A signed URL for the screenshot, valid for five minutes. |

#### Example: Create

```ts
const report = await client.Report().create({
  public_key: 'example_public_key',
  title: 'example_title',
})
```


### Screenshot

Create an instance: `const screenshot = client.Screenshot()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |
| `ok` | `boolean` |  |

#### Example: Create

```ts
const screenshot = await client.Screenshot().create({
  id: 1,
  expire: 1,
  signature: 'example_signature',
})
```


### WidgetConfig

Create an instance: `const widget_config = client.WidgetConfig()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `brand` | `Record<string, any>` |  |
| `capture_screenshot` | `boolean` |  |
| `mode` | `string` | How much the key trusts what a page says about the reporter. |
| `require_email` | `boolean` |  |

#### Example: Load

```ts
const widget_config = await client.WidgetConfig().load({ public_key: 'public_key' })
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

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

### Module structure

```
buggie/
├── src/
│   ├── BuggieSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { BuggieSDK } from '@voxgig-sdk/buggie-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const project = client.Project()
await project.list()

// project.data() now returns the project data from the last `list`
// project.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
