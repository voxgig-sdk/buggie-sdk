# Typed models for the Buggie SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class IssueRequired(TypedDict):
    project_id: int


class Issue(IssueRequired, total=False):
    assignee: dict
    assignee_id: int
    board_pinned: bool
    client_audience: str
    client_share_ids: list
    closed_at: str
    created_at: str
    custom_fields: Any
    description: dict
    due_on: str
    estimate_minutes: int
    id: str
    key: str
    labels: list
    occurrences: int
    parent: str
    phase_id: int
    priority: int
    project: dict
    reporter: dict
    start_on: str
    status: dict
    status_id: int
    time_spent_minutes: int
    title: str
    type: str
    updated_at: str
    version_id: int
    visibility: str


class IssueLoadMatch(TypedDict):
    id: str


class IssueListMatch(TypedDict, total=False):
    page: int
    per_page: int
    q: str


class IssueCreateDataRequired(TypedDict):
    project_id: int


class IssueCreateData(IssueCreateDataRequired, total=False):
    assignee: dict
    assignee_id: int
    board_pinned: bool
    client_audience: str
    client_share_ids: list
    closed_at: str
    created_at: str
    custom_fields: Any
    description: dict
    due_on: str
    estimate_minutes: int
    id: str
    key: str
    labels: list
    occurrences: int
    parent: str
    phase_id: int
    priority: int
    project: dict
    reporter: dict
    start_on: str
    status: dict
    status_id: int
    time_spent_minutes: int
    title: str
    type: str
    updated_at: str
    version_id: int
    visibility: str


class IssueUpdateDataRequired(TypedDict):
    id: str


class IssueUpdateData(IssueUpdateDataRequired, total=False):
    assignee: dict
    assignee_id: int
    board_pinned: bool
    client_audience: str
    client_share_ids: list
    closed_at: str
    created_at: str
    custom_fields: Any
    description: dict
    due_on: str
    estimate_minutes: int
    key: str
    labels: list
    occurrences: int
    parent: str
    phase_id: int
    priority: int
    project: dict
    project_id: int
    reporter: dict
    start_on: str
    status: dict
    status_id: int
    time_spent_minutes: int
    title: str
    type: str
    updated_at: str
    version_id: int
    visibility: str


class Project(TypedDict, total=False):
    description: str
    key: str
    name: str
    slug: str


class ProjectListMatch(TypedDict, total=False):
    description: str
    key: str
    name: str
    slug: str


class ReportRequired(TypedDict):
    title: str


class Report(ReportRequired, total=False):
    body: str
    console: list
    environment: dict
    error: dict
    id: int
    network: list
    reference: str
    reporter: dict
    screenshot: bool
    upload_url: str


class ReportCreateDataRequired(TypedDict):
    public_key: str
    title: str


class ReportCreateData(ReportCreateDataRequired, total=False):
    body: str
    console: list
    environment: dict
    error: dict
    id: int
    network: list
    reference: str
    reporter: dict
    screenshot: bool
    upload_url: str


class Screenshot(TypedDict, total=False):
    id: str
    ok: bool


class ScreenshotCreateDataRequired(TypedDict):
    id: int
    expire: int
    signature: str


class ScreenshotCreateData(ScreenshotCreateDataRequired, total=False):
    ok: bool


class WidgetConfig(TypedDict, total=False):
    brand: dict
    capture_screenshot: bool
    mode: str
    require_email: bool


class WidgetConfigLoadMatch(TypedDict):
    public_key: str
