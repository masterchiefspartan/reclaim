/**
 * Analytics Types for Dashboard Data
 */

export type MoodLevel = 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type TrendDirection = 'improving' | 'stable' | 'declining';

// Mood Trends Types
export interface MoodDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  mood: MoodLevel | string;
  moodScore?: number; // 1-10 scale
  entryId: string;
}

export interface MoodDistribution {
  very_sad: number;
  sad: number;
  neutral: number;
  happy: number;
  very_happy: number;
  [key: string]: number; // Allow other mood strings
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

// Insights Summary Types
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

// Helper type for journal entry with insights
export interface EntryInsights {
  keyTopics?: string[];
  sentiment?: Sentiment;
  suggestedActions?: string[];
}

export interface JournalEntryWithInsights {
  id: string;
  userId: string;
  mood?: string;
  moodScore?: number;
  duration: number;
  createdAt: FirebaseFirestore.Timestamp;
  insights?: EntryInsights;
}
