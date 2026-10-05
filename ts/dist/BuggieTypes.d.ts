export interface Issue {
    assignee?: Record<string, any>;
    assignee_id?: number;
    board_pinned?: boolean;
    client_audience?: string;
    client_share_ids?: any[];
    closed_at?: string;
    created_at?: string;
    custom_fields?: any;
    description?: Record<string, any>;
    due_on?: string;
    estimate_minutes?: number;
    id?: string;
    key?: string;
    labels?: any[];
    occurrences?: number;
    parent?: string;
    phase_id?: number;
    priority?: number;
    project?: Record<string, any>;
    project_id: number;
    reporter?: Record<string, any>;
    start_on?: string;
    status?: Record<string, any>;
    status_id?: number;
    time_spent_minutes?: number;
    title?: string;
    type?: string;
    updated_at?: string;
    version_id?: number;
    visibility?: string;
}
export interface IssueLoadMatch {
    id: string;
}
export interface IssueListMatch {
    page?: number;
    per_page?: number;
    q?: string;
}
export interface IssueCreateData {
    assignee?: Record<string, any>;
    assignee_id?: number;
    board_pinned?: boolean;
    client_audience?: string;
    client_share_ids?: any[];
    closed_at?: string;
    created_at?: string;
    custom_fields?: any;
    description?: Record<string, any>;
    due_on?: string;
    estimate_minutes?: number;
    id?: string;
    key?: string;
    labels?: any[];
    occurrences?: number;
    parent?: string;
    phase_id?: number;
    priority?: number;
    project?: Record<string, any>;
    project_id: number;
    reporter?: Record<string, any>;
    start_on?: string;
    status?: Record<string, any>;
    status_id?: number;
    time_spent_minutes?: number;
    title?: string;
    type?: string;
    updated_at?: string;
    version_id?: number;
    visibility?: string;
}
export interface IssueUpdateData {
    id: string;
    assignee?: Record<string, any>;
    assignee_id?: number;
    board_pinned?: boolean;
    client_audience?: string;
    client_share_ids?: any[];
    closed_at?: string;
    created_at?: string;
    custom_fields?: any;
    description?: Record<string, any>;
    due_on?: string;
    estimate_minutes?: number;
    key?: string;
    labels?: any[];
    occurrences?: number;
    parent?: string;
    phase_id?: number;
    priority?: number;
    project?: Record<string, any>;
    project_id?: number;
    reporter?: Record<string, any>;
    start_on?: string;
    status?: Record<string, any>;
    status_id?: number;
    time_spent_minutes?: number;
    title?: string;
    type?: string;
    updated_at?: string;
    version_id?: number;
    visibility?: string;
}
export interface Project {
    description?: string;
    key?: string;
    name?: string;
    slug?: string;
}
export interface ProjectListMatch {
    description?: string;
    key?: string;
    name?: string;
    slug?: string;
}
export interface Report {
    body?: string;
    console?: any[];
    environment?: Record<string, any>;
    error?: Record<string, any>;
    id?: number;
    network?: any[];
    reference?: string;
    reporter?: Record<string, any>;
    screenshot?: boolean;
    title: string;
    upload_url?: string;
}
export interface ReportCreateData {
    public_key: string;
    body?: string;
    console?: any[];
    environment?: Record<string, any>;
    error?: Record<string, any>;
    id?: number;
    network?: any[];
    reference?: string;
    reporter?: Record<string, any>;
    screenshot?: boolean;
    title: string;
    upload_url?: string;
}
export interface Screenshot {
    id?: string;
    ok?: boolean;
}
export interface ScreenshotCreateData {
    id: number;
    expire: number;
    signature: string;
    ok?: boolean;
}
export interface WidgetConfig {
    brand?: Record<string, any>;
    capture_screenshot?: boolean;
    mode?: string;
    require_email?: boolean;
}
export interface WidgetConfigLoadMatch {
    public_key: string;
}
