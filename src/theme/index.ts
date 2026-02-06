/**
 * Reclaim Theme System — Apple Glass Aesthetic
 * ==============================================
 * Central export for the complete design system.
 * Glass morphism + Apple HIG foundation.
 */

import { darkThemeColors, lightThemeColors, type ThemeColorSet, moodColors } from './colors';
import { spacing, layout } from './spacing';
import { typography, fontWeight } from './typography';
import {
  brandColors,
  semanticColors,
  borderRadius,
  shadows,
  buttonTokens,
  cardTokens,
  inputTokens,
  navigationTokens,
  touchTarget,
  duration,
  easing,
  iconSize,
  zIndex,
  moodEmojis,
  glass,
  glassDark,
  buildBrandTheme,
  type BrandTheme,
  type ThemeMode,
  type MoodType,
} from './brandKit';

export type ColorScheme = 'light' | 'dark';

export interface AppTheme {
  colors: ThemeColorSet;
  spacing: typeof spacing;
  layout: typeof layout;
  typography: typeof typography;
  fontWeight: typeof fontWeight;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  buttons: typeof buttonTokens;
  cards: typeof cardTokens;
  inputs: typeof inputTokens;
  navigation: typeof navigationTokens;
  touchTarget: typeof touchTarget;
  duration: typeof duration;
  iconSize: typeof iconSize;
  isDark: boolean;
  glass: typeof glass | typeof glassDark;
}

/**
 * Build complete theme object for React context
 */
export const buildTheme = (mode: ColorScheme = 'light'): AppTheme => ({
  colors: mode === 'dark' ? darkThemeColors : lightThemeColors,
  spacing,
  layout,
  typography,
  fontWeight,
  borderRadius,
  shadows,
  buttons: buttonTokens,
  cards: cardTokens,
  inputs: inputTokens,
  navigation: navigationTokens,
  touchTarget,
  duration,
  iconSize,
  isDark: mode === 'dark',
  glass: mode === 'dark' ? glassDark : glass,
});

// Re-export everything
export {
  // Colors
  lightThemeColors,
  darkThemeColors,
  brandColors,
  moodColors,
  semanticColors,

  // Spacing & Layout
  spacing,
  layout,

  // Typography
  typography,
  fontWeight,

  // Component tokens
  borderRadius,
  shadows,
  buttonTokens,
  cardTokens,
  inputTokens,
  navigationTokens,
  touchTarget,

  // Glass
  glass,
  glassDark,

  // Animation
  duration,
  easing,

  // Utilities
  iconSize,
  zIndex,
  moodEmojis,

  // Full brand theme builder
  buildBrandTheme,
};

// Type exports
export type { ThemeColorSet, BrandTheme, ThemeMode, MoodType };
