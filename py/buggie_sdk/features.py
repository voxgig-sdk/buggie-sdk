# Buggie SDK feature factory

from buggie_sdk.feature.base_feature import BuggieBaseFeature
from buggie_sdk.feature.debug_feature import BuggieDebugFeature
from buggie_sdk.feature.idempotency_feature import BuggieIdempotencyFeature
from buggie_sdk.feature.metrics_feature import BuggieMetricsFeature
from buggie_sdk.feature.paging_feature import BuggiePagingFeature
from buggie_sdk.feature.ratelimit_feature import BuggieRatelimitFeature
from buggie_sdk.feature.retry_feature import BuggieRetryFeature
from buggie_sdk.feature.test_feature import BuggieTestFeature
from buggie_sdk.feature.timeout_feature import BuggieTimeoutFeature


_FEATURES = {
    "base": lambda: BuggieBaseFeature(),
    "debug": lambda: BuggieDebugFeature(),
    "idempotency": lambda: BuggieIdempotencyFeature(),
    "metrics": lambda: BuggieMetricsFeature(),
    "paging": lambda: BuggiePagingFeature(),
    "ratelimit": lambda: BuggieRatelimitFeature(),
    "retry": lambda: BuggieRetryFeature(),
    "test": lambda: BuggieTestFeature(),
    "timeout": lambda: BuggieTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
