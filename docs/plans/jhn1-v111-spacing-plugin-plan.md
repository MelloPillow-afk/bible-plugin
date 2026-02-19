# Plugin-Layer Spacing Bug Fix Plan (`JHN.1`, version `111`)

## Summary
1. Reproduce the missing-space bug in the plugin package at Figma text-output level using a fixture derived from real `JHN.1`/`111` API content.
2. Add a failing regression test in plugin tests that currently produces merged tokens like `believebecause`, `youwill`, and `on’the`.
3. Fix spacing at plugin text-segment assembly (not web-app parser), then verify targeted and full test/lint gates.
4. Track all work in `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans` with milestone status and evidence.

## Public API / Interface Changes
1. No external/public API changes.
2. Internal behavior change only in `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/packages/plugin/src/adapter/node-builder.ts` for text segment boundary spacing normalization.
3. New plugin test fixture and regression tests under plugin test paths.

## Milestones With Hard Verification Gates

### Milestone 1: Create planning/progress docs first
1. Create `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/`.
2. Create `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/jhn1-v111-spacing-plugin-plan.md` containing the finalized execution spec.
3. Create `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/progress.md` with milestone checklist and verification log sections.

Verification gate:
1. `test -f /Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/jhn1-v111-spacing-plugin-plan.md`
2. `test -f /Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/progress.md`

Success metric:
1. Both files exist and include milestone checkboxes plus a command-results section.

Subagent note:
1. Not required; this is quick and sequential.

### Milestone 2: Build reproducible plugin fixture from real API analysis
1. Add focused fixture for verse 50-51 at `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/packages/plugin/test/fixtures/jhn1-v111-50-51.fixture.json`.
2. Fixture content will represent plugin-layer input DOM tree that leads to merged-word output when converted.
3. Include metadata keys: `source`, `versionId`, `usfm`, `notes`, `domTree`.
4. Do not store API key in file; only keep passage/source metadata.

Verification gate:
1. Fixture loads successfully in tests via import/read.
2. A sanity test confirms fixture corresponds to the problematic phrase boundaries.

Success metric:
1. Fixture is deterministic and offline; no network needed for tests.

Subagent note:
1. Optional explorer-only subagent can validate fixture shape, but main flow remains sequential.

### Milestone 3: Add failing plugin regression test (replication)
1. Add plugin regression test file `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/packages/plugin/src/adapter/spacing-regression.test.ts`.
2. Use existing Figma mocks and run `DOMToFigmaAdapter.convert` on fixture `domTree`.
3. Assert expected correct string with spaces so test fails before fix (red state), proving replication in plugin output layer.

Verification gate:
1. Run targeted test command and confirm failure reason shows merged boundaries from current behavior.
2. Log failing output in `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/progress.md`.

Success metric:
1. Reproducible failing test in plugin package, independent of web-app runtime/API.

Subagent note:
1. No subagent; failure analysis and test authoring are tightly coupled to next fix.

### Milestone 4: Implement plugin-layer fix
1. Update `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/packages/plugin/src/adapter/node-builder.ts`.
2. Add a normalization step over text segments before final join.
3. Insert one space at a segment boundary when prior segment ends in a word/closing quote and next begins with a word/opening quote, unless whitespace already exists.
4. Prevent false positives by skipping insertion before punctuation and when boundary already has whitespace.
5. Keep superscript verse-label behavior intact.

Verification gate:
1. Re-run targeted regression test and confirm pass.
2. Add/extend unit cases in `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/packages/plugin/src/adapter/node-builder.test.ts` for punctuation and no-double-space guards.

Success metric:
1. Regression phrase outputs include `believe because`, `you will`, `on’ the` in generated text.

Subagent note:
1. Not recommended; code+tests should be changed together for fast red-green cycle.

### Milestone 5: Full validation and completion record
1. Run `pnpm --filter plugin test:run`.
2. Run `pnpm --filter plugin lint`.
3. Run `pnpm lint`.
4. Update `/Users/richardhuynh/.codex/worktrees/f24d/bible-plugin/docs/plans/progress.md` with final pass/fail logs and milestone completion marks.
5. Add brief troubleshooting notes for anything encountered.

Verification gate:
1. All commands exit code `0`.
2. No failing plugin tests and no lint errors.

Success metric:
1. Bug fixed with regression coverage and green quality gates.

Subagent note:
1. Not needed; final validation must remain single-owner and serialized.

## Test Cases and Scenarios
1. Regression fixture: plugin output text should preserve spaces across adjacent inline `wj` segments.
2. Guard: no extra spaces before punctuation (for example `, . ! ? ; :` boundaries).
3. Guard: no duplicate spaces when previous segment already ends in whitespace.
4. Guard: verse label superscript formatting still works and does not regress.

## Assumptions and Defaults
1. Scope is plugin package only for replication and fix, per request.
2. Fixture scope is verse `50-51` only (focused and minimal).
3. API is used only to derive fixture once; all automated tests run offline afterward.
4. Milestones are strictly sequential; next milestone starts only after current verification gate passes.
