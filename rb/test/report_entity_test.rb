# Report entity test

require "minitest/autorun"
require "json"
require_relative "../Buggie_sdk"
require_relative "runner"

class ReportEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = BuggieSDK.test(nil, nil)
    ent = testsdk.Report(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = BuggieConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = BuggieSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Report(nil).create({ "public_key" => 1, "title" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = report_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "report." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    if setup[:live]
      ["public_key01"].each do |_live_key|
        if setup[:synthetic_only] || setup[:idmap][_live_key].nil?
          Runner.live_miss(LIVE_STRICT, "Live entity test blocked: needs #{_live_key} via BUGGIE_TEST_REPORT_ENTID")
        end
      end
    end
    client = setup[:client]

    # CREATE
    report_ref01_ent = client.Report(nil)
    report_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.report"), "report_ref01"))
    report_ref01_data["public_key"] = setup[:idmap]["public_key01"]

    report_ref01_data_result = report_ref01_ent.create(report_ref01_data, nil)
    report_ref01_data = Helpers.to_map(report_ref01_data_result.respond_to?(:data_get) ? report_ref01_data_result.data_get : report_ref01_data_result)
    assert !report_ref01_data.nil?
    assert !report_ref01_data["id"].nil?

  end
end

def report_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "report", "ReportTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = BuggieSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["report01", "report02", "report03", "public_key01"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["BUGGIE_TEST_REPORT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "BUGGIE_TEST_REPORT_ENTID" => idmap,
    "BUGGIE_TEST_LIVE" => "FALSE",
    "BUGGIE_TEST_EXPLAIN" => "FALSE",
    "BUGGIE_APIKEY" => "",
    "BUGGIE_SERVER_WORKSPACE" => "your-workspace",
  })

  idmap_resolved = Helpers.to_map(
    env["BUGGIE_TEST_REPORT_ENTID"])
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
