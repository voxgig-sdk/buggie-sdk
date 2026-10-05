# Buggie API

> Buggie is bug tracking that starts with a good report: a tracker for people who
> build things for clients, whose reporter widget captures the screenshot, the
> console and the failing request at the moment something broke. It is AGPL-3.0 and
> self-hostable, with a hosted service at buggie.eu.
>
> This definition covers both HTTP APIs Buggie documents for its users:
>
> - **The token API** (`/v1`), for scripting against a workspace: listing, reading,
> filing and updating issues, and listing projects. It lives on the workspace&#39;s own
> subdomain and is authenticated by a personal access token made under
> Settings → Workspace → API tokens, with the abilities `read` and/or `write`.
> Tokens are for members of staff: a client&#39;s token is refused with 403.
> Requests are limited to 120 a minute per token.
> - **The reporter ingest API** (`/ingest`), which the web widget and the native
> SDKs post bug reports to. It is unauthenticated and keyed by a project&#39;s public
> widget key. It is documented on the central domain, `https://buggie.eu/api`, or
> a self-hosted install&#39;s own domain.
>
> Not covered, deliberately: the inbound-mail webhook (`/mail/inbound`), which is a
> Mailgun callback rather than an API for Buggie&#39;s users; the webhooks Buggie sends
> to you (https://buggie.eu/docs/webhooks); and the application&#39;s own screens.
>
> Unofficial definition authored by Voxgig from Buggie&#39;s public source
> (https://github.com/bpowerie25/buggie: `routes/api.php`, the `Api` controllers and
> the form requests they validate with) and its documentation
> (https://buggie.eu/docs/api, https://buggie.eu/docs/native-sdks), and verified
> against a self-hosted instance built from that source. Not an official Buggie
> document.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 5 entities and 8 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Issue

Results: The created issue, key included.; A page of issues.; The issue.; The updated issue.

SDK operations: `create`, `list`, `load`, `update`.

Key fields to recognise:

- `assignee_id`: A member of the team.
- `board_pinned`: A pinned card stays on the board whatever the filter says.
- `client_audience`: Which clients see a client-visible issue.
- `client_share_ids`: The clients an issue is shared with, by user id, when `client_audience` is `specific`.
- `custom_fields`: Custom field values keyed by the field&#39;s key, for example `&#123;&quot;environment&quot;: &quot;Production&quot;&#125;`. An issue with none gets an empty array, `[]`, rather than an empty object.

### Project

Results: The projects.

SDK operations: `list`.

### Report

Results: The report was accepted and is being processed.

SDK operations: `create`.

Key fields to recognise:

- `body`: What the reporter wrote.
- `environment`: Where it happened.
- `error`: The error, if there was one.
- `reference`: The reference shown to the reporter.
- `reporter`: Who is reporting.

### Screenshot

Results: The screenshot was stored.

SDK operations: `create`.

### WidgetConfig

Results: The key&#39;s settings.

SDK operations: `load`.

Key fields to recognise:

- `mode`: How much the key trusts what a page says about the reporter.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Issue | `create` | `POST /v1/issues` | Required |
| Issue | `list` | `GET /v1/issues` | Required |
| Issue | `load` | `GET /v1/issues/{key}` | Required |
| Issue | `update` | `PATCH /v1/issues/{key}` | Required |
| Project | `list` | `GET /v1/projects` | Required |
| Report | `create` | `POST /ingest/{publicKey}` | Not required |
| Screenshot | `create` | `POST /ingest/screenshot/{report}` | Not required |
| WidgetConfig | `load` | `GET /ingest/{publicKey}/config` | Not required |

## Connect to the API

- Buggie (hosted). The token API answers on the workspace&#39;s own subdomain. A self-hosted install serves the same paths on its own domain.: `https://{workspace}.buggie.eu/api`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

A personal access token from Settings → Workspace → API tokens, for members of staff. It is shown once, works only in the workspace it was made in, and carries the abilities `read` (list and read issues and projects) and/or `write` (create and update issues).

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `buggie_list`: List records for an entity. Supported entities: `issue`, `project`.
- `buggie_load`: Load one record for an entity. Supported entities: `issue`, `widget_config`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `debug`: Request/response capture ring buffer for debugging
- `idempotency`: Idempotency keys for safe retries of mutating operations
- `metrics`: Statistics capture: per-operation counters and latency
- `paging`: Pagination signals for list operations
- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

