/**
 * Analytics Service
 * Client-side service for fetching mood trends and insights from Firebase Functions
 */

import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '@services/firebase/client';

// Types matching backend
export type MoodLevel = 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';
export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface MoodDataPoint {
  date: string;
  mood: MoodLevel | string;
  moodScore?: number;
  entryId: string;
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

/**
 * Fetch mood trends for the authenticated user
 * @param days - Number of days to fetch (7, 14, 30, or 90)
 */
export async function getMoodTrends(days: 7 | 14 | 30 | 90 = 30): Promise<MoodTrendsResponse> {
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
export async function getInsightsSummary(
  days: 7 | 14 | 30 | 90 = 30
): Promise<InsightsSummaryResponse> {
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
 * Combined dashboard data fetch
 * Fetches both mood trends and insights in parallel
 */
export async function getDashboardData(days: 7 | 14 | 30 | 90 = 30): Promise<{
  moodTrends: MoodTrendsResponse;
  insights: InsightsSummaryResponse;
}> {
  const [moodTrends, insights] = await Promise.all([getMoodTrends(days), getInsightsSummary(days)]);

  return { moodTrends, insights };
}
