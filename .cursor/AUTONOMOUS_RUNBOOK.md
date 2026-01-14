# Autonomous Nightly Runbook

#

# Mode: Nightly one-feature PRDs

# Source of truth: APP_PLAN.md

## Nightly Setup (Before Sleep)

1. Pick the next item from `.cursor/NIGHTLY_PRD_QUEUE.md`.
2. Create a PRD using `.cursor/templates/prd-template.md`.
3. Save the PRD in a predictable location (example: `.cursor/prds/PRD_YYYY-MM-DD_feature.md`).
4. Open Cursor and attach:
   - `@.cursor/commands/overnight-run.md`
   - `@.cursor/commands/implement-feature.md`
   - `@.cursor/commands/quality-gate.md`
   - Your PRD file
   - `@.cursorrules`

## Nightly Prompt (Copy/Paste)

Use this prompt after attaching the files:

```
Implement the attached PRD using the overnight workflow.
Do not change anything outside the scope of the PRD.
Follow .cursorrules and quality-gate checks.
```

## Morning Review (Required)

1. Read the summary from the run (files changed, assumptions, tests).
2. Scan the diff for:
   - Unauthorized scope changes
   - Error handling and security coverage
   - UI states (loading/empty/error)
3. Run project checks as needed:
   - TypeScript check
   - App smoke test
4. If anything looks risky, revert or create a follow-up PRD.

## Safety Rules

- One PRD = one feature.
- Never batch unrelated changes.
- Keep PRDs small enough for a single-night run.
- Use `quality-gate.md` before marking done.
- Use `rollback-plan.md` for anything risky.

## Optional: PRD Folder Convention

Create a folder for PRDs:

```
.cursor/prds/
```

Example naming:

```
.cursor/prds/PRD_2026-01-14_processing-screen.md
```
