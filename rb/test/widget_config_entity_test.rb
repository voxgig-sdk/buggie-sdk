# WidgetConfig entity test

require "minitest/autorun"
require "json"
require_relative "../Buggie_sdk"
require_relative "runner"

class WidgetConfigEntityTest < Minitest::Test
  def test_create_instance
    testsdk = BuggieSDK.test(nil, nil)
    ent = testsdk.WidgetConfig(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = widget_config_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "widget_config." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set BUGGIE_TEST_WIDGET_CONFIG_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    widget_config_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.widget_config")))
    widget_config_ref01_data = nil
    if widget_config_ref01_data_raw.length > 0
      widget_config_ref01_data = Helpers.to_map(widget_config_ref01_data_raw[0][1])
    end

    # LOAD
    widget_config_ref01_ent = client.WidgetConfig(nil)
    widget_config_ref01_match_dt0 = {}
    widget_config_ref01_data_dt0_loaded = widget_config_ref01_ent.load(widget_config_ref01_match_dt0, nil)
    assert !widget_config_ref01_data_dt0_loaded.nil?

  end
end

def widget_config_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "widget_config", "WidgetConfigTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = BuggieSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["widget_config01", "widget_config02", "widget_config03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["BUGGIE_TEST_WIDGET_CONFIG_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "BUGGIE_TEST_WIDGET_CONFIG_ENTID" => idmap,
    "BUGGIE_TEST_LIVE" => "FALSE",
    "BUGGIE_TEST_EXPLAIN" => "FALSE",
    "BUGGIE_APIKEY" => "",
    "BUGGIE_SERVER_WORKSPACE" => "your-workspace",
  })

  idmap_resolved = Helpers.to_map(
    env["BUGGIE_TEST_WIDGET_CONFIG_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["BUGGIE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["BUGGIE_APIKEY"],
        "server" => {
          "workspace" => env["BUGGIE_SERVER_WORKSPACE"],
        },
      },
      extra || {},
    ])
    client = BuggieSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["BUGGIE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["BUGGIE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
