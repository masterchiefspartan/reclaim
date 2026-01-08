import { Text, TextProps, StyleSheet } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';
import type { TypographyVariant } from '@theme/typography';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export const AppText = ({ children, style, variant = 'body', color, ...rest }: AppTextProps) => {
  const { theme } = useAppTheme();
  const variantStyle = theme.typography[variant];

  return (
    <Text
      style={StyleSheet.flatten([
        styles.base,
        {
          color: color ?? theme.colors.text,
          fontSize: variantStyle.fontSize,
          fontWeight: variantStyle.fontWeight as
            | '100'
            | '200'
            | '300'
            | '400'
            | '500'
            | '600'
            | '700'
            | '800'
            | '900'
            | 'bold'
            | 'normal',
          lineHeight: variantStyle.lineHeight,
        },
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
    fontFamily: 'System',
  },
});
