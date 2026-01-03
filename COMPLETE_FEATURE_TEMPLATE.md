# Complete Feature Template
# How to Generate Complete Features with Cursor AI

**Purpose:** Template for generating complete, production-ready features in one Cursor request  
**Goal:** Reduce development time by generating entire features instead of individual components

---

## Template Structure

### Basic Template

```
"Create complete [FEATURE NAME] feature with:

**Files to Create:**
- [File 1 with path]
- [File 2 with path]
- [File 3 with path]

**Functionality:**
- [Feature requirement 1]
- [Feature requirement 2]
- [Feature requirement 3]

**Requirements:**
- API: Use [endpoint] from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section [X]
- Patterns: Follow @ARCHITECTURE_DECISIONS.md
- Types: Use @types/[type].ts
- Security: Follow @.cursorrules security checklist

**States to Include:**
- Loading state
- Error state
- Success state
- Empty state

**Error Handling:**
- Network errors
- Validation errors
- Authentication errors
- [Feature-specific errors]

**Testing:**
- [Test requirements]"
```

---

## Feature-Specific Templates

### Template 1: Authentication Feature

```
"Create complete authentication feature with:

**Files to Create:**
- src/screens/LoginScreen.tsx
- src/screens/SignUpScreen.tsx
- src/screens/ForgotPasswordScreen.tsx
- src/screens/EmailVerificationScreen.tsx
- src/hooks/useAuth.ts
- src/services/authService.ts
- src/types/auth.ts
- src/utils/authValidators.ts

**Functionality:**
- Email/password signup with validation
- Email/password login
- Email verification flow
- Password reset flow
- Auto-login on app open
- Sign out functionality
- Auth state management with React Context

**Requirements:**
- API: Use Firebase Auth (no backend Functions needed)
- UI: Follow @APP_PLAN.md Section 5 (Authentication Screens)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md (State Management)
- Security: Follow @.cursorrules security checklist
- Error handling: Firebase Auth errors with user-friendly messages

**States to Include:**
- Loading state (during auth operations)
- Error state (with clear error messages)
- Success state (navigation after success)
- Authenticated state (protected routes)
- Unauthenticated state (auth screens)

**Error Handling:**
- Invalid email format
- Weak password
- Email already in use
- Invalid credentials
- Network errors
- Email verification expired

**Testing:**
- Unit tests for validators
- Integration tests for auth flow
- Test error scenarios"
```

### Template 2: Voice Recording Feature

```
"Create complete voice recording feature with:

**Files to Create:**
- src/components/voice/VoiceRecorder.tsx
- src/components/voice/RecordingControls.tsx
- src/components/voice/TranscriptDisplay.tsx
- src/hooks/useVoiceRecording.ts
- src/services/audioService.ts
- src/types/voice.ts
- src/utils/audioHelpers.ts

**Functionality:**
- Start/stop/pause recording
- Real-time transcript display (Deepgram streaming)
- Audio playback of recorded audio
- Upload audio to Firebase Storage
- Duration tracking
- Maximum recording length: 10 minutes
- Audio format: M4A
- Waveform visualization (optional)

**Requirements:**
- API: Upload to Firebase Storage, then trigger transcription Function from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section 5 (Voice Recording Screen)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md (Component Patterns)
- Types: Use @types/journal.ts for entry structure
- Security: Follow @.cursorrules security checklist
- Audio Library: Use expo-av

**States to Include:**
- Idle state (ready to record)
- Recording state (with timer)
- Paused state
- Processing state (uploading)
- Success state (uploaded)
- Error state (with retry)

**Error Handling:**
- Microphone permission denied
- Microphone unavailable
- Recording interrupted (phone call)
- Upload failure (network error)
- Storage quota exceeded
- Transcription failure

**User Interactions:**
- Tap to start recording
- Tap to pause/resume
- Tap to stop recording
- Tap to cancel recording
- Swipe to delete recording

**Testing:**
- Test recording functionality
- Test upload functionality
- Test error scenarios
- Test permission handling"
```

### Template 3: Journal Entry List Feature

```
"Create complete journal entry list feature with:

**Files to Create:**
- src/screens/JournalListScreen.tsx
- src/components/journal/JournalEntryCard.tsx
- src/components/journal/EntryFilter.tsx
- src/hooks/useJournalEntries.ts
- src/services/journalService.ts
- src/types/journal.ts (if not exists)

**Functionality:**
- Display all journal entries chronologically (newest first)
- Pagination (load more on scroll)
- Pull-to-refresh
- Search by keyword
- Filter by date range
- Filter by mood
- Entry preview (first few words)
- Mood indicator
- Entry date/time
- Tap entry to view detail
- Empty state when no entries

**Requirements:**
- API: Use getJournalEntries from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section 5 (Journal List Screen)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md
- Types: Use @types/journal.ts
- Security: Follow @.cursorrules security checklist
- Performance: Use FlatList for large lists

**States to Include:**
- Loading state (initial load)
- Loading more state (pagination)
- Success state (entries displayed)
- Empty state (no entries)
- Error state (with retry)
- Search/filter active state

**Error Handling:**
- Network errors
- API errors
- Empty search results
- Filter returns no results

**User Interactions:**
- Scroll to load more
- Pull to refresh
- Tap entry to view detail
- Tap search icon
- Select filters
- Clear search/filters

**Testing:**
- Test pagination
- Test search functionality
- Test filter functionality
- Test empty states
- Test error handling"
```

### Template 4: Journal Entry Detail Feature

```
"Create complete journal entry detail feature with:

**Files to Create:**
- src/screens/JournalEntryDetailScreen.tsx
- src/components/journal/AudioPlayer.tsx
- src/components/journal/TranscriptSection.tsx
- src/components/journal/AIResponseSection.tsx
- src/components/journal/EntryMetrics.tsx
- src/hooks/useJournalEntry.ts
- src/services/journalService.ts (update if needed)

**Functionality:**
- Display full entry details
- Audio playback (play/pause/seek)
- Full transcript display
- AI response display
- Mood indicator
- Metrics display (pain, mood score, mobility)
- Share entry functionality
- Export to PDF functionality
- Delete entry (with confirmation)
- Edit entry metadata (mood, tags)

**Requirements:**
- API: Use getJournalEntry from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section 5 (Entry Detail Screen)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md
- Types: Use @types/journal.ts
- Security: Follow @.cursorrules security checklist
- Audio: Use expo-av for playback

**States to Include:**
- Loading state (fetching entry)
- Success state (entry displayed)
- Error state (entry not found)
- Playing state (audio)
- Paused state (audio)
- Deleted state (after deletion)

**Error Handling:**
- Entry not found
- Audio playback failed
- Share failed
- Export failed
- Delete failed
- Network errors

**User Interactions:**
- Play/pause audio
- Seek audio
- Scroll transcript
- Scroll AI response
- Tap share button
- Tap export button
- Tap delete button
- Tap edit button
- Swipe to go back

**Testing:**
- Test audio playback
- Test share functionality
- Test delete functionality
- Test error scenarios"
```

### Template 5: Dashboard/Analytics Feature

```
"Create complete dashboard/analytics feature with:

**Files to Create:**
- src/screens/DashboardScreen.tsx
- src/components/dashboard/StreakCounter.tsx
- src/components/dashboard/MoodTrendChart.tsx
- src/components/dashboard/ProgressIndicators.tsx
- src/components/dashboard/MilestonesList.tsx
- src/components/dashboard/StatisticsCard.tsx
- src/hooks/useDashboardData.ts
- src/services/analyticsService.ts

**Functionality:**
- Display current streak
- Mood trend chart (14/30/90 days)
- Pain progress indicator
- Mobility progress indicator
- Milestones achieved
- Statistics (total entries, voice time, etc.)
- Tap charts for detailed view
- Pull-to-refresh

**Requirements:**
- API: Use getMoodTrends and getInsightsSummary from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section 5 (Dashboard Screen)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md
- Types: Use @types/journal.ts and @types/user.ts
- Security: Follow @.cursorrules security checklist
- Charts: Use react-native-chart-kit or Victory Native

**States to Include:**
- Loading state (fetching data)
- Success state (data displayed)
- Empty state (less than 7 days of data)
- Error state (failed to load)

**Error Handling:**
- Network errors
- Insufficient data
- API errors

**User Interactions:**
- Tap chart for details
- Pull to refresh
- Tap milestone for details
- Navigate to detailed stats

**Testing:**
- Test chart rendering
- Test data calculations
- Test empty states
- Test error handling"
```

### Template 6: Settings Feature

```
"Create complete settings feature with:

**Files to Create:**
- src/screens/SettingsScreen.tsx
- src/screens/EditProfileScreen.tsx
- src/components/settings/SettingsSection.tsx
- src/components/settings/SettingsItem.tsx
- src/hooks/useSettings.ts
- src/services/userService.ts

**Functionality:**
- Display user profile
- Edit profile information
- Update preferences (notifications, reminders)
- Manage subscription
- Data export
- Delete account
- Sign out

**Requirements:**
- API: Use getUserProfile and updateUserPreferences from @BACKEND_PLAN.md
- UI: Follow @APP_PLAN.md Section 5 (Settings Screen)
- Patterns: Follow @ARCHITECTURE_DECISIONS.md
- Types: Use @types/user.ts
- Security: Follow @.cursorrules security checklist

**States to Include:**
- Loading state (fetching/saving)
- Success state (saved)
- Error state (save failed)
- Confirmation state (delete account)

**Error Handling:**
- Network errors
- Validation errors
- Permission errors
- API errors

**User Interactions:**
- Tap to edit profile
- Toggle preferences
- Tap subscription management
- Tap data export
- Tap delete account (with confirmation)
- Tap sign out

**Testing:**
- Test profile updates
- Test preference changes
- Test sign out
- Test error scenarios"
```

---

## Comprehensive Prompt Template

### Full Feature Generation Template

```
"Create complete [FEATURE NAME] feature following all requirements:

**Feature Overview:**
[Brief description of what this feature does]

**Files to Create:**
[List all files with full paths]

**Core Functionality:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
- [Requirement 4]

**API Integration:**
- Endpoint: [API endpoint name] from @BACKEND_PLAN.md
- Request/Response: Use types from @types/[type].ts
- Error handling: Follow @.cursorrules error handling patterns

**UI Requirements:**
- Screen: Follow @APP_PLAN.md Section [X] specifications
- Components: Follow @APP_PLAN.md Section 7 design system
- Navigation: Follow @APP_PLAN.md Section 6 navigation patterns
- Accessibility: Follow @APP_PLAN.md Section 7 accessibility requirements

**State Management:**
- Use React hooks (useState, useEffect, custom hooks)
- State patterns: Follow @ARCHITECTURE_DECISIONS.md
- Data fetching: Use custom hooks pattern

**States to Include:**
- Loading state: [Describe loading UI]
- Error state: [Describe error UI]
- Success state: [Describe success UI]
- Empty state: [Describe empty UI]

**Error Handling:**
- Network errors: [How to handle]
- API errors: [How to handle]
- Validation errors: [How to handle]
- Authentication errors: [How to handle]
- [Feature-specific errors]

**Security Requirements:**
- Authentication: Verify user is authenticated
- Authorization: Verify user owns resources
- Input validation: Validate all inputs
- Error messages: Don't leak sensitive information
- Follow @.cursorrules security checklist

**Performance Considerations:**
- Use React.memo() for expensive components
- Implement pagination for large lists
- Lazy load heavy components
- Optimize images

**Testing Requirements:**
- Unit tests: [What to test]
- Integration tests: [What to test]
- User interaction tests: [What to test]

**Additional Requirements:**
- [Any other specific requirements]
- [Any platform-specific requirements]
- [Any special considerations]

**Reference Existing Code:**
- Similar patterns: @codebase [component/file]
- Follow patterns from: [existing feature]
- Use similar structure to: [existing screen]"
```

---

## Quick Reference: One-Line Feature Requests

For faster development, use these condensed templates:

### Authentication
```
"Create complete authentication feature (LoginScreen, SignUpScreen, ForgotPasswordScreen, EmailVerificationScreen, useAuth hook, authService) with Firebase Auth integration, error handling, loading states, validation. Follow @APP_PLAN.md Section 5 and @.cursorrules"
```

### Voice Recording
```
"Create complete voice recording feature (VoiceRecorder component, useVoiceRecording hook, audioService) with expo-av, real-time transcription, Firebase Storage upload, error handling, loading states. Follow @APP_PLAN.md Section 5 and @BACKEND_PLAN.md API contracts"
```

### Journal List
```
"Create complete journal entry list feature (JournalListScreen, JournalEntryCard, useJournalEntries hook, journalService) with pagination, search, filters, empty states, error handling. Use getJournalEntries from @BACKEND_PLAN.md, follow @APP_PLAN.md Section 5"
```

### Journal Detail
```
"Create complete journal entry detail feature (JournalEntryDetailScreen, AudioPlayer, TranscriptSection, AIResponseSection) with audio playback, share, export, delete. Use getJournalEntry from @BACKEND_PLAN.md, follow @APP_PLAN.md Section 5"
```

### Dashboard
```
"Create complete dashboard feature (DashboardScreen, StreakCounter, MoodTrendChart, ProgressIndicators, MilestonesList) with charts, statistics, pull-to-refresh. Use getMoodTrends and getInsightsSummary from @BACKEND_PLAN.md, follow @APP_PLAN.md Section 5"
```

### Settings
```
"Create complete settings feature (SettingsScreen, EditProfileScreen, useSettings hook, userService) with profile editing, preferences, subscription management, sign out. Use getUserProfile and updateUserPreferences from @BACKEND_PLAN.md, follow @APP_PLAN.md Section 5"
```

---

## Best Practices for Using Templates

### 1. Be Specific About What You Want

**✅ GOOD:**
- List all files you need
- Specify exact functionality
- Reference documentation
- Include all states

**❌ BAD:**
- "Create journal feature"
- Vague requirements
- No file structure
- Missing states

### 2. Always Reference Documentation

**Always Include:**
- `@BACKEND_PLAN.md` - For API contracts
- `@APP_PLAN.md` - For UI requirements
- `@ARCHITECTURE_DECISIONS.md` - For patterns
- `@.cursorrules` - For code standards
- `@codebase` - For existing patterns

### 3. Specify All States

**Required States:**
- Loading state
- Error state
- Success state
- Empty state (if applicable)

### 4. Include Error Handling

**Specify:**
- What errors to handle
- How to display errors
- Retry mechanisms
- Fallback behaviors

### 5. Request Related Files Together

**Instead of:**
- Creating screen
- Then creating hook
- Then creating service

**Do:**
- Create all related files in one request
- They'll work together from the start
- Less integration work later

---

## Example: Real Feature Request

Here's how to use the template for a real feature:

```
"Create complete journal entry creation feature with:

**Files to Create:**
- src/screens/CreateEntryScreen.tsx
- src/components/journal/RecordingSection.tsx
- src/components/journal/MoodSelector.tsx
- src/hooks/useCreateEntry.ts
- src/services/journalService.ts (add createEntry method)

**Core Functionality:**
- Voice recording with expo-av
- Real-time transcript display
- Upload audio to Firebase Storage
- Call createJournalEntry Function from @BACKEND_PLAN.md
- Display AI response when ready
- Mood selection after AI response
- Save entry with mood
- Navigate to entry detail or home after save

**API Integration:**
- Endpoint: createJournalEntry from @BACKEND_PLAN.md
- Request: { audioUrl, duration }
- Response: { entryId, success }
- Then: Wait for transcription and AI response (via Firestore listener)

**UI Requirements:**
- Screen: Follow @APP_PLAN.md Section 5 (Voice Recording Screen)
- Design: Follow @APP_PLAN.md Section 7 (UI/UX Design Principles)
- Colors: Use Recovery Blue for primary actions
- Typography: Use system fonts per design system

**State Management:**
- Recording state (idle, recording, paused, stopped)
- Upload state (uploading, uploaded, failed)
- Processing state (transcribing, generating AI response)
- AI response state (received, error)
- Mood selection state

**States to Include:**
- Loading state: Recording in progress
- Processing state: Uploading and processing audio
- Success state: AI response received
- Error state: Recording failed, upload failed, or processing failed
- Empty state: Not applicable

**Error Handling:**
- Network errors: Show error message, allow retry
- Upload errors: Show error, save locally, retry when online
- Transcription errors: Show error, allow manual retry
- AI response errors: Show error, allow retry
- Storage quota: Show error message
- Microphone permission: Request permission, show instructions

**Security Requirements:**
- Verify user is authenticated before recording
- Validate audio file before upload
- Verify user owns entry before saving
- Follow @.cursorrules security checklist

**Performance Considerations:**
- Optimize audio recording format
- Compress audio before upload
- Show loading indicators during processing
- Don't block UI during upload

**Testing Requirements:**
- Test recording functionality
- Test upload functionality
- Test error scenarios
- Test mood selection
- Test navigation after save

**Reference Existing Code:**
- Follow patterns from @codebase for similar screens
- Use similar error handling patterns
- Use similar loading state patterns"
```

---

## Common Patterns to Include

### Always Include These in Feature Requests:

1. **File Structure**
   - List all files with full paths
   - Include related hooks, services, types

2. **API Contracts**
   - Reference specific endpoints
   - Specify request/response formats
   - Include error responses

3. **UI Specifications**
   - Reference screen specifications
   - Include design system references
   - Specify accessibility requirements

4. **State Management**
   - List all states needed
   - Specify state transitions
   - Include loading/error states

5. **Error Handling**
   - List all error scenarios
   - Specify error messages
   - Include retry mechanisms

6. **Security**
   - Authentication checks
   - Authorization checks
   - Input validation
   - Error message security

7. **Testing**
   - Unit test requirements
   - Integration test requirements
   - User interaction tests

---

## Tips for Maximum Efficiency

### 1. Copy-Paste Template, Fill in Blanks

1. Copy the template
2. Fill in feature-specific details
3. Add references to documentation
4. Paste into Cursor Chat
5. Get complete feature

### 2. Build Features in Logical Order

**Week 1-2:**
- Authentication
- Voice recording
- Basic journal saving

**Week 3-4:**
- Journal list
- Entry detail
- Dashboard

**Week 5-6:**
- Settings
- Advanced features
- Polish

### 3. Generate Related Features Together

**Example:**
```
"Create complete journal management feature:
- Journal list screen
- Entry detail screen
- Create entry screen
- Edit entry functionality
- Delete entry functionality
- All with shared hooks and services"
```

### 4. Test Immediately After Generation

1. Generate feature
2. Review code
3. Test immediately
4. Fix critical issues
5. Commit working code
6. Move to next feature

---

## Feature Complexity Levels

### Simple Feature (1-2 files)
- Single component
- Basic functionality
- Minimal state management
- Example: Simple button component

### Medium Feature (3-5 files)
- Screen + components
- Hook for state management
- Service for API calls
- Example: Settings screen

### Complex Feature (6+ files)
- Multiple screens
- Multiple components
- Multiple hooks
- Multiple services
- Example: Complete journal flow

**Use templates for Medium and Complex features for maximum efficiency.**

---

## Quick Checklist Before Using Template

Before asking Cursor to generate a feature, ensure you have:

- [ ] Reviewed @APP_PLAN.md for UI requirements
- [ ] Reviewed @BACKEND_PLAN.md for API contracts
- [ ] Reviewed @ARCHITECTURE_DECISIONS.md for patterns
- [ ] Reviewed @.cursorrules for code standards
- [ ] Listed all files needed
- [ ] Specified all functionality
- [ ] Included all states
- [ ] Specified error handling
- [ ] Included security requirements
- [ ] Referenced existing code patterns

---

**This template ensures Cursor generates complete, production-ready features in one request, dramatically reducing development time.**


