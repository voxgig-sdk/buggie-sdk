# Buggie SDK exists test

import pytest
from buggie_sdk import BuggieSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = BuggieSDK.test(None, None)
        assert testsdk is not None
