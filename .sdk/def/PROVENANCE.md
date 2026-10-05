# Provenance of `buggie-openapi.yaml`

Buggie publishes no OpenAPI definition. This one was **derived by Voxgig** on
2026-10-05 and is not an official Buggie document.

## Sources

- Buggie's public source, github.com/bpowerie25/buggie (AGPL-3.0), at commit
  `a73c4cd`: `routes/api.php`, `app/Http/Controllers/Api/IngestController.php`,
  `app/Http/Controllers/Api/V1/{IssueApiController,ProjectApiController}.php`, the
  form requests they validate with (`StoreIssueRequest`, `UpdateIssueRequest`,
  `IngestReportRequest`) and the enums those name.
- Buggie's documentation: https://buggie.eu/docs/api and
  https://buggie.eu/docs/native-sdks.

## Coverage

Both APIs Buggie documents for its users, in full:

| API | Operations |
|---|---|
| Token API, `https://{workspace}.buggie.eu/api/v1` | listIssues, createIssue, getIssue, updateIssue, listProjects |
| Reporter ingest API, `https://buggie.eu/api/ingest` | createReport, getWidgetConfig, uploadReportScreenshot |

Left out deliberately: `POST /api/mail/inbound`, which is Mailgun's inbound-mail
callback rather than an API for Buggie's users.

## Verification

Every operation was driven against a self-hosted Buggie built from the same
commit (`docker-compose.selfhost.yml`, demo data from its own seeder), and each
request and response was validated against this definition with openapi-core.
31 checks pass: every 2xx response, and the 401, 403, 404, 409, 422 and 429
errors. That includes the origin allowlist, the signed screenshot upload, the
cross-workspace 404 and both rate limits. The 402 (monthly report allowance) only
occurs on a hosted plan, so it is taken from the code, not exercised.

What the verification changed: client tokens are refused (403, "API tokens are for
members of staff."), although the API page still describes what a client's token
sees; and an issue with no custom fields returns `custom_fields: []`, not `{}`.

SHA-256 of the definition as committed: `6ac5ed08882b08b06e8863ae4830d5ef5284a656c27c4e77dbc2e29614358c62`
