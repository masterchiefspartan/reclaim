# Nightly PRD Queue (One Feature Per Night)

#

# Order is dependency-first and follows APP_PLAN phases.

# Each line is intended to be a single PRD.

## MVP Completion (Phase 1)

1. Processing Screen + navigation handoff from recording to AI response
2. Celebration Screen after save (streak + entry complete messaging)
3. Real-time transcription in Voice Journal (UI + streaming integration)
4. Paywall purchase flow (select plan -> subscription state -> gating)
5. Standardized empty/error screens (reuse across journal/dashboard)

## Phase 2

6. Guided Check-In screen (launch guided mode from Home)
7. Guided check-in structured data capture (save structured fields)
8. Milestone system v1 (data model + basic unlocks + UI)
9. Advanced Dashboard v1 (charts for mood + pain + mobility)
10. Search and filter for journal list (UI + query)
11. Export entry to PDF (basic export flow)
12. TTS for journal AI response (wire aiResponseAudioUrl or generate on demand)

## Phase 3

13. Notification scheduling (daily reminders + settings integration)
14. Detailed stats screen (drill-down charts)
15. Personalized prompts engine (based on history)
16. Proactive AI insights card (weekly summary)
17. Social sharing of milestones (share sheet)
18. PT integration placeholder (data model + UI stub)
19. Multiple recovery tracking (switch context + filtering)

## Notes

- Each PRD should reference `@.cursor/templates/prd-template.md`.
- For nightly runs, use `@.cursor/commands/overnight-run.md`.
