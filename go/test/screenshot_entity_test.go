package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/buggie-sdk/go"
	"github.com/voxgig-sdk/buggie-sdk/go/core"

	vs "github.com/voxgig-sdk/buggie-sdk/go/utility/struct"
)

func TestScreenshotEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Screenshot(nil)
		if ent == nil {
			t.Fatal("expected non-nil ScreenshotEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := screenshotBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "screenshot." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set BUGGIE_TEST_SCREENSHOT_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		screenshotRef01Ent := client.Screenshot(nil)
		screenshotRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "screenshot"}), "screenshot_ref01"))
		screenshotRef01Data["report"] = setup.idmap["report01"]

		screenshotRef01DataResult, err := screenshotRef01Ent.Create(screenshotRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		screenshotRef01Data = core.ToMapAny(entityData(screenshotRef01DataResult))
		if screenshotRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if screenshotRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

	})
}

func screenshotBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "screenshot", "ScreenshotTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read screenshot test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse screenshot test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"screenshot01", "screenshot02", "screenshot03", "report01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("BUGGIE_TEST_SCREENSHOT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"BUGGIE_TEST_SCREENSHOT_ENTID": idmap,
		"BUGGIE_TEST_LIVE":      "FALSE",
		"BUGGIE_TEST_EXPLAIN":   "FALSE",
		"BUGGIE_APIKEY":         "",
		"BUGGIE_SERVER_WORKSPACE": "your-workspace",
	})

	idmapResolved := core.ToMapAny(env["BUGGIE_TEST_SCREENSHOT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["BUGGIE_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["BUGGIE_APIKEY"],
				"server": map[string]any{
					"workspace": env["BUGGIE_SERVER_WORKSPACE"],
				},
			},
			extraOpts,
		})
		client = sdk.NewBuggieSDK(core.ToMapAny(mergedOpts))
	}

	live := env["BUGGIE_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["BUGGIE_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
