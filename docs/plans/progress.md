# Progress: JHN.1 v111 Plugin Spacing Regression

## Milestone Checklist
- [x] Milestone 1: Create planning/progress docs
- [x] Milestone 2: Build reproducible plugin fixture from real API analysis
- [x] Milestone 3: Add failing plugin regression test (replication)
- [x] Milestone 4: Implement plugin-layer fix
- [x] Milestone 5: Full validation and completion record

## Verification Log

### Milestone 1
- Status: Completed
- Verification gate passed:
`test -f docs/plans/jhn1-v111-spacing-plugin-plan.md` and
`test -f docs/plans/progress.md`
- Output:
`plan_exists=ok`
`progress_exists=ok`

### Milestone 2
- Status: Completed
- Fixture created:
`packages/plugin/test/fixtures/jhn1-v111-50-51.fixture.json`
- Verification gate passed:
`pnpm --filter plugin exec vitest run src/adapter/spacing-fixture.test.ts`
- Sanity evidence:
`believebecause`, `youwill`, and `on’the` are present in fixture text output.

### Milestone 3
- Status: Completed
- Regression test created:
`packages/plugin/src/adapter/spacing-regression.test.ts`
- Verification gate passed:
`pnpm --filter plugin exec vitest run src/adapter/spacing-regression.test.ts`
- Failure evidence (expected red state before fix):
`expected '...You believebecause...' to contain 'believe because'`
`Received: ... 'tell you,youwill ... on’the Son of Man.'`

### Milestone 4
- Status: Completed
- Implementation:
`packages/plugin/src/adapter/node-builder.ts` now normalizes boundary spacing for adjacent `wj` segments and guards punctuation/double-space boundaries.
- Additional unit coverage:
`packages/plugin/src/adapter/node-builder.test.ts` includes spacing restore plus punctuation/no-double-space cases.
- Verification gate passed:
`pnpm --filter plugin exec vitest run src/adapter/spacing-regression.test.ts`
`pnpm --filter plugin exec vitest run src/adapter/node-builder.test.ts`

### Milestone 5
- Status: Completed
- Verification gate passed with exit code `0`:
`pnpm --filter plugin test:run`
`pnpm --filter plugin lint`
`pnpm lint`
- Result: plugin tests/lint and workspace lint are all green.

## Command Results
- `test -f docs/plans/jhn1-v111-spacing-plugin-plan.md && echo 'plan_exists=ok'; test -f docs/plans/progress.md && echo 'progress_exists=ok'`
- `pnpm --filter plugin exec vitest run src/adapter/spacing-fixture.test.ts`
- `pnpm --filter plugin exec vitest run src/adapter/spacing-regression.test.ts` (expected fail before fix)
- `pnpm --filter plugin exec vitest run src/adapter/spacing-regression.test.ts` (pass after fix)
- `pnpm --filter plugin exec vitest run src/adapter/node-builder.test.ts`
- `pnpm --filter plugin test:run`
- `pnpm --filter plugin lint` (initial run failed on `no-useless-escape`, then fixed)
- `pnpm --filter plugin test:run` (re-run after lint fix)
- `pnpm --filter plugin lint` (pass)
- `pnpm lint` (pass)

## Findings
- Live `JHN.1` (`111`) verse 50-51 produces adjacent inline span boundaries where missing whitespace causes merged words in plugin text output.
- Regression test reproduces missing spaces in plugin output text node construction, confirming plugin-layer fix target.
- Fix validated: plugin output now preserves target phrases with spaces (`believe because`, `you will`, `on’ the`).

## Troubleshooting Notes
- Initial spacing normalization was too broad and changed existing expected outputs (`AB` -> `A B`), so insertion logic was constrained to `wj` boundary segments to match the real bug and preserve prior behavior.
- Lint caught an unnecessary regex escape in `node-builder.ts`; corrected and re-ran full verification.
