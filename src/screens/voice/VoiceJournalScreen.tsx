import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { RecordingVisualizer } from '@components/voice/RecordingVisualizer';
import { useVoiceRecorder } from '@hooks/useVoiceRecorder';
import { createJournalEntry } from '@services/journal/journalService';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RouteProps = RouteProp<RootStackParamList, 'VoiceJournal'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const VoiceJournalScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { isRecording, durationMillis, startRecording, stopRecording } = useVoiceRecorder();
  const [isSaving, setIsSaving] = useState(false);
  const mode = route.params?.mode ?? 'free';

  const prompts = useMemo(
    () =>
      mode === 'guided'
        ? [
            'How did your body feel today compared to yesterday?',
            'What emotions surfaced during PT?',
            'What’s one win worth celebrating?',
          ]
        : ['Share anything on your mind. Try 2-3 minutes of honest reflection.'],
    [mode],
  );

  const formattedDuration = useMemo(() => {
    const seconds = Math.floor(durationMillis / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [durationMillis]);

  const handleStop = useCallback(async () => {
    const result = await stopRecording();
    if (!result?.uri) return;
    setIsSaving(true);
    try {
      const entryId = await createJournalEntry({
        localAudioUri: result.uri,
        duration: result.durationMillis,
        checkInType: mode,
      });
      // Backend triggers automatically handle transcription and AI response
      navigation.replace('AIResponse', { entryId });
    } catch (error) {
      console.error('Failed to save entry:', error);
      // Optional: Show error to user
    } finally {
      setIsSaving(false);
    }
  }, [mode, navigation, stopRecording]);

  return (
    <View style={styles.container}>
      <AppText variant="h2">{mode === 'guided' ? 'Guided Check-In' : 'Voice Journal'}</AppText>
      <AppText style={styles.timer}>{formattedDuration}</AppText>
      <RecordingVisualizer isRecording={isRecording} />
      <View style={styles.prompts}>
        {prompts.map((prompt) => (
          <AppText key={prompt}>• {prompt}</AppText>
        ))}
      </View>
      <View style={styles.actions}>
        {isRecording ? (
          <PrimaryButton label="Stop Recording" onPress={handleStop} isLoading={isSaving} />
        ) : (
          <PrimaryButton label="Start Recording" onPress={startRecording} />
        )}
        <AppText style={styles.helper}>Max duration 10 minutes</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  timer: {
    fontSize: 32,
    fontWeight: '600',
  },
  prompts: {
    gap: 8,
  },
  actions: {
    marginTop: 'auto',
    gap: 12,
  },
  helper: {
    textAlign: 'center',
    opacity: 0.7,
  },
});


