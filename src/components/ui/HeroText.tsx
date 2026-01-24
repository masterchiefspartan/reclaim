/**
 * HeroText - Hero UI inspired typography component
 * Clean, modern text with consistent sizing
 */

import { Text, type TextProps } from 'react-native';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextVariant = 'default' | 'secondary' | 'muted' | 'primary' | 'error' | 'success';

interface HeroTextProps extends TextProps {
  /** Text size */
  size?: TextSize;
  /** Font weight */
  weight?: TextWeight;
  /** Color variant */
  variant?: TextVariant;
  /** Center text */
  center?: boolean;
  /** Additional Tailwind classes */
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-hero-xs',
  sm: 'text-hero-sm',
  base: 'text-hero-base',
  lg: 'text-hero-lg',
  xl: 'text-hero-xl',
  '2xl': 'text-hero-2xl',
  '3xl': 'text-hero-3xl',
  '4xl': 'text-hero-4xl',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const variantClasses: Record<TextVariant, string> = {
  default: 'text-light-text dark:text-dark-text',
  secondary: 'text-light-text-secondary dark:text-dark-text-secondary',
  muted: 'text-light-text-secondary/70 dark:text-dark-text-secondary/70',
  primary: 'text-brand-primary',
  error: 'text-error',
  success: 'text-success',
};

export const HeroText = ({
  size = 'base',
  weight = 'normal',
  variant = 'default',
  center = false,
  className = '',
  children,
  ...props
}: HeroTextProps) => {
  const classes = `
    ${sizeClasses[size]}
    ${weightClasses[weight]}
    ${variantClasses[variant]}
    ${center ? 'text-center' : ''}
    ${className}
  `.trim();

  return (
    <Text className={classes} {...props}>
      {children}
    </Text>
  );
};

/**
 * Heading component for titles
 */
interface HeroHeadingProps extends Omit<HeroTextProps, 'size'> {
  level?: 1 | 2 | 3 | 4;
}

const headingSizes: Record<number, TextSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
};

export const HeroHeading = ({ level = 1, weight = 'bold', ...props }: HeroHeadingProps) => (
  <HeroText size={headingSizes[level]} weight={weight} accessibilityRole="header" {...props} />
);

/**
 * Label component for form labels
 */
export const HeroLabel = ({
  className = '',
  children,
  ...props
}: Omit<HeroTextProps, 'size' | 'weight'>) => (
  <HeroText size="sm" weight="medium" className={`mb-2 ${className}`} {...props}>
    {children}
  </HeroText>
);
