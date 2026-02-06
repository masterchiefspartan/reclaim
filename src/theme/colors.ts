/**
 * Reclaim Color System — Apple Glass Aesthetic
 * =============================================
 * Maps brand kit colors into the ThemeColorSet contract
 * used throughout the app via useAppTheme().
 */

import {
  lightTheme as brandLightTheme,
  darkTheme as brandDarkTheme,
  semanticColors,
} from './brandKit';

export type ThemeColorSet = {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceGlass: string;

  // Text hierarchy
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;

  // Brand
  primary: string;
  primaryLight: string;
  primarySubtle: string;
  secondary: string;
  accent: string;

  // Semantic
  error: string;
  success: string;
  warning: string;
  info: string;

  // Borders & separators
  border: string;
  borderLight: string;
  divider: string;

  // Fills (Apple system fills)
  fillPrimary: string;
  fillSecondary: string;
  fillTertiary: string;
  fillQuaternary: string;

  // States
  muted: string;
  pressed: string;
  focused: string;
  disabled: string;
  overlay: string;
  overlayLight: string;
};

export const lightThemeColors: ThemeColorSet = {
  background: brandLightTheme.background,
  backgroundSecondary: brandLightTheme.backgroundSecondary,
  surface: brandLightTheme.surface,
  surfaceElevated: brandLightTheme.surfaceElevated,
  surfaceGlass: brandLightTheme.surfaceGlass,

  text: brandLightTheme.textPrimary,
  textSecondary: brandLightTheme.textSecondary,
  textTertiary: brandLightTheme.textTertiary,
  textMuted: brandLightTheme.textMuted,
  textInverse: brandLightTheme.textInverse,

  primary: brandLightTheme.primary,
  primaryLight: brandLightTheme.primaryLight,
  primarySubtle: brandLightTheme.primarySubtle,
  secondary: brandLightTheme.secondary,
  accent: brandLightTheme.accent,

  error: semanticColors.error,
  success: semanticColors.success,
  warning: semanticColors.warning,
  info: semanticColors.info,

  border: brandLightTheme.border,
  borderLight: brandLightTheme.borderLight,
  divider: brandLightTheme.divider,

  fillPrimary: brandLightTheme.fillPrimary,
  fillSecondary: brandLightTheme.fillSecondary,
  fillTertiary: brandLightTheme.fillTertiary,
  fillQuaternary: brandLightTheme.fillQuaternary,

  muted: brandLightTheme.primarySubtle,
  pressed: brandLightTheme.pressed,
  focused: brandLightTheme.focused,
  disabled: brandLightTheme.disabled,
  overlay: brandLightTheme.overlay,
  overlayLight: brandLightTheme.overlayLight,
};

export const darkThemeColors: ThemeColorSet = {
  background: brandDarkTheme.background,
  backgroundSecondary: brandDarkTheme.backgroundSecondary,
  surface: brandDarkTheme.surface,
  surfaceElevated: brandDarkTheme.surfaceElevated,
  surfaceGlass: brandDarkTheme.surfaceGlass,

  text: brandDarkTheme.textPrimary,
  textSecondary: brandDarkTheme.textSecondary,
  textTertiary: brandDarkTheme.textTertiary,
  textMuted: brandDarkTheme.textMuted,
  textInverse: brandDarkTheme.textInverse,

  primary: brandDarkTheme.primary,
  primaryLight: brandDarkTheme.primaryLight,
  primarySubtle: brandDarkTheme.primarySubtle,
  secondary: brandDarkTheme.secondary,
  accent: brandDarkTheme.accent,

  error: semanticColors.error,
  success: semanticColors.success,
  warning: semanticColors.warning,
  info: semanticColors.info,

  border: brandDarkTheme.border,
  borderLight: brandDarkTheme.borderLight,
  divider: brandDarkTheme.divider,

  fillPrimary: brandDarkTheme.fillPrimary,
  fillSecondary: brandDarkTheme.fillSecondary,
  fillTertiary: brandDarkTheme.fillTertiary,
  fillQuaternary: brandDarkTheme.fillQuaternary,

  muted: brandDarkTheme.primarySubtle,
  pressed: brandDarkTheme.pressed,
  focused: brandDarkTheme.focused,
  disabled: brandDarkTheme.disabled,
  overlay: brandDarkTheme.overlay,
  overlayLight: brandDarkTheme.overlayLight,
};

// Convenience re-export
export { moodColors } from './brandKit';
