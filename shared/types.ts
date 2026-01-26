/**
 * Shared Types
 *
 * This file contains TypeScript types shared between frontend and backend.
 * Both `src/` and `functions/src/` should import from this file to ensure
 * type consistency across the codebase.
 *
 * IMPORTANT: When modifying types here, ensure both frontend and backend
 * are updated to handle any breaking changes.
 */

// ============================================
// Processing & Status Types
// ============================================

export type ProcessingStatus =
  | 'pending'
  | 'uploading'
  | 'transcribing'
  | 'analyzing'
  | 'synthesizing'
  | 'completed'
  | 'failed';

export interface ProcessingError {
  stage: ProcessingStatus;
  message: string;
  timestamp: number;
}

// ============================================
// Mood & Sentiment Types
// ============================================

export type MoodLevel =
  | 'very_sad'
  | 'sad'
  | 'neutral'
  | 'happy'
  | 'very_happy';

export type SentimentType = 'positive' | 'neutral' | 'negative';

// ============================================
// Recovery Types
// ============================================

export type RecoveryPhase = 'acute' | 'early' | 'middle' | 'late' | 'maintenance';

export interface RecoveryMetrics {
  painLevel?: number; // 1-10
  mobilityLevel?: number; // 1-10
  energyLevel?: number; // 1-10
  sleepQuality?: number; // 1-10
  ptAdherence?: number; // 0-100%
}

export interface EnhancedInsights {
  keyTopics: string[];
  sentiment: SentimentType;
  emotionalState: string;
  recoveryIndicators: string[];
  suggestedActions: string[];
  copingStrategies?: string[];
  progressIndicators?: string[];
}

// ============================================
// Journal Entry Types
// ============================================

export interface JournalEntry {
  id: string;
  userId: string;

  // Audio Source
  audioUrl?: string;
  localAudioUri?: string; // Frontend only - local file path
  duration: number; // seconds

  // Content
  transcript?: string;
  aiResponse?: string;
  aiResponseAudioUrl?: string;

  // Status
  transcriptionStatus: 'pending' | 'completed' | 'failed';
  aiResponseStatus: 'pending' | 'completed' | 'failed';
  processingStage?: ProcessingStatus;
  error?: ProcessingError;

  // Metadata
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;

  // Context
  checkInType: 'free' | 'guided';
  mood?: MoodLevel;
  moodScore?: number; // 1-10
  tags?: string[];

  // Insights (legacy format for backward compatibility)
  insights?: {
    keyTopics: string[];
    sentiment: SentimentType;
    suggestedActions?: string[];
  };

  // Enhanced insights (new format)
  enhancedInsights?: EnhancedInsights;

  // Recovery metrics
  recoveryMetrics?: RecoveryMetrics;
}

// Firestore Timestamp type for compatibility
export interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

// ============================================
// User Types
// ============================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;

  // Recovery context
  recoveryContext?: {
    injuryType?: string;
    injuryDescription?: string;
    surgeryDate?: string; // ISO date string
    biggestStruggle?: string;
    weeksIntoRecovery?: number;
  };

  // Preferences
  preferences?: UserPreferences;

  // Stats
  stats?: UserStats;

  // Subscription (synced from RevenueCat)
  subscription?: UserSubscription;

  // Milestones
  achievedMilestones?: string[];
  milestoneAchievedAt?: Record<string, Date | FirestoreTimestamp>;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  reminderTime?: string; // "HH:MM" format
  streakReminders: boolean;
  milestoneAlerts: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export interface UserStats {
  totalEntries: number;
  totalVoiceMinutes: number;
  streakDays: number;
  longestStreak: number;
  lastEntryDate?: Date | FirestoreTimestamp;
  currentPhase?: RecoveryPhase;
}

export interface UserSubscription {
  isSubscribed: boolean;
  status: SubscriptionStatus;
  productId?: string;
  expirationDate?: Date | FirestoreTimestamp;
  willRenew: boolean;
  platform?: 'ios' | 'android';
  updatedAt: Date | FirestoreTimestamp;
}

export type SubscriptionStatus =
  | 'none'
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'expired'
  | 'grace_period';

// ============================================
// Analytics Types
// ============================================

export interface MoodDataPoint {
  date: string; // ISO date string
  mood: MoodLevel;
  moodScore?: number;
}

export interface MoodTrendsResponse {
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

export interface InsightsSummaryResponse {
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

export interface RecoveryProgressResponse {
  overallScore: number;
  weeklyChange: number;
  phases: {
    current: RecoveryPhase;
    daysInPhase: number;
    daysUntilNext?: number;
  };
  metrics: {
    pain: { current: number; change: number };
    mobility: { current: number; change: number };
    mood: { current: number; change: number };
  };
  milestones: {
    achieved: string[];
    next?: { id: string; title: string; progress: number };
  };
  insufficientData: boolean;
}

export interface PatternInsightsResponse {
  correlations: {
    description: string;
    strength: 'strong' | 'moderate' | 'weak';
  }[];
  triggers: {
    positive: string[];
    negative: string[];
  };
  recommendations: string[];
  weeklyPatterns: {
    bestDay: string;
    worstDay: string;
    pattern: string;
  };
  insufficientData: boolean;
}

export interface WeeklySummaryResponse {
  weekStart: string;
  weekEnd: string;
  entryCount: number;
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  highlights: string[];
  challenges: string[];
  aiSummary: string;
  insufficientData: boolean;
}

// ============================================
// Conversation Types
// ============================================

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ConversationSummary {
  transcript: string;
  aiSummary: string;
  mood?: MoodLevel;
  moodScore?: number;
  keyTopics: string[];
  actionItems?: string[];
  duration: number;
}

// ============================================
// Milestone Types
// ============================================

export type MilestoneType = 'streak' | 'entries' | 'recovery_phase' | 'engagement';

export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: MilestoneType;
  threshold: number;
  celebrationType: 'toast' | 'full_screen';
}

export interface AchievedMilestone {
  id: string;
  achievedAt: Date | FirestoreTimestamp;
}

// ============================================
// Offline Queue Types
// ============================================

export type PendingEntryStatus = 'pending' | 'uploading' | 'failed';

export interface PendingEntry {
  id: string;
  localAudioUri: string;
  userId: string;
  checkInType: 'free' | 'guided';
  mood?: MoodLevel;
  moodScore?: number;
  transcript?: string; // From real-time transcription
  createdAt: string; // ISO string
  retryCount: number;
  lastRetryAt?: string;
  status: PendingEntryStatus;
  error?: string;
}

// ============================================
// API Request/Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
}

// Analytics request types
export interface MoodTrendsRequest {
  days?: number; // 7, 14, 30, 90
}

export interface InsightsSummaryRequest {
  days?: number;
}

export interface RecoveryProgressRequest {
  days?: number;
}

export interface PatternInsightsRequest {
  days?: number;
}

export interface WeeklySummaryRequest {
  weekOffset?: number; // 0 = current week, 1 = last week, etc.
}

// ============================================
// Notification Types
// ============================================

export interface NotificationPayload {
  title: string;
  body: string;
  data?: {
    screen?: string;
    entryId?: string;
    milestoneId?: string;
  };
}

export type NotificationType =
  | 'daily_reminder'
  | 'streak_warning'
  | 'milestone_achieved'
  | 'weekly_summary';

// ============================================
// Type Guards
// ============================================

export function isFirestoreTimestamp(value: unknown): value is FirestoreTimestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as FirestoreTimestamp).toDate === 'function'
  );
}

export function toDate(value: Date | FirestoreTimestamp | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (isFirestoreTimestamp(value)) return value.toDate();
  return undefined;
}

// ============================================
// Constants
// ============================================

export const MOOD_LABELS: Record<MoodLevel, string> = {
  very_sad: 'Very Sad',
  sad: 'Sad',
  neutral: 'Neutral',
  happy: 'Happy',
  very_happy: 'Very Happy',
};

export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  very_sad: '😢',
  sad: '😐',
  neutral: '🙂',
  happy: '😊',
  very_happy: '✨',
};

export const RECOVERY_PHASE_INFO: Record<RecoveryPhase, { name: string; description: string; weekRange: string }> = {
  acute: {
    name: 'Acute Recovery',
    description: 'Focus on rest and pain management',
    weekRange: 'Weeks 1-2',
  },
  early: {
    name: 'Early Recovery',
    description: 'Building routine and persistence',
    weekRange: 'Weeks 2-4',
  },
  middle: {
    name: 'Active Recovery',
    description: 'Progress may feel slow - celebrate small wins',
    weekRange: 'Weeks 4-8',
  },
  late: {
    name: 'Advanced Recovery',
    description: 'Real progress visible - build confidence',
    weekRange: 'Weeks 8-12',
  },
  maintenance: {
    name: 'Maintenance',
    description: 'Focus on maintaining gains and prevention',
    weekRange: 'Week 12+',
  },
};
