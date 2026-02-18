# Plugin AI Test Readiness Roadmap

Objective: establish a runnable, measurable test loop inside `/Users/richardhuynh/.codex/worktrees/23b8/bible-plugin/packages/plugin` for AI-task verification.

## Subagents Used

- `SA-DOCS` (`019c7281-d57c-7613-a9e4-7ba58e33785f`): docs planning/progress artifacts
- `SA-INFRA` (`019c7281-f003-7a01-9fad-7c0351bc36ae`): Vitest infrastructure in plugin package
- `SA-CORE` (`019c7282-058d-7721-bc08-ba3136be1f7a`): core unit tests
- `SA-BEHAVIOR` (`019c7282-1c8d-71a0-adc7-8d472c9ba20c`): behavior/integration tests
- `MAIN` (this agent): command execution, verification, and progress updates

## Milestones and Tasks

### M1 - Planning Artifacts

| Task ID | Task | Owner | Verification Command | Success Metric |
| --- | --- | --- | --- | --- |
| M1-T1 | Create roadmap document with milestones, tasks, and metrics | SA-DOCS | `test -f docs/plans/ai-test-readiness-roadmap.md` | File exists and includes M1-M4 sections |
| M1-T2 | Create progress tracker with status and execution log | SA-DOCS | `test -f docs/plans/progress.md` | File exists and includes task table + execution log |

### M2 - Plugin Test Infrastructure

| Task ID | Task | Owner | Verification Command | Success Metric |
| --- | --- | --- | --- | --- |
| M2-T1 | Add plugin test scripts + deps (`test`, `test:watch`, `test:run`, `test:ci`) | SA-INFRA | `node -e "const fs=require('fs'); const j=JSON.parse(fs.readFileSync('packages/plugin/package.json','utf8')); const s=j.scripts||{}; const ok=s.test==='vitest'&&s['test:watch']==='vitest --watch'&&s['test:run']==='vitest run'&&s['test:ci']==='vitest run --coverage'&&!!j.devDependencies?.vitest&&!!j.devDependencies['@vitest/coverage-v8']; if(!ok) process.exit(1)"` | Required scripts and both test deps are present |
| M2-T2 | Add `vitest.config.ts` merged with `vite.config.ts`, plus node env, setup file, and coverage config | SA-INFRA | `rg -n "mergeConfig|viteConfig|environment: 'node'|setupFiles: \\['\\./test/setup/figma.mock.ts'\\]|coverage" packages/plugin/vitest.config.ts` | Vitest config merges Vite config and includes required test settings |
| M2-T3 | Add `tsconfig.vitest.json` for vitest globals and test includes | SA-INFRA | `rg -n "vitest/globals|@figma/plugin-typings|test/\\*\\*/\\*\\.ts" packages/plugin/tsconfig.vitest.json` | Required types and test includes are present |
| M2-T4 | Add Figma mock harness (`test/setup/figma.mock.ts`) | SA-INFRA | `test -f packages/plugin/test/setup/figma.mock.ts` | Mock file exists with reset helper and required Figma API stubs |

### M3 - Core Plugin Tests

| Task ID | Task | Owner | Verification Command | Success Metric |
| --- | --- | --- | --- | --- |
| M3-T1 | Add `css-helpers` unit tests | SA-CORE | `test -f packages/plugin/src/utils/css-helpers.test.ts` | Test file exists and covers conversion + superscript helpers |
| M3-T2 | Add `usfm-styles` helper tests | SA-CORE | `test -f packages/plugin/src/styles/usfm-styles.test.ts` | Test file exists and covers lookup/block/context helpers |
| M3-T3 | Add `layout-engine` tests | SA-CORE | `test -f packages/plugin/src/adapter/layout-engine.test.ts` | Test file exists and covers merge/context/recursive behavior |

### M4 - Behavior + Gate Execution

| Task ID | Task | Owner | Verification Command | Success Metric |
| --- | --- | --- | --- | --- |
| M4-T1 | Add `node-builder` behavior tests | SA-BEHAVIOR | `test -f packages/plugin/src/adapter/node-builder.test.ts` | Test file exists and covers frame/text assembly and style ranges |
| M4-T2 | Add adapter integration test (`DOMToFigmaAdapter.convert`) | SA-BEHAVIOR | `test -f packages/plugin/src/adapter/adapter.integration.test.ts` | Test file exists and asserts full pipeline effects |
| M4-T3 | Add plugin handler tests (`code.ts`) | SA-BEHAVIOR | `test -f packages/plugin/src/code.test.ts` | Test file exists and covers select/success/error/close message flows |
| M4-T4 | Install dependencies so tests can execute | MAIN | `pnpm install` | Exit code `0` |
| M4-T5 | Execute plugin test loop | MAIN | `pnpm --filter plugin test:run` | Exit code `0` with all tests passing |
| M4-T6 | Execute plugin CI loop with coverage | MAIN | `pnpm --filter plugin test:ci` | Exit code `0` with coverage report generated |

## Definition of Done

- All tasks M1-T1 through M4-T6 are marked `DONE` in `/Users/richardhuynh/.codex/worktrees/23b8/bible-plugin/docs/plans/progress.md`.
- `pnpm --filter plugin test:run` is green.
- `pnpm --filter plugin test:ci` is green.
- Progress log contains command outputs for each verification step.
