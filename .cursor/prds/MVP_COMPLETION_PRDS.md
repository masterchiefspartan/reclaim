# MVP Completion PRDs

# Four Immediate Features Required for MVP Launch

**Created:** January 2026  
**Status:** Ready for Implementation  
**Priority:** P0 - Must complete before launch

---

## Table of Contents

1. [PRD 1: Backend Analytics Functions](#prd-1-backend-analytics-functions)
2. [PRD 2: Standardized Empty/Error State Components](#prd-2-standardized-emptyerror-state-components)
3. [PRD 3: Real-time Transcription UI](#prd-3-real-time-transcription-ui)
4. [PRD 4: Paywall Purchase Flow](#prd-4-paywall-purchase-flow)

---

# PRD 1: Backend Analytics Functions

## 1. Objective

Implement backend Firebase Functions to provide mood trends and insights data for the dashboard, enabling users to visualize their recovery progress over time.

## 2. User Story

As a recovering user, I want to see my mood and progress trends over time so that I can visualize my recovery journey and stay motivated.

## 3. Requirements

### Functional Requirements

- [ ] FR1: `getMoodTrends` function returns mood data for configurable time periods (7, 14, 30, 90 days)
- [ ] FR2: `getInsightsSummary` function returns aggregated insights (top topics, sentiment distribution, suggested actions)
- [ ] FR3: Both functions require authentication and only return data for the authenticated user
- [ ] FR4: Functions handle edge cases (no data, insufficient data, invalid date ranges)
- [ ] FR5: Response includes calculated averages and distributions

### Non-Functional Requirements

- [ ] Performance: Response time < 2 seconds for 90 days of data
- [ ] Security: Verify `context.auth.uid` matches requested user data
- [ ] Reliability: Graceful degradation when data is insufficient

## 4. Technical Specification

### Files to Create or Modify

- `functions/src/index.ts` - Add new exported functions
- `functions/src/services/analytics.ts` - Analytics service logic (NEW)
- `functions/src/types/analytics.ts` - TypeScript types (NEW)

### API Contracts

```typescript
// getMoodTrends
interface GetMoodTrendsRequest {
  days?: number; // Default: 30, Options: 7, 14, 30, 90
}

interface MoodDataPoint {
  date: string; // ISO date string
  mood: string; // MoodLevel
  moodScore?: number; // 1-10
}

interface GetMoodTrendsResponse {
  moodData: MoodDataPoint[];
  averages: {
    moodDistribution: Record<string, number>; // { happy: 5, sad: 2, ... }
    averageMoodScore: number;
    totalEntries: number;
  };
  trend: 'improving' | 'stable' | 'declining';
}

// getInsightsSummary
interface GetInsightsSummaryRequest {
  days?: number; // Default: 30
}

interface GetInsightsSummaryResponse {
  topTopics: string[]; // Top 5 recurring topics
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  suggestedActions: string[]; // Up to 5 suggestions
  totalEntries: number;
  streakDays: number;
  totalVoiceMinutes: number;
}
```

### Data Flow

```
Client Request -> Firebase Function -> Verify Auth -> Query Firestore -> Aggregate Data -> Return Response
```

## 5. Acceptance Criteria

- [ ] AC1: When authenticated user calls `getMoodTrends` with days=30, they receive mood data for last 30 days
- [ ] AC2: When user has < 3 entries, response includes `insufficientData: true` flag
- [ ] AC3: When unauthenticated user calls function, they receive `unauthenticated` error
- [ ] AC4: When user calls with invalid days value, they receive `invalid-argument` error
- [ ] AC5: Mood trend calculation correctly identifies improving/stable/declining based on score changes

## 6. Implementation Checklist

- [ ] Create `functions/src/types/analytics.ts` with type definitions
- [ ] Create `functions/src/services/analytics.ts` with helper functions
- [ ] Implement `getMoodTrends` function in `functions/src/index.ts`
- [ ] Implement `getInsightsSummary` function in `functions/src/index.ts`
- [ ] Add trend calculation logic (compare first half vs second half averages)
- [ ] Add authentication checks
- [ ] Add input validation
- [ ] Test with Firebase emulator
- [ ] Deploy to Firebase

---

# PRD 2: Standardized Empty/Error State Components

## 1. Objective

Create reusable, consistent UI components for empty states and error states across the app, improving user experience and reducing code duplication.

## 2. User Story

As a user, I want to see helpful, consistent messages when there's no data or when something goes wrong so that I understand what happened and what I can do next.

## 3. Requirements

### Functional Requirements

- [ ] FR1: EmptyState component displays illustration, title, message, and optional action button
- [ ] FR2: ErrorState component displays error icon, title, message, and retry button
- [ ] FR3: NetworkErrorState specialized component for network failures with retry
- [ ] FR4: LoadingState component with skeleton/spinner options
- [ ] FR5: All components follow app design system (colors, typography, spacing)
- [ ] FR6: Components support custom icons/illustrations

### Non-Functional Requirements

- [ ] Accessibility: All components have proper accessibility labels
- [ ] Performance: Components render in < 16ms
- [ ] Consistency: Match APP_PLAN.md Section 7 design specifications

## 4. Technical Specification

### Files to Create

- `src/components/common/EmptyState.tsx` - Empty state component
- `src/components/common/ErrorState.tsx` - Error state component
- `src/components/common/NetworkErrorState.tsx` - Network error component
- `src/components/common/LoadingState.tsx` - Loading state component
- `src/components/common/StateContainer.tsx` - Wrapper for conditional rendering
- `src/components/common/index.ts` - Export barrel file (update)

### Component Props

```typescript
// EmptyState
interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

// ErrorState
interface ErrorStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title?: string; // Default: "Something went wrong"
  message: string;
  retryLabel?: string; // Default: "Try Again"
  onRetry?: () => void;
  showContactSupport?: boolean;
  style?: ViewStyle;
}

// NetworkErrorState
interface NetworkErrorStateProps {
  onRetry: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

// LoadingState
interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton' | 'dots';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

// StateContainer - Conditional rendering wrapper
interface StateContainerProps {
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;
  data?: unknown;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: React.ReactNode;
  onRetry?: () => void;
}
```

### UI States Visual Spec

```
┌─────────────────────────┐
│                         │
│      [Icon/Image]       │
│                         │
│     Title Text Here     │
│                         │
│  Description message    │
│  that explains what     │
│  happened or what to do │
│                         │
│   [ Action Button ]     │
│                         │
└─────────────────────────┘
```

## 5. Acceptance Criteria

- [ ] AC1: EmptyState renders with title, message, and optional action button
- [ ] AC2: ErrorState renders with error message and retry button that triggers callback
- [ ] AC3: NetworkErrorState shows "No internet connection" with retry
- [ ] AC4: LoadingState shows spinner/skeleton based on variant prop
- [ ] AC5: StateContainer automatically renders correct state based on props
- [ ] AC6: All components match app theme (light/dark mode)
- [ ] AC7: All text wrapped in AppText component (not raw Text)

## 6. Implementation Checklist

- [ ] Create EmptyState component with Feather icon support
- [ ] Create ErrorState component with retry functionality
- [ ] Create NetworkErrorState component
- [ ] Create LoadingState component with variants
- [ ] Create StateContainer wrapper component
- [ ] Update barrel export in `src/components/common/index.ts`
- [ ] Add accessibility labels to all components
- [ ] Test in light and dark modes
- [ ] Integrate into JournalListScreen as example
- [ ] Integrate into DashboardScreen as example

---

# PRD 3: Real-time Transcription UI

## 1. Objective

Display real-time speech-to-text transcription in the Voice Journal screen while the user is recording, providing immediate feedback that their voice is being captured accurately.

## 2. User Story

As a user recording a voice journal, I want to see my words appear on screen as I speak so that I know my voice is being captured and can review what I'm saying.

## 3. Requirements

### Functional Requirements

- [ ] FR1: Transcript text appears within 1-2 seconds of speaking
- [ ] FR2: Transcript scrolls automatically as new text is added
- [ ] FR3: User can manually scroll to review earlier parts of transcript
- [ ] FR4: Transcript persists after recording stops
- [ ] FR5: Visual indicator shows when transcription is active/processing
- [ ] FR6: Graceful handling when transcription service is unavailable

### Non-Functional Requirements

- [ ] Performance: UI remains responsive during transcription (60fps)
- [ ] Latency: Text appears within 2 seconds of speech
- [ ] Reliability: Partial transcripts saved if connection drops

## 4. Technical Specification

### Files to Create or Modify

- `src/screens/voice/VoiceJournalScreen.tsx` - Add transcript display
- `src/components/voice/LiveTranscript.tsx` - New transcript display component
- `src/hooks/useRealtimeTranscription.ts` - Hook for streaming transcription
- `src/services/voice/transcriptionStream.ts` - Deepgram streaming service (NEW)

### Data Flow

```
Microphone -> Audio Chunks -> WebSocket to Deepgram -> Partial Transcripts -> State Update -> UI Render
```

### Component Structure

```typescript
// LiveTranscript component
interface LiveTranscriptProps {
  transcript: string;
  isListening: boolean;
  error?: string | null;
  style?: ViewStyle;
}

// useRealtimeTranscription hook
interface UseRealtimeTranscriptionReturn {
  transcript: string;
  isListening: boolean;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  clearTranscript: () => void;
}
```

### Deepgram Streaming Integration

```typescript
// WebSocket connection to Deepgram
const DEEPGRAM_WS_URL = 'wss://api.deepgram.com/v1/listen';

interface DeepgramConfig {
  model: 'nova-2';
  language: 'en-US';
  smart_format: true;
  interim_results: true;
  punctuate: true;
  endpointing: 300;
}
```

### UI Layout

```
┌─────────────────────────────────┐
│  Voice Journal                  │
├─────────────────────────────────┤
│                                 │
│     ┌───────────────────┐       │
│     │   🎙️ Recording... │       │
│     │      02:34        │       │
│     └───────────────────┘       │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Live Transcript         │    │
│  │ ─────────────────────── │    │
│  │ Today was really hard.  │    │
│  │ My knee is still        │    │
│  │ swollen and painful...  │    │
│  │ █ (cursor)              │    │
│  └─────────────────────────┘    │
│                                 │
│     [ ⏸️ Pause ] [ ⏹️ Stop ]    │
│                                 │
└─────────────────────────────────┘
```

## 5. Acceptance Criteria

- [ ] AC1: When user starts recording, transcript area appears with "Listening..." indicator
- [ ] AC2: When user speaks, words appear in transcript within 2 seconds
- [ ] AC3: When user pauses speaking, transcript shows complete sentences
- [ ] AC4: When user scrolls transcript, auto-scroll pauses until they scroll to bottom
- [ ] AC5: When recording stops, final transcript is preserved for submission
- [ ] AC6: When transcription fails, error message shown with option to continue without transcript
- [ ] AC7: Transcript uses interim results for responsiveness, replaced by final results

## 6. Implementation Checklist

- [ ] Create `src/services/voice/transcriptionStream.ts` for Deepgram WebSocket
- [ ] Create `src/hooks/useRealtimeTranscription.ts` hook
- [ ] Create `src/components/voice/LiveTranscript.tsx` component
- [ ] Modify `VoiceJournalScreen.tsx` to include LiveTranscript
- [ ] Get Deepgram API key via `getStreamingTokens` Cloud Function
- [ ] Handle WebSocket connection lifecycle (connect, reconnect, cleanup)
- [ ] Implement auto-scroll with user override detection
- [ ] Add error handling for network issues
- [ ] Test with various speech patterns and durations
- [ ] Ensure transcript is passed to entry creation

---

# PRD 4: Paywall Purchase Flow

## 1. Objective

Implement a complete subscription purchase flow that allows users to select a plan, process payment, and unlock premium features, enabling app monetization.

## 2. User Story

As a new user, I want to subscribe to the app after seeing the value proposition so that I can access all features and support my recovery journey.

## 3. Requirements

### Functional Requirements

- [ ] FR1: Display three pricing options: Monthly ($9.99), Annual ($59.99), Free Trial (7 days)
- [ ] FR2: Integrate with native in-app purchases (iOS App Store, Google Play)
- [ ] FR3: Store subscription status in Firestore user profile
- [ ] FR4: Gate premium features based on subscription status
- [ ] FR5: Handle subscription restoration for returning users
- [ ] FR6: Support subscription cancellation (link to platform settings)
- [ ] FR7: Handle subscription expiration gracefully

### Non-Functional Requirements

- [ ] Security: Validate purchases server-side before granting access
- [ ] Reliability: Handle network failures during purchase gracefully
- [ ] Compliance: Follow App Store and Play Store guidelines

## 4. Technical Specification

### Files to Create or Modify

- `src/screens/onboarding/PaywallScreen.tsx` - Update with purchase logic
- `src/services/subscription/subscriptionService.ts` - NEW: IAP service
- `src/hooks/useSubscription.ts` - NEW: Subscription state hook
- `src/types/subscription.ts` - NEW: Subscription types
- `src/providers/SubscriptionProvider.tsx` - NEW: Context provider
- `functions/src/index.ts` - Add `validatePurchase` function
- `functions/src/services/iap.ts` - NEW: Server-side validation

### Data Model

```typescript
// Subscription Types
type SubscriptionPlan = 'monthly' | 'annual' | 'trial';
type SubscriptionStatus = 'active' | 'trialing' | 'expired' | 'canceled' | 'none';

interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  productId: string; // App Store / Play Store product ID
  purchaseDate: Timestamp;
  expirationDate: Timestamp;
  trialEndDate?: Timestamp;
  lastValidated: Timestamp;
  platform: 'ios' | 'android';
  originalTransactionId: string;
}

// Firestore: users/{userId}/subscription
```

### Product IDs (Configure in App Store Connect / Google Play Console)

```typescript
const PRODUCT_IDS = {
  ios: {
    monthly: 'com.recovervoice.monthly',
    annual: 'com.recovervoice.annual',
  },
  android: {
    monthly: 'recovervoice_monthly',
    annual: 'recovervoice_annual',
  },
};
```

### Purchase Flow

```
1. User selects plan on PaywallScreen
2. App initiates native purchase via expo-in-app-purchases
3. User completes purchase in native dialog
4. App receives purchase receipt
5. App sends receipt to validatePurchase Cloud Function
6. Cloud Function validates with Apple/Google
7. Cloud Function updates Firestore subscription
8. App updates local subscription state
9. User proceeds to ProfileSetup
```

### API Contract

```typescript
// validatePurchase Cloud Function
interface ValidatePurchaseRequest {
  receipt: string; // Base64 encoded receipt
  productId: string;
  platform: 'ios' | 'android';
}

interface ValidatePurchaseResponse {
  valid: boolean;
  subscription: UserSubscription | null;
  error?: string;
}

// restorePurchases Cloud Function
interface RestorePurchasesRequest {
  receipts: string[]; // Array of receipts to validate
  platform: 'ios' | 'android';
}

interface RestorePurchasesResponse {
  restored: boolean;
  subscription: UserSubscription | null;
}
```

### Gating Logic

```typescript
// In components that need subscription check
const { subscription, isSubscribed, isTrialing } = useSubscription();

if (!isSubscribed && !isTrialing) {
  // Show upgrade prompt or limit functionality
}
```

## 5. Acceptance Criteria

- [ ] AC1: When user taps "Monthly" plan, native purchase dialog appears
- [ ] AC2: When purchase succeeds, subscription stored in Firestore and user proceeds
- [ ] AC3: When purchase fails, error message shown with option to retry
- [ ] AC4: When user has existing subscription, "Restore Purchases" works correctly
- [ ] AC5: When subscription expires, user sees renewal prompt
- [ ] AC6: When checking subscription status, app validates with server
- [ ] AC7: Free trial grants 7 days of access then prompts for payment
- [ ] AC8: Subscription status persists across app restarts

## 6. Implementation Checklist

- [ ] Install `expo-in-app-purchases` package
- [ ] Configure products in App Store Connect (iOS)
- [ ] Configure products in Google Play Console (Android)
- [ ] Create `src/types/subscription.ts` with type definitions
- [ ] Create `src/services/subscription/subscriptionService.ts`
- [ ] Create `src/hooks/useSubscription.ts` hook
- [ ] Create `src/providers/SubscriptionProvider.tsx` context
- [ ] Create `functions/src/services/iap.ts` for server validation
- [ ] Add `validatePurchase` Cloud Function
- [ ] Add `restorePurchases` Cloud Function
- [ ] Update `PaywallScreen.tsx` with purchase logic
- [ ] Update `AuthProvider` to include subscription state
- [ ] Add subscription gating to appropriate features
- [ ] Test on iOS device with sandbox account
- [ ] Test on Android device with test account
- [ ] Handle edge cases (network failure, pending purchases)

---

## Implementation Order

Execute in this order due to dependencies:

1. **Backend Analytics Functions** - No dependencies, enables dashboard
2. **Empty/Error State Components** - No dependencies, used by other features
3. **Real-time Transcription UI** - Depends on existing streaming infrastructure
4. **Paywall Purchase Flow** - Most complex, can be developed in parallel

---

## References

- Architecture: @ARCHITECTURE_DECISIONS.md
- Backend: @BACKEND_PLAN.md
- UI: @APP_PLAN.md
- Code Standards: @.cursorrules
- Feature Gap Analysis: @.cursor/FEATURE_GAP_CHECKLIST.md
