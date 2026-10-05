# Buggie SDK utility: make_context

from projectname_sdk.core.context import BuggieContext


def make_context_util(ctxmap, basectx):
    return BuggieContext(ctxmap, basectx)
