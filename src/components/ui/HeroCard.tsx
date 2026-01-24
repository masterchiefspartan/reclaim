/**
 * HeroCard - Hero UI inspired card component
 * Clean, elevated card with soft shadows and smooth interactions
 */

import { View, Pressable, type ViewProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HeroCardProps extends ViewProps {
  /** Card variant */
  variant?: 'elevated' | 'outlined' | 'flat';
  /** Enable press animation */
  pressable?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Additional Tailwind classes */
  className?: string;
  children: React.ReactNode;
}

export const HeroCard = ({
  variant = 'elevated',
  pressable = false,
  onPress,
  className = '',
  children,
  ...props
}: HeroCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    'worklet';
    if (pressable) {
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withSpring(0.98, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    'worklet';
    if (pressable) {
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const baseClasses = 'rounded-hero-xl p-hero-xl';

  const variantClasses = {
    elevated:
      'bg-light-surface dark:bg-dark-surface shadow-hero border border-light-border dark:border-dark-border',
    outlined: 'bg-transparent border-2 border-light-border dark:border-dark-border',
    flat: 'bg-light-muted dark:bg-dark-muted',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (pressable || onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        className={combinedClasses}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View className={combinedClasses} {...props}>
      {children}
    </View>
  );
};

/**
 * Card Header component
 */
export const HeroCardHeader = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <View className={`mb-hero-md ${className}`}>{children}</View>;

/**
 * Card Content component
 */
export const HeroCardContent = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <View className={className}>{children}</View>;

/**
 * Card Footer component
 */
export const HeroCardFooter = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <View
    className={`mt-hero-lg pt-hero-md border-t border-light-border dark:border-dark-border ${className}`}
  >
    {children}
  </View>
);
