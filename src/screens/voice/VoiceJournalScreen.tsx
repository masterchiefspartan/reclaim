import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { RecordingVisualizer } from '@components/voice/RecordingVisualizer';
import { LiveTranscript } from '@components/voice/LiveTranscript';
import { useVoiceRecorder } from '@hooks/useVoiceRecorder';
import { useRealtimeTranscription } from '@hooks/useRealtimeTranscription';
import { useAppTheme } from '@hooks/useAppTheme';
import { createJournalEntry } from '@services/journal/journalService';
import { getUserFriendlyMessage } from '@utils/errors';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RouteProps = RouteProp<RootStackParamList, 'VoiceJournal'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const VoiceJournalScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const {
    isRecording,
    durationMillis,
    error: recorderError,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
  } = useVoiceRecorder();

  const {
    transcript,
    finalTranscript,
    isListening,
    error: transcriptionError,
    startListening,
    stopListening,
    clearTranscript,
  } = useRealtimeTranscription();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const mode = route.params?.mode ?? 'free';

  const prompts = useMemo(
    () =>
      mode === 'guided'
        ? [
            'How did your body feel today compared to yesterday?',
            'What emotions surfaced during PT?',
            "What's one win worth celebrating?",
          ]
        : ['Share anything on your mind. Try 2-3 minutes of honest reflection.'],
    [mode]
  );

  const formattedDuration = useMemo(() => {
    const seconds = Math.floor(durationMillis / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [durationMillis]);

  // Start both recording and transcription together
  const handleStartRecording = useCallback(async () => {
    clearTranscript();
    setSaveError(null);

    // Start audio recording first
    await startAudioRecording();

    // Start transcription (non-blocking - will show error in UI if fails)
    startListening().catch(() => {
      // Transcription error is handled by the hook and shown in UI
      // Recording can continue without transcription
    });
  }, [startAudioRecording, startListening, clearTranscript]);

  // Stop both recording and transcription
  const handleStopRecording = useCallback(async () => {
    setSaveError(null);

    // Stop transcription
    stopListening();

    // Stop audio recording
    const result = await stopAudioRecording();

    if (!result?.uri) {
      setSaveError('Recording failed. Please try again.');
      return;
    }

    setIsSaving(true);
    try {
      const entryId = await createJournalEntry({
        localAudioUri: result.uri,
        duration: result.durationMillis,
        checkInType: mode,
        // Include transcript if available (will be overwritten by server transcription)
        transcript: finalTranscript || undefined,
      });
      navigation.replace('Processing', { entryId });
    } catch (error) {
      const friendlyMessage = getUserFriendlyMessage(error);
      setSaveError(friendlyMessage);

      Alert.alert('Failed to Save', friendlyMessage, [
        { text: 'Try Again', onPress: () => setSaveError(null) },
        { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsSaving(false);
    }
  }, [mode, navigation, stopAudioRecording, stopListening, finalTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Combine errors for display (prioritize save/record errors over transcription)
  const displayError = recorderError || saveError;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="h2">{mode === 'guided' ? 'Guided Check-In' : 'Voice Journal'}</AppText>
          <AppText variant="h1" style={styles.timer}>
            {formattedDuration}
          </AppText>
        </View>

        {/* Recording Visualizer */}
        <RecordingVisualizer isRecording={isRecording} />

        {/* Live Transcript - Only show when recording */}
        {(isRecording || transcript) && (
          <LiveTranscript
            transcript={transcript}
            isListening={isListening}
            error={transcriptionError}
            style={styles.transcript}
            placeholder="Your words will appear here as you speak..."
          />
        )}

        {/* Prompts */}
        <View style={styles.prompts}>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {mode === 'guided' ? 'Answer these questions:' : 'Suggested prompt:'}
          </AppText>
          {prompts.map(prompt => (
            <AppText key={prompt} style={styles.promptText}>
              • {prompt}
            </AppText>
          ))}
        </View>

        {/* Error Display */}
        {displayError && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: `${theme.colors.error}15`, borderColor: theme.colors.error },
            ]}
          >
            <AppText color={theme.colors.error}>{displayError}</AppText>
          </View>
        )}
      </ScrollView>

      {/* Actions - Fixed at bottom */}
      <View style={styles.actions}>
        {isRecording ? (
          <PrimaryButton
            label="Stop Recording"
            onPress={handleStopRecording}
            isLoading={isSaving}
          />
        ) : (
          <PrimaryButton label="Start Recording" onPress={handleStartRecording} />
        )}
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.helper}>
          Max duration 10 minutes
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  errorContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  helper: {
    textAlign: 'center',
  },
  promptText: {
    lineHeight: 22,
  },
  prompts: {
    gap: 8,
    paddingVertical: 8,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 2,
  },
  transcript: {
    marginVertical: 8,
  },
});
