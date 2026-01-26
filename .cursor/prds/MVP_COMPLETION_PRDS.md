# MVP Completion PRDs

# Critical Features Required for MVP Launch

**Created:** January 2026  
**Last Updated:** January 25, 2026  
**Status:** Comprehensive Gap Analysis Complete  
**Priority:** P0 - Must complete before launch

---

## Executive Summary

This document contains Product Requirement Documents for all critical features needed before MVP launch. Features are prioritized by business impact and technical dependencies.

**Critical Path to Launch:**
1. Paywall Purchase Flow (monetization - can't launch without revenue)
2. Offline Support & Error Recovery (data safety - user trust)
3. Dashboard Analytics Display (retention - core value demonstration)
4. Real-time Transcription UI (UX promise - core feature)
5. Recovery Phase Intelligence (differentiation - competitive moat)
6. Notification System (engagement - daily return rate)
7. Analytics & Crash Reporting (measurement - success metrics)
8. Milestone & Celebration System (gamification - retention)

---

## Table of Contents

### Tier 1: Launch Blockers (Must Have)
1. [PRD 1: Paywall Purchase Flow (Complete)](#prd-1-paywall-purchase-flow-complete)
2. [PRD 2: Offline Support & Error Recovery](#prd-2-offline-support--error-recovery)
3. [PRD 3: Dashboard Analytics Integration](#prd-3-dashboard-analytics-integration)

### Tier 2: Core Experience (Should Have)
4. [PRD 4: Real-time Transcription UI](#prd-4-real-time-transcription-ui)
5. [PRD 5: Recovery Phase Intelligence](#prd-5-recovery-phase-intelligence)
6. [PRD 6: Notification System](#prd-6-notification-system)

### Tier 3: Quality & Measurement (Important)
7. [PRD 7: Analytics & Crash Reporting](#prd-7-analytics--crash-reporting)
8. [PRD 8: Milestone & Celebration System](#prd-8-milestone--celebration-system)
9. [PRD 9: Standardized Empty/Error State Components](#prd-9-standardized-emptyerror-state-components)

### Tier 4: Security & Polish
10. [PRD 10: API Security Hardening](#prd-10-api-security-hardening)
11. [PRD 11: Type Safety & Shared Contracts](#prd-11-type-safety--shared-contracts)

---

# TIER 1: LAUNCH BLOCKERS

---

# PRD 1: Paywall Purchase Flow (Complete)

## 1. Objective

Complete the subscription purchase flow by connecting the PaywallScreen UI to RevenueCat, validating purchases server-side, gating features based on subscription status, and storing subscription state in Firestore.

## 2. User Story

As a new user, I want to subscribe to the app after seeing the value proposition so that I can access all features and support my recovery journey.

## 3. Current State Analysis

**What Exists:**
- ✅ RevenueCat SDK integrated (`src/services/subscription/revenueCatService.ts`)
- ✅ `useSubscription` hook with purchase/restore methods
- ✅ `RevenueCatProvider` context
- ✅ PaywallScreen UI layout
- ✅ Subscription types defined

**What's Missing:**
- ❌ PaywallScreen doesn't call purchase methods
- ❌ No loading/error states during purchase
- ❌ No server-side purchase validation
- ❌ Subscription status not stored in Firestore user profile
- ❌ No feature gating throughout app
- ❌ No subscription webhook handling for renewals/cancellations

## 4. Requirements

### Functional Requirements

- [ ] FR1: PaywallScreen displays products from RevenueCat offerings
- [ ] FR2: Tapping plan button initiates native purchase flow
- [ ] FR3: Show loading state during purchase processing
- [ ] FR4: Handle purchase success → navigate to ProfileSetup
- [ ] FR5: Handle purchase failure → show error with retry option
- [ ] FR6: Handle user cancellation → stay on paywall
- [ ] FR7: "Restore Purchases" button works correctly
- [ ] FR8: Subscription status stored in Firestore `users/{uid}` document
- [ ] FR9: Feature gating based on `isSubscribed` throughout app
- [ ] FR10: Server-side webhook validates subscription changes

### Non-Functional Requirements

- [ ] Purchase completes within 30 seconds
- [ ] Graceful handling of App Store/Play Store unavailability
- [ ] Offline-friendly: Show cached products if available

## 5. Technical Specification

### Files to Modify

- `src/screens/onboarding/PaywallScreen.tsx` - Connect to useSubscription
- `src/providers/RevenueCatProvider.tsx` - Add Firestore sync
- `src/hooks/useSubscription.ts` - Already complete
- `functions/src/index.ts` - Add webhook handler (optional for MVP)

### PaywallScreen Implementation

```typescript
// PaywallScreen.tsx changes needed
const PaywallScreen = () => {
  const { products, purchase, restore, isLoading, error } = useSubscription();
  const [purchasing, setPurchasing] = useState(false);
  const navigation = useNavigation();

  const handlePurchase = async (product: DisplayProduct) => {
    setPurchasing(true);
    try {
      const result = await purchase(product);
      if (result.success) {
        // Navigate to next step
        navigation.navigate('ProfileSetup');
      } else if (!result.userCancelled) {
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    const result = await restore();
    if (result.success && result.hasActiveEntitlements) {
      navigation.navigate('ProfileSetup');
    }
  };

  // ... rest of component
};
```

### Firestore Subscription Sync

```typescript
// In RevenueCatProvider - sync subscription to Firestore
useEffect(() => {
  const syncToFirestore = async () => {
    if (user && subscriptionState.customerInfo) {
      await updateDoc(doc(db, 'users', user.uid), {
        subscription: {
          isSubscribed: subscriptionState.isSubscribed,
          status: subscriptionState.status,
          expirationDate: subscriptionState.expirationDate,
          productId: subscriptionState.activeProductId,
          updatedAt: serverTimestamp(),
        },
      });
    }
  };
  syncToFirestore();
}, [user, subscriptionState]);
```

### Feature Gating Pattern

```typescript
// Use throughout app where premium features are needed
const { isSubscribed, isLoading } = useSubscription();

if (isLoading) return <LoadingState />;

if (!isSubscribed) {
  return <UpgradePrompt onUpgrade={() => navigation.navigate('Paywall')} />;
}

// Premium feature content
```

## 6. Acceptance Criteria

- [ ] AC1: Products load from RevenueCat and display on PaywallScreen
- [ ] AC2: Tapping "Monthly" opens native App Store/Play Store purchase sheet
- [ ] AC3: Successful purchase navigates to ProfileSetup
- [ ] AC4: Failed purchase shows error alert with retry option
- [ ] AC5: Restore Purchases finds and restores existing subscriptions
- [ ] AC6: Subscription status visible in Firestore user document
- [ ] AC7: Non-subscribed user cannot access voice conversation (gated feature)

## 7. Implementation Checklist

- [ ] Update PaywallScreen to use useSubscription hook
- [ ] Add loading/purchasing state UI
- [ ] Connect plan buttons to purchase method
- [ ] Implement restore purchases flow
- [ ] Add Firestore sync to RevenueCatProvider
- [ ] Add feature gating to VoiceConversationScreen
- [ ] Test full purchase flow on iOS with sandbox account
- [ ] Test full purchase flow on Android with test account
- [ ] Test restore purchases flow
- [ ] Test subscription expiration handling

---

# PRD 2: Offline Support & Error Recovery

## 1. Objective

Implement robust offline support and error recovery to ensure users never lose their voice recordings, even with poor connectivity. This is critical for users journaling from PT offices, hospitals, and other locations with unreliable internet.

## 2. User Story

As a user recording a voice journal in a location with poor internet, I want my recording to be saved locally and uploaded automatically when connection is restored so that I never lose my thoughts.

## 3. Current State Analysis

**What Exists:**
- ✅ Audio recording works locally
- ✅ Firebase Storage upload capability
- ✅ Backend processing triggers

**What's Missing:**
- ❌ No local audio storage queue
- ❌ No network state detection
- ❌ No retry mechanism for failed uploads
- ❌ No sync indicator UI
- ❌ No offline journal viewing
- ❌ Recording lost if upload fails

## 4. Requirements

### Functional Requirements

- [ ] FR1: Audio recorded locally before any upload attempt
- [ ] FR2: Network state monitored continuously
- [ ] FR3: Failed uploads queued for retry
- [ ] FR4: Automatic retry with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- [ ] FR5: Visual indicator shows pending uploads
- [ ] FR6: User can manually trigger retry
- [ ] FR7: Pending entries visible in journal list (marked as "uploading" or "pending")
- [ ] FR8: Successful sync shows confirmation toast
- [ ] FR9: Maximum 5 pending entries before warning user

### Non-Functional Requirements

- [ ] Local audio storage survives app restart
- [ ] Queue persists across sessions (AsyncStorage)
- [ ] Retry attempts don't block UI
- [ ] Battery-efficient retry strategy

## 5. Technical Specification

### New Files to Create

- `src/services/offline/offlineQueue.ts` - Queue management
- `src/services/offline/networkMonitor.ts` - Network state
- `src/hooks/useOfflineSync.ts` - React hook for components
- `src/components/common/SyncIndicator.tsx` - UI component

### Data Model

```typescript
// Pending Entry in AsyncStorage
interface PendingEntry {
  id: string;
  localAudioUri: string;
  userId: string;
  checkInType: 'free' | 'guided';
  mood?: string;
  createdAt: string;
  retryCount: number;
  lastRetryAt?: string;
  status: 'pending' | 'uploading' | 'failed';
  error?: string;
}

// AsyncStorage key: '@offline_queue'
```

### Offline Queue Service

```typescript
// src/services/offline/offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@offline_queue';
const MAX_RETRIES = 5;
const BACKOFF_BASE = 1000; // 1 second

class OfflineQueueService {
  private queue: PendingEntry[] = [];
  private isProcessing = false;
  private listeners: Set<(queue: PendingEntry[]) => void> = new Set();

  async initialize(): Promise<void> {
    const stored = await AsyncStorage.getItem(QUEUE_KEY);
    this.queue = stored ? JSON.parse(stored) : [];
    this.startNetworkListener();
  }

  private startNetworkListener(): void {
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isProcessing) {
        this.processQueue();
      }
    });
  }

  async addToQueue(entry: Omit<PendingEntry, 'retryCount' | 'status'>): Promise<void> {
    const pendingEntry: PendingEntry = {
      ...entry,
      retryCount: 0,
      status: 'pending',
    };
    this.queue.push(pendingEntry);
    await this.persist();
    this.notifyListeners();
    this.processQueue();
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    this.isProcessing = true;

    for (const entry of this.queue.filter(e => e.status !== 'uploading')) {
      entry.status = 'uploading';
      this.notifyListeners();

      try {
        await this.uploadEntry(entry);
        this.queue = this.queue.filter(e => e.id !== entry.id);
        await this.persist();
        this.notifyListeners();
      } catch (error) {
        entry.status = 'failed';
        entry.retryCount++;
        entry.lastRetryAt = new Date().toISOString();
        entry.error = error instanceof Error ? error.message : 'Upload failed';
        
        if (entry.retryCount >= MAX_RETRIES) {
          // Keep in queue but mark as permanently failed
          entry.status = 'failed';
        }
        
        await this.persist();
        this.notifyListeners();

        // Exponential backoff for next retry
        const delay = Math.min(BACKOFF_BASE * Math.pow(2, entry.retryCount), 30000);
        setTimeout(() => this.processQueue(), delay);
      }
    }

    this.isProcessing = false;
  }

  private async uploadEntry(entry: PendingEntry): Promise<void> {
    // Upload to Firebase Storage
    // Create Firestore document
    // Trigger backend processing
  }

  private async persist(): Promise<void> {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }

  subscribe(listener: (queue: PendingEntry[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.queue]));
  }

  getQueue(): PendingEntry[] {
    return [...this.queue];
  }

  getPendingCount(): number {
    return this.queue.filter(e => e.status !== 'failed' || e.retryCount < MAX_RETRIES).length;
  }
}

export const offlineQueue = new OfflineQueueService();
```

### Sync Indicator Component

```typescript
// src/components/common/SyncIndicator.tsx
interface SyncIndicatorProps {
  pendingCount: number;
  onPress?: () => void;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ pendingCount, onPress }) => {
  if (pendingCount === 0) return null;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <AppText style={styles.text}>
        {pendingCount} {pendingCount === 1 ? 'entry' : 'entries'} syncing...
      </AppText>
    </TouchableOpacity>
  );
};
```

## 6. Acceptance Criteria

- [ ] AC1: Recording while offline saves to local storage
- [ ] AC2: Entry appears in journal list immediately (marked as "pending")
- [ ] AC3: When connection restored, upload starts automatically
- [ ] AC4: Sync indicator shows pending count in header
- [ ] AC5: Failed upload retries up to 5 times with backoff
- [ ] AC6: User can manually retry from journal list
- [ ] AC7: App restart resumes pending uploads
- [ ] AC8: Successfully synced entries update to "completed" status

## 7. Implementation Checklist

- [ ] Install @react-native-community/netinfo if not present
- [ ] Create offlineQueue service
- [ ] Create networkMonitor service
- [ ] Create useOfflineSync hook
- [ ] Create SyncIndicator component
- [ ] Modify VoiceJournalScreen to use offline queue
- [ ] Modify journalService to handle pending entries
- [ ] Update JournalListScreen to show pending entries
- [ ] Add sync indicator to HomeScreen header
- [ ] Test offline recording flow
- [ ] Test retry mechanism
- [ ] Test app restart with pending entries

---

# PRD 3: Dashboard Analytics Integration

## 1. Objective

Connect the Dashboard screen to the backend analytics functions to display mood trends, insights, recovery progress, and stats - enabling users to visualize their recovery journey.

## 2. User Story

As a recovering user, I want to see my mood trends and progress over time so that I can visualize my recovery and stay motivated by seeing measurable improvement.

## 3. Current State Analysis

**What Exists:**
- ✅ Backend functions: `getMoodTrends`, `getInsightsSummary`, `getRecoveryProgress`, `getPatternInsights`, `getWeeklySummary`
- ✅ DashboardScreen with basic UI structure
- ✅ Analytics types defined in backend

**What's Missing:**
- ❌ DashboardScreen doesn't call backend functions
- ❌ No mood trend chart visualization
- ❌ No insights display
- ❌ No recovery progress indicators
- ❌ No loading/error states for analytics
- ❌ Frontend analytics types not aligned with backend

## 4. Requirements

### Functional Requirements

- [ ] FR1: Dashboard loads mood trends for last 30 days on mount
- [ ] FR2: Mood trend chart displays with interactive data points
- [ ] FR3: Insights summary shows top topics and sentiment
- [ ] FR4: Recovery progress shows improvement indicators
- [ ] FR5: Stats section shows streak, total entries, voice minutes
- [ ] FR6: Pull-to-refresh reloads all analytics data
- [ ] FR7: Time period selector (7/14/30/90 days)
- [ ] FR8: Graceful handling of insufficient data (<3 entries)

### Non-Functional Requirements

- [ ] Analytics data cached for 5 minutes
- [ ] Loading skeleton while fetching
- [ ] Charts render smoothly (60fps)

## 5. Technical Specification

### Files to Create/Modify

- `src/services/analytics/dashboardAnalytics.ts` - API calls (NEW)
- `src/hooks/useDashboardAnalytics.ts` - Data fetching hook (NEW)
- `src/screens/dashboard/DashboardScreen.tsx` - Update to use analytics
- `src/components/dashboard/MoodTrendChart.tsx` - Chart component (NEW)
- `src/components/dashboard/InsightsSummary.tsx` - Insights display (NEW)
- `src/components/dashboard/RecoveryProgress.tsx` - Progress display (NEW)
- `src/types/analytics.ts` - Frontend analytics types (NEW)

### Frontend Analytics Types

```typescript
// src/types/analytics.ts
export interface MoodDataPoint {
  date: string;
  mood: string;
  moodScore?: number;
}

export interface MoodTrendsData {
  moodData: MoodDataPoint[];
  averages: {
    moodDistribution: Record<string, number>;
    averageMoodScore: number;
    totalEntries: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  insufficientData: boolean;
  periodStart: string;
  periodEnd: string;
}

export interface InsightsSummaryData {
  topTopics: string[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  suggestedActions: string[];
  totalEntries: number;
  streakDays: number;
  totalVoiceMinutes: number;
  averageMoodScore: number;
  insufficientData: boolean;
}

export interface RecoveryProgressData {
  overallScore: number;
  weeklyChange: number;
  milestones: {
    id: string;
    title: string;
    achieved: boolean;
    achievedAt?: string;
  }[];
  nextMilestone?: {
    id: string;
    title: string;
    progress: number;
  };
}
```

### Dashboard Analytics Service

```typescript
// src/services/analytics/dashboardAnalytics.ts
import { functions } from '@services/firebase/client';
import { httpsCallable } from 'firebase/functions';
import type { MoodTrendsData, InsightsSummaryData } from '@/types/analytics';

export async function fetchMoodTrends(days: number = 30): Promise<MoodTrendsData> {
  const fn = httpsCallable(functions, 'getMoodTrends');
  const result = await fn({ days });
  return result.data as MoodTrendsData;
}

export async function fetchInsightsSummary(days: number = 30): Promise<InsightsSummaryData> {
  const fn = httpsCallable(functions, 'getInsightsSummary');
  const result = await fn({ days });
  return result.data as InsightsSummaryData;
}

// ... other functions
```

### useDashboardAnalytics Hook

```typescript
// src/hooks/useDashboardAnalytics.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchMoodTrends, fetchInsightsSummary } from '@services/analytics/dashboardAnalytics';

export function useDashboardAnalytics(days: number = 30) {
  const [moodTrends, setMoodTrends] = useState<MoodTrendsData | null>(null);
  const [insights, setInsights] = useState<InsightsSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [moodData, insightsData] = await Promise.all([
        fetchMoodTrends(days),
        fetchInsightsSummary(days),
      ]);
      
      setMoodTrends(moodData);
      setInsights(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    moodTrends,
    insights,
    isLoading,
    error,
    refresh: fetchData,
  };
}
```

### Mood Trend Chart (using react-native-chart-kit or victory-native)

```typescript
// src/components/dashboard/MoodTrendChart.tsx
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface MoodTrendChartProps {
  data: MoodDataPoint[];
  trend: 'improving' | 'stable' | 'declining';
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ data, trend }) => {
  const chartData = {
    labels: data.slice(-7).map(d => formatDate(d.date)),
    datasets: [{
      data: data.slice(-7).map(d => d.moodScore || 5),
    }],
  };

  const trendColor = {
    improving: '#52C41A',
    stable: '#FAAD14',
    declining: '#FF4D4F',
  }[trend];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Mood Trend</AppText>
        <View style={[styles.trendBadge, { backgroundColor: trendColor }]}>
          <AppText style={styles.trendText}>{trend}</AppText>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={200}
        chartConfig={{
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};
```

## 6. Acceptance Criteria

- [ ] AC1: Dashboard shows loading skeleton on initial load
- [ ] AC2: Mood trend chart displays last 7 data points with trend indicator
- [ ] AC3: Insights section shows top 3 topics and sentiment breakdown
- [ ] AC4: Stats show streak days, total entries, voice minutes
- [ ] AC5: Time period selector changes data (7/14/30/90 days)
- [ ] AC6: Pull-to-refresh reloads all data
- [ ] AC7: Insufficient data state shows "Keep journaling to see trends"
- [ ] AC8: Error state shows retry button

## 7. Implementation Checklist

- [ ] Install chart library (react-native-chart-kit or victory-native)
- [ ] Create analytics types in `src/types/analytics.ts`
- [ ] Create dashboard analytics service
- [ ] Create useDashboardAnalytics hook
- [ ] Create MoodTrendChart component
- [ ] Create InsightsSummary component
- [ ] Create RecoveryProgress component
- [ ] Update DashboardScreen to use hook and components
- [ ] Add time period selector
- [ ] Add pull-to-refresh
- [ ] Add loading skeletons
- [ ] Add insufficient data state
- [ ] Test with various data scenarios

---

# TIER 2: CORE EXPERIENCE

---

# PRD 4: Real-time Transcription UI

## 1. Objective

Display real-time speech-to-text transcription in the Voice Journal screen while the user is recording, providing immediate feedback that their voice is being captured accurately.

## 2. User Story

As a user recording a voice journal, I want to see my words appear on screen as I speak so that I know my voice is being captured and can review what I'm saying in real-time.

## 3. Current State Analysis

**What Exists:**
- ✅ Deepgram streaming for Voice Conversation (`deepgramStream.ts`)
- ✅ Voice recording via expo-av
- ✅ Backend batch transcription

**What's Missing:**
- ❌ VoiceJournalScreen doesn't show real-time transcript
- ❌ No streaming transcription for journaling flow
- ❌ User sees nothing until recording stops

## 4. Requirements

### Functional Requirements

- [ ] FR1: Transcript text appears within 1-2 seconds of speaking
- [ ] FR2: Transcript scrolls automatically as new text is added
- [ ] FR3: User can manually scroll to review earlier parts
- [ ] FR4: Transcript persists after recording stops
- [ ] FR5: Visual indicator shows transcription status (listening/processing)
- [ ] FR6: Graceful fallback if streaming unavailable (use batch)
- [ ] FR7: Interim results shown immediately, replaced by final results

### Non-Functional Requirements

- [ ] UI remains responsive during transcription (60fps)
- [ ] Text appears within 2 seconds of speech
- [ ] Memory efficient for long recordings

## 5. Technical Specification

### Files to Modify/Create

- `src/screens/voice/VoiceJournalScreen.tsx` - Add transcript display
- `src/components/voice/LiveTranscript.tsx` - Transcript component
- `src/hooks/useRealtimeTranscription.ts` - Streaming hook
- `src/services/voice/journalTranscriptionStream.ts` - Adapted from deepgramStream

### LiveTranscript Component

```typescript
// src/components/voice/LiveTranscript.tsx
interface LiveTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error?: string | null;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  transcript,
  interimTranscript,
  isListening,
  error,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [transcript, interimTranscript, autoScroll]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setAutoScroll(isAtBottom);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Live Transcript</AppText>
        {isListening && (
          <View style={styles.listeningIndicator}>
            <Animated.View style={[styles.dot, pulseAnimation]} />
            <AppText style={styles.listeningText}>Listening...</AppText>
          </View>
        )}
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <AppText style={styles.transcript}>
          {transcript}
          <AppText style={styles.interim}>{interimTranscript}</AppText>
        </AppText>
        
        {!transcript && !interimTranscript && isListening && (
          <AppText style={styles.placeholder}>
            Start speaking and your words will appear here...
          </AppText>
        )}
      </ScrollView>
      
      {error && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color={theme.colors.error} />
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}
    </View>
  );
};
```

### useRealtimeTranscription Hook

```typescript
// src/hooks/useRealtimeTranscription.ts
export function useRealtimeTranscription() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startListening = useCallback(async () => {
    try {
      // Get streaming tokens
      const { deepgramApiKey } = await getStreamingTokens();
      
      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&smart_format=true&interim_results=true&punctuate=true`,
        ['token', deepgramApiKey]
      );

      ws.onopen = () => {
        setIsListening(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const text = data.channel?.alternatives?.[0]?.transcript || '';
        
        if (data.is_final) {
          setTranscript(prev => prev + text + ' ');
          setInterimTranscript('');
        } else {
          setInterimTranscript(text);
        }
      };

      ws.onerror = () => {
        setError('Transcription connection failed');
        setIsListening(false);
      };

      ws.onclose = () => {
        setIsListening(false);
      };

      wsRef.current = ws;
    } catch (err) {
      setError('Failed to start transcription');
    }
  }, []);

  const stopListening = useCallback(() => {
    wsRef.current?.close();
    setIsListening(false);
  }, []);

  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(audioData);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    sendAudio,
    clearTranscript,
  };
}
```

## 6. Acceptance Criteria

- [ ] AC1: When recording starts, "Listening..." indicator appears
- [ ] AC2: When user speaks, words appear within 2 seconds
- [ ] AC3: Interim (uncertain) text shows in lighter color
- [ ] AC4: Final text replaces interim text
- [ ] AC5: Transcript auto-scrolls to show latest text
- [ ] AC6: User can scroll up to review, auto-scroll pauses
- [ ] AC7: When user scrolls to bottom, auto-scroll resumes
- [ ] AC8: Final transcript passed to entry creation

## 7. Implementation Checklist

- [ ] Create LiveTranscript component
- [ ] Create useRealtimeTranscription hook
- [ ] Modify VoiceJournalScreen to include LiveTranscript
- [ ] Connect audio recording to streaming WebSocket
- [ ] Test interim vs final results handling
- [ ] Test auto-scroll behavior
- [ ] Test error handling and fallback
- [ ] Test long recording sessions (10+ minutes)

---

# PRD 5: Recovery Phase Intelligence

## 1. Objective

Implement recovery-phase-aware features that adapt the app experience based on where the user is in their recovery journey. This is the core differentiator that makes RecoverVoice unique from generic journaling apps.

## 2. User Story

As a user who is 3 weeks post-surgery, I want the app to understand that Week 3 challenges are different from Week 1 and provide relevant prompts and support for my current recovery phase.

## 3. Current State Analysis

**What Exists:**
- ✅ User's `surgeryDate` captured in profile
- ✅ `weeksIntoRecovery` calculated in backend
- ✅ `userContext` passed to Claude for responses

**What's Missing:**
- ❌ No phase-specific prompts on HomeScreen
- ❌ No adaptive guided check-in questions
- ❌ No phase milestones (Week 1, Week 4, Month 2, etc.)
- ❌ No phase-aware celebration messages
- ❌ Frontend doesn't calculate/display recovery week

## 4. Requirements

### Functional Requirements

- [ ] FR1: HomeScreen shows current recovery week/phase prominently
- [ ] FR2: Suggested prompts change based on recovery phase
- [ ] FR3: Guided check-in questions adapt to phase
- [ ] FR4: AI responses reference phase-specific challenges
- [ ] FR5: Milestones tied to recovery phases (Week 1 Complete, Month 1, etc.)
- [ ] FR6: Phase transition celebrations (entering Week 4, Month 2, etc.)

### Recovery Phases

| Phase | Weeks | Characteristics | Prompt Focus |
|-------|-------|-----------------|--------------|
| Acute | 0-2 | Pain, immobility, dependence | Pain management, accepting help |
| Early | 2-4 | Reality hits, motivation drops | Persistence, small wins |
| Middle | 4-8 | Slow progress, frustration | Patience, celebrating progress |
| Late | 8-12 | See improvement, fear of reinjury | Confidence, future planning |
| Maintenance | 12+ | Return to normal, fear recurrence | Habits, prevention |

## 5. Technical Specification

### Files to Create/Modify

- `src/utils/recoveryPhase.ts` - Phase calculation utilities (NEW)
- `src/config/recoveryPrompts.ts` - Phase-specific prompts (NEW)
- `src/hooks/useRecoveryPhase.ts` - Hook for phase data (NEW)
- `src/components/home/RecoveryPhaseCard.tsx` - Phase display (NEW)
- `src/screens/HomeScreen.tsx` - Add phase display and prompts

### Recovery Phase Utilities

```typescript
// src/utils/recoveryPhase.ts
export type RecoveryPhase = 'acute' | 'early' | 'middle' | 'late' | 'maintenance';

export interface RecoveryPhaseInfo {
  phase: RecoveryPhase;
  weekNumber: number;
  dayNumber: number;
  phaseName: string;
  phaseDescription: string;
  daysUntilNextPhase?: number;
  nextPhaseName?: string;
}

export function calculateRecoveryPhase(surgeryDate: Date): RecoveryPhaseInfo {
  const now = new Date();
  const diffTime = now.getTime() - surgeryDate.getTime();
  const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(dayNumber / 7);

  let phase: RecoveryPhase;
  let phaseName: string;
  let phaseDescription: string;

  if (weekNumber < 2) {
    phase = 'acute';
    phaseName = 'Acute Recovery';
    phaseDescription = 'Focus on rest and pain management';
  } else if (weekNumber < 4) {
    phase = 'early';
    phaseName = 'Early Recovery';
    phaseDescription = 'Building routine and persistence';
  } else if (weekNumber < 8) {
    phase = 'middle';
    phaseName = 'Active Recovery';
    phaseDescription = 'Progress may feel slow - celebrate small wins';
  } else if (weekNumber < 12) {
    phase = 'late';
    phaseName = 'Advanced Recovery';
    phaseDescription = 'Real progress visible - build confidence';
  } else {
    phase = 'maintenance';
    phaseName = 'Maintenance';
    phaseDescription = 'Focus on maintaining gains and prevention';
  }

  return {
    phase,
    weekNumber,
    dayNumber,
    phaseName,
    phaseDescription,
  };
}
```

### Phase-Specific Prompts

```typescript
// src/config/recoveryPrompts.ts
export const RECOVERY_PROMPTS: Record<RecoveryPhase, string[]> = {
  acute: [
    "How is your pain today compared to yesterday?",
    "What's one thing someone did that helped you today?",
    "How are you handling the dependency on others?",
    "What's been the hardest part of these first days?",
  ],
  early: [
    "What small victory can you celebrate today?",
    "How did PT go? What emotions came up?",
    "When do you feel most discouraged? Most hopeful?",
    "What helps you push through the tough moments?",
  ],
  middle: [
    "What progress have you noticed this week?",
    "How do you handle the frustration of slow progress?",
    "What has surprised you about your recovery?",
    "What's one thing you can do now that you couldn't before?",
  ],
  late: [
    "What activities are you looking forward to returning to?",
    "How has this experience changed your perspective?",
    "What fears do you have about reinjury?",
    "What advice would you give yourself from Week 1?",
  ],
  maintenance: [
    "How are you maintaining the habits you built?",
    "What lessons from recovery are you carrying forward?",
    "How do you handle setback fears?",
    "What does 'recovered' mean to you now?",
  ],
};
```

### RecoveryPhaseCard Component

```typescript
// src/components/home/RecoveryPhaseCard.tsx
export const RecoveryPhaseCard: React.FC<{ phaseInfo: RecoveryPhaseInfo }> = ({ phaseInfo }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.weekLabel}>Week {phaseInfo.weekNumber + 1}</AppText>
        <AppText style={styles.dayLabel}>Day {phaseInfo.dayNumber + 1}</AppText>
      </View>
      
      <AppText style={styles.phaseName}>{phaseInfo.phaseName}</AppText>
      <AppText style={styles.description}>{phaseInfo.phaseDescription}</AppText>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${getPhaseProgress(phaseInfo)}%` }]} />
      </View>
    </View>
  );
};
```

## 6. Acceptance Criteria

- [ ] AC1: HomeScreen shows "Week X, Day Y" prominently
- [ ] AC2: Phase name and description displayed
- [ ] AC3: Suggested prompts match current phase
- [ ] AC4: Guided check-in uses phase-specific questions
- [ ] AC5: AI responses acknowledge recovery phase when relevant
- [ ] AC6: Phase transition triggers celebration

## 7. Implementation Checklist

- [ ] Create recovery phase utilities
- [ ] Create phase-specific prompts config
- [ ] Create useRecoveryPhase hook
- [ ] Create RecoveryPhaseCard component
- [ ] Update HomeScreen with phase card
- [ ] Update suggested prompts based on phase
- [ ] Update guided check-in questions
- [ ] Update backend AI context with phase info
- [ ] Test phase transitions
- [ ] Add phase transition celebrations

---

# PRD 6: Notification System

## 1. Objective

Implement a notification system that sends daily reminders to help users maintain their journaling habit, with smart timing and personalized messages.

## 2. User Story

As a user recovering from surgery, I want to receive a gentle reminder each morning to journal so that I can maintain my daily habit even when I'm feeling unmotivated.

## 3. Current State Analysis

**What Exists:**
- ✅ Notification permissions requested
- ✅ Settings toggle for notifications
- ✅ expo-notifications available

**What's Missing:**
- ❌ No notification scheduling
- ❌ No reminder time preference storage
- ❌ No notification content personalization
- ❌ No streak-break notifications
- ❌ No milestone notifications

## 4. Requirements

### Functional Requirements

- [ ] FR1: Daily reminder notification at user-specified time (default 9 AM)
- [ ] FR2: User can set preferred reminder time in Settings
- [ ] FR3: Notification includes personalized message with name and streak
- [ ] FR4: Streak-break warning if missed yesterday
- [ ] FR5: Milestone celebration notifications (7-day streak, 30-day, etc.)
- [ ] FR6: Notifications disabled when user already journaled today
- [ ] FR7: Deep link from notification opens recording screen

### Non-Functional Requirements

- [ ] Notifications work when app is backgrounded
- [ ] Respect system Do Not Disturb settings
- [ ] Battery-efficient scheduling

## 5. Technical Specification

### Files to Create/Modify

- `src/services/notifications/notificationService.ts` - Core service (NEW)
- `src/hooks/useNotifications.ts` - React hook (NEW)
- `src/screens/settings/SettingsScreen.tsx` - Add time picker
- `src/types/user.ts` - Add notification preferences

### Notification Service

```typescript
// src/services/notifications/notificationService.ts
import * as Notifications from 'expo-notifications';

export interface NotificationPreferences {
  enabled: boolean;
  reminderTime: string; // "09:00" format
  streakReminders: boolean;
  milestoneAlerts: boolean;
}

class NotificationService {
  async initialize(): Promise<void> {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async scheduleDailyReminder(time: string, userName: string, streak: number): Promise<void> {
    // Cancel existing reminder
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');

    const [hours, minutes] = time.split(':').map(Number);
    
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    };

    const message = this.getDailyMessage(userName, streak);

    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-reminder',
      content: {
        title: "Time for your check-in ☀️",
        body: message,
        data: { screen: 'VoiceJournal' },
      },
      trigger,
    });
  }

  private getDailyMessage(name: string, streak: number): string {
    if (streak === 0) {
      return `Good morning${name ? `, ${name}` : ''}! Ready to start your journaling journey?`;
    } else if (streak === 1) {
      return `${name || 'Hey'}! You journaled yesterday. Let's keep that momentum going! 🔥`;
    } else {
      return `${name || 'Hey'}! You're on a ${streak}-day streak! Don't break the chain 🔥`;
    }
  }

  async scheduleStreakBreakWarning(userName: string): Promise<void> {
    // Schedule for 8 PM if user hasn't journaled today
    await Notifications.scheduleNotificationAsync({
      identifier: 'streak-warning',
      content: {
        title: "Don't lose your streak! 😢",
        body: `${userName || 'Hey'}, you haven't journaled today. Even a quick 30-second entry counts!`,
        data: { screen: 'VoiceJournal' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: calculateSecondsUntil8PM(),
      },
    });
  }

  async cancelStreakWarning(): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync('streak-warning');
  }
}

export const notificationService = new NotificationService();
```

### Notification Preferences in User Profile

```typescript
// Update src/types/user.ts
export interface UserPreferences {
  // ... existing
  notifications: {
    enabled: boolean;
    reminderTime: string; // "09:00"
    streakReminders: boolean;
    milestoneAlerts: boolean;
  };
}
```

## 6. Acceptance Criteria

- [ ] AC1: Daily notification fires at user-specified time
- [ ] AC2: Notification includes user's name and streak count
- [ ] AC3: Tapping notification opens voice recording screen
- [ ] AC4: Settings allows changing reminder time
- [ ] AC5: Toggling off disables all scheduled notifications
- [ ] AC6: Streak warning appears at 8 PM if user hasn't journaled

## 7. Implementation Checklist

- [ ] Create notification service
- [ ] Create useNotifications hook
- [ ] Add time picker to Settings
- [ ] Store notification preferences in Firestore
- [ ] Schedule daily reminder on preference change
- [ ] Implement streak warning logic
- [ ] Add deep linking from notifications
- [ ] Test notification scheduling
- [ ] Test notification content variations
- [ ] Test app backgrounded behavior

---

# TIER 3: QUALITY & MEASUREMENT

---

# PRD 7: Analytics & Crash Reporting

## 1. Objective

Implement analytics tracking and crash reporting to measure success metrics defined in APP_PLAN and quickly identify and fix production issues.

## 2. User Story

As the product team, we need to track key metrics (paywall conversion, day 2 return, entry completion) to understand user behavior and measure success.

## 3. Requirements

### Events to Track

| Event | Properties | Purpose |
|-------|------------|---------|
| `app_opened` | source (notification, organic) | Engagement |
| `onboarding_step_viewed` | step_name | Funnel |
| `paywall_viewed` | - | Conversion |
| `purchase_initiated` | product_id | Revenue |
| `purchase_completed` | product_id, price | Revenue |
| `recording_started` | type (free, guided) | Engagement |
| `recording_completed` | duration_seconds | Engagement |
| `entry_saved` | mood, check_in_type | Retention |
| `dashboard_viewed` | days_selected | Engagement |
| `error_occurred` | error_type, screen | Quality |

### Crash Reporting

- [ ] Capture all JavaScript errors
- [ ] Capture native crashes
- [ ] Include user context (userId, recoveryPhase)
- [ ] Include breadcrumbs (last 10 actions)

## 4. Technical Specification

### Files to Create/Modify

- `src/services/analytics/analyticsService.ts` - Update with real implementation
- `src/providers/AnalyticsProvider.tsx` - Context for tracking (NEW)
- `src/hooks/useAnalytics.ts` - Hook for components (NEW)

### Implementation Options

**Option A: Firebase Analytics + Crashlytics (Recommended for MVP)**
- Free
- Already have Firebase
- Good enough for launch

**Option B: Mixpanel + Sentry**
- Better analytics UI
- More expensive
- Consider post-launch

### Analytics Service

```typescript
// src/services/analytics/analyticsService.ts
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

class AnalyticsService {
  async initialize(): Promise<void> {
    await analytics().setAnalyticsCollectionEnabled(true);
    await crashlytics().setCrashlyticsCollectionEnabled(true);
  }

  async setUser(userId: string, properties?: Record<string, string>): Promise<void> {
    await analytics().setUserId(userId);
    await crashlytics().setUserId(userId);
    
    if (properties) {
      await analytics().setUserProperties(properties);
      Object.entries(properties).forEach(([key, value]) => {
        crashlytics().setAttribute(key, value);
      });
    }
  }

  async track(event: string, properties?: Record<string, unknown>): Promise<void> {
    await analytics().logEvent(event, properties);
  }

  async trackScreen(screenName: string): Promise<void> {
    await analytics().logScreenView({ screen_name: screenName });
  }

  logError(error: Error, context?: Record<string, string>): void {
    crashlytics().recordError(error);
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        crashlytics().setAttribute(key, value);
      });
    }
  }

  addBreadcrumb(message: string): void {
    crashlytics().log(message);
  }
}

export const analyticsService = new AnalyticsService();
```

## 5. Implementation Checklist

- [ ] Install @react-native-firebase/analytics
- [ ] Install @react-native-firebase/crashlytics
- [ ] Configure Firebase project for analytics
- [ ] Update analytics service with real implementation
- [ ] Add tracking calls to key screens
- [ ] Add error boundary with crash reporting
- [ ] Test event tracking in Firebase console
- [ ] Test crash reporting
- [ ] Create analytics dashboard in Firebase

---

# PRD 8: Milestone & Celebration System

## 1. Objective

Implement a milestone tracking and celebration system that recognizes user achievements and motivates continued engagement.

## 2. User Story

As a user, I want to be celebrated when I reach milestones (7-day streak, 30 entries, etc.) so that I feel accomplished and motivated to continue.

## 3. Requirements

### Milestones to Track

| Milestone | Trigger | Celebration |
|-----------|---------|-------------|
| First Entry | Complete first journal | Full screen celebration |
| 3-Day Streak | 3 consecutive days | Toast + badge |
| 7-Day Warrior | 7-day streak | Full screen + badge |
| 2-Week Champion | 14-day streak | Full screen + badge |
| Month Master | 30-day streak | Full screen + badge |
| 50 Entries | 50 total entries | Toast + badge |
| 100 Entries | 100 total entries | Full screen + badge |
| Week 4 Complete | 4 weeks into recovery | Phase celebration |
| Month 2 Complete | 8 weeks into recovery | Phase celebration |

### Functional Requirements

- [ ] FR1: Milestone detection after each entry save
- [ ] FR2: CelebrationScreen shows achievement details
- [ ] FR3: Badges visible in dashboard
- [ ] FR4: Milestone history viewable in settings
- [ ] FR5: Push notification for milestone (if enabled)

## 4. Technical Specification

### Files to Create/Modify

- `src/config/milestones.ts` - Milestone definitions (NEW)
- `src/services/milestones/milestoneService.ts` - Detection logic (NEW)
- `src/hooks/useMilestones.ts` - Hook for components (NEW)
- `src/screens/voice/CelebrationScreen.tsx` - Update with milestone data
- `src/components/dashboard/MilestonesBadges.tsx` - Badge display (NEW)

### Milestone Configuration

```typescript
// src/config/milestones.ts
export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'entries' | 'recovery_phase';
  threshold: number;
  celebrationType: 'toast' | 'full_screen';
}

export const MILESTONES: MilestoneDefinition[] = [
  {
    id: 'first_entry',
    title: 'First Entry Complete!',
    description: "You've started your recovery journey",
    icon: '🎉',
    type: 'entries',
    threshold: 1,
    celebrationType: 'full_screen',
  },
  {
    id: 'streak_3',
    title: '3-Day Streak!',
    description: "You're building a habit",
    icon: '🔥',
    type: 'streak',
    threshold: 3,
    celebrationType: 'toast',
  },
  {
    id: 'streak_7',
    title: '7-Day Warrior',
    description: "A full week of consistency!",
    icon: '⚔️',
    type: 'streak',
    threshold: 7,
    celebrationType: 'full_screen',
  },
  // ... more milestones
];
```

### Milestone Service

```typescript
// src/services/milestones/milestoneService.ts
export class MilestoneService {
  async checkMilestones(
    stats: UserStats,
    achievedMilestones: string[]
  ): Promise<MilestoneDefinition | null> {
    for (const milestone of MILESTONES) {
      if (achievedMilestones.includes(milestone.id)) continue;

      const achieved = this.checkMilestone(milestone, stats);
      if (achieved) {
        return milestone;
      }
    }
    return null;
  }

  private checkMilestone(milestone: MilestoneDefinition, stats: UserStats): boolean {
    switch (milestone.type) {
      case 'streak':
        return stats.streakDays >= milestone.threshold;
      case 'entries':
        return stats.totalEntries >= milestone.threshold;
      case 'recovery_phase':
        return stats.weeksIntoRecovery >= milestone.threshold;
      default:
        return false;
    }
  }

  async markAchieved(userId: string, milestoneId: string): Promise<void> {
    await updateDoc(doc(db, 'users', userId), {
      achievedMilestones: arrayUnion(milestoneId),
      [`milestoneAchievedAt.${milestoneId}`]: serverTimestamp(),
    });
  }
}
```

## 5. Implementation Checklist

- [ ] Create milestone definitions
- [ ] Create milestone service
- [ ] Create useMilestones hook
- [ ] Update CelebrationScreen with milestone data
- [ ] Add milestone check after entry save
- [ ] Create MilestonesBadges component
- [ ] Add badges to Dashboard
- [ ] Add milestone history to Settings
- [ ] Test all milestone triggers
- [ ] Add milestone notifications

---

# PRD 9: Standardized Empty/Error State Components

## 1. Objective

Create reusable, consistent UI components for empty states and error states across the app.

## 2. Current State

**Partially Implemented:**
- `src/components/common/EmptyState.tsx` ✅
- `src/components/common/ErrorState.tsx` ✅
- `src/components/common/LoadingState.tsx` ✅
- `src/components/common/NetworkErrorState.tsx` ✅
- `src/components/common/StateContainer.tsx` ✅

**Remaining:**
- [ ] Integrate into JournalListScreen
- [ ] Integrate into DashboardScreen
- [ ] Integrate into EntryDetailScreen
- [ ] Add offline-specific empty state

## 3. Implementation Checklist

- [ ] Review existing components for consistency
- [ ] Add offline state variant
- [ ] Integrate StateContainer into JournalListScreen
- [ ] Integrate StateContainer into DashboardScreen
- [ ] Test all state variations

---

# TIER 4: SECURITY & POLISH

---

# PRD 10: API Security Hardening

## 1. Objective

Secure the streaming tokens endpoint to prevent API key abuse.

## 2. Current Issue

`getStreamingTokens` returns raw Deepgram/ElevenLabs API keys to the client. Anyone can extract these and rack up charges.

## 3. Solution Options

**Option A: Deepgram Temporary Keys (Recommended)**
Use Deepgram's API to generate temporary, scoped keys.

**Option B: Proxy All Requests**
Route all audio through Firebase Functions (higher latency, higher cost).

**Option C: IP/Usage Monitoring**
Keep current approach but add aggressive rate limiting and usage alerts.

## 4. Implementation (Option A)

```typescript
// Update getStreamingTokens to use temporary keys
export const getStreamingTokens = functions.https.onCall(async (data, context) => {
  const userId = requireAuth(context);
  
  // Generate temporary Deepgram key
  const response = await fetch('https://api.deepgram.com/v1/projects/{projectId}/keys', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: `temp-key-${userId}`,
      scopes: ['usage:write'],
      time_to_live_in_seconds: 3600, // 1 hour
    }),
  });
  
  const tempKey = await response.json();
  
  return {
    deepgramApiKey: tempKey.key,
    expiresAt: Date.now() + 3600 * 1000,
  };
});
```

## 5. Implementation Checklist

- [ ] Research Deepgram temporary key API
- [ ] Implement temporary key generation
- [ ] Update client to handle key expiration/refresh
- [ ] Add usage monitoring alerts
- [ ] Test key rotation

---

# PRD 11: Type Safety & Shared Contracts

## 1. Objective

Establish a single source of truth for TypeScript types shared between frontend and backend.

## 2. Current Issue

Types are duplicated/split:
- `shared/types.ts` (basic types)
- `functions/src/types/shared.ts` (backend types)
- `functions/src/types/analytics.ts` (analytics types)
- `src/types/*.ts` (frontend types)

Risk of drift causing runtime errors.

## 3. Solution

Create a shared types package or use build-time type generation.

### Approach: Shared Types Directory

```
shared/
├── types/
│   ├── journal.ts
│   ├── user.ts
│   ├── analytics.ts
│   ├── subscription.ts
│   └── index.ts
```

Both frontend and backend import from this location.

### Implementation

```typescript
// shared/types/journal.ts
export interface JournalEntry {
  id: string;
  userId: string;
  audioUrl?: string;
  localAudioUri?: string;
  duration: number;
  transcript?: string;
  aiResponse?: string;
  aiResponseAudioUrl?: string;
  transcriptionStatus: 'pending' | 'completed' | 'failed';
  aiResponseStatus: 'pending' | 'completed' | 'failed';
  processingStage?: ProcessingStatus;
  error?: ProcessingError;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  checkInType: 'free' | 'guided';
  mood?: MoodLevel;
  moodScore?: number;
  tags?: string[];
  insights?: EntryInsights;
  enhancedInsights?: EnhancedInsights;
  recoveryMetrics?: RecoveryMetrics;
}

// ... all shared types
```

## 4. Implementation Checklist

- [ ] Audit all type definitions across codebase
- [ ] Consolidate into shared/types/
- [ ] Update frontend imports
- [ ] Update backend imports
- [ ] Add TypeScript path mapping
- [ ] Verify no type drift
- [ ] Add CI check for type consistency

---

# Implementation Priority Matrix

## Must Complete Before Launch

| PRD | Feature | Effort | Impact | Priority |
|-----|---------|--------|--------|----------|
| 1 | Paywall Purchase Flow | Medium | Critical | P0 |
| 2 | Offline Support | High | Critical | P0 |
| 3 | Dashboard Analytics | Medium | High | P0 |

## Should Complete Before Launch

| PRD | Feature | Effort | Impact | Priority |
|-----|---------|--------|--------|----------|
| 4 | Real-time Transcription | Medium | High | P1 |
| 5 | Recovery Phase Intelligence | Medium | High | P1 |
| 6 | Notification System | Medium | Medium | P1 |

## Complete During Beta

| PRD | Feature | Effort | Impact | Priority |
|-----|---------|--------|--------|----------|
| 7 | Analytics & Crash Reporting | Low | Medium | P2 |
| 8 | Milestone System | Medium | Medium | P2 |
| 9 | Empty/Error States | Low | Low | P2 |
| 10 | API Security | Medium | Medium | P2 |
| 11 | Type Safety | Low | Low | P2 |

---

## Recommended Sprint Plan

### Sprint 1 (Week 1-2): Launch Blockers
- PRD 1: Paywall Purchase Flow
- PRD 3: Dashboard Analytics Integration
- Start PRD 2: Offline Support (foundation)

### Sprint 2 (Week 3-4): Core Experience
- Complete PRD 2: Offline Support
- PRD 4: Real-time Transcription
- PRD 5: Recovery Phase Intelligence

### Sprint 3 (Week 5-6): Quality & Polish
- PRD 6: Notification System
- PRD 7: Analytics & Crash Reporting
- PRD 8: Milestone System

### Sprint 4 (Week 7-8): Security & Launch Prep
- PRD 9: Empty/Error States (finalize)
- PRD 10: API Security
- PRD 11: Type Safety
- App Store submission preparation

---

# TIER 5: COMPETITIVE DIFFERENTIATION (Mindsera Alignment)

These features align RecoverVoice with best-in-class mental fitness apps like Mindsera while maintaining our recovery-specific focus.

---

# PRD 12: Recovery Frameworks System

## 1. Objective

Implement a structured journaling system with 7 recovery-specific frameworks that guide users through different types of reflection, inspired by Mindsera's mental models but tailored for physical recovery journeys.

## 2. User Story

As a user recovering from injury/surgery, I want to choose from structured journaling frameworks so that I get guided prompts for specific challenges (pain days, PT sessions, fear processing) rather than facing a blank page.

## 3. Current State Analysis

**What Exists:**
- ✅ Free-form voice journaling
- ✅ Basic prompt suggestions on home screen
- ✅ Single AI response format

**What's Missing:**
- ❌ Structured frameworks with sequential prompts
- ❌ Framework selection screen
- ❌ Phase-appropriate framework suggestions
- ❌ Data extraction from framework responses
- ❌ Framework-specific AI response guidelines

## 4. Requirements

### Functional Requirements

- [ ] FR1: Framework selection screen after "Start Entry" tap
- [ ] FR2: 7 frameworks implemented:
  - Daily Recovery Check-In (default)
  - Pain Processing Protocol
  - PT Session Reflection
  - Fear & Worry Inventory
  - Support Network Audit
  - Progress & Gratitude Review
  - Identity & Meaning Making
- [ ] FR3: Sequential prompt display during recording
- [ ] FR4: Progress indicator showing current/total prompts
- [ ] FR5: Framework-specific AI response generation
- [ ] FR6: Extracted data points stored with entry
- [ ] FR7: Smart framework suggestions based on:
  - Recovery phase
  - Recent pain levels
  - Time of day / schedule
  - Detected keywords in recent entries

### Non-Functional Requirements

- [ ] Framework loads in < 500ms
- [ ] Smooth transitions between prompts
- [ ] Works offline (framework data bundled)
- [ ] Accessible prompt text (large, readable)

## 5. Technical Specification

### Files Created

```
src/types/frameworks.ts           - Type definitions
src/data/frameworks.ts            - Framework definitions & AI perspectives
src/components/frameworks/
├── FrameworkSelector.tsx         - Framework selection UI
├── FrameworkPromptCard.tsx       - Individual prompt display
├── PerspectiveSelector.tsx       - AI perspective selection
└── index.ts                      - Exports
```

### Data Model Extension

```typescript
// Extend JournalEntry with framework data
interface FrameworkEntryData {
  frameworkId: FrameworkId;
  frameworkName: string;
  promptResponses: {
    promptId: string;
    promptText: string;
    response: string;
    timestamp: Date;
  }[];
  extractedData: {
    key: string;
    value: string | number | boolean;
    confidence: number;
  }[];
}

// JournalEntry.frameworkData?: FrameworkEntryData
```

### AI System Prompt Extension

```typescript
// Each framework adds to the system prompt:
const frameworkPromptAddition = framework.aiGuidance.systemPromptAddition;

// Combined with base system prompt for recovery-specific AI
```

## 6. Implementation Checklist

- [x] Create framework type definitions
- [x] Define all 7 frameworks with prompts
- [x] Build FrameworkSelector component
- [x] Build FrameworkPromptCard component
- [ ] Integrate into recording flow
- [ ] Update AI service with framework-specific prompts
- [ ] Store framework data in Firestore
- [ ] Implement framework suggestion logic
- [ ] Add analytics for framework usage

---

# PRD 13: AI Perspectives (Multiple Minds)

## 1. Objective

Implement a system where users can choose from multiple AI "perspectives" (similar to Mindsera's "Minds" feature) - different AI personas that respond with different tones and focuses.

## 2. User Story

As a user, I want to choose which type of AI perspective responds to my journal so that I can get advice from a "PT Coach" when I need motivation, or a "Therapist" when I need deeper reflection.

## 3. Current State Analysis

**What Exists:**
- ✅ Single AI companion voice
- ✅ Claude API integration

**What's Missing:**
- ❌ Multiple AI personas/perspectives
- ❌ Perspective selection UI
- ❌ Persona-specific system prompts
- ❌ Premium gating for additional perspectives

## 4. Requirements

### Functional Requirements

- [ ] FR1: 7 AI Perspectives available:
  - Compassionate Companion (default, free)
  - PT Coach (premium)
  - Therapist Mind (premium)
  - Fellow Recoverer (premium)
  - Medical Explainer (premium)
  - Future Self (premium)
  - Stoic Mentor (premium)
- [ ] FR2: Perspective selector in recording flow
- [ ] FR3: Compact selector for quick switching
- [ ] FR4: Each perspective has unique system prompt
- [ ] FR5: Premium perspectives gated for subscribers
- [ ] FR6: Selected perspective stored with entry

### Non-Functional Requirements

- [ ] Perspective switching is instant
- [ ] Response quality consistent across perspectives
- [ ] Clear differentiation between perspective tones

## 5. Technical Specification

### Files Created

```
src/components/frameworks/PerspectiveSelector.tsx
src/data/frameworks.ts (includes aiPerspectives)
```

### Perspective System Prompts

```typescript
// Example: Fellow Recoverer
systemPrompt: `You are a fellow recoverer perspective - someone who 
understands the journey from personal experience. You validate that 
this is hard, share that the feelings are normal, and offer the kind 
of support that only someone who's been there can give. You're real, 
not clinical.`
```

### API Integration

```typescript
// When generating AI response:
const perspective = getPerspectiveById(entry.selectedPerspective);
const systemPrompt = baseSystemPrompt + '\n\n' + perspective.systemPrompt;

// Pass to Claude API
```

## 6. Implementation Checklist

- [x] Define perspective types and data
- [x] Build PerspectiveSelector component
- [x] Build CompactPerspectiveSelector variant
- [ ] Integrate with AI service
- [ ] Add premium gating
- [ ] Store selected perspective with entries
- [ ] Analytics for perspective usage

---

# PRD 14: Science-Backed Authority Marketing

## 1. Objective

Add research citations and statistics throughout the app to build credibility and trust, matching the authority positioning of Mindsera.

## 2. User Story

As a potential subscriber, I want to see evidence that journaling actually works for recovery so that I feel confident investing in the app.

## 3. Requirements

### Content Updates

- [ ] Add science statistics to PaywallScreen
- [ ] Add research citations to onboarding slides
- [ ] Create authority section in marketing
- [ ] Add appropriate disclaimers

### Key Statistics to Include

| Claim | Use Location |
|-------|--------------|
| "85% report better mental health" | Paywall headline |
| "Reduces anxiety by 30%" | Paywall benefits |
| "40% better PT adherence with support" | Value proposition |
| "Week 2-4 is when support fades" | Urgency messaging |

### Implementation

See `MARKETING_PSYCHOLOGY.md` Section 11 for complete statistics and sources.

## 4. Implementation Checklist

- [x] Research and document science claims
- [x] Add to MARKETING_PSYCHOLOGY.md
- [ ] Update PaywallScreen with statistics
- [ ] Update onboarding with research backing
- [ ] Add disclaimers to appropriate screens

---

# Updated Implementation Priority Matrix

## Competitive Features (Post-Launch or Premium)

| PRD | Feature | Effort | Impact | Priority |
|-----|---------|--------|--------|----------|
| 12 | Recovery Frameworks | High | Very High | P1 |
| 13 | AI Perspectives | Medium | High | P2 |
| 14 | Science Marketing | Low | High | P1 |

## Recommended Addition to Sprint Plan

### Sprint 5 (Week 9-10): Competitive Differentiation
- PRD 12: Recovery Frameworks integration
- PRD 14: Science marketing implementation
- PRD 13: AI Perspectives (premium feature)

---

## References

- Architecture: @ARCHITECTURE_DECISIONS.md
- Backend: @BACKEND_PLAN.md
- UI: @APP_PLAN.md
- Code Standards: @.cursorrules
- Launch Plan: @APP_STORE_LAUNCH_PLAN.md
- Recovery Frameworks: @.cursor/RECOVERY_FRAMEWORKS.md
- Marketing Psychology: @.cursor/MARKETING_PSYCHOLOGY.md
