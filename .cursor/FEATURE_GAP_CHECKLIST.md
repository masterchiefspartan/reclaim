# Feature Gap Checklist (APP_PLAN)

#

# Source: /Users/nikhilmohanty/Documents/reclaim/APP_PLAN.md

# Statuses: Implemented | Partial | Missing

## Phase 1 (MVP) Features

- Voice Recording — Implemented
  - Evidence: `src/screens/voice/VoiceJournalScreen.tsx`, `src/hooks/useVoiceRecorder.ts`, `src/components/voice/RecordingVisualizer.tsx`
- Real-time Transcription — Partial
  - Evidence: streaming exists for conversations in `src/services/voice-conversation/deepgramStream.ts`
  - Gap: journaling flow does not show real-time transcript UI like plan describes
- AI Response Generation — Partial
  - Evidence: conversation AI flow in `src/hooks/useVoiceConversation.ts` and `src/services/voice-conversation/conversationApi.ts`
  - Gap: journal AI response depends on backend processing; no explicit client-side request control
- Mood Tracking — Implemented
  - Evidence: `src/components/common/MoodSelector.tsx`, `src/services/journal/journalService.ts`
- Journal Entry Storage — Implemented
  - Evidence: `src/services/journal/journalService.ts`, `src/hooks/useJournalEntries.ts`
- Basic Dashboard — Implemented (basic metrics only)
  - Evidence: `src/screens/dashboard/DashboardScreen.tsx`
  - Gap: no charts or pain/mobility trends
- Authentication — Implemented
  - Evidence: `src/providers/AuthProvider.tsx`, `src/services/auth/authService.ts`
- Paywall — Partial
  - Evidence: `src/screens/onboarding/PaywallScreen.tsx` (UI only)
  - Gap: no purchase/subscription flow
- Onboarding — Implemented
  - Evidence: `src/screens/onboarding/*`, wired in `src/navigation/AppNavigator.tsx`

## Phase 2 Features

- Guided Check-Ins — Partial
  - Evidence: guided mode prompts in `src/screens/voice/VoiceJournalScreen.tsx`
  - Gap: no dedicated guided check-in screen and structured data capture
- Text-to-Speech (AI response) — Partial
  - Evidence: ElevenLabs service exists in `src/services/voice-conversation/elevenLabsTTS.ts`
  - Gap: not wired to journal AI response flow end-to-end
- Entry Detail View — Implemented
  - Evidence: `src/screens/journal/EntryDetailScreen.tsx`
  - Gap: missing export/share actions from plan
- Advanced Dashboard — Missing
  - Gap: pain/mobility charts, trends, advanced analytics
- Milestone System — Partial
  - Evidence: basic milestone messaging in `src/screens/dashboard/DashboardScreen.tsx`
  - Gap: full milestone tracking/celebrations
- Search & Filter — Missing
  - Gap: no search/filter UI or service
- Export Functionality — Missing
  - Gap: no PDF export or share flow

## Phase 3 Features

- Proactive AI Insights — Missing
- Personalized Prompts — Missing
- Social Sharing — Missing
- PT Integration — Missing
- Notification System — Partial
  - Evidence: permissions and toggle in `src/screens/onboarding/PermissionsScreen.tsx`, `src/screens/settings/SettingsScreen.tsx`
  - Gap: no scheduling, channels, or reminders
- Advanced Analytics — Missing
  - Gap: no detailed stats screen or deeper charts
- Multiple Recovery Tracking — Missing

## Screen Inventory (from APP_PLAN)

- Welcome — Implemented (`src/screens/onboarding/WelcomeScreen.tsx`)
- Value Slides 1–3 — Implemented (`src/screens/onboarding/ValueSlidesScreen.tsx`)
- Create Account — Implemented (`src/screens/onboarding/SignUpScreen.tsx`)
- Email Verification — Implemented (`src/screens/onboarding/EmailVerificationScreen.tsx`)
- Paywall — Partial (UI only) (`src/screens/onboarding/PaywallScreen.tsx`)
- Profile Setup — Implemented (`src/screens/onboarding/ProfileSetupScreen.tsx`)
- Permissions — Implemented (`src/screens/onboarding/PermissionsScreen.tsx`)
- Home — Implemented (`src/screens/HomeScreen.tsx`)
- Voice Recording — Implemented (`src/screens/voice/VoiceJournalScreen.tsx`)
- Processing — Missing (currently handled inside `AIResponseScreen`)
- AI Response — Implemented (`src/screens/voice/AIResponseScreen.tsx`)
- Celebration — Missing
- Journal List — Implemented (`src/screens/journal/JournalListScreen.tsx`)
- Entry Detail — Implemented (`src/screens/journal/EntryDetailScreen.tsx`)
- Dashboard — Implemented (basic) (`src/screens/dashboard/DashboardScreen.tsx`)
- Guided Check-In — Missing (no dedicated screen)
- Settings — Implemented (`src/screens/settings/SettingsScreen.tsx`)
- Detailed Stats — Missing
- Edit Profile — Missing (only inline edit in Settings)
- Subscription Management — Missing
- Network Error Screen — Missing
- Loading Screen — Implemented (`src/screens/LoadingScreen.tsx`)
- Empty State Screen — Missing (handled inline)
- Error Screen — Missing (handled inline)
- Offline Screen — Missing

## Key Flows / Edge Cases (Plan vs Implementation)

- Offline recording + retry — Missing (no queue/sync UX)
- API timeout handling and retry flows — Partial (AI response failure UI exists)
- Audio upload retry flow — Missing
- Guided check-in structured storage — Missing
- Export/share flows — Missing

## Mobile Optimization Notes (High-Level)

- Lists: `FlatList` used in journal and onboarding slides (good).
- Scroll: Multiple `ScrollView` screens; OK for short content but not optimized for long data sets.
- UI states: Loading and empty states exist inline but not standardized across app.
