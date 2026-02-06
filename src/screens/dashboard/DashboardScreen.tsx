/**
 * DashboardScreen — Apple Glass Aesthetic
 * =========================================
 * Full analytics dashboard powered by useDashboardAnalytics hook.
 * Features: TimePeriodSelector, MoodTrendChart, InsightsSummary,
 * skeleton loading states, and feature-gate upgrade CTA.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { SkeletonLoader } from '@components/common/SkeletonLoader';
import { TimePeriodSelector } from '@components/dashboard/TimePeriodSelector';
import { MoodTrendChart } from '@components/dashboard/MoodTrendChart';
import { useAppTheme } from '@hooks/useAppTheme';
import { useJournalEntries } from '@hooks/useJournalEntries';
import { useDashboardAnalytics } from '@hooks/useDashboardAnalytics';
import { useFeatureGate } from '@hooks/useFeatureGate';
import type { TrendDirection } from '@services/analytics/analyticsService';
import type { MainTabScreenProps } from '@navigation/types';
import type { EmotionalTheme } from '@/types/journal';

type Props = MainTabScreenProps<'ExploreTab'>;

// ============================================
// Main Component
// ============================================

export const DashboardScreen = (_props: Props) => {
  const { entries } = useJournalEntries();
  const { theme } = useAppTheme();
  const { allowed: analyticsAllowed, showPaywall } = useFeatureGate('analytics');

  const {
    moodTrends,
    insights,
    recoveryProgress,
    patternInsights,
    weeklySummary,
    isLoading,
    error,
    selectedPeriod,
    setSelectedPeriod,
    refresh,
  } = useDashboardAnalytics();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const localStats = useMemo(
    () => ({
      streak: weeklySummary?.summary.streakMaintained ? 7 : entries.length,
      entriesCount: entries.length,
      totalMinutes: Math.round(entries.reduce((sum, e) => sum + (e.duration || 0) / 60000, 0)),
    }),
    [entries, weeklySummary]
  );

  return (
    <ScreenContainer
      testID="dashboard-screen"
      scrollable
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="largeTitle" color={theme.colors.text}>
          Insights
        </AppText>
        <AppText variant="subheadline" color={theme.colors.textSecondary}>
          The mental side of healing
        </AppText>
      </View>

      {/* Time Period Selector */}
      <TimePeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        disabled={isLoading}
      />

      {/* Upgrade CTA (if not subscribed) */}
      {!analyticsAllowed && (
        <View style={styles.sectionWrap}>
          <GlassCard variant="tinted" style={styles.upgradeCta} blurEnabled={false}>
            <View style={styles.upgradeRow}>
              <View style={styles.upgradeContent}>
                <AppText variant="headline" color={theme.colors.text}>
                  Unlock Insights
                </AppText>
                <AppText variant="subheadline" color={theme.colors.textSecondary}>
                  See mood trends, pattern analysis, and AI-powered recovery insights.
                </AppText>
              </View>
              <View style={[styles.upgradeIcon, { backgroundColor: theme.colors.primarySubtle }]}>
                <Feather name="lock" size={20} color={theme.colors.primary} />
              </View>
            </View>
            <PrimaryButton label="Upgrade to Pro" onPress={showPaywall} size="md" />
          </GlassCard>
        </View>
      )}

      {/* Quick Stats */}
      {isLoading && !moodTrends ? (
        <View style={styles.sectionWrap}>
          <SkeletonLoader.StatRow />
        </View>
      ) : (
        <View style={styles.metricsGrid}>
          <MetricCard value={localStats.streak} label="Day Streak" icon="zap" theme={theme} />
          <MetricCard
            value={localStats.entriesCount}
            label="Entries"
            icon="book-open"
            theme={theme}
          />
          <MetricCard value={localStats.totalMinutes} label="Voice Min" icon="mic" theme={theme} />
          <MetricCard
            value={recoveryProgress?.averageMetrics.hopeLevel?.toFixed(1) || '–'}
            label="Avg Hope"
            icon="sun"
            trend={recoveryProgress?.metricTrends.hope}
            theme={theme}
          />
        </View>
      )}

      {/* Mood Trend Chart */}
      {analyticsAllowed && (
        <View style={styles.sectionWrap}>
          {isLoading && !moodTrends ? (
            <GlassCard style={styles.sectionContent} blurEnabled={false}>
              <SkeletonLoader.Chart />
            </GlassCard>
          ) : moodTrends ? (
            <MoodTrendChart moodData={moodTrends.moodData} trend={moodTrends.trend} />
          ) : null}
        </View>
      )}

      {/* Insights Summary */}
      {analyticsAllowed && insights && !insights.insufficientData && (
        <View style={styles.sectionWrap}>
          <SectionCard title="Insights Summary" icon="bar-chart-2" theme={theme}>
            {/* Top Topics */}
            {insights.topTopics.length > 0 && (
              <View style={styles.topicGroup}>
                <AppText
                  variant="caption1"
                  color={theme.colors.textTertiary}
                  style={styles.subLabel}
                >
                  Top Topics
                </AppText>
                <View style={styles.topicRow}>
                  {insights.topTopics.slice(0, 5).map((topic, i) => (
                    <View
                      key={i}
                      style={[styles.topicBadge, { backgroundColor: theme.colors.fillQuaternary }]}
                    >
                      <AppText variant="footnote" color={theme.colors.textSecondary}>
                        {topic}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Sentiment Distribution */}
            <View style={styles.sentimentGroup}>
              <AppText variant="caption1" color={theme.colors.textTertiary} style={styles.subLabel}>
                Sentiment
              </AppText>
              <View style={styles.sentimentBarOuter}>
                <View
                  style={[
                    styles.sentimentBarSegment,
                    {
                      flex: insights.sentimentDistribution.positive || 1,
                      backgroundColor: theme.colors.success,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.sentimentBarSegment,
                    {
                      flex: insights.sentimentDistribution.neutral || 1,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.sentimentBarSegment,
                    {
                      flex: insights.sentimentDistribution.negative || 1,
                      backgroundColor: theme.colors.error,
                    },
                  ]}
                />
              </View>
              <View style={styles.sentimentLegend}>
                <SentimentLabel
                  color={theme.colors.success}
                  label="Positive"
                  value={insights.sentimentDistribution.positive}
                  theme={theme}
                />
                <SentimentLabel
                  color={theme.colors.primary}
                  label="Neutral"
                  value={insights.sentimentDistribution.neutral}
                  theme={theme}
                />
                <SentimentLabel
                  color={theme.colors.error}
                  label="Negative"
                  value={insights.sentimentDistribution.negative}
                  theme={theme}
                />
              </View>
            </View>

            {/* Suggested Actions */}
            {insights.suggestedActions.length > 0 && (
              <View style={[styles.actionsGroup, { borderTopColor: theme.colors.divider }]}>
                <AppText
                  variant="caption1"
                  color={theme.colors.textTertiary}
                  style={styles.subLabel}
                >
                  Suggested Actions
                </AppText>
                {insights.suggestedActions.slice(0, 3).map((action, i) => (
                  <View key={i} style={styles.actionItem}>
                    <Feather name="arrow-right" size={12} color={theme.colors.primary} />
                    <AppText
                      variant="subheadline"
                      color={theme.colors.text}
                      style={styles.actionText}
                    >
                      {action}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>
        </View>
      )}

      {/* Insights skeleton */}
      {analyticsAllowed && isLoading && !insights && (
        <View style={styles.sectionWrap}>
          <GlassCard style={styles.sectionContent} blurEnabled={false}>
            <SkeletonLoader.Text lines={4} />
          </GlassCard>
        </View>
      )}

      {/* Weekly Summary */}
      {weeklySummary && !weeklySummary.insufficientData && (
        <View style={styles.sectionWrap}>
          <SectionCard title="This Week" icon="calendar" theme={theme}>
            <AppText variant="title3" color={theme.colors.text} style={styles.weeklyHeadline}>
              {weeklySummary.summary.headline}
            </AppText>

            {weeklySummary.emotionalJourney.emotionalThemes.length > 0 && (
              <View style={styles.themesContainer}>
                {weeklySummary.emotionalJourney.emotionalThemes.slice(0, 4).map((t, i) => (
                  <EmotionalThemeBadge key={i} theme={t} appTheme={theme} />
                ))}
              </View>
            )}

            {weeklySummary.highlights.length > 0 && (
              <View style={styles.highlightsContainer}>
                <AppText variant="caption1" color={theme.colors.textTertiary}>
                  Highlights
                </AppText>
                {weeklySummary.highlights.slice(0, 2).map((h, i) => (
                  <View key={i} style={styles.highlightItem}>
                    <Feather name="check-circle" size={14} color={theme.colors.success} />
                    <AppText variant="body" color={theme.colors.text} style={styles.highlightText}>
                      {h}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {weeklySummary.encouragement && (
              <View
                style={[styles.encouragementBox, { backgroundColor: theme.colors.fillQuaternary }]}
              >
                <AppText
                  variant="body"
                  color={theme.colors.textSecondary}
                  style={styles.encouragementText}
                >
                  &ldquo;{weeklySummary.encouragement}&rdquo;
                </AppText>
              </View>
            )}
          </SectionCard>
        </View>
      )}

      {/* Recovery Progress */}
      {recoveryProgress && !recoveryProgress.insufficientData && (
        <View style={styles.sectionWrap}>
          <SectionCard title="Recovery Trends" icon="trending-up" theme={theme}>
            <View style={styles.trendsGrid}>
              <TrendItem
                label="Hope"
                trend={recoveryProgress.metricTrends.hope}
                value={recoveryProgress.averageMetrics.hopeLevel}
                theme={theme}
              />
              <TrendItem
                label="Energy"
                trend={recoveryProgress.metricTrends.energy}
                value={recoveryProgress.averageMetrics.energyLevel}
                theme={theme}
              />
              <TrendItem
                label="Fear"
                trend={recoveryProgress.metricTrends.fear}
                value={recoveryProgress.averageMetrics.fearLevel}
                invertColors
                theme={theme}
              />
              <TrendItem
                label="Identity"
                trend={recoveryProgress.metricTrends.identity}
                value={recoveryProgress.averageMetrics.identityScore}
                theme={theme}
              />
            </View>

            {recoveryProgress.significantChanges.length > 0 && (
              <View style={[styles.changesContainer, { borderTopColor: theme.colors.divider }]}>
                {recoveryProgress.significantChanges.slice(0, 2).map((change, i) => (
                  <View key={i} style={styles.changeItem}>
                    <Feather
                      name={change.direction === 'up' ? 'arrow-up-circle' : 'arrow-down-circle'}
                      size={16}
                      color={
                        change.metric === 'Fear' || change.metric === 'Pain'
                          ? change.direction === 'down'
                            ? theme.colors.success
                            : theme.colors.error
                          : change.direction === 'up'
                            ? theme.colors.success
                            : theme.colors.error
                      }
                    />
                    <AppText
                      variant="footnote"
                      color={theme.colors.textSecondary}
                      style={styles.changeText}
                    >
                      {change.description}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>
        </View>
      )}

      {/* Pattern Insights */}
      {patternInsights && !patternInsights.insufficientData && (
        <View style={styles.sectionWrap}>
          <SectionCard title="Patterns & Insights" icon="sun" theme={theme}>
            {patternInsights.actionableInsights.length > 0 && (
              <View style={styles.insightsContainer}>
                {patternInsights.actionableInsights.slice(0, 3).map((insight, i) => (
                  <View key={i} style={styles.insightItem}>
                    <View style={[styles.insightBullet, { backgroundColor: theme.colors.primary }]}>
                      <AppText variant="caption2" color="#FFFFFF">
                        {i + 1}
                      </AppText>
                    </View>
                    <AppText variant="body" color={theme.colors.text} style={styles.insightText}>
                      {insight}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {patternInsights.positiveCorrelations.length > 0 && (
              <View
                style={[styles.correlationsContainer, { borderTopColor: theme.colors.divider }]}
              >
                <AppText variant="caption1" color={theme.colors.success}>
                  What helps your good days
                </AppText>
                <AppText variant="subheadline" color={theme.colors.textSecondary}>
                  {patternInsights.positiveCorrelations.slice(0, 2).join(' · ')}
                </AppText>
              </View>
            )}
          </SectionCard>
        </View>
      )}

      {/* Empty State */}
      {!isLoading &&
        (!weeklySummary || weeklySummary.insufficientData) &&
        (!recoveryProgress || recoveryProgress.insufficientData) &&
        (!moodTrends || moodTrends.insufficientData) && (
          <View style={styles.sectionWrap}>
            <SectionCard title="Getting Started" icon="info" theme={theme}>
              <AppText variant="body" color={theme.colors.textSecondary}>
                Keep journaling to unlock personalized insights about your recovery journey.
              </AppText>
              <View style={styles.featureList}>
                <FeatureItem icon="calendar" text="Weekly emotional summaries" theme={theme} />
                <FeatureItem icon="trending-up" text="Mental recovery trends" theme={theme} />
                <FeatureItem icon="sun" text="AI-powered insights" theme={theme} />
              </View>
            </SectionCard>
          </View>
        )}

      {/* Error banner */}
      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.fillQuaternary }]}>
          <AppText variant="footnote" color={theme.colors.textSecondary}>
            {error}
          </AppText>
          <Pressable onPress={handleRefresh}>
            <AppText variant="footnote" color={theme.colors.primary} style={styles.retryText}>
              Retry
            </AppText>
          </Pressable>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScreenContainer>
  );
};

// ============================================
// Helper Components
// ============================================

interface MetricCardProps {
  value: string | number;
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  trend?: TrendDirection;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const MetricCard = ({ value, label, icon, trend, theme }: MetricCardProps) => {
  const getTrendIcon = (): keyof typeof Feather.glyphMap => {
    if (trend === 'improving') return 'trending-up';
    if (trend === 'declining') return 'trending-down';
    return 'minus';
  };

  const getTrendColor = () => {
    if (trend === 'improving') return theme.colors.success;
    if (trend === 'declining') return theme.colors.error;
    return theme.colors.textTertiary;
  };

  return (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.metricHeader}>
        {icon && (
          <View style={[styles.metricIconWrap, { backgroundColor: theme.colors.fillQuaternary }]}>
            <Feather name={icon} size={14} color={theme.colors.primary} />
          </View>
        )}
        {trend && <Feather name={getTrendIcon()} size={14} color={getTrendColor()} />}
      </View>
      <AppText variant="title2" color={theme.colors.text}>
        {value}
      </AppText>
      <AppText variant="caption1" color={theme.colors.textTertiary}>
        {label}
      </AppText>
    </View>
  );
};

interface SectionCardProps {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
  theme: ReturnType<typeof useAppTheme>['theme'];
  onPress?: () => void;
}

const SectionCard = ({ title, icon, children, theme, onPress }: SectionCardProps) => (
  <GlassCard onPress={onPress} style={styles.sectionContent} blurEnabled={false}>
    <View style={styles.sectionHeader}>
      {icon && (
        <View style={[styles.sectionIcon, { backgroundColor: theme.colors.fillQuaternary }]}>
          <Feather name={icon} size={16} color={theme.colors.primary} />
        </View>
      )}
      <AppText variant="headline" color={theme.colors.text} style={styles.sectionTitle}>
        {title}
      </AppText>
      {onPress && <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />}
    </View>
    {children}
  </GlassCard>
);

const EmotionalThemeBadge = ({
  theme: emotionalTheme,
  appTheme,
}: {
  theme: EmotionalTheme;
  appTheme: ReturnType<typeof useAppTheme>['theme'];
}) => {
  const emojis: Record<EmotionalTheme, string> = {
    frustration: '😤',
    fear: '😰',
    grief: '😢',
    hope: '🌟',
    gratitude: '🙏',
    determination: '💪',
    isolation: '🏠',
    acceptance: '☮️',
    celebration: '🎉',
  };

  return (
    <View style={[styles.themeBadge, { backgroundColor: appTheme.colors.fillQuaternary }]}>
      <AppText variant="footnote" color={appTheme.colors.textSecondary}>
        {emojis[emotionalTheme] || '•'} {emotionalTheme}
      </AppText>
    </View>
  );
};

interface TrendItemProps {
  label: string;
  trend: TrendDirection;
  value?: number;
  invertColors?: boolean;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const TrendItem = ({ label, trend, value, invertColors, theme }: TrendItemProps) => {
  const getColor = () => {
    if (invertColors) {
      if (trend === 'improving') return theme.colors.error;
      if (trend === 'declining') return theme.colors.success;
    } else {
      if (trend === 'improving') return theme.colors.success;
      if (trend === 'declining') return theme.colors.error;
    }
    return theme.colors.textTertiary;
  };

  const getIcon = (): keyof typeof Feather.glyphMap => {
    if (trend === 'improving') return invertColors ? 'arrow-down' : 'arrow-up';
    if (trend === 'declining') return invertColors ? 'arrow-up' : 'arrow-down';
    return 'minus';
  };

  return (
    <View style={styles.trendItem}>
      <AppText variant="caption1" color={theme.colors.textTertiary}>
        {label}
      </AppText>
      <View style={styles.trendValue}>
        <AppText variant="title3" color={theme.colors.text}>
          {value?.toFixed(1) || '–'}
        </AppText>
        <Feather name={getIcon()} size={14} color={getColor()} />
      </View>
    </View>
  );
};

interface SentimentLabelProps {
  color: string;
  label: string;
  value: number;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const SentimentLabel = ({ color, label, value, theme }: SentimentLabelProps) => (
  <View style={styles.sentimentItem}>
    <View style={[styles.sentimentDot, { backgroundColor: color }]} />
    <AppText variant="caption2" color={theme.colors.textTertiary}>
      {label} {value}%
    </AppText>
  </View>
);

interface FeatureItemProps {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const FeatureItem = ({ icon, text, theme }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIcon, { backgroundColor: theme.colors.fillQuaternary }]}>
      <Feather name={icon} size={14} color={theme.colors.primary} />
    </View>
    <AppText variant="body" color={theme.colors.text}>
      {text}
    </AppText>
  </View>
);

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    flex: 1,
  },
  actionsGroup: {
    borderTopWidth: 0.5,
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
  },
  bottomSpacing: {
    height: 40,
  },
  changeItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  changeText: {
    flex: 1,
  },
  changesContainer: {
    borderTopWidth: 0.5,
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
  },
  correlationsContainer: {
    borderTopWidth: 0.5,
    gap: 4,
    marginTop: 16,
    paddingTop: 14,
  },
  encouragementBox: {
    borderRadius: 12,
    marginTop: 16,
    padding: 14,
  },
  encouragementText: {
    fontStyle: 'italic',
  },
  errorBanner: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 12,
  },
  featureIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  featureList: {
    gap: 14,
    marginTop: 16,
  },
  header: {
    gap: 4,
    marginBottom: 16,
    paddingTop: 8,
  },
  highlightItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  highlightText: {
    flex: 1,
  },
  highlightsContainer: {
    gap: 8,
    marginTop: 16,
  },
  insightBullet: {
    alignItems: 'center',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  insightItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  insightText: {
    flex: 1,
  },
  insightsContainer: {
    gap: 12,
  },
  metricCard: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    gap: 4,
    minWidth: '45%',
    padding: 14,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
  },
  metricIconWrap: {
    alignItems: 'center',
    borderRadius: 7,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  retryText: {
    fontWeight: '600',
  },
  sectionContent: {
    padding: 18,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionWrap: {
    marginTop: 16,
  },
  sentimentBarOuter: {
    borderRadius: 4,
    flexDirection: 'row',
    height: 8,
    overflow: 'hidden',
  },
  sentimentBarSegment: {
    height: '100%',
  },
  sentimentDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  sentimentGroup: {
    gap: 8,
    marginTop: 14,
  },
  sentimentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  sentimentLegend: {
    flexDirection: 'row',
    gap: 14,
  },
  subLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  themeBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  topicBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  topicGroup: {
    gap: 6,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  trendValue: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  trendsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  upgradeContent: {
    flex: 1,
    gap: 4,
  },
  upgradeCta: {
    gap: 16,
    padding: 20,
  },
  upgradeIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  upgradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  weeklyHeadline: {
    marginBottom: 4,
  },
});
