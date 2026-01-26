/**
 * Journal Types for Re:Claim
 *
 * Re:Claim focuses on the MENTAL side of recovery. These types capture
 * not just mood, but the full emotional journey: hope, fear, identity,
 * connection, and progress toward reclaiming their life.
 */

import type { Timestamp } from 'firebase/firestore';
import type { FrameworkId, PerspectiveId } from './frameworks';

// ============================================
// Core Enums
// ============================================

export type MoodLevel = 'sad' | 'neutral' | 'hopeful' | 'grateful' | 'energized' | 'anxious';

export type EntryStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ProcessingStage =
  | 'uploading'
  | 'transcribing'
  | 'analyzing'
  | 'synthesizing'
  | 'completed'
  | 'failed';

/** Emotional themes detected in journal entries */
export type EmotionalTheme =
  | 'frustration'
  | 'fear'
  | 'grief'
  | 'hope'
  | 'gratitude'
  | 'determination'
  | 'isolation'
  | 'acceptance'
  | 'celebration';

/** Recovery phase based on timeline and content */
export type RecoveryPhase =
  | 'acute'
  | 'subacute'
  | 'rehabilitation'
  | 'return_to_activity'
  | 'maintenance';

export type TrendDirection = 'improving' | 'stable' | 'declining';

// ============================================
// Recovery-Specific Metrics (NEW)
// ============================================

/**
 * Recovery wellness metrics - the mental side of recovery
 * These go beyond basic mood to track the full emotional journey
 */
export interface RecoveryMetrics {
  /** How hopeful about recovery (1-10) */
  hopeLevel?: number;
  /** Energy/fatigue level (1-10) */
  energyLevel?: number;
  /** Fear of re-injury (1-10, higher = more fear) */
  fearLevel?: number;
  /** Feeling like themselves (1-10) */
  identityScore?: number;
  /** Social connection/support (1-10) */
  connectionScore?: number;
  /** Sleep quality impact (1-10) */
  sleepQuality?: number;
  /** Physical pain level (1-10) */
  painLevel?: number;
}

// ============================================
// Insights Types
// ============================================

/** Basic insights (legacy) */
export interface EntryInsights {
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions?: string[];
}

/**
 * Enhanced AI-extracted insights (NEW)
 * Much richer understanding of the user's mental state
 */
export interface EnhancedInsights {
  // Basic
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions: string[];

  // Recovery-specific
  emotionalThemes: EmotionalTheme[];
  recoveryPhaseIndicators: string[];
  winsAndProgress: string[];
  challengesAndSetbacks: string[];
  supportMentions: string[];
  goalsAndAspirations: string[];

  // AI confidence
  confidenceScore: number;
}

// ============================================
// Journal Entry (Enhanced)
// ============================================

export interface JournalEntry {
  id: string;
  userId: string;

  // Audio
  audioUrl: string;
  duration: number;

  // Processing
  processingStage?: ProcessingStage;
  transcriptionStatus: EntryStatus;
  aiResponseStatus: EntryStatus;

  // Content
  transcript?: string;
  aiResponse?: string;
  aiResponseAudioUrl?: string;

  // Mood
  mood?: MoodLevel;
  moodScore?: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  transcriptionCompletedAt?: Timestamp;
  aiResponseCompletedAt?: Timestamp;

  // Metadata
  tags?: string[];
  checkInType?: 'free' | 'guided';

  // Insights
  insights?: EntryInsights; // Legacy
  enhancedInsights?: EnhancedInsights; // NEW

  // Recovery Metrics (NEW)
  recoveryMetrics?: RecoveryMetrics;

  // Structured check-in data
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };

  // Framework data (for guided journaling)
  frameworkData?: FrameworkEntryData;

  // Legacy fields (deprecated but kept for compatibility)
  painLevel?: number;
  mobilityProgress?: number;
}

// ============================================
// Framework Entry Data (NEW)
// ============================================

export interface FrameworkPromptResponse {
  promptId: string;
  promptText: string;
  response: string;
  audioUrl?: string;
  timestamp: Date;
  duration?: number;
}

export interface ExtractedDataPoint {
  key: string;
  value: string | number | boolean;
  confidence: number;
}

export interface FrameworkEntryData {
  frameworkId: FrameworkId;
  frameworkName: string;
  perspectiveId?: PerspectiveId;
  perspectiveName?: string;
  promptResponses: FrameworkPromptResponse[];
  extractedData: ExtractedDataPoint[];
  totalDuration: number;
  completedAt: Date;
}

// ============================================
// Entry Creation Payload
// ============================================

export interface CreateEntryPayload {
  localAudioUri: string;
  duration: number;
  checkInType: 'free' | 'guided';
  /** Optional client-side transcript */
  transcript?: string;
  /** User-provided recovery metrics */
  recoveryMetrics?: RecoveryMetrics;
  /** Structured answers for guided check-ins */
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };
  /** Framework data for guided journaling with frameworks */
  frameworkData?: FrameworkEntryData;
}

// ============================================
// Analytics Types (for Dashboard)
// ============================================

export interface MoodTrendPoint {
  date: string;
  moodScore: number;
  hopeLevel?: number;
  energyLevel?: number;
  painLevel?: number;
  entryId?: string;
}

export interface MoodDistribution {
  sad: number;
  neutral: number;
  hopeful: number;
  grateful: number;
  energized: number;
  anxious: number;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

// ============================================
// Recovery Progress Types (NEW)
// ============================================

export interface RecoveryProgressData {
  currentPhase: RecoveryPhase;
  phaseProgress: number;
  daysInCurrentPhase: number;
  metricTrends: {
    hope: TrendDirection;
    energy: TrendDirection;
    fear: TrendDirection;
    identity: TrendDirection;
    pain: TrendDirection;
  };
  averageMetrics: RecoveryMetrics;
  significantChanges: Array<{
    metric: string;
    direction: 'up' | 'down';
    magnitude: 'slight' | 'moderate' | 'significant';
    description: string;
  }>;
}

// ============================================
// Pattern Insights Types (NEW)
// ============================================

export interface PatternInsight {
  id: string;
  type: 'correlation' | 'trigger' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
}

export interface PatternInsightsData {
  patterns: PatternInsight[];
  positiveCorrelations: string[];
  negativeCorrelations: string[];
  recurringThemes: Array<{
    theme: EmotionalTheme;
    frequency: number;
    trend: TrendDirection;
  }>;
  actionableInsights: string[];
}

// ============================================
// Weekly Summary Types (NEW)
// ============================================

export interface WeeklySummaryData {
  weekStart: string;
  weekEnd: string;
  summary: {
    headline: string;
    totalEntries: number;
    totalVoiceMinutes: number;
    streakMaintained: boolean;
  };
  emotionalJourney: {
    dominantMood: string;
    moodRange: { low: number; high: number };
    emotionalThemes: EmotionalTheme[];
  };
  highlights: string[];
  challenges: string[];
  encouragement: string;
  nextWeekFocus: string[];
}
