/**
 * ProcessingScreen — Apple Glass Aesthetic
 * ==========================================
 * Minimal processing indicator with status text.
 */
import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { useJournalEntry } from '@hooks/useJournalEntries';
import { useAppTheme } from '@hooks/useAppTheme';
import type { RootStackParamList } from '@navigation/types';
import type { ProcessingStage } from '@/types/journal';

type RouteProps = RouteProp<RootStackParamList, 'Processing'>;

const STATUS_COPY: Record<ProcessingStage, string> = {
  uploading: 'Uploading your voice journal...',
  transcribing: 'Transcribing your voice...',
  analyzing: 'Your AI companion is listening...',
  synthesizing: 'Preparing your response...',
  completed: 'Response ready',
  failed: 'Processing failed',
};

export const ProcessingScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useAppTheme();
  const { entry, loading, error } = useJournalEntry(route.params?.entryId);
  const hasNavigatedRef = useRef(false);

  const statusMessage = useMemo(() => {
    if (!entry?.processingStage) return 'Preparing your entry...';
    return STATUS_COPY[entry.processingStage] ?? 'Processing...';
  }, [entry?.processingStage]);

  useEffect(() => {
    if (!entry || hasNavigatedRef.current) return;

    const isTerminal =
      entry.processingStage === 'completed' ||
      entry.processingStage === 'failed' ||
      entry.transcriptionStatus === 'failed' ||
      entry.aiResponseStatus === 'failed' ||
      entry.aiResponseStatus === 'completed';

    if (isTerminal) {
      hasNavigatedRef.current = true;
      navigation.replace('AIResponse', { entryId: entry.id });
    }
  }, [entry, navigation]);

  if (!route.params?.entryId) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <AppText variant="title3" color={theme.colors.text}>
          Missing entry
        </AppText>
        <AppText variant="subheadline" color={theme.colors.textSecondary}>
          Please return to your journal and try again.
        </AppText>
        <View style={styles.buttonWrap}>
          <PrimaryButton
            label="Go to Journal"
            onPress={() => navigation.navigate('Main', { screen: 'JourneyTab' })}
          />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <AppText variant="title3" color={theme.colors.text}>
          We hit a snag
        </AppText>
        <AppText variant="subheadline" color={theme.colors.textSecondary}>
          {error}
        </AppText>
        <View style={styles.buttonWrap}>
          <PrimaryButton
            label="Go to Journal"
            onPress={() => navigation.navigate('Main', { screen: 'JourneyTab' })}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText variant="title3" color={theme.colors.text} style={styles.statusText}>
        {loading ? 'Preparing your entry...' : statusMessage}
      </AppText>
      <AppText variant="footnote" color={theme.colors.textTertiary}>
        This usually takes less than a minute.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrap: {
    marginTop: 8,
    width: '100%',
  },
  center: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  statusText: {
    textAlign: 'center',
  },
});
