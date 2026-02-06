/**
 * usePressAnimation - Reusable hook for press scale animations
 *
 * Provides consistent press feedback animation across all interactive components.
 * Uses react-native-reanimated for smooth 60fps animations.
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  type SharedValue,
  type AnimatedStyle,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface PressAnimationConfig {
  /** Scale value when pressed (default: 0.97) */
  pressedScale?: number;
  /** Spring damping (default: 15) */
  damping?: number;
  /** Spring stiffness (default: 150) */
  stiffness?: number;
  /** Whether animation is enabled (default: true) */
  enabled?: boolean;
}

interface PressAnimationReturn {
  /** Animated style to apply to the component */
  animatedStyle: AnimatedStyle<ViewStyle>;
  /** Handler for onPressIn event */
  handlePressIn: () => void;
  /** Handler for onPressOut event */
  handlePressOut: () => void;
  /** Direct access to scale shared value (for advanced use) */
  scale: SharedValue<number>;
}

const DEFAULT_CONFIG: Required<PressAnimationConfig> = {
  pressedScale: 0.97,
  damping: 15,
  stiffness: 150,
  enabled: true,
};

/**
 * Hook for creating press animation effects on interactive components
 *
 * @example
 * ```tsx
 * const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();
 *
 * return (
 *   <AnimatedPressable
 *     style={animatedStyle}
 *     onPressIn={handlePressIn}
 *     onPressOut={handlePressOut}
 *   >
 *     <Text>Press me</Text>
 *   </AnimatedPressable>
 * );
 * ```
 */
export const usePressAnimation = (config?: PressAnimationConfig): PressAnimationReturn => {
  const { pressedScale, damping, stiffness, enabled } = { ...DEFAULT_CONFIG, ...config };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    if (enabled) {
      scale.value = withSpring(pressedScale, { damping, stiffness });
    }
  }, [enabled, pressedScale, damping, stiffness, scale]);

  const handlePressOut = useCallback(() => {
    'worklet';
    if (enabled) {
      scale.value = withSpring(1, { damping, stiffness });
    }
  }, [enabled, damping, stiffness, scale]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    scale,
  };
};

/**
 * Preset configurations for common use cases
 */
export const PRESS_ANIMATION_PRESETS = {
  /** Standard button press (scale to 0.97) */
  button: { pressedScale: 0.97 },
  /** Subtle press for cards (scale to 0.98) */
  card: { pressedScale: 0.98 },
  /** More pronounced press for icons (scale to 0.9) */
  icon: { pressedScale: 0.9 },
  /** Very subtle press (scale to 0.99) */
  subtle: { pressedScale: 0.99 },
} as const;
