# Autonomous Coding Setup

This folder contains automation helpers that are safe and non-invasive.
They do not change app code unless explicitly invoked by you.

## Files Added

- `.cursor/templates/prd-template.md` - PRD template for consistent specs
- `.cursor/commands/implement-feature.md` - Step-by-step implementation workflow
- `.cursor/commands/quality-gate.md` - Post-implementation safety checks

## Recommended Usage

1. Create a PRD using the template.
2. Attach both the PRD and `implement-feature.md` in Cursor.
3. Ask Cursor to implement the feature.
4. Run the `quality-gate.md` checklist.

## Safety Notes

- No app code is modified by these files directly.
- All changes are scoped to `.cursor/`.
- You can delete these files at any time.
