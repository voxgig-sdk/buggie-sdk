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

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const screenshotEntityLiveStrict = true


func TestScreenshotEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Screenshot(nil)
		if ent == nil {
			t.Fatal("expected non-nil ScreenshotEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Screenshot(nil).Create(map[string]any{"id": "x", "expire": 1, "signature": "x"}, nil)
		if sdkerr, ok := err.(*core.BuggieError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := screenshotBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "screenshot." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// Bootstrap entity data from existing test data (no create step in flow).
		screenshotRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath(setup.data, "existing.screenshot")))
		var screenshotRef01Data map[string]any
		if len(screenshotRef01DataRaw) > 0 {
			screenshotRef01Data = core.ToMapAny(screenshotRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = screenshotRef01Data

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
		[]any{"screenshot01", "screenshot02", "screenshot03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
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
