import { Platform } from 'react-native';

const baseFontFamily = Platform.select({
  ios: 'SF Pro Rounded',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: { fontSize: 30, fontWeight: '700', lineHeight: 36, letterSpacing: 0.3 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28, letterSpacing: 0.2 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24, letterSpacing: 0.2 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
} as const;

export const baseTextStyle = {
  fontFamily: baseFontFamily,
};

export type TypographyVariant = keyof typeof typography;
