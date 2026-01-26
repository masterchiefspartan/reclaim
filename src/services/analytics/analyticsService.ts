/**
 * Analytics Service for Re:Claim
 *
 * Client-side service for fetching mood trends, recovery progress,
 * pattern insights, and weekly summaries from Firebase Functions.
 *
 * Re:Claim focuses on the MENTAL side of recovery - these analytics
 * help users understand their emotional journey.
 */

import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '@services/firebase/client';
import type {
  TrendDirection,
  RecoveryPhase,
  EmotionalTheme,
  RecoveryMetrics,
  PatternInsight,
} from '@/types/journal';

// ============================================
// Re-export types for convenience
// ============================================

export type { TrendDirection, RecoveryPhase, EmotionalTheme, RecoveryMetrics };

// ============================================
// Mood Trends Types (existing)
// ============================================

export type MoodLevel = 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';

export interface MoodDataPoint {
  date: string;
  mood: MoodLevel | string;
  moodScore?: number;
  entryId: string;
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
// Insights Summary Types (existing)
// ============================================

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
// Recovery Progress Types (NEW)
// ============================================

export interface RecoveryProgressResponse {
  overallProgress: {
    currentPhase: RecoveryPhase;
    phaseProgress: number;
    daysInCurrentPhase: number;
  };
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
  milestonesAchieved: Array<{
    id: string;
    title: string;
    achievedAt: string;
    description: string;
  }>;
  insufficientData: boolean;
}

// ============================================
// Pattern Insights Types (NEW)
// ============================================

export interface PatternInsightsResponse {
  patterns: PatternInsight[];
  positiveCorrelations: string[];
  negativeCorrelations: string[];
  recurringThemes: Array<{
    theme: EmotionalTheme;
    frequency: number;
    trend: TrendDirection;
  }>;
  actionableInsights: string[];
  insufficientData: boolean;
}

// ============================================
// Weekly Summary Types (NEW)
// ============================================

export interface WeeklySummaryResponse {
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
  insufficientData: boolean;
}

// ============================================
// API Functions
// ============================================

type ValidDays = 7 | 14 | 30 | 90;

/**
 * Fetch mood trends for the authenticated user
 * @param days - Number of days to fetch (7, 14, 30, or 90)
 */
export async function getMoodTrends(days: ValidDays = 30): Promise<MoodTrendsResponse> {
  if (!cloudFunctions) {
    throw new Error('Firebase Functions not initialized');
  }

  const getMoodTrendsFn = httpsCallable<{ days: number }, MoodTrendsResponse>(
    cloudFunctions,
    'getMoodTrends'
  );

  const result = await getMoodTrendsFn({ days });
  return result.data;
}

/**
 * Fetch insights summary for the authenticated user
 * @param days - Number of days to fetch (7, 14, 30, or 90)
 */
export async function getInsightsSummary(days: ValidDays = 30): Promise<InsightsSummaryResponse> {
  if (!cloudFunctions) {
    throw new Error('Firebase Functions not initialized');
  }

  const getInsightsSummaryFn = httpsCallable<{ days: number }, InsightsSummaryResponse>(
    cloudFunctions,
    'getInsightsSummary'
  );

  const result = await getInsightsSummaryFn({ days });
  return result.data;
}

/**
 * Fetch recovery progress for the authenticated user (NEW)
 * Tracks mental/emotional recovery trajectory over time
 * @param days - Number of days to analyze (7, 14, 30, or 90)
 */
export async function getRecoveryProgress(days: ValidDays = 30): Promise<RecoveryProgressResponse> {
  if (!cloudFunctions) {
    throw new Error('Firebase Functions not initialized');
  }

  const getRecoveryProgressFn = httpsCallable<{ days: number }, RecoveryProgressResponse>(
    cloudFunctions,
    'getRecoveryProgress'
  );

  const result = await getRecoveryProgressFn({ days });
  return result.data;
}

/**
 * Fetch AI-powered pattern insights for the authenticated user (NEW)
 * Identifies correlations, triggers, and recommendations
 * @param days - Number of days to analyze (7, 14, 30, or 90)
 */
export async function getPatternInsights(days: ValidDays = 30): Promise<PatternInsightsResponse> {
  if (!cloudFunctions) {
    throw new Error('Firebase Functions not initialized');
  }

  const getPatternInsightsFn = httpsCallable<{ days: number }, PatternInsightsResponse>(
    cloudFunctions,
    'getPatternInsights'
  );

  const result = await getPatternInsightsFn({ days });
  return result.data;
}

/**
 * Fetch weekly summary for the authenticated user (NEW)
 * AI-generated recap of the week's emotional journey
 * @param weekOffset - 0 for current week, 1 for last week, etc.
 */
export async function getWeeklySummary(weekOffset: number = 0): Promise<WeeklySummaryResponse> {
  if (!cloudFunctions) {
    throw new Error('Firebase Functions not initialized');
  }

  const getWeeklySummaryFn = httpsCallable<{ weekOffset: number }, WeeklySummaryResponse>(
    cloudFunctions,
    'getWeeklySummary'
  );

  const result = await getWeeklySummaryFn({ weekOffset });
  return result.data;
}

// ============================================
// Combined Fetch Functions
// ============================================

/**
 * Combined dashboard data fetch (existing)
 * Fetches both mood trends and insights in parallel
 */
export async function getDashboardData(days: ValidDays = 30): Promise<{
  moodTrends: MoodTrendsResponse;
  insights: InsightsSummaryResponse;
}> {
  const [moodTrends, insights] = await Promise.all([getMoodTrends(days), getInsightsSummary(days)]);

  return { moodTrends, insights };
}

/**
 * Comprehensive recovery analytics fetch (NEW)
 * Fetches all analytics data for a rich dashboard experience
 */
export async function getComprehensiveAnalytics(days: ValidDays = 30): Promise<{
  moodTrends: MoodTrendsResponse;
  insights: InsightsSummaryResponse;
  recoveryProgress: RecoveryProgressResponse;
  patternInsights: PatternInsightsResponse;
}> {
  const [moodTrends, insights, recoveryProgress, patternInsights] = await Promise.all([
    getMoodTrends(days),
    getInsightsSummary(days),
    getRecoveryProgress(days),
    getPatternInsights(days),
  ]);

  return { moodTrends, insights, recoveryProgress, patternInsights };
}
