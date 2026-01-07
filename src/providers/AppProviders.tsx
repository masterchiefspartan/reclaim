import { PropsWithChildren, createContext, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import { buildTheme } from '@theme/index';
import type { ThemeContextValue } from '@/types/theme';
import { useColorSchemePreference } from '@hooks/useColorSchemePreference';
import { AuthProvider } from './AuthProvider';

enableScreens();

export const AppThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const AppProviders = ({ children }: PropsWithChildren) => {
  const { mode, setMode, toggleMode } = useColorSchemePreference();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setMode,
      toggleMode,
    }),
    [theme, mode, setMode, toggleMode]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeContext.Provider value={value}>
          <AuthProvider>
            <StatusBar style={theme.isDark ? 'light' : 'dark'} />
            {children}
          </AuthProvider>
        </AppThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
