-- Screenshot entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("buggie_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

describe("ScreenshotEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Screenshot(nil)
    assert.is_not_nil(ent)
  end)

  it("should run basic flow", function()
    local setup = screenshot_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"create"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "screenshot." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    -- The basic flow consumes synthetic IDs from the fixture. In live mode
    -- without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup.synthetic_only then
      pending("live entity test uses synthetic IDs from fixture — set BUGGIE_TEST_SCREENSHOT_ENTID JSON to run live")
      return
    end
    local client = setup.client

    -- CREATE
    local screenshot_ref01_ent = client:Screenshot(nil)
    local screenshot_ref01_data = helpers.to_map(vs.getprop(
      vs.getpath(setup.data, "new.screenshot"), "screenshot_ref01"))
    screenshot_ref01_data["report"] = setup.idmap["report01"]

    local screenshot_ref01_data_result, err = screenshot_ref01_ent:create(screenshot_ref01_data, nil)
    assert.is_nil(err)
    screenshot_ref01_data = helpers.to_map(type(screenshot_ref01_data_result) == 'table' and screenshot_ref01_data_result.data_get and screenshot_ref01_data_result:data_get() or screenshot_ref01_data_result)
    assert.is_not_nil(screenshot_ref01_data)
    assert.is_not_nil(screenshot_ref01_data["id"])

  end)
end)

function screenshot_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/screenshot/ScreenshotTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read screenshot test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "screenshot01", "screenshot02", "screenshot03", "report01" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Detect ENTID env override before envOverride consumes it. When live
  -- mode is on without a real override, the basic test runs against synthetic
  -- IDs from the fixture and 4xx's. Surface this so the test can skip.
  local entid_env_raw = os.getenv("BUGGIE_TEST_SCREENSHOT_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["BUGGIE_TEST_SCREENSHOT_ENTID"] = idmap,
    ["BUGGIE_TEST_LIVE"] = "FALSE",
    ["BUGGIE_TEST_EXPLAIN"] = "FALSE",
    ["BUGGIE_APIKEY"] = "",
    ["BUGGIE_SERVER_WORKSPACE"] = "your-workspace",
  })

  local idmap_resolved = helpers.to_map(
    env["BUGGIE_TEST_SCREENSHOT_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["BUGGIE_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
        apikey = env["BUGGIE_APIKEY"],
        server = {
          ["workspace"] = env["BUGGIE_SERVER_WORKSPACE"],
        },
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["BUGGIE_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["BUGGIE_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
