/**
 * SkeletonLoader — Apple Glass Aesthetic
 * =========================================
 * Animated pulsing rectangles for loading states.
 * Includes preset variants for Card, Text, and Chart.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

/** Single pulsing skeleton rectangle */
const SkeletonRect: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const { theme } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: theme.colors.fillQuaternary,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};

// ============================================
// Preset Variants
// ============================================

/** Skeleton for a full card (e.g. GlassCard size) */
const CardSkeleton: React.FC<{ style?: object }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <SkeletonRect width="40%" height={14} />
    <View style={styles.cardGap} />
    <SkeletonRect height={60} borderRadius={12} />
  </View>
);

/** Skeleton for a text block with multiple lines */
const TextSkeleton: React.FC<{ lines?: number; style?: object }> = ({ lines = 3, style }) => (
  <View style={[styles.textBlock, style]}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonRect key={i} width={i === lines - 1 ? '60%' : '100%'} height={12} borderRadius={6} />
    ))}
  </View>
);

/** Skeleton for a chart area */
const ChartSkeleton: React.FC<{ style?: object }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <View style={styles.chartHeader}>
      <SkeletonRect width="35%" height={14} />
      <SkeletonRect width={60} height={22} borderRadius={11} />
    </View>
    <View style={styles.chartGap} />
    <View style={styles.chartBars}>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonRect key={i} width={18} height={30 + Math.random() * 60} borderRadius={4} />
      ))}
    </View>
  </View>
);

/** Skeleton for a stat row (3 stat cards side by side) */
const StatRowSkeleton: React.FC<{ style?: object }> = ({ style }) => (
  <View style={[styles.statRow, style]}>
    {Array.from({ length: 3 }).map((_, i) => (
      <View key={i} style={styles.statCard}>
        <SkeletonRect width={28} height={28} borderRadius={8} />
        <SkeletonRect width="60%" height={20} />
        <SkeletonRect width="80%" height={10} />
      </View>
    ))}
  </View>
);

// ============================================
// Compound Export
// ============================================

export const SkeletonLoader = Object.assign(SkeletonRect, {
  Card: CardSkeleton,
  Text: TextSkeleton,
  Chart: ChartSkeleton,
  StatRow: StatRowSkeleton,
});

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
  },
  cardGap: {
    height: 8,
  },
  chartBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    height: 90,
    justifyContent: 'center',
  },
  chartGap: {
    height: 12,
  },
  chartHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    padding: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textBlock: {
    gap: 8,
  },
});
