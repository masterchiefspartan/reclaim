/**
 * EmotionBars - Vertical bar chart showing emotion percentages
 * Displays mood distribution for a journal or time period
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import { moodColors } from '@/theme/brandKit';

type MoodType = 'happy' | 'sad' | 'calm' | 'anxious';

interface EmotionData {
  type: MoodType;
  percentage: number;
}

interface EmotionBarsProps {
  /** Array of emotion data with type and percentage */
  emotions: EmotionData[];
  /** Maximum bar height in pixels */
  maxHeight?: number;
  /** Whether to animate on mount */
  animate?: boolean;
}

interface BarProps {
  type: MoodType;
  percentage: number;
  maxHeight: number;
  index: number;
  animate: boolean;
}

const Bar = ({ type, percentage, maxHeight, index, animate }: BarProps) => {
  const { theme } = useAppTheme();
  const height = useSharedValue(animate ? 0 : (percentage / 100) * maxHeight);

  useEffect(() => {
    if (animate) {
      height.value = withDelay(
        index * 100,
        withTiming((percentage / 100) * maxHeight, { duration: 500 })
      );
    }
  }, [animate, percentage, maxHeight, index, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const moodData = moodColors[type];
  const barColor = moodData?.main || theme.colors.primary;

  return (
    <View style={styles.barContainer}>
      <View style={[styles.barTrack, { height: maxHeight, backgroundColor: theme.colors.border }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: barColor }, animatedStyle]} />
      </View>
      <AppText style={[styles.percentage, { color: theme.colors.text }]}>{percentage}%</AppText>
      <AppText style={[styles.label, { color: theme.colors.textSecondary }]}>
        {moodData?.label || type}
      </AppText>
    </View>
  );
};

export const EmotionBars = ({ emotions, maxHeight = 100, animate = true }: EmotionBarsProps) => {
  return (
    <View style={styles.container}>
      {emotions.map((emotion, index) => (
        <Bar
          key={emotion.type}
          type={emotion.type}
          percentage={emotion.percentage}
          maxHeight={maxHeight}
          index={index}
          animate={animate}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  barFill: {
    borderRadius: 4,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  barTrack: {
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    width: 32,
  },
  container: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
  },
});
