// Typed models for the Buggie SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/buggie-sdk/go/core"
)

// Issue is the typed data model for the issue entity.
type Issue struct {
}

// IssueLoadMatch is the typed request payload for Issue.LoadTyped.
type IssueLoadMatch struct {
	Id string `json:"id"`
}

// IssueListMatch is the typed request payload for Issue.ListTyped.
type IssueListMatch struct {
	Page *int `json:"page,omitempty"`
	PerPage *int `json:"per_page,omitempty"`
	Q *string `json:"q,omitempty"`
}

// IssueCreateData is the typed request payload for Issue.CreateTyped.
type IssueCreateData struct {
	Assignee *map[string]any `json:"assignee,omitempty"`
	AssigneeId *int `json:"assignee_id,omitempty"`
	BoardPinned *bool `json:"board_pinned,omitempty"`
	ClientAudience *string `json:"client_audience,omitempty"`
	ClientShareIds *[]any `json:"client_share_ids,omitempty"`
	ClosedAt *string `json:"closed_at,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CustomFields *any `json:"custom_fields,omitempty"`
	Description *map[string]any `json:"description,omitempty"`
	DueOn *string `json:"due_on,omitempty"`
	EstimateMinutes *int `json:"estimate_minutes,omitempty"`
	Id *string `json:"id,omitempty"`
	Key *string `json:"key,omitempty"`
	Labels *[]any `json:"labels,omitempty"`
	Occurrences *int `json:"occurrences,omitempty"`
	Parent *string `json:"parent,omitempty"`
	PhaseId *int `json:"phase_id,omitempty"`
	Priority *int `json:"priority,omitempty"`
	Project *map[string]any `json:"project,omitempty"`
	ProjectId int `json:"project_id"`
	Reporter *map[string]any `json:"reporter,omitempty"`
	StartOn *string `json:"start_on,omitempty"`
	Status *map[string]any `json:"status,omitempty"`
	StatusId *int `json:"status_id,omitempty"`
	TimeSpentMinutes *int `json:"time_spent_minutes,omitempty"`
	Title *string `json:"title,omitempty"`
	Type *string `json:"type,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	VersionId *int `json:"version_id,omitempty"`
	Visibility *string `json:"visibility,omitempty"`
}

// IssueUpdateData is the typed request payload for Issue.UpdateTyped.
type IssueUpdateData struct {
	Id string `json:"id"`
	Assignee *map[string]any `json:"assignee,omitempty"`
	AssigneeId *int `json:"assignee_id,omitempty"`
	BoardPinned *bool `json:"board_pinned,omitempty"`
	ClientAudience *string `json:"client_audience,omitempty"`
	ClientShareIds *[]any `json:"client_share_ids,omitempty"`
	ClosedAt *string `json:"closed_at,omitempty"`
	CreatedAt *string `json:"created_at,omitempty"`
	CustomFields *any `json:"custom_fields,omitempty"`
	Description *map[string]any `json:"description,omitempty"`
	DueOn *string `json:"due_on,omitempty"`
	EstimateMinutes *int `json:"estimate_minutes,omitempty"`
	Key *string `json:"key,omitempty"`
	Labels *[]any `json:"labels,omitempty"`
	Occurrences *int `json:"occurrences,omitempty"`
	Parent *string `json:"parent,omitempty"`
	PhaseId *int `json:"phase_id,omitempty"`
	Priority *int `json:"priority,omitempty"`
	Project *map[string]any `json:"project,omitempty"`
	ProjectId *int `json:"project_id,omitempty"`
	Reporter *map[string]any `json:"reporter,omitempty"`
	StartOn *string `json:"start_on,omitempty"`
	Status *map[string]any `json:"status,omitempty"`
	StatusId *int `json:"status_id,omitempty"`
	TimeSpentMinutes *int `json:"time_spent_minutes,omitempty"`
	Title *string `json:"title,omitempty"`
	Type *string `json:"type,omitempty"`
	UpdatedAt *string `json:"updated_at,omitempty"`
	VersionId *int `json:"version_id,omitempty"`
	Visibility *string `json:"visibility,omitempty"`
}

// Project is the typed data model for the project entity.
type Project struct {
}

// ProjectListMatch is the typed request payload for Project.ListTyped.
type ProjectListMatch struct {
	Description *string `json:"description,omitempty"`
	Key *string `json:"key,omitempty"`
	Name *string `json:"name,omitempty"`
	Slug *string `json:"slug,omitempty"`
}

// Report is the typed data model for the report entity.
type Report struct {
}

// ReportCreateData is the typed request payload for Report.CreateTyped.
type ReportCreateData struct {
	PublicKey string `json:"public_key"`
	Body *string `json:"body,omitempty"`
	Console *[]any `json:"console,omitempty"`
	Environment *map[string]any `json:"environment,omitempty"`
	Error *map[string]any `json:"error,omitempty"`
	Id *int `json:"id,omitempty"`
	Network *[]any `json:"network,omitempty"`
	Reference *string `json:"reference,omitempty"`
	Reporter *map[string]any `json:"reporter,omitempty"`
	Screenshot *bool `json:"screenshot,omitempty"`
	Title string `json:"title"`
	UploadUrl *string `json:"upload_url,omitempty"`
}

// Screenshot is the typed data model for the screenshot entity.
type Screenshot struct {
}

// ScreenshotCreateData is the typed request payload for Screenshot.CreateTyped.
type ScreenshotCreateData struct {
	Id int `json:"id"`
	Expire int `json:"expire"`
	Signature string `json:"signature"`
	Ok *bool `json:"ok,omitempty"`
}

// WidgetConfig is the typed data model for the widget_config entity.
type WidgetConfig struct {
}

// WidgetConfigLoadMatch is the typed request payload for WidgetConfig.LoadTyped.
type WidgetConfigLoadMatch struct {
	PublicKey string `json:"public_key"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
