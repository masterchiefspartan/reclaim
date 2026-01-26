/**
 * Analytics Types for Dashboard Data
 * Re:Claim - The Mental Side of Recovery
 *
 * This module defines comprehensive types for tracking the emotional
 * and mental aspects of physical recovery journeys.
 */

// ============================================
// Core Enums & Types
// ============================================

export type MoodLevel = 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type TrendDirection = 'improving' | 'stable' | 'declining';

/** Recovery phase based on timeline and content analysis */
export type RecoveryPhase =
  | 'acute' // Days 1-14: High pain, shock, fear
  | 'subacute' // Weeks 2-6: Beginning movement, hope emerging
  | 'rehabilitation' // Weeks 6-12+: Building strength, motivation fluctuations
  | 'return_to_activity' // Months 3-12+: Near-normal, fear of re-injury
  | 'maintenance'; // Ongoing: Prevention, acceptance

/** Emotional themes detected in journal entries */
export type EmotionalTheme =
  | 'frustration'
  | 'fear'
  | 'grief' // Loss of identity/ability
  | 'hope'
  | 'gratitude'
  | 'determination'
  | 'isolation'
  | 'acceptance'
  | 'celebration';

// ============================================
// Recovery-Specific Metrics (New)
// ============================================

/**
 * Recovery wellness metrics captured per entry
 * These go beyond basic mood to track mental recovery
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
  /** Isolation/connection (1-10, higher = more connected) */
  connectionScore?: number;
  /** Sleep quality impact (1-10) */
  sleepQuality?: number;
  /** Physical pain level (1-10) */
  painLevel?: number;
}

/**
 * AI-extracted insights from transcript analysis
 * Much richer than basic sentiment
 */
export interface EnhancedInsights {
  // Basic insights (existing)
  keyTopics: string[];
  sentiment: Sentiment;
  suggestedActions: string[];

  // Recovery-specific insights (new)
  emotionalThemes: EmotionalTheme[];
  recoveryPhaseIndicators: string[];
  winsAndProgress: string[];
  challengesAndSetbacks: string[];
  supportMentions: string[];
  goalsAndAspirations: string[];

  // AI confidence
  confidenceScore: number; // 0-1
}

// ============================================
// Mood Trends Types (Enhanced)
// ============================================

export interface MoodDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  mood: MoodLevel | string;
  moodScore?: number; // 1-10 scale
  entryId: string;
  // New recovery metrics
  hopeLevel?: number;
  energyLevel?: number;
  painLevel?: number;
}

export interface MoodDistribution {
  very_sad: number;
  sad: number;
  neutral: number;
  happy: number;
  very_happy: number;
  [key: string]: number;
}

export interface MoodTrendsRequest {
  days?: number; // Default: 30, Options: 7, 14, 30, 90
}

export interface MoodTrendsResponse {
  moodData: MoodDataPoint[];
  averages: {
    moodDistribution: MoodDistribution;
    averageMoodScore: number;
    totalEntries: number;
  };
  trend: TrendDirection;
  insufficientData: boolean;
  periodStart: string;
  periodEnd: string;
}

// ============================================
// Insights Summary Types (Enhanced)
// ============================================

export interface InsightsSummaryRequest {
  days?: number; // Default: 30
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface InsightsSummaryResponse {
  topTopics: string[];
  sentimentDistribution: SentimentDistribution;
  suggestedActions: string[];
  totalEntries: number;
  streakDays: number;
  totalVoiceMinutes: number;
  averageMoodScore: number;
  insufficientData: boolean;
}

// ============================================
// NEW: Recovery Progress Types
// ============================================

export interface RecoveryProgressRequest {
  days?: number; // Default: 30
}

export interface RecoveryProgressResponse {
  /** Overall mental recovery trajectory */
  overallProgress: {
    currentPhase: RecoveryPhase;
    phaseProgress: number; // 0-100 within current phase
    daysInCurrentPhase: number;
  };

  /** Key metric trends */
  metricTrends: {
    hope: TrendDirection;
    energy: TrendDirection;
    fear: TrendDirection; // declining is good
    identity: TrendDirection;
    pain: TrendDirection; // declining is good
  };

  /** Average metrics over period */
  averageMetrics: RecoveryMetrics;

  /** Significant changes detected */
  significantChanges: Array<{
    metric: string;
    direction: 'up' | 'down';
    magnitude: 'slight' | 'moderate' | 'significant';
    description: string;
  }>;

  /** Recovery milestones achieved */
  milestonesAchieved: Array<{
    id: string;
    title: string;
    achievedAt: string;
    description: string;
  }>;

  insufficientData: boolean;
}

// ============================================
// NEW: Pattern Insights Types
// ============================================

export interface PatternInsightsRequest {
  days?: number; // Default: 30
}

export interface PatternInsight {
  id: string;
  type: 'correlation' | 'trigger' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-1
  supportingData?: {
    metric1?: string;
    metric2?: string;
    correlation?: number;
    occurrences?: number;
  };
}

export interface PatternInsightsResponse {
  patterns: PatternInsight[];

  /** What tends to correlate with good days */
  positiveCorrelations: string[];

  /** What tends to correlate with hard days */
  negativeCorrelations: string[];

  /** Recurring themes over time */
  recurringThemes: Array<{
    theme: EmotionalTheme;
    frequency: number;
    trend: TrendDirection;
  }>;

  /** AI-generated actionable insights */
  actionableInsights: string[];

  insufficientData: boolean;
}

// ============================================
// NEW: Weekly Summary Types
// ============================================

export interface WeeklySummaryRequest {
  weekOffset?: number; // 0 = current week, 1 = last week, etc.
}

export interface WeeklySummaryResponse {
  weekStart: string;
  weekEnd: string;

  /** High-level summary */
  summary: {
    headline: string; // e.g., "A week of progress despite challenges"
    totalEntries: number;
    totalVoiceMinutes: number;
    streakMaintained: boolean;
  };

  /** Emotional journey this week */
  emotionalJourney: {
    dominantMood: string;
    moodRange: { low: number; high: number };
    emotionalThemes: EmotionalTheme[];
  };

  /** Wins and highlights */
  highlights: string[];

  /** Challenges faced */
  challenges: string[];

  /** AI-generated encouragement */
  encouragement: string;

  /** Focus suggestions for next week */
  nextWeekFocus: string[];

  insufficientData: boolean;
}

// ============================================
// Journal Entry with Full Insights
// ============================================

export interface EntryInsights {
  keyTopics?: string[];
  sentiment?: Sentiment;
  suggestedActions?: string[];
}

export interface JournalEntryWithInsights {
  id: string;
  userId: string;
  transcript?: string;
  mood?: string;
  moodScore?: number;
  duration: number;
  createdAt: FirebaseFirestore.Timestamp;

  // Basic insights
  insights?: EntryInsights;

  // Enhanced insights (new)
  enhancedInsights?: EnhancedInsights;

  // Recovery metrics (new)
  recoveryMetrics?: RecoveryMetrics;

  // Structured data for guided check-ins
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };
}
