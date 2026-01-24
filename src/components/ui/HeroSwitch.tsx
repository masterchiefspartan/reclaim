/**
 * HeroSwitch - Hero UI inspired toggle/switch component
 * Clean, modern toggle with smooth animations
 */

import { Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { HeroText } from './HeroText';

type SwitchSize = 'sm' | 'md' | 'lg';

interface HeroSwitchProps {
  /** Controlled value */
  value: boolean;
  /** Change handler */
  onValueChange: (value: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size preset */
  size?: SwitchSize;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Additional classes */
  className?: string;
}

const sizeConfig: Record<SwitchSize, { track: string; thumb: string; translate: number }> = {
  sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 16 },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 20 },
  lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 24 },
};

export const HeroSwitch = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
}: HeroSwitchProps) => {
  const config = sizeConfig[size];
  const translateX = useSharedValue(value ? config.translate : 0);
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = withSpring(value ? config.translate : 0, {
      damping: 15,
      stiffness: 200,
    });
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, config.translate]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#E9D6E0', '#C85A8C']),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const SwitchComponent = (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={trackStyle}
        className={`
          ${config.track}
          rounded-full
          justify-center
          px-0.5
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        <Animated.View
          style={thumbStyle}
          className={`
            ${config.thumb}
            rounded-full
            bg-white
            shadow-hero-sm
          `}
        />
      </Animated.View>
    </Pressable>
  );

  if (label || description) {
    return (
      <View className={`flex-row items-center justify-between ${className}`}>
        <View className="flex-1 mr-4">
          {label && <HeroText weight="medium">{label}</HeroText>}
          {description && (
            <HeroText size="sm" variant="secondary" className="mt-0.5">
              {description}
            </HeroText>
          )}
        </View>
        {SwitchComponent}
      </View>
    );
  }

  return <View className={className}>{SwitchComponent}</View>;
};
