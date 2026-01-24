/**
 * HeroButton - Hero UI inspired button component
 * Clean, vibrant buttons with smooth press animations
 */

import { Pressable, ActivityIndicator, type PressableProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { HeroText } from './HeroText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'light';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonColor = 'primary' | 'secondary' | 'accent' | 'error' | 'success';

interface HeroButtonProps extends Omit<PressableProps, 'children'> {
  /** Button text */
  label: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Color scheme */
  color?: ButtonColor;
  /** Loading state */
  isLoading?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 rounded-hero',
  md: 'h-12 px-6 rounded-hero-lg',
  lg: 'h-14 px-8 rounded-hero-xl',
};

const textSizes: Record<ButtonSize, 'sm' | 'base' | 'lg'> = {
  sm: 'sm',
  md: 'base',
  lg: 'lg',
};

const colorClasses: Record<ButtonColor, Record<ButtonVariant, { bg: string; text: string }>> = {
  primary: {
    solid: { bg: 'bg-brand-primary', text: 'text-white' },
    outline: { bg: 'bg-transparent border-2 border-brand-primary', text: 'text-brand-primary' },
    ghost: { bg: 'bg-transparent', text: 'text-brand-primary' },
    light: { bg: 'bg-brand-primary/10', text: 'text-brand-primary' },
  },
  secondary: {
    solid: { bg: 'bg-brand-secondary', text: 'text-white' },
    outline: { bg: 'bg-transparent border-2 border-brand-secondary', text: 'text-brand-secondary' },
    ghost: { bg: 'bg-transparent', text: 'text-brand-secondary' },
    light: { bg: 'bg-brand-secondary/10', text: 'text-brand-secondary' },
  },
  accent: {
    solid: { bg: 'bg-brand-accent', text: 'text-white' },
    outline: { bg: 'bg-transparent border-2 border-brand-accent', text: 'text-brand-accent' },
    ghost: { bg: 'bg-transparent', text: 'text-brand-accent' },
    light: { bg: 'bg-brand-accent/10', text: 'text-brand-accent' },
  },
  error: {
    solid: { bg: 'bg-error', text: 'text-white' },
    outline: { bg: 'bg-transparent border-2 border-error', text: 'text-error' },
    ghost: { bg: 'bg-transparent', text: 'text-error' },
    light: { bg: 'bg-error/10', text: 'text-error' },
  },
  success: {
    solid: { bg: 'bg-success', text: 'text-white' },
    outline: { bg: 'bg-transparent border-2 border-success', text: 'text-success' },
    ghost: { bg: 'bg-transparent', text: 'text-success' },
    light: { bg: 'bg-success/10', text: 'text-success' },
  },
};

export const HeroButton = ({
  label,
  variant = 'solid',
  size = 'md',
  color = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: HeroButtonProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    'worklet';
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.97, { damping: 15 });
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    'worklet';
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, { damping: 15 });
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withSpring(1, { damping: 15 });
  };

  const isDisabled = disabled || isLoading;
  const { bg, text } = colorClasses[color][variant];

  const buttonClasses = `
    ${sizeClasses[size]}
    ${bg}
    ${fullWidth ? 'w-full' : ''}
    flex-row items-center justify-center gap-2
    ${isDisabled ? 'opacity-50' : ''}
    ${className}
  `.trim();

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={animatedStyle}
      className={buttonClasses}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === 'solid' ? '#FFFFFF' : undefined} />
      ) : (
        <>
          {leftIcon}
          <HeroText size={textSizes[size]} weight="semibold" className={text}>
            {label}
          </HeroText>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
};

/**
 * Icon-only button variant
 */
interface HeroIconButtonProps extends Omit<PressableProps, 'children'> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  className?: string;
}

export const HeroIconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  color = 'primary',
  disabled,
  className = '',
  ...props
}: HeroIconButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    'worklet';
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    'worklet';
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, { damping: 15 });
  };

  const sizeMap = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  const { bg } = colorClasses[color][variant];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={`${sizeMap[size]} ${bg} rounded-full items-center justify-center ${disabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="button"
      {...props}
    >
      {icon}
    </AnimatedPressable>
  );
};
