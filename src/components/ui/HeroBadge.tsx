/**
 * HeroBadge - Hero UI inspired badge/chip component
 * Clean, modern badges for status and labels
 */

import { View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HeroText } from './HeroText';

type BadgeVariant = 'solid' | 'flat' | 'outline' | 'dot';
type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface HeroBadgeProps {
  /** Badge text */
  label: string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Color scheme */
  color?: BadgeColor;
  /** Size preset */
  size?: BadgeSize;
  /** Left icon (Feather) */
  icon?: keyof typeof Feather.glyphMap;
  /** Dismissible */
  onDismiss?: () => void;
  /** Additional classes */
  className?: string;
}

const colorConfig: Record<BadgeColor, { bg: string; text: string; border: string; dot: string }> = {
  default: {
    bg: 'bg-light-muted dark:bg-dark-muted',
    text: 'text-light-text dark:text-dark-text',
    border: 'border-light-border dark:border-dark-border',
    dot: 'bg-light-text-secondary',
  },
  primary: {
    bg: 'bg-brand-primary/15',
    text: 'text-brand-primary',
    border: 'border-brand-primary',
    dot: 'bg-brand-primary',
  },
  secondary: {
    bg: 'bg-brand-secondary/15',
    text: 'text-brand-secondary',
    border: 'border-brand-secondary',
    dot: 'bg-brand-secondary',
  },
  success: {
    bg: 'bg-success/15',
    text: 'text-success',
    border: 'border-success',
    dot: 'bg-success',
  },
  warning: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    border: 'border-warning',
    dot: 'bg-warning',
  },
  error: {
    bg: 'bg-error/15',
    text: 'text-error',
    border: 'border-error',
    dot: 'bg-error',
  },
};

const sizeConfig: Record<
  BadgeSize,
  { container: string; text: 'xs' | 'sm' | 'base'; icon: number; dot: string }
> = {
  sm: { container: 'h-6 px-2 gap-1', text: 'xs', icon: 12, dot: 'w-1.5 h-1.5' },
  md: { container: 'h-7 px-3 gap-1.5', text: 'sm', icon: 14, dot: 'w-2 h-2' },
  lg: { container: 'h-8 px-4 gap-2', text: 'base', icon: 16, dot: 'w-2.5 h-2.5' },
};

export const HeroBadge = ({
  label,
  variant = 'flat',
  color = 'default',
  size = 'md',
  icon,
  onDismiss,
  className = '',
}: HeroBadgeProps) => {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  const getContainerStyle = () => {
    switch (variant) {
      case 'solid':
        return color === 'default'
          ? 'bg-light-text dark:bg-dark-text'
          : colors.bg.replace('/15', '');
      case 'outline':
        return `bg-transparent border ${colors.border}`;
      case 'dot':
        return colors.bg;
      default:
        return colors.bg;
    }
  };

  const getTextColor = () => {
    if (variant === 'solid' && color !== 'default') {
      return 'text-white';
    }
    if (variant === 'solid' && color === 'default') {
      return 'text-light-surface dark:text-dark-surface';
    }
    return colors.text;
  };

  return (
    <View
      className={`
        flex-row items-center
        ${sizes.container}
        ${getContainerStyle()}
        rounded-full
        ${className}
      `}
    >
      {variant === 'dot' && <View className={`${sizes.dot} ${colors.dot} rounded-full`} />}

      {icon && variant !== 'dot' && (
        <Feather name={icon} size={sizes.icon} className={getTextColor()} />
      )}

      <HeroText size={sizes.text} weight="medium" className={getTextColor()}>
        {label}
      </HeroText>

      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={4}>
          <Feather name="x" size={sizes.icon} className={getTextColor()} />
        </Pressable>
      )}
    </View>
  );
};

/**
 * Status dot indicator
 */
interface HeroStatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusColors: Record<string, string> = {
  online: 'bg-success',
  offline: 'bg-light-text-secondary',
  busy: 'bg-error',
  away: 'bg-warning',
};

const dotSizes: Record<string, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const HeroStatusDot = ({ status, size = 'md', className = '' }: HeroStatusDotProps) => (
  <View
    className={`
      ${dotSizes[size]}
      ${statusColors[status]}
      rounded-full
      ${className}
    `}
  />
);
