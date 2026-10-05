<?php
declare(strict_types=1);

// Typed models for the Buggie SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Issue entity data model. */
class Issue
{
    public ?array $assignee = null;
    public ?int $assignee_id = null;
    public ?bool $board_pinned = null;
    public ?string $client_audience = null;
    public ?array $client_share_ids = null;
    public ?string $closed_at = null;
    public ?string $created_at = null;
    public mixed $custom_fields = null;
    public ?array $description = null;
    public ?string $due_on = null;
    public ?int $estimate_minutes = null;
    public ?string $id = null;
    public ?string $key = null;
    public ?array $labels = null;
    public ?int $occurrences = null;
    public ?string $parent = null;
    public ?int $phase_id = null;
    public ?int $priority = null;
    public ?array $project = null;
    public int $project_id;
    public ?array $reporter = null;
    public ?string $start_on = null;
    public ?array $status = null;
    public ?int $status_id = null;
    public ?int $time_spent_minutes = null;
    public ?string $title = null;
    public ?string $type = null;
    public ?string $updated_at = null;
    public ?int $version_id = null;
    public ?string $visibility = null;
}

/** Request payload for Issue#load. */
class IssueLoadMatch
{
    public string $id;
}

/** Request payload for Issue#list. */
class IssueListMatch
{
    public ?int $page = null;
    public ?int $per_page = null;
    public ?string $q = null;
}

/** Request payload for Issue#create. */
class IssueCreateData
{
    public ?array $assignee = null;
    public ?int $assignee_id = null;
    public ?bool $board_pinned = null;
    public ?string $client_audience = null;
    public ?array $client_share_ids = null;
    public ?string $closed_at = null;
    public ?string $created_at = null;
    public mixed $custom_fields = null;
    public ?array $description = null;
    public ?string $due_on = null;
    public ?int $estimate_minutes = null;
    public ?string $id = null;
    public ?string $key = null;
    public ?array $labels = null;
    public ?int $occurrences = null;
    public ?string $parent = null;
    public ?int $phase_id = null;
    public ?int $priority = null;
    public ?array $project = null;
    public int $project_id;
    public ?array $reporter = null;
    public ?string $start_on = null;
    public ?array $status = null;
    public ?int $status_id = null;
    public ?int $time_spent_minutes = null;
    public ?string $title = null;
    public ?string $type = null;
    public ?string $updated_at = null;
    public ?int $version_id = null;
    public ?string $visibility = null;
}

/** Request payload for Issue#update. */
class IssueUpdateData
{
    public string $id;
    public ?array $assignee = null;
    public ?int $assignee_id = null;
    public ?bool $board_pinned = null;
    public ?string $client_audience = null;
    public ?array $client_share_ids = null;
    public ?string $closed_at = null;
    public ?string $created_at = null;
    public mixed $custom_fields = null;
    public ?array $description = null;
    public ?string $due_on = null;
    public ?int $estimate_minutes = null;
    public ?string $key = null;
    public ?array $labels = null;
    public ?int $occurrences = null;
    public ?string $parent = null;
    public ?int $phase_id = null;
    public ?int $priority = null;
    public ?array $project = null;
    public ?int $project_id = null;
    public ?array $reporter = null;
    public ?string $start_on = null;
    public ?array $status = null;
    public ?int $status_id = null;
    public ?int $time_spent_minutes = null;
    public ?string $title = null;
    public ?string $type = null;
    public ?string $updated_at = null;
    public ?int $version_id = null;
    public ?string $visibility = null;
}

/** Project entity data model. */
class Project
{
    public ?string $description = null;
    public ?string $key = null;
    public ?string $name = null;
    public ?string $slug = null;
}

/** Request payload for Project#list. */
class ProjectListMatch
{
    public ?string $description = null;
    public ?string $key = null;
    public ?string $name = null;
    public ?string $slug = null;
}

/** Report entity data model. */
class Report
{
    public ?string $body = null;
    public ?array $console = null;
    public ?array $environment = null;
    public ?array $error = null;
    public ?int $id = null;
    public ?array $network = null;
    public ?string $reference = null;
    public ?array $reporter = null;
    public ?bool $screenshot = null;
    public string $title;
    public ?string $upload_url = null;
}

/** Request payload for Report#create. */
class ReportCreateData
{
    public string $public_key;
    public ?string $body = null;
    public ?array $console = null;
    public ?array $environment = null;
    public ?array $error = null;
    public ?int $id = null;
    public ?array $network = null;
    public ?string $reference = null;
    public ?array $reporter = null;
    public ?bool $screenshot = null;
    public string $title;
    public ?string $upload_url = null;
}

/** Screenshot entity data model. */
class Screenshot
{
    public ?string $id = null;
    public ?bool $ok = null;
}

/** Request payload for Screenshot#create. */
class ScreenshotCreateData
{
    public int $id;
    public int $expire;
    public string $signature;
    public ?bool $ok = null;
}

/** WidgetConfig entity data model. */
class WidgetConfig
{
    public ?array $brand = null;
    public ?bool $capture_screenshot = null;
    public ?string $mode = null;
    public ?bool $require_email = null;
}

/** Request payload for WidgetConfig#load. */
class WidgetConfigLoadMatch
{
    public string $public_key;
}

