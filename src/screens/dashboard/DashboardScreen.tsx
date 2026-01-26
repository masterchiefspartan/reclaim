/**
 * Enhanced Dashboard Screen for Re:Claim
 *
 * Displays comprehensive recovery analytics including:
 * - Weekly summary with AI-generated insights
 * - Recovery progress and metric trends
 * - Pattern insights and correlations
 * - Core stats (streak, entries, voice minutes)
 *
 * Re:Claim focuses on the MENTAL side of recovery.
 */

import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { LoadingState } from '@components/common/LoadingState';
import { ErrorState } from '@components/common/ErrorState';
import { useAppTheme } from '@hooks/useAppTheme';
import { useJournalEntries } from '@hooks/useJournalEntries';
import {
  getWeeklySummary,
  getRecoveryProgress,
  getPatternInsights,
  type WeeklySummaryResponse,
  type RecoveryProgressResponse,
  type PatternInsightsResponse,
  type TrendDirection,
} from '@services/analytics/analyticsService';
import { logger } from '@utils/logger';
import type { MainTabScreenProps } from '@navigation/types';
import type { EmotionalTheme } from '@/types/journal';

type Props = MainTabScreenProps<'DashboardTab'>;

// ============================================
// Types
// ============================================

interface DashboardState {
  weeklySummary: WeeklySummaryResponse | null;
  recoveryProgress: RecoveryProgressResponse | null;
  patternInsights: PatternInsightsResponse | null;
  isLoading: boolean;
  error: string | null;
}

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
    if (trend === 'improving') return '#52C41A';
    if (trend === 'declining') return theme.colors.error;
    return theme.colors.textSecondary;
  };

  return (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.metricHeader}>
        {icon && <Feather name={icon} size={16} color={theme.colors.textSecondary} />}
        {trend && <Feather name={getTrendIcon()} size={14} color={getTrendColor()} />}
      </View>
      <AppText variant="h2" style={styles.metricValue}>
        {value}
      </AppText>
      <AppText variant="caption" color={theme.colors.textSecondary}>
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

const SectionCard = ({ title, icon, children, theme, onPress }: SectionCardProps) => {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={[
        styles.sectionCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.sectionHeader}>
        {icon && (
          <View style={[styles.sectionIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
            <Feather name={icon} size={18} color={theme.colors.primary} />
          </View>
        )}
        <AppText variant="h3" style={styles.sectionTitle}>
          {title}
        </AppText>
        {onPress && <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />}
      </View>
      {children}
    </Container>
  );
};

const EmotionalThemeBadge = ({
  theme: emotionalTheme,
  appTheme,
}: {
  theme: EmotionalTheme;
  appTheme: ReturnType<typeof useAppTheme>['theme'];
}) => {
  const getThemeEmoji = () => {
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
    return emojis[emotionalTheme] || '•';
  };

  return (
    <View style={[styles.themeBadge, { backgroundColor: `${appTheme.colors.primary}10` }]}>
      <AppText variant="caption">
        {getThemeEmoji()} {emotionalTheme}
      </AppText>
    </View>
  );
};

// ============================================
// Main Component
// ============================================

export const DashboardScreen = (_props: Props) => {
  const { entries, loading: entries: _entries } = useJournalEntries();
  const { theme } = useAppTheme();

  const [state, setState] = useState<DashboardState>({
    weeklySummary: null,
    recoveryProgress: null,
    patternInsights: null,
    isLoading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      // Fetch all analytics in parallel
      const [weeklySummary, recoveryProgress, patternInsights] = await Promise.all([
        getWeeklySummary(0).catch(err => {
          logger.warn('Failed to fetch weekly summary', { error: err });
          return null;
        }),
        getRecoveryProgress(30).catch(err => {
          logger.warn('Failed to fetch recovery progress', { error: err });
          return null;
        }),
        getPatternInsights(30).catch(err => {
          logger.warn('Failed to fetch pattern insights', { error: err });
          return null;
        }),
      ]);

      setState({
        weeklySummary,
        recoveryProgress,
        patternInsights,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      logger.error('Failed to fetch dashboard analytics', { error });
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to load analytics. Please try again.',
      }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAnalytics(false);
    setRefreshing(false);
  }, [fetchAnalytics]);

  // Calculate local stats from entries
  const localStats = {
    streak: state.weeklySummary?.summary.streakMaintained ? 7 : entries.length,
    entriesCount: entries.length,
    totalMinutes: Math.round(entries.reduce((sum, e) => sum + (e.duration || 0) / 60000, 0)),
  };

  // Loading state
  if (state.isLoading && !state.weeklySummary) {
    return (
      <ScreenContainer testID="dashboard-screen">
        <LoadingState message="Loading your recovery insights..." />
      </ScreenContainer>
    );
  }

  // Error state (only show if no data at all)
  if (state.error && !state.weeklySummary && !state.recoveryProgress) {
    return (
      <ScreenContainer testID="dashboard-screen">
        <ErrorState message={state.error} onRetry={() => fetchAnalytics()} />
      </ScreenContainer>
    );
  }

  const { weeklySummary, recoveryProgress, patternInsights } = state;

  return (
    <ScreenContainer testID="dashboard-screen" scrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="h2">Your Recovery Journey</AppText>
          <AppText variant="body" color={theme.colors.textSecondary}>
            The mental side of healing
          </AppText>
        </View>

        {/* Weekly Summary Card */}
        {weeklySummary && !weeklySummary.insufficientData && (
          <SectionCard title="This Week" icon="calendar" theme={theme}>
            <AppText variant="h3" style={styles.weeklyHeadline}>
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
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Highlights
                </AppText>
                {weeklySummary.highlights.slice(0, 2).map((h, i) => (
                  <View key={i} style={styles.highlightItem}>
                    <Feather name="check-circle" size={14} color={'#52C41A'} />
                    <AppText variant="body" style={styles.highlightText}>
                      {h}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {weeklySummary.encouragement && (
              <View
                style={[styles.encouragementBox, { backgroundColor: `${theme.colors.primary}08` }]}
              >
                <AppText variant="body" color={theme.colors.text} style={styles.encouragementText}>
                  &ldquo;{weeklySummary.encouragement}&rdquo;
                </AppText>
              </View>
            )}
          </SectionCard>
        )}

        {/* Quick Stats */}
        <View style={styles.metricsGrid}>
          <MetricCard value={localStats.streak} label="Day Streak" icon="zap" theme={theme} />
          <MetricCard
            value={localStats.entriesCount}
            label="Entries"
            icon="book-open"
            theme={theme}
          />
          <MetricCard
            value={localStats.totalMinutes}
            label="Voice Minutes"
            icon="mic"
            theme={theme}
          />
          <MetricCard
            value={recoveryProgress?.averageMetrics.hopeLevel?.toFixed(1) || '-'}
            label="Avg Hope"
            icon="sun"
            trend={recoveryProgress?.metricTrends.hope}
            theme={theme}
          />
        </View>

        {/* Recovery Progress */}
        {recoveryProgress && !recoveryProgress.insufficientData && (
          <SectionCard title="Mental Recovery Trends" icon="trending-up" theme={theme}>
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
              <View style={styles.changesContainer}>
                {recoveryProgress.significantChanges.slice(0, 2).map((change, i) => (
                  <View key={i} style={styles.changeItem}>
                    <Feather
                      name={change.direction === 'up' ? 'arrow-up-circle' : 'arrow-down-circle'}
                      size={16}
                      color={
                        change.metric === 'Fear' || change.metric === 'Pain'
                          ? change.direction === 'down'
                            ? '#52C41A'
                            : theme.colors.error
                          : change.direction === 'up'
                            ? '#52C41A'
                            : theme.colors.error
                      }
                    />
                    <AppText variant="caption" style={styles.changeText}>
                      {change.description}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>
        )}

        {/* Pattern Insights */}
        {patternInsights && !patternInsights.insufficientData && (
          <SectionCard title="Patterns & Insights" icon="sun" theme={theme}>
            {patternInsights.actionableInsights.length > 0 && (
              <View style={styles.insightsContainer}>
                {patternInsights.actionableInsights.slice(0, 3).map((insight, i) => (
                  <View key={i} style={styles.insightItem}>
                    <View style={[styles.insightBullet, { backgroundColor: theme.colors.primary }]}>
                      <AppText variant="caption" color={theme.colors.surface}>
                        {i + 1}
                      </AppText>
                    </View>
                    <AppText variant="body" style={styles.insightText}>
                      {insight}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {patternInsights.positiveCorrelations.length > 0 && (
              <View style={styles.correlationsContainer}>
                <AppText variant="caption" color={'#52C41A'}>
                  What helps your good days:
                </AppText>
                <AppText variant="body" color={theme.colors.textSecondary}>
                  {patternInsights.positiveCorrelations.slice(0, 2).join(' • ')}
                </AppText>
              </View>
            )}
          </SectionCard>
        )}

        {/* Empty State - Show when no analytics available */}
        {(!weeklySummary || weeklySummary.insufficientData) &&
          (!recoveryProgress || recoveryProgress.insufficientData) && (
            <SectionCard title="Getting Started" icon="info" theme={theme}>
              <AppText variant="body" color={theme.colors.textSecondary}>
                Keep journaling to unlock personalized insights about your recovery journey.
              </AppText>
              <AppText
                variant="body"
                color={theme.colors.textSecondary}
                style={styles.emptyStateText}
              >
                After a few entries, you will see:
              </AppText>
              <View style={styles.featureList}>
                <FeatureItem icon="calendar" text="Weekly emotional summaries" theme={theme} />
                <FeatureItem icon="trending-up" text="Mental recovery trends" theme={theme} />
                <FeatureItem icon="sun" text="AI-powered insights" theme={theme} />
              </View>
            </SectionCard>
          )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenContainer>
  );
};

// ============================================
// Additional Helper Components
// ============================================

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
      if (trend === 'improving') return theme.colors.error; // For fear/pain, improving means going down
      if (trend === 'declining') return '#52C41A';
    } else {
      if (trend === 'improving') return '#52C41A';
      if (trend === 'declining') return theme.colors.error;
    }
    return theme.colors.textSecondary;
  };

  const getIcon = (): keyof typeof Feather.glyphMap => {
    if (trend === 'improving') return invertColors ? 'arrow-down' : 'arrow-up';
    if (trend === 'declining') return invertColors ? 'arrow-up' : 'arrow-down';
    return 'minus';
  };

  return (
    <View style={styles.trendItem}>
      <AppText variant="caption" color={theme.colors.textSecondary}>
        {label}
      </AppText>
      <View style={styles.trendValue}>
        <AppText variant="h3">{value?.toFixed(1) || '-'}</AppText>
        <Feather name={getIcon()} size={14} color={getColor()} />
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const FeatureItem = ({ icon, text, theme }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <Feather name={icon} size={16} color={theme.colors.primary} />
    <AppText variant="body">{text}</AppText>
  </View>
);

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  bottomSpacing: {
    height: 32,
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
    borderTopColor: '#eee',
    borderTopWidth: 1,
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
  },
  correlationsContainer: {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    gap: 4,
    marginTop: 16,
    paddingTop: 12,
  },
  emptyStateText: {
    marginTop: 8,
  },
  encouragementBox: {
    borderRadius: 12,
    marginTop: 16,
    padding: 12,
  },
  encouragementText: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  featureList: {
    gap: 12,
    marginTop: 16,
  },
  header: {
    gap: 4,
    marginBottom: 20,
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
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  insightItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  insightText: {
    flex: 1,
    lineHeight: 22,
  },
  insightsContainer: {
    gap: 12,
  },
  metricCard: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minWidth: '45%',
    padding: 16,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sectionIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sectionTitle: {
    flex: 1,
  },
  themeBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
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
  weeklyHeadline: {
    lineHeight: 28,
  },
});
