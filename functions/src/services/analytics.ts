/**
 * Analytics Service for Re:Claim
 *
 * Provides helper functions for calculating mood trends, recovery progress,
 * pattern insights, and weekly summaries.
 *
 * Re:Claim focuses on the MENTAL side of recovery - these analytics
 * help users understand their emotional journey.
 */

import * as admin from 'firebase-admin';
import {
  MoodDataPoint,
  MoodDistribution,
  TrendDirection,
  SentimentDistribution,
  JournalEntryWithInsights,
  RecoveryPhase,
  RecoveryMetrics,
  EmotionalTheme,
  RecoveryProgressResponse,
  PatternInsightsResponse,
  PatternInsight,
  WeeklySummaryResponse,
} from '../types/analytics';
import {
  generateWeeklySummary as aiGenerateWeeklySummary,
  analyzePatterns as aiAnalyzePatterns,
  WeeklySummaryInput,
  PatternAnalysisInput,
} from './claude';

// Lazy initialization to avoid calling firestore() before initializeApp()
const getDb = () => admin.firestore();

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

  const snapshot = await getDb()
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
  const snapshot = await getDb()
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

// ============================================
// NEW: Recovery Progress Functions
// ============================================

/**
 * Determine recovery phase based on timeline and entry content
 */
export function determineRecoveryPhase(
  daysSinceStart: number,
  entries: JournalEntryWithInsights[]
): RecoveryPhase {
  // Base phase on timeline
  if (daysSinceStart <= 14) return 'acute';
  if (daysSinceStart <= 42) return 'subacute'; // 6 weeks
  if (daysSinceStart <= 84) return 'rehabilitation'; // 12 weeks
  if (daysSinceStart <= 365) return 'return_to_activity';
  return 'maintenance';
}

/**
 * Calculate average recovery metrics from entries
 */
export function calculateAverageRecoveryMetrics(
  entries: JournalEntryWithInsights[]
): RecoveryMetrics {
  const metricsWithData = entries.filter(e => e.recoveryMetrics);

  if (metricsWithData.length === 0) {
    return {};
  }

  const sumMetrics = {
    hopeLevel: 0,
    energyLevel: 0,
    fearLevel: 0,
    identityScore: 0,
    connectionScore: 0,
    sleepQuality: 0,
    painLevel: 0,
  };

  const counts = { ...sumMetrics };

  metricsWithData.forEach(entry => {
    const m = entry.recoveryMetrics!;
    if (m.hopeLevel) {
      sumMetrics.hopeLevel += m.hopeLevel;
      counts.hopeLevel++;
    }
    if (m.energyLevel) {
      sumMetrics.energyLevel += m.energyLevel;
      counts.energyLevel++;
    }
    if (m.fearLevel) {
      sumMetrics.fearLevel += m.fearLevel;
      counts.fearLevel++;
    }
    if (m.identityScore) {
      sumMetrics.identityScore += m.identityScore;
      counts.identityScore++;
    }
    if (m.connectionScore) {
      sumMetrics.connectionScore += m.connectionScore;
      counts.connectionScore++;
    }
    if (m.sleepQuality) {
      sumMetrics.sleepQuality += m.sleepQuality;
      counts.sleepQuality++;
    }
    if (m.painLevel) {
      sumMetrics.painLevel += m.painLevel;
      counts.painLevel++;
    }
  });

  return {
    hopeLevel: counts.hopeLevel > 0 ? Math.round((sumMetrics.hopeLevel / counts.hopeLevel) * 10) / 10 : undefined,
    energyLevel: counts.energyLevel > 0 ? Math.round((sumMetrics.energyLevel / counts.energyLevel) * 10) / 10 : undefined,
    fearLevel: counts.fearLevel > 0 ? Math.round((sumMetrics.fearLevel / counts.fearLevel) * 10) / 10 : undefined,
    identityScore: counts.identityScore > 0 ? Math.round((sumMetrics.identityScore / counts.identityScore) * 10) / 10 : undefined,
    connectionScore: counts.connectionScore > 0 ? Math.round((sumMetrics.connectionScore / counts.connectionScore) * 10) / 10 : undefined,
    sleepQuality: counts.sleepQuality > 0 ? Math.round((sumMetrics.sleepQuality / counts.sleepQuality) * 10) / 10 : undefined,
    painLevel: counts.painLevel > 0 ? Math.round((sumMetrics.painLevel / counts.painLevel) * 10) / 10 : undefined,
  };
}

/**
 * Calculate trend for a specific metric
 */
export function calculateMetricTrend(
  entries: JournalEntryWithInsights[],
  metricGetter: (e: JournalEntryWithInsights) => number | undefined
): TrendDirection {
  const values = entries
    .map(e => metricGetter(e))
    .filter((v): v is number => v !== undefined);

  if (values.length < 4) return 'stable';

  const midpoint = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, midpoint);
  const secondHalf = values.slice(midpoint);

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const difference = secondAvg - firstAvg;

  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
}

/**
 * Detect significant changes in metrics
 */
export function detectSignificantChanges(
  entries: JournalEntryWithInsights[]
): RecoveryProgressResponse['significantChanges'] {
  const changes: RecoveryProgressResponse['significantChanges'] = [];

  const metrics: Array<{
    name: string;
    getter: (e: JournalEntryWithInsights) => number | undefined;
    positiveIsGood: boolean;
  }> = [
    { name: 'Hope', getter: e => e.recoveryMetrics?.hopeLevel, positiveIsGood: true },
    { name: 'Energy', getter: e => e.recoveryMetrics?.energyLevel, positiveIsGood: true },
    { name: 'Fear', getter: e => e.recoveryMetrics?.fearLevel, positiveIsGood: false },
    { name: 'Identity', getter: e => e.recoveryMetrics?.identityScore, positiveIsGood: true },
    { name: 'Pain', getter: e => e.recoveryMetrics?.painLevel, positiveIsGood: false },
  ];

  for (const metric of metrics) {
    const values = entries
      .map(e => metric.getter(e))
      .filter((v): v is number => v !== undefined);

    if (values.length < 3) continue;

    const recent = values.slice(-3);
    const earlier = values.slice(0, -3);

    if (earlier.length === 0) continue;

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    const diff = recentAvg - earlierAvg;

    if (Math.abs(diff) >= 1) {
      const direction = diff > 0 ? 'up' : 'down';
      const magnitude: 'slight' | 'moderate' | 'significant' =
        Math.abs(diff) >= 2.5 ? 'significant' : Math.abs(diff) >= 1.5 ? 'moderate' : 'slight';

      const isPositiveChange = metric.positiveIsGood ? direction === 'up' : direction === 'down';

      changes.push({
        metric: metric.name,
        direction,
        magnitude,
        description: `${metric.name} has ${magnitude}ly ${direction === 'up' ? 'increased' : 'decreased'} recently${isPositiveChange ? ' - great progress!' : '.'}`,
      });
    }
  }

  return changes;
}

/**
 * Build recovery progress response
 */
export async function buildRecoveryProgress(
  userId: string,
  entries: JournalEntryWithInsights[],
  days: number
): Promise<RecoveryProgressResponse> {
  if (entries.length < 3) {
    return {
      overallProgress: {
        currentPhase: 'rehabilitation',
        phaseProgress: 0,
        daysInCurrentPhase: 0,
      },
      metricTrends: {
        hope: 'stable',
        energy: 'stable',
        fear: 'stable',
        identity: 'stable',
        pain: 'stable',
      },
      averageMetrics: {},
      significantChanges: [],
      milestonesAchieved: [],
      insufficientData: true,
    };
  }

  // Get user context for phase calculation
  const userDoc = await getDb().collection('users').doc(userId).get();
  const userData = userDoc.data();
  const daysSinceStart = userData?.recoveryContext?.daysSinceStart || days;

  const currentPhase = determineRecoveryPhase(daysSinceStart, entries);
  const averageMetrics = calculateAverageRecoveryMetrics(entries);
  const significantChanges = detectSignificantChanges(entries);

  return {
    overallProgress: {
      currentPhase,
      phaseProgress: Math.min(100, Math.round((entries.length / 10) * 100)), // Simplified
      daysInCurrentPhase: daysSinceStart,
    },
    metricTrends: {
      hope: calculateMetricTrend(entries, e => e.recoveryMetrics?.hopeLevel),
      energy: calculateMetricTrend(entries, e => e.recoveryMetrics?.energyLevel),
      fear: calculateMetricTrend(entries, e => e.recoveryMetrics?.fearLevel),
      identity: calculateMetricTrend(entries, e => e.recoveryMetrics?.identityScore),
      pain: calculateMetricTrend(entries, e => e.recoveryMetrics?.painLevel),
    },
    averageMetrics,
    significantChanges,
    milestonesAchieved: [], // TODO: Implement milestone tracking
    insufficientData: false,
  };
}

// ============================================
// NEW: Pattern Insights Functions
// ============================================

/**
 * Build pattern insights using AI analysis
 */
export async function buildPatternInsights(
  entries: JournalEntryWithInsights[],
  userContext?: { userName?: string; recoveryType?: string }
): Promise<PatternInsightsResponse> {
  if (entries.length < 5) {
    return {
      patterns: [],
      positiveCorrelations: [],
      negativeCorrelations: [],
      recurringThemes: [],
      actionableInsights: [],
      insufficientData: true,
    };
  }

  // Prepare input for AI analysis
  const analysisInput: PatternAnalysisInput = {
    entries: entries.map(e => ({
      mood: e.mood,
      moodScore: e.moodScore,
      createdAt: e.createdAt.toDate(),
      enhancedInsights: e.enhancedInsights,
      recoveryMetrics: e.recoveryMetrics,
    })),
    userContext,
  };

  // Get AI-powered pattern analysis
  const aiPatterns = await aiAnalyzePatterns(analysisInput);

  // Calculate recurring themes from entries
  const themeCounts: Record<string, number> = {};
  entries.forEach(e => {
    e.enhancedInsights?.emotionalThemes?.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });

  const recurringThemes = Object.entries(themeCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([theme, frequency]) => ({
      theme: theme as EmotionalTheme,
      frequency,
      trend: 'stable' as TrendDirection, // Simplified
    }));

  // Convert AI patterns to our format
  const patterns: PatternInsight[] = aiPatterns.patterns.map((p, i) => ({
    id: `pattern-${i}`,
    type: p.type as 'correlation' | 'trigger' | 'recommendation',
    title: p.title,
    description: p.description,
    confidence: 0.75,
  }));

  return {
    patterns,
    positiveCorrelations: aiPatterns.positiveCorrelations,
    negativeCorrelations: aiPatterns.negativeCorrelations,
    recurringThemes,
    actionableInsights: aiPatterns.actionableInsights,
    insufficientData: false,
  };
}

// ============================================
// NEW: Weekly Summary Functions
// ============================================

/**
 * Get entries for a specific week
 */
export async function fetchEntriesForWeek(
  userId: string,
  weekOffset: number = 0
): Promise<JournalEntryWithInsights[]> {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() - weekOffset * 7);
  weekEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const snapshot = await getDb()
    .collection('journalEntries')
    .where('userId', '==', userId)
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(weekStart))
    .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(weekEnd))
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as JournalEntryWithInsights[];
}

/**
 * Build weekly summary response
 */
export async function buildWeeklySummary(
  entries: JournalEntryWithInsights[],
  weekStart: Date,
  weekEnd: Date,
  userContext?: { userName?: string; recoveryType?: string }
): Promise<WeeklySummaryResponse> {
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  if (entries.length === 0) {
    return {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      summary: {
        headline: 'No entries this week',
        totalEntries: 0,
        totalVoiceMinutes: 0,
        streakMaintained: false,
      },
      emotionalJourney: {
        dominantMood: 'unknown',
        moodRange: { low: 0, high: 0 },
        emotionalThemes: [],
      },
      highlights: [],
      challenges: [],
      encouragement: 'Start journaling to track your recovery journey.',
      nextWeekFocus: ['Record your first entry'],
      insufficientData: true,
    };
  }

  // Calculate basic stats
  const totalVoiceMinutes = Math.round(entries.reduce((sum, e) => sum + (e.duration || 0), 0) / 60);

  // Collect all emotional themes
  const allThemes: EmotionalTheme[] = [];
  entries.forEach(e => {
    e.enhancedInsights?.emotionalThemes?.forEach(t => allThemes.push(t));
  });

  // Get AI-generated summary
  const summaryInput: WeeklySummaryInput = {
    entries: entries.map(e => ({
      transcript: e.transcript || '',
      mood: e.mood,
      moodScore: e.moodScore,
      createdAt: e.createdAt.toDate(),
      enhancedInsights: e.enhancedInsights,
    })),
    userContext,
  };

  const aiSummary = await aiGenerateWeeklySummary(summaryInput);

  // Calculate mood range
  const moodScores = entries
    .map(e => e.moodScore)
    .filter((s): s is number => s !== undefined);

  const moodRange = moodScores.length > 0
    ? { low: Math.min(...moodScores), high: Math.max(...moodScores) }
    : { low: 5, high: 5 };

  // Determine dominant mood
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const dominantMood = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    summary: {
      headline: aiSummary.headline,
      totalEntries: entries.length,
      totalVoiceMinutes,
      streakMaintained: entries.length >= 3, // Simplified streak check
    },
    emotionalJourney: {
      dominantMood,
      moodRange,
      emotionalThemes: [...new Set(allThemes)].slice(0, 5),
    },
    highlights: aiSummary.highlights,
    challenges: aiSummary.challenges,
    encouragement: aiSummary.encouragement,
    nextWeekFocus: aiSummary.nextWeekFocus,
    insufficientData: false,
  };
}
