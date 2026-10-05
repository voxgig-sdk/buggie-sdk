# frozen_string_literal: true

# Typed models for the Buggie SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Issue entity data model.
#
# @!attribute [rw] assignee
#   @return [Hash, nil]
#
# @!attribute [rw] assignee_id
#   @return [Integer, nil]
#
# @!attribute [rw] board_pinned
#   @return [Boolean, nil]
#
# @!attribute [rw] client_audience
#   @return [String, nil]
#
# @!attribute [rw] client_share_ids
#   @return [Array, nil]
#
# @!attribute [rw] closed_at
#   @return [String, nil]
#
# @!attribute [rw] created_at
#   @return [String, nil]
#
# @!attribute [rw] custom_fields
#   @return [Object, nil]
#
# @!attribute [rw] description
#   @return [Hash, nil]
#
# @!attribute [rw] due_on
#   @return [String, nil]
#
# @!attribute [rw] estimate_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] key
#   @return [String, nil]
#
# @!attribute [rw] labels
#   @return [Array, nil]
#
# @!attribute [rw] occurrences
#   @return [Integer, nil]
#
# @!attribute [rw] parent
#   @return [String, nil]
#
# @!attribute [rw] phase_id
#   @return [Integer, nil]
#
# @!attribute [rw] priority
#   @return [Integer, nil]
#
# @!attribute [rw] project
#   @return [Hash, nil]
#
# @!attribute [rw] project_id
#   @return [Integer]
#
# @!attribute [rw] reporter
#   @return [Hash, nil]
#
# @!attribute [rw] start_on
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [Hash, nil]
#
# @!attribute [rw] status_id
#   @return [Integer, nil]
#
# @!attribute [rw] time_spent_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] type
#   @return [String, nil]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
#
# @!attribute [rw] version_id
#   @return [Integer, nil]
#
# @!attribute [rw] visibility
#   @return [String, nil]
Issue = Struct.new(
  :assignee,
  :assignee_id,
  :board_pinned,
  :client_audience,
  :client_share_ids,
  :closed_at,
  :created_at,
  :custom_fields,
  :description,
  :due_on,
  :estimate_minutes,
  :id,
  :key,
  :labels,
  :occurrences,
  :parent,
  :phase_id,
  :priority,
  :project,
  :project_id,
  :reporter,
  :start_on,
  :status,
  :status_id,
  :time_spent_minutes,
  :title,
  :type,
  :updated_at,
  :version_id,
  :visibility,
  keyword_init: true
)

# Request payload for Issue#load.
#
# @!attribute [rw] id
#   @return [String]
IssueLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Issue#list.
#
# @!attribute [rw] page
#   @return [Integer, nil]
#
# @!attribute [rw] per_page
#   @return [Integer, nil]
#
# @!attribute [rw] q
#   @return [String, nil]
IssueListMatch = Struct.new(
  :page,
  :per_page,
  :q,
  keyword_init: true
)

# Request payload for Issue#create.
#
# @!attribute [rw] assignee
#   @return [Hash, nil]
#
# @!attribute [rw] assignee_id
#   @return [Integer, nil]
#
# @!attribute [rw] board_pinned
#   @return [Boolean, nil]
#
# @!attribute [rw] client_audience
#   @return [String, nil]
#
# @!attribute [rw] client_share_ids
#   @return [Array, nil]
#
# @!attribute [rw] closed_at
#   @return [String, nil]
#
# @!attribute [rw] created_at
#   @return [String, nil]
#
# @!attribute [rw] custom_fields
#   @return [Object, nil]
#
# @!attribute [rw] description
#   @return [Hash, nil]
#
# @!attribute [rw] due_on
#   @return [String, nil]
#
# @!attribute [rw] estimate_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] key
#   @return [String, nil]
#
# @!attribute [rw] labels
#   @return [Array, nil]
#
# @!attribute [rw] occurrences
#   @return [Integer, nil]
#
# @!attribute [rw] parent
#   @return [String, nil]
#
# @!attribute [rw] phase_id
#   @return [Integer, nil]
#
# @!attribute [rw] priority
#   @return [Integer, nil]
#
# @!attribute [rw] project
#   @return [Hash, nil]
#
# @!attribute [rw] project_id
#   @return [Integer]
#
# @!attribute [rw] reporter
#   @return [Hash, nil]
#
# @!attribute [rw] start_on
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [Hash, nil]
#
# @!attribute [rw] status_id
#   @return [Integer, nil]
#
# @!attribute [rw] time_spent_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] type
#   @return [String, nil]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
#
# @!attribute [rw] version_id
#   @return [Integer, nil]
#
# @!attribute [rw] visibility
#   @return [String, nil]
IssueCreateData = Struct.new(
  :assignee,
  :assignee_id,
  :board_pinned,
  :client_audience,
  :client_share_ids,
  :closed_at,
  :created_at,
  :custom_fields,
  :description,
  :due_on,
  :estimate_minutes,
  :id,
  :key,
  :labels,
  :occurrences,
  :parent,
  :phase_id,
  :priority,
  :project,
  :project_id,
  :reporter,
  :start_on,
  :status,
  :status_id,
  :time_spent_minutes,
  :title,
  :type,
  :updated_at,
  :version_id,
  :visibility,
  keyword_init: true
)

# Request payload for Issue#update.
#
# @!attribute [rw] id
#   @return [String]
#
# @!attribute [rw] assignee
#   @return [Hash, nil]
#
# @!attribute [rw] assignee_id
#   @return [Integer, nil]
#
# @!attribute [rw] board_pinned
#   @return [Boolean, nil]
#
# @!attribute [rw] client_audience
#   @return [String, nil]
#
# @!attribute [rw] client_share_ids
#   @return [Array, nil]
#
# @!attribute [rw] closed_at
#   @return [String, nil]
#
# @!attribute [rw] created_at
#   @return [String, nil]
#
# @!attribute [rw] custom_fields
#   @return [Object, nil]
#
# @!attribute [rw] description
#   @return [Hash, nil]
#
# @!attribute [rw] due_on
#   @return [String, nil]
#
# @!attribute [rw] estimate_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] key
#   @return [String, nil]
#
# @!attribute [rw] labels
#   @return [Array, nil]
#
# @!attribute [rw] occurrences
#   @return [Integer, nil]
#
# @!attribute [rw] parent
#   @return [String, nil]
#
# @!attribute [rw] phase_id
#   @return [Integer, nil]
#
# @!attribute [rw] priority
#   @return [Integer, nil]
#
# @!attribute [rw] project
#   @return [Hash, nil]
#
# @!attribute [rw] project_id
#   @return [Integer, nil]
#
# @!attribute [rw] reporter
#   @return [Hash, nil]
#
# @!attribute [rw] start_on
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [Hash, nil]
#
# @!attribute [rw] status_id
#   @return [Integer, nil]
#
# @!attribute [rw] time_spent_minutes
#   @return [Integer, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
#
# @!attribute [rw] type
#   @return [String, nil]
#
# @!attribute [rw] updated_at
#   @return [String, nil]
#
# @!attribute [rw] version_id
#   @return [Integer, nil]
#
# @!attribute [rw] visibility
#   @return [String, nil]
IssueUpdateData = Struct.new(
  :id,
  :assignee,
  :assignee_id,
  :board_pinned,
  :client_audience,
  :client_share_ids,
  :closed_at,
  :created_at,
  :custom_fields,
  :description,
  :due_on,
  :estimate_minutes,
  :key,
  :labels,
  :occurrences,
  :parent,
  :phase_id,
  :priority,
  :project,
  :project_id,
  :reporter,
  :start_on,
  :status,
  :status_id,
  :time_spent_minutes,
  :title,
  :type,
  :updated_at,
  :version_id,
  :visibility,
  keyword_init: true
)

# Project entity data model.
#
# @!attribute [rw] description
#   @return [String, nil]
#
# @!attribute [rw] key
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
Project = Struct.new(
  :description,
  :key,
  :name,
  :slug,
  keyword_init: true
)

# Request payload for Project#list.
#
# @!attribute [rw] description
#   @return [String, nil]
#
# @!attribute [rw] key
#   @return [String, nil]
#
# @!attribute [rw] name
#   @return [String, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
ProjectListMatch = Struct.new(
  :description,
  :key,
  :name,
  :slug,
  keyword_init: true
)

# Report entity data model.
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] console
#   @return [Array, nil]
#
# @!attribute [rw] environment
#   @return [Hash, nil]
#
# @!attribute [rw] error
#   @return [Hash, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] network
#   @return [Array, nil]
#
# @!attribute [rw] reference
#   @return [String, nil]
#
# @!attribute [rw] reporter
#   @return [Hash, nil]
#
# @!attribute [rw] screenshot
#   @return [Boolean, nil]
#
# @!attribute [rw] title
#   @return [String]
#
# @!attribute [rw] upload_url
#   @return [String, nil]
Report = Struct.new(
  :body,
  :console,
  :environment,
  :error,
  :id,
  :network,
  :reference,
  :reporter,
  :screenshot,
  :title,
  :upload_url,
  keyword_init: true
)

# Request payload for Report#create.
#
# @!attribute [rw] public_key
#   @return [String]
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] console
#   @return [Array, nil]
#
# @!attribute [rw] environment
#   @return [Hash, nil]
#
# @!attribute [rw] error
#   @return [Hash, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] network
#   @return [Array, nil]
#
# @!attribute [rw] reference
#   @return [String, nil]
#
# @!attribute [rw] reporter
#   @return [Hash, nil]
#
# @!attribute [rw] screenshot
#   @return [Boolean, nil]
#
# @!attribute [rw] title
#   @return [String]
#
# @!attribute [rw] upload_url
#   @return [String, nil]
ReportCreateData = Struct.new(
  :public_key,
  :body,
  :console,
  :environment,
  :error,
  :id,
  :network,
  :reference,
  :reporter,
  :screenshot,
  :title,
  :upload_url,
  keyword_init: true
)

# Screenshot entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] ok
#   @return [Boolean, nil]
Screenshot = Struct.new(
  :id,
  :ok,
  keyword_init: true
)

# Request payload for Screenshot#create.
#
# @!attribute [rw] id
#   @return [Integer]
#
# @!attribute [rw] expire
#   @return [Integer]
#
# @!attribute [rw] signature
#   @return [String]
#
# @!attribute [rw] ok
#   @return [Boolean, nil]
ScreenshotCreateData = Struct.new(
  :id,
  :expire,
  :signature,
  :ok,
  keyword_init: true
)

# WidgetConfig entity data model.
#
# @!attribute [rw] brand
#   @return [Hash, nil]
#
# @!attribute [rw] capture_screenshot
#   @return [Boolean, nil]
#
# @!attribute [rw] mode
#   @return [String, nil]
#
# @!attribute [rw] require_email
#   @return [Boolean, nil]
WidgetConfig = Struct.new(
  :brand,
  :capture_screenshot,
  :mode,
  :require_email,
  keyword_init: true
)

# Request payload for WidgetConfig#load.
#
# @!attribute [rw] public_key
#   @return [String]
WidgetConfigLoadMatch = Struct.new(
  :public_key,
  keyword_init: true
)

