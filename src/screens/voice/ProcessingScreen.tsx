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
        <AppText variant="h3">Missing entry</AppText>
        <AppText>Please return to your journal and try again.</AppText>
        <PrimaryButton
          label="Go to Journal"
          onPress={() => navigation.navigate('Main', { screen: 'JournalTab' })}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <AppText variant="h3">We hit a snag</AppText>
        <AppText>{error}</AppText>
        <PrimaryButton
          label="Go to Journal"
          onPress={() => navigation.navigate('Main', { screen: 'JournalTab' })}
        />
      </View>
    );
  }

  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText variant="h3">{loading ? 'Preparing your entry...' : statusMessage}</AppText>
      <AppText style={styles.subtext}>This usually takes less than a minute.</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  subtext: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
