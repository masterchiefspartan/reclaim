import { darkThemeColors, lightThemeColors, type ThemeColorSet } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type ColorScheme = 'light' | 'dark';

export interface AppTheme {
  colors: ThemeColorSet;
  spacing: typeof spacing;
  typography: typeof typography;
  isDark: boolean;
}

export const buildTheme = (mode: ColorScheme = 'light'): AppTheme => ({
  colors: mode === 'dark' ? darkThemeColors : lightThemeColors,
  spacing,
  typography,
  isDark: mode === 'dark',
});
