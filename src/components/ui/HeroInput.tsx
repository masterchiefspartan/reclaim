/**
 * HeroInput - Hero UI inspired input component
 * Clean, modern inputs with smooth focus states
 */

import { useState, forwardRef } from 'react';
import { TextInput, View, Pressable, type TextInputProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { HeroText, HeroLabel } from './HeroText';

type InputVariant = 'outlined' | 'filled' | 'underlined';
type InputSize = 'sm' | 'md' | 'lg';

interface HeroInputProps extends Omit<TextInputProps, 'style'> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Visual variant */
  variant?: InputVariant;
  /** Size preset */
  size?: InputSize;
  /** Left icon name (Feather) */
  leftIcon?: keyof typeof Feather.glyphMap;
  /** Right icon name (Feather) */
  rightIcon?: keyof typeof Feather.glyphMap;
  /** Right icon press handler */
  onRightIconPress?: () => void;
  /** Full width */
  fullWidth?: boolean;
  /** Additional container classes */
  className?: string;
  /** Additional input classes */
  inputClassName?: string;
}

const sizeClasses: Record<InputSize, { container: string; text: string; icon: number }> = {
  sm: { container: 'h-10 px-3', text: 'text-sm', icon: 16 },
  md: { container: 'h-12 px-4', text: 'text-base', icon: 18 },
  lg: { container: 'h-14 px-5', text: 'text-lg', icon: 20 },
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const HeroInput = forwardRef<TextInput, HeroInputProps>(
  (
    {
      label,
      helperText,
      error,
      variant = 'outlined',
      size = 'md',
      leftIcon,
      rightIcon,
      onRightIconPress,
      fullWidth = true,
      className = '',
      inputClassName = '',
      editable = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderWidth = useSharedValue(variant === 'outlined' ? 1 : 0);

    const hasError = !!error;
    const sizeConfig = sizeClasses[size];

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderWidth: withTiming(isFocused ? 2 : borderWidth.value, { duration: 150 }),
    }));

    const getBorderColor = () => {
      if (hasError) return 'border-error';
      if (isFocused) return 'border-brand-primary';
      return 'border-light-border dark:border-dark-border';
    };

    const getBackgroundColor = () => {
      switch (variant) {
        case 'filled':
          return 'bg-light-muted dark:bg-dark-muted';
        case 'underlined':
          return 'bg-transparent border-b-2';
        default:
          return 'bg-light-surface dark:bg-dark-surface';
      }
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

    const inputContainerClasses = `
    ${sizeConfig.container}
    ${getBackgroundColor()}
    ${getBorderColor()}
    ${variant === 'underlined' ? 'rounded-none' : 'rounded-hero-lg'}
    flex-row items-center gap-3
    ${!editable ? 'opacity-50' : ''}
  `.trim();

    return (
      <View className={containerClasses}>
        {label && <HeroLabel>{label}</HeroLabel>}

        <AnimatedView
          style={variant !== 'underlined' ? animatedBorderStyle : undefined}
          className={inputContainerClasses}
        >
          {leftIcon && (
            <Feather
              name={leftIcon}
              size={sizeConfig.icon}
              className="text-light-text-secondary dark:text-dark-text-secondary"
            />
          )}

          <TextInput
            ref={ref}
            editable={editable}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
            flex-1
            ${sizeConfig.text}
            text-light-text dark:text-dark-text
            ${inputClassName}
          `}
            placeholderTextColor="#6F5B68"
            {...props}
          />

          {rightIcon && (
            <Pressable onPress={onRightIconPress} disabled={!onRightIconPress} hitSlop={8}>
              <Feather
                name={rightIcon}
                size={sizeConfig.icon}
                className="text-light-text-secondary dark:text-dark-text-secondary"
              />
            </Pressable>
          )}
        </AnimatedView>

        {(helperText || error) && (
          <HeroText size="xs" variant={hasError ? 'error' : 'secondary'} className="mt-1 ml-1">
            {error || helperText}
          </HeroText>
        )}
      </View>
    );
  }
);

HeroInput.displayName = 'HeroInput';

/**
 * Password input with toggle visibility
 */
export const HeroPasswordInput = forwardRef<
  TextInput,
  Omit<HeroInputProps, 'secureTextEntry' | 'rightIcon' | 'onRightIconPress'>
>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <HeroInput
      ref={ref}
      secureTextEntry={!isVisible}
      rightIcon={isVisible ? 'eye-off' : 'eye'}
      onRightIconPress={() => setIsVisible(!isVisible)}
      {...props}
    />
  );
});

HeroPasswordInput.displayName = 'HeroPasswordInput';

/**
 * Search input with search icon
 */
export const HeroSearchInput = forwardRef<TextInput, Omit<HeroInputProps, 'leftIcon'>>(
  (props, ref) => (
    <HeroInput ref={ref} leftIcon="search" placeholder="Search..." variant="filled" {...props} />
  )
);

HeroSearchInput.displayName = 'HeroSearchInput';
