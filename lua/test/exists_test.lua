-- Buggie SDK exists test

local sdk = require("buggie_sdk")

describe("BuggieSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
