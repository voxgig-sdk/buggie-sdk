# Buggie SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module BuggieFeatures
  def self.make_feature(name)
    case name
    when "base"
      BuggieBaseFeature.new
    when "debug"
      BuggieDebugFeature.new
    when "idempotency"
      BuggieIdempotencyFeature.new
    when "metrics"
      BuggieMetricsFeature.new
    when "paging"
      BuggiePagingFeature.new
    when "ratelimit"
      BuggieRatelimitFeature.new
    when "retry"
      BuggieRetryFeature.new
    when "test"
      BuggieTestFeature.new
    when "timeout"
      BuggieTimeoutFeature.new
    else
      BuggieBaseFeature.new
    end
  end
end
