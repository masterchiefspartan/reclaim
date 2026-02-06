/**
 * MoodTrendChart — Apple Glass Aesthetic
 * =========================================
 * Displays mood trend data as vertical bars with a trend indicator.
 * Pure React Native — no chart library needed.
 */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@components/common/GlassCard';
import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import type { MoodDataPoint, TrendDirection } from '@services/analytics/analyticsService';

interface MoodTrendChartProps {
  moodData: MoodDataPoint[];
  trend: TrendDirection;
  title?: string;
}

const CHART_HEIGHT = 120;
const MAX_MOOD_SCORE = 10;
const MIN_BAR_HEIGHT = 6;

/** Map mood strings to a numeric score if moodScore isn't present */
function moodToScore(mood: string, moodScore?: number): number {
  if (moodScore !== undefined) return moodScore;
  const map: Record<string, number> = {
    very_sad: 2,
    sad: 4,
    neutral: 5,
    happy: 7,
    very_happy: 9,
  };
  return map[mood] ?? 5;
}

/** Bar color based on score */
function getBarColor(
  score: number,
  colors: { success: string; primary: string; error: string }
): string {
  if (score >= 7) return colors.success;
  if (score >= 4) return colors.primary;
  return colors.error;
}

/** Trend configuration */
function getTrendConfig(trend: TrendDirection): {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  colorKey: 'success' | 'error' | 'textSecondary';
} {
  switch (trend) {
    case 'improving':
      return { icon: 'trending-up', label: 'Improving', colorKey: 'success' };
    case 'declining':
      return { icon: 'trending-down', label: 'Declining', colorKey: 'error' };
    case 'stable':
    default:
      return { icon: 'minus', label: 'Stable', colorKey: 'textSecondary' };
  }
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({
  moodData,
  trend,
  title = 'Mood Trends',
}) => {
  const { theme } = useAppTheme();

  const trendConfig = useMemo(() => getTrendConfig(trend), [trend]);

  // Limit visible bars to prevent overcrowding
  const visibleData = useMemo(() => {
    return moodData.slice(-14); // show last 14 data points max
  }, [moodData]);

  // Empty state
  if (visibleData.length === 0) {
    return (
      <GlassCard style={styles.card} blurEnabled={false}>
        <View style={styles.header}>
          <AppText variant="headline" color={theme.colors.text}>
            {title}
          </AppText>
        </View>
        <View style={styles.emptyState}>
          <Feather name="bar-chart-2" size={28} color={theme.colors.textMuted} />
          <AppText variant="subheadline" color={theme.colors.textTertiary}>
            Not enough data yet
          </AppText>
          <AppText variant="caption1" color={theme.colors.textMuted}>
            Keep journaling to see your mood trends
          </AppText>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.card} blurEnabled={false}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="headline" color={theme.colors.text}>
          {title}
        </AppText>
        <View style={[styles.trendBadge, { backgroundColor: theme.colors.fillQuaternary }]}>
          <Feather name={trendConfig.icon} size={12} color={theme.colors[trendConfig.colorKey]} />
          <AppText
            variant="caption2"
            color={theme.colors[trendConfig.colorKey]}
            style={styles.trendLabel}
          >
            {trendConfig.label}
          </AppText>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {visibleData.map((point, index) => {
          const score = moodToScore(point.mood, point.moodScore);
          const barHeight = Math.max((score / MAX_MOOD_SCORE) * CHART_HEIGHT, MIN_BAR_HEIGHT);
          const barColor = getBarColor(score, theme.colors);

          // Date label: show first, last, and every ~4th
          const showLabel =
            index === 0 ||
            index === visibleData.length - 1 ||
            index % Math.max(1, Math.floor(visibleData.length / 4)) === 0;

          const dateLabel = formatDateLabel(point.date);

          return (
            <View key={point.entryId || index} style={styles.barWrapper}>
              <View style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              {showLabel ? (
                <AppText variant="caption2" color={theme.colors.textMuted} style={styles.dateLabel}>
                  {dateLabel}
                </AppText>
              ) : (
                <View style={styles.datePlaceholder} />
              )}
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

/** Format a date string (e.g. "2025-01-15") to abbreviated label */
function formatDateLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr.slice(5); // fallback: "01-15"
  }
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 4,
    minWidth: 6,
    width: '100%',
  },
  barColumn: {
    alignItems: 'center',
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    width: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  card: {
    padding: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 16,
  },
  dateLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  datePlaceholder: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendBadge: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendLabel: {
    fontWeight: '600',
  },
});
