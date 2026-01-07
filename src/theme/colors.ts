export const palette = {
  recoveryBlue: '#4A90E2',
  progressGreen: '#52C41A',
  warmOrange: '#FF8C42',
  moodSad: '#FF6B6B',
  moodNeutral: '#FFD93D',
  moodHappy: '#6BCF7F',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  darkTextPrimary: '#E2E8F0',
  darkTextSecondary: '#94A3B8',
} as const;

export type ThemeColorSet = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
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
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  border: '#E2E8F0',
  muted: '#CBD5F5',
};

export const darkThemeColors: ThemeColorSet = {
  background: palette.darkBackground,
  surface: palette.darkSurface,
  primary: palette.recoveryBlue,
  secondary: palette.progressGreen,
  accent: palette.warmOrange,
  text: palette.darkTextPrimary,
  textSecondary: palette.darkTextSecondary,
  border: '#1F2937',
  muted: '#334155',
};
