/**
 * useFeatureGate Hook
 * =====================
 * Returns whether a specific feature is available to the current user
 * and a function to navigate to the paywall if it's not.
 */

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProAccess } from '@hooks/useSubscription';
import { useJournalEntries } from '@hooks/useJournalEntries';
import { isFeatureAvailable, type GatedFeature } from '@config/features';
import type { RootStackParamList } from '@navigation/types';

interface FeatureGateResult {
  /** Whether the user can access this feature right now */
  allowed: boolean;
  /** Navigate to the paywall to upgrade */
  showPaywall: () => void;
}

export function useFeatureGate(feature: GatedFeature): FeatureGateResult {
  const { hasAccess } = useProAccess();
  const { entries } = useJournalEntries();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const allowed = isFeatureAvailable(feature, hasAccess, entries.length);

  const showPaywall = useCallback(() => {
    navigation.navigate('Onboarding');
  }, [navigation]);

  return { allowed, showPaywall };
}
