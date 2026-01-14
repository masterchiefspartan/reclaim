# Overnight Implementation Run

#

# Use this for a controlled "hands-off" implementation.

# Attach this file and your PRD, then ask Cursor to proceed.

## Stage 1: Planning (no code)

1. Read the PRD end-to-end.
2. List all files to be created or modified.
3. Identify dependencies and potential breaking changes.
4. List open questions or ambiguities.
5. Output a short plan and STOP.

## Stage 2: Implementation (after plan approval)

Implement in order:

1. Types (`src/types/`)
2. Services (`src/services/`)
3. Hooks (`src/hooks/`)
4. Components (`src/components/`)
5. Screens (`src/screens/`)

## Stage 3: Verification

1. Follow `@.cursorrules`.
2. Run `@.cursor/commands/codereview.md`.
3. Run `@.cursor/commands/quality-gate.md`.

## Stage 4: Report

Provide:

- Files created or modified
- Assumptions made
- Testing suggestions
- Known limitations or TODOs
