/**
 * TimePeriodSelector — Apple Glass Aesthetic
 * =============================================
 * Horizontal pill selector for dashboard time periods.
 * Glass chrome background with primary fill on selected pill.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { GlassCard } from '@components/common/GlassCard';
import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import type { AnalyticsPeriod } from '@hooks/useDashboardAnalytics';

interface TimePeriodSelectorProps {
  selectedPeriod: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  disabled?: boolean;
}

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 7, label: '7d' },
  { value: 14, label: '14d' },
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
];

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  disabled = false,
}) => {
  const { theme } = useAppTheme();

  return (
    <GlassCard variant="chrome" style={styles.container} blurEnabled={false}>
      <View style={styles.pillRow}>
        {PERIODS.map(period => {
          const isSelected = selectedPeriod === period.value;
          return (
            <Pressable
              key={period.value}
              onPress={() => onPeriodChange(period.value)}
              disabled={disabled || isSelected}
              style={[styles.pill, isSelected && { backgroundColor: theme.colors.primary }]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Show ${period.label} data`}
            >
              <AppText
                variant="footnote"
                color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
                style={styles.pillText}
              >
                {period.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pillText: {
    fontWeight: '600',
  },
});
