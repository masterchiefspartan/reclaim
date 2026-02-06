/**
 * useDashboardAnalytics Hook
 * ============================
 * Fetches all 5 analytics endpoints using Promise.allSettled
 * for graceful partial failure. Supports period selection,
 * caching, and pull-to-refresh.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getMoodTrends,
  getInsightsSummary,
  getRecoveryProgress,
  getPatternInsights,
  getWeeklySummary,
} from '@services/analytics/analyticsService';
import type {
  MoodTrendsResponse,
  InsightsSummaryResponse,
  RecoveryProgressResponse,
  PatternInsightsResponse,
  WeeklySummaryResponse,
} from '@services/analytics/analyticsService';
import { logger } from '@utils/logger';

export type AnalyticsPeriod = 7 | 14 | 30 | 90;

interface DashboardAnalyticsState {
  moodTrends: MoodTrendsResponse | null;
  insights: InsightsSummaryResponse | null;
  recoveryProgress: RecoveryProgressResponse | null;
  patternInsights: PatternInsightsResponse | null;
  weeklySummary: WeeklySummaryResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedPeriod: AnalyticsPeriod;
}

interface UseDashboardAnalyticsReturn extends DashboardAnalyticsState {
  /** Change the period and re-fetch all data */
  setSelectedPeriod: (period: AnalyticsPeriod) => void;
  /** Manually re-fetch all data (for pull-to-refresh) */
  refresh: () => Promise<void>;
}

export function useDashboardAnalytics(): UseDashboardAnalyticsReturn {
  const [state, setState] = useState<DashboardAnalyticsState>({
    moodTrends: null,
    insights: null,
    recoveryProgress: null,
    patternInsights: null,
    weeklySummary: null,
    isLoading: true,
    error: null,
    selectedPeriod: 30,
  });

  // Cache for last successful data so UI doesn't blank on re-fetch
  const cacheRef = useRef<Omit<DashboardAnalyticsState, 'isLoading' | 'error' | 'selectedPeriod'>>({
    moodTrends: null,
    insights: null,
    recoveryProgress: null,
    patternInsights: null,
    weeklySummary: null,
  });

  const fetchAll = useCallback(async (days: AnalyticsPeriod) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await Promise.allSettled([
        getMoodTrends(days),
        getInsightsSummary(days),
        getRecoveryProgress(days),
        getPatternInsights(days),
        getWeeklySummary(0),
      ]);

      const [moodResult, insightsResult, recoveryResult, patternsResult, weeklyResult] = results;

      // Extract values, fall back to cached data
      const moodTrends =
        moodResult.status === 'fulfilled' ? moodResult.value : cacheRef.current.moodTrends;
      const insights =
        insightsResult.status === 'fulfilled' ? insightsResult.value : cacheRef.current.insights;
      const recoveryProgress =
        recoveryResult.status === 'fulfilled'
          ? recoveryResult.value
          : cacheRef.current.recoveryProgress;
      const patternInsights =
        patternsResult.status === 'fulfilled'
          ? patternsResult.value
          : cacheRef.current.patternInsights;
      const weeklySummary =
        weeklyResult.status === 'fulfilled' ? weeklyResult.value : cacheRef.current.weeklySummary;

      // Update cache
      cacheRef.current = { moodTrends, insights, recoveryProgress, patternInsights, weeklySummary };

      // Check if ALL failed
      const allFailed = results.every(r => r.status === 'rejected');
      const failedCount = results.filter(r => r.status === 'rejected').length;

      // Log any failures
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          const names = [
            'moodTrends',
            'insights',
            'recoveryProgress',
            'patternInsights',
            'weeklySummary',
          ];
          logger.error(`Dashboard analytics: ${names[i]} failed`, { error: r.reason });
        }
      });

      setState(prev => ({
        ...prev,
        moodTrends,
        insights,
        recoveryProgress,
        patternInsights,
        weeklySummary,
        isLoading: false,
        error: allFailed
          ? 'Unable to load analytics. Pull down to retry.'
          : failedCount > 0
            ? 'Some data may be unavailable right now.'
            : null,
      }));
    } catch (error) {
      logger.error('Dashboard analytics fetch failed', { error });
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to load analytics. Pull down to retry.',
      }));
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchAll(state.selectedPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedPeriod = useCallback(
    (period: AnalyticsPeriod) => {
      setState(prev => ({ ...prev, selectedPeriod: period }));
      fetchAll(period);
    },
    [fetchAll]
  );

  const refresh = useCallback(async () => {
    await fetchAll(state.selectedPeriod);
  }, [fetchAll, state.selectedPeriod]);

  return {
    ...state,
    setSelectedPeriod,
    refresh,
  };
}
