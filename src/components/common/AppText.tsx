/**
 * AppText — Universal text component
 * ====================================
 * Applies typography variants from the theme system.
 * Supports all Apple-style typography variants (largeTitle, title1, body, etc.)
 * and semantic aliases (h1, h2, etc.) for backward compatibility.
 */
import { Text, TextProps, StyleSheet } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';
import type { TypographyVariant } from '@theme/typography';
import { baseTextStyle } from '@theme/typography';

interface AppTextProps extends TextProps {
  /** Typography variant from the theme scale */
  variant?: TypographyVariant;
  /** Override text color */
  color?: string;
}

export const AppText = ({ children, style, variant = 'body', color, ...rest }: AppTextProps) => {
  const { theme } = useAppTheme();
  const variantStyle = theme.typography[variant];

  return (
    <Text
      style={StyleSheet.flatten([
        styles.base,
        { color: color ?? theme.colors.text },
        variantStyle,
        style,
      ])}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    ...baseTextStyle,
  },
});
