export const palette = {
  recoveryBlue: '#C85A8C',
  progressGreen: '#4F9D9D',
  warmOrange: '#F4A07A',
  moodSad: '#E46C86',
  moodNeutral: '#F4C86B',
  moodHappy: '#6FBF9C',
  background: '#FFF7FA',
  surface: '#FFFFFF',
  textPrimary: '#2B1F2A',
  textSecondary: '#6F5B68',
  success: '#6FBF9C',
  warning: '#F4C86B',
  error: '#E15A6B',
  info: '#6B8CE5',
  darkBackground: '#1A1218',
  darkSurface: '#241A22',
  darkTextPrimary: '#F6EEF2',
  darkTextSecondary: '#C9B5C1',
} as const;

export type ThemeColorSet = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  text: string;
  textSecondary: string;
  border: string;
  muted: string;
};

export const lightThemeColors: ThemeColorSet = {
  background: palette.background,
  surface: palette.surface,
  primary: palette.recoveryBlue,
  secondary: palette.progressGreen,
  accent: palette.warmOrange,
  error: palette.error,
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  border: '#E9D6E0',
  muted: '#F2E8EE',
};

export const darkThemeColors: ThemeColorSet = {
  background: palette.darkBackground,
  surface: palette.darkSurface,
  primary: palette.recoveryBlue,
  secondary: palette.progressGreen,
  accent: palette.warmOrange,
  error: palette.error,
  text: palette.darkTextPrimary,
  textSecondary: palette.darkTextSecondary,
  border: '#2F2530',
  muted: '#3B2E3A',
};
