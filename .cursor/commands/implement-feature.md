# Implement Feature from PRD

#

# Usage:

# 1) Attach this file in Cursor: @.cursor/commands/implement-feature.md

# 2) Attach the PRD file: @path/to/prd.md

# 3) Ask Cursor to implement the feature.

#

# This workflow is designed to reduce risk and keep changes scoped.

## Phase 1: Analyze (no code yet)

1. Read the PRD end-to-end.
2. List all files to be created or modified.
3. Identify dependencies and potential breaking changes.
4. Identify open questions or ambiguities.
5. Produce a short implementation plan.

## Phase 2: Types

1. Create or update types in `src/types/`.
2. Ensure all exported types are used.
3. Avoid `any` and prefer explicit types.

## Phase 3: Services

1. Create or update service files in `src/services/`.
2. Use existing error handling helpers (e.g. `withErrorHandling`).
3. Validate inputs before sending requests.

## Phase 4: Hooks

1. Create or update hooks in `src/hooks/`.
2. Use `useReducer` for multi-state flows.
3. Ensure cleanup in `useEffect` where needed.

## Phase 5: UI

1. Create or update screens in `src/screens/`.
2. Create or update components in `src/components/`.
3. Implement loading, empty, error, and success states.
4. Use `StyleSheet.create()` and add `accessibilityLabel` on interactive elements.

## Phase 6: Verification

1. Follow rules in `@.cursorrules`.
2. Run `@.cursor/commands/codereview.md` checks.
3. Ensure error handling is explicit and does not leak sensitive info.
4. Avoid breaking changes unless the PRD explicitly allows them.

## Phase 7: Summary

Provide:

- Files created or modified
- Key decisions or assumptions
- Testing suggestions
- Known limitations
