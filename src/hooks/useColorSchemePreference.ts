import { useColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '@/types/theme';

const STORAGE_KEY = 'recoverVoice.themePreference';

export const useColorSchemePreference = () => {
  const deviceScheme = useColorScheme() ?? 'light';
  const [mode, setMode] = useState<ThemeMode>(deviceScheme);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(storedMode => {
        if (storedMode === 'light' || storedMode === 'dark') {
          setMode(storedMode);
        }
      })
      .catch(error => {
        console.error('Failed to load theme preference', error);
      });
  }, []);

  const persistMode = useCallback(async (nextMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
      setMode(nextMode);
    } catch (error) {
      console.error('Failed to persist theme preference', error);
    }
  }, []);

  const toggleMode = useCallback(() => {
    persistMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, persistMode]);

  return {
    mode,
    setMode: persistMode,
    toggleMode,
  };
};
