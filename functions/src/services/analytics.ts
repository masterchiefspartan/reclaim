/**
 * Analytics Service
 * Provides helper functions for calculating mood trends and insights
 */

import * as admin from 'firebase-admin';
import {
  MoodDataPoint,
  MoodDistribution,
  TrendDirection,
  SentimentDistribution,
  JournalEntryWithInsights,
} from '../types/analytics';

const db = admin.firestore();

/**
 * Fetch journal entries for a user within a date range
 */
export async function fetchEntriesForPeriod(
  userId: string,
  days: number
): Promise<JournalEntryWithInsights[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const snapshot = await db
    .collection('journalEntries')
    .where('userId', '==', userId)
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as JournalEntryWithInsights[];
}

/**
 * Convert mood string to numeric score
 */
export function moodToScore(mood: string | undefined): number {
  if (!mood) return 5; // neutral default

  const moodScores: Record<string, number> = {
    very_sad: 1,
    sad: 3,
    neutral: 5,
    happy: 7,
    very_happy: 9,
    // Legacy mood values
    anxious: 3,
    frustrated: 3,
    grateful: 8,
    excited: 8,
  };

  return moodScores[mood.toLowerCase()] ?? 5;
}

/**
 * Calculate mood distribution from entries
 */
export function calculateMoodDistribution(entries: JournalEntryWithInsights[]): MoodDistribution {
  const distribution: MoodDistribution = {
    very_sad: 0,
    sad: 0,
    neutral: 0,
    happy: 0,
    very_happy: 0,
  };

  entries.forEach(entry => {
    if (entry.mood) {
      const mood = entry.mood.toLowerCase();
      if (mood in distribution) {
        distribution[mood]++;
      } else {
        // Map legacy moods to new scale
        if (['anxious', 'frustrated'].includes(mood)) {
          distribution.sad++;
        } else if (['grateful', 'excited'].includes(mood)) {
          distribution.happy++;
        } else {
          distribution.neutral++;
        }
      }
    }
  });

  return distribution;
}

/**
 * Calculate average mood score from entries
 */
export function calculateAverageMoodScore(entries: JournalEntryWithInsights[]): number {
  const entriesWithMood = entries.filter(e => e.mood || e.moodScore);

  if (entriesWithMood.length === 0) return 0;

  const totalScore = entriesWithMood.reduce((sum, entry) => {
    // Use explicit moodScore if available, otherwise derive from mood
    const score = entry.moodScore ?? moodToScore(entry.mood);
    return sum + score;
  }, 0);

  return Math.round((totalScore / entriesWithMood.length) * 10) / 10;
}

/**
 * Determine trend direction by comparing first half vs second half of period
 */
export function calculateTrend(entries: JournalEntryWithInsights[]): TrendDirection {
  if (entries.length < 4) return 'stable'; // Not enough data

  const midpoint = Math.floor(entries.length / 2);
  const firstHalf = entries.slice(0, midpoint);
  const secondHalf = entries.slice(midpoint);

  const firstHalfAvg = calculateAverageMoodScore(firstHalf);
  const secondHalfAvg = calculateAverageMoodScore(secondHalf);

  const difference = secondHalfAvg - firstHalfAvg;

  // Threshold for determining trend (0.5 point difference)
  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
}

/**
 * Build mood data points from entries
 */
export function buildMoodDataPoints(entries: JournalEntryWithInsights[]): MoodDataPoint[] {
  return entries
    .filter(entry => entry.mood || entry.moodScore)
    .map(entry => ({
      date: entry.createdAt.toDate().toISOString().split('T')[0],
      mood: entry.mood || 'neutral',
      moodScore: entry.moodScore ?? moodToScore(entry.mood),
      entryId: entry.id,
    }));
}

/**
 * Calculate sentiment distribution from entry insights
 */
export function calculateSentimentDistribution(
  entries: JournalEntryWithInsights[]
): SentimentDistribution {
  const distribution: SentimentDistribution = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  entries.forEach(entry => {
    const sentiment = entry.insights?.sentiment;
    if (sentiment && sentiment in distribution) {
      distribution[sentiment]++;
    } else {
      // Infer from mood if no explicit sentiment
      const score = entry.moodScore ?? moodToScore(entry.mood);
      if (score >= 7) {
        distribution.positive++;
      } else if (score <= 3) {
        distribution.negative++;
      } else {
        distribution.neutral++;
      }
    }
  });

  return distribution;
}

/**
 * Extract and rank top topics from entries
 */
export function extractTopTopics(entries: JournalEntryWithInsights[], limit: number = 5): string[] {
  const topicCounts: Record<string, number> = {};

  entries.forEach(entry => {
    entry.insights?.keyTopics?.forEach(topic => {
      const normalizedTopic = topic.toLowerCase().trim();
      topicCounts[normalizedTopic] = (topicCounts[normalizedTopic] || 0) + 1;
    });
  });

  return Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([topic]) => topic);
}

/**
 * Collect suggested actions from entries
 */
export function collectSuggestedActions(
  entries: JournalEntryWithInsights[],
  limit: number = 5
): string[] {
  const actions: string[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    for (const action of entry.insights?.suggestedActions || []) {
      const normalized = action.toLowerCase().trim();
      if (!seen.has(normalized) && actions.length < limit) {
        seen.add(normalized);
        actions.push(action);
      }
    }
  }

  return actions;
}

/**
 * Calculate total voice minutes from entries
 */
export function calculateTotalVoiceMinutes(entries: JournalEntryWithInsights[]): number {
  const totalSeconds = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  return Math.round(totalSeconds / 60);
}

/**
 * Calculate current streak days
 */
export async function calculateStreakDays(userId: string): Promise<number> {
  // Get all entries ordered by date descending
  const snapshot = await db
    .collection('journalEntries')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.empty) return 0;

  const entries = snapshot.docs.map(doc => doc.data());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Get unique dates with entries
  const entryDates = new Set<string>();
  entries.forEach(entry => {
    if (entry.createdAt) {
      const date = entry.createdAt.toDate();
      date.setHours(0, 0, 0, 0);
      entryDates.add(date.toISOString().split('T')[0]);
    }
  });

  // Check consecutive days starting from today
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];

    if (entryDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (streak === 0) {
      // If no entry today, check yesterday (allow for "current day" not yet recorded)
      currentDate.setDate(currentDate.getDate() - 1);
      const yesterdayStr = currentDate.toISOString().split('T')[0];
      if (entryDates.has(yesterdayStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Validate days parameter
 */
export function validateDays(days: unknown): number {
  const validDays = [7, 14, 30, 90];
  const numDays = typeof days === 'number' ? days : 30;

  if (!validDays.includes(numDays)) {
    return 30; // Default to 30 if invalid
  }

  return numDays;
}
