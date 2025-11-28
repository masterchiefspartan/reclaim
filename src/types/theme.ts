import type { AppTheme } from '@theme/index';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

