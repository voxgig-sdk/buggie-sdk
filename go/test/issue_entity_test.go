package sdktest

import (
	"encoding/json"
	"fmt"
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

func TestIssueEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Issue(nil)
		if ent == nil {
			t.Fatal("expected non-nil IssueEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"issue": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for item := range base.Issue(nil).Stream("list", nil, nil) {
			seen = append(seen, item)
		}
		if len(seen) != 3 {
			t.Fatalf("expected 3 streamed items, got %d", len(seen))
		}

		// Inbound: streaming active -> yields each item from the feature iterator.
		hasStreaming := false
		if fm, ok := core.SharedConfig()["feature"].(map[string]any); ok {
			_, hasStreaming = fm["streaming"]
		}
		if hasStreaming {
			streamSdk := sdk.TestSDK(seed, map[string]any{
				"feature": map[string]any{"streaming": map[string]any{"active": true}},
			})
			var got []any
			for item := range streamSdk.Issue(nil).Stream("list", nil, nil) {
				if sub, ok := item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := issueBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "issue." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set BUGGIE_TEST_ISSUE_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		issueRef01Ent := client.Issue(nil)
		issueRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "issue"}), "issue_ref01"))

		issueRef01DataResult, err := issueRef01Ent.Create(issueRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		issueRef01Data = core.ToMapAny(entityData(issueRef01DataResult))
		if issueRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if issueRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		issueRef01Match := map[string]any{}

		issueRef01ListResult, err := issueRef01Ent.List(issueRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		issueRef01List, issueRef01ListOk := issueRef01ListResult.([]any)
		if !issueRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", issueRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(issueRef01List), map[string]any{"id": issueRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		issueRef01DataUp0Up := map[string]any{
			"id": issueRef01Data["id"],
		}

		issueRef01MarkdefUp0Name := "client_audience"
		issueRef01MarkdefUp0Value := fmt.Sprintf("Mark01-issue_ref01_%d", setup.now)
		issueRef01DataUp0Up[issueRef01MarkdefUp0Name] = issueRef01MarkdefUp0Value

		issueRef01ResdataUp0Result, err := issueRef01Ent.Update(issueRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		issueRef01ResdataUp0 := core.ToMapAny(entityData(issueRef01ResdataUp0Result))
		if issueRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if issueRef01ResdataUp0["id"] != issueRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if issueRef01ResdataUp0[issueRef01MarkdefUp0Name] != issueRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", issueRef01MarkdefUp0Name, issueRef01ResdataUp0[issueRef01MarkdefUp0Name])
		}

		// LOAD
		issueRef01MatchDt0 := map[string]any{
			"id": issueRef01Data["id"],
		}
		issueRef01DataDt0Loaded, err := issueRef01Ent.Load(issueRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		issueRef01DataDt0LoadResult := core.ToMapAny(entityData(issueRef01DataDt0Loaded))
		if issueRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if issueRef01DataDt0LoadResult["id"] != issueRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

	})
}

func issueBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "issue", "IssueTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read issue test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse issue test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"issue01", "issue02", "issue03"},
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
	entidEnvRaw := os.Getenv("BUGGIE_TEST_ISSUE_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"BUGGIE_TEST_ISSUE_ENTID": idmap,
		"BUGGIE_TEST_LIVE":      "FALSE",
		"BUGGIE_TEST_EXPLAIN":   "FALSE",
		"BUGGIE_APIKEY":         "",
		"BUGGIE_SERVER_WORKSPACE": "your-workspace",
	})

	idmapResolved := core.ToMapAny(env["BUGGIE_TEST_ISSUE_ENTID"])
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
