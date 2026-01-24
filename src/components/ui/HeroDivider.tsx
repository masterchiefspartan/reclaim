/**
 * HeroDivider - Hero UI inspired divider component
 * Clean, subtle dividers for separating content
 */

import { View } from 'react-native';
import { HeroText } from './HeroText';

interface HeroDividerProps {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Text label in the middle */
  label?: string;
  /** Additional classes */
  className?: string;
}

export const HeroDivider = ({
  orientation = 'horizontal',
  label,
  className = '',
}: HeroDividerProps) => {
  if (orientation === 'vertical') {
    return (
      <View className={`w-px bg-light-border dark:bg-dark-border self-stretch ${className}`} />
    );
  }

  if (label) {
    return (
      <View className={`flex-row items-center gap-4 ${className}`}>
        <View className="flex-1 h-px bg-light-border dark:bg-dark-border" />
        <HeroText size="sm" variant="secondary">
          {label}
        </HeroText>
        <View className="flex-1 h-px bg-light-border dark:bg-dark-border" />
      </View>
    );
  }

  return <View className={`h-px bg-light-border dark:bg-dark-border ${className}`} />;
};

/**
 * Spacer component for adding consistent spacing
 */
interface HeroSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const spacerSizes: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
  xl: 'h-6',
  '2xl': 'h-8',
  '3xl': 'h-12',
};

export const HeroSpacer = ({ size = 'md' }: HeroSpacerProps) => (
  <View className={spacerSizes[size]} />
);
