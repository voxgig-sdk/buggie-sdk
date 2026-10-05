package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewDebugFeatureFunc func() Feature

var NewIdempotencyFeatureFunc func() Feature

var NewMetricsFeatureFunc func() Feature

var NewPagingFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewIssueEntityFunc func(client *BuggieSDK, entopts map[string]any) BuggieEntity

var NewProjectEntityFunc func(client *BuggieSDK, entopts map[string]any) BuggieEntity

var NewReportEntityFunc func(client *BuggieSDK, entopts map[string]any) BuggieEntity

var NewScreenshotEntityFunc func(client *BuggieSDK, entopts map[string]any) BuggieEntity

var NewWidgetConfigEntityFunc func(client *BuggieSDK, entopts map[string]any) BuggieEntity

