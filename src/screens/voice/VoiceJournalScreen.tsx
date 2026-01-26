import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { RecordingVisualizer } from '@components/voice/RecordingVisualizer';
import { LiveTranscript } from '@components/voice/LiveTranscript';
import { useVoiceRecorder } from '@hooks/useVoiceRecorder';
import { useRealtimeTranscription } from '@hooks/useRealtimeTranscription';
import { useAppTheme } from '@hooks/useAppTheme';
import { createJournalEntry } from '@services/journal/journalService';
import { getUserFriendlyMessage } from '@utils/errors';
import { getFrameworkById, getPerspectiveById, getDefaultFramework } from '@/data/frameworks';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FrameworkPromptResponse } from '@/types/journal';

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
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [promptResponses, setPromptResponses] = useState<FrameworkPromptResponse[]>([]);

  const mode = route.params?.mode ?? 'free';
  const frameworkId = route.params?.frameworkId;
  const perspectiveId = route.params?.perspectiveId;

  // Get framework and perspective
  const framework = useMemo(() => {
    if (frameworkId) {
      return getFrameworkById(frameworkId) || getDefaultFramework();
    }
    return mode === 'guided' ? getDefaultFramework() : null;
  }, [frameworkId, mode]);

  const perspective = useMemo(() => {
    if (perspectiveId) {
      return getPerspectiveById(perspectiveId);
    }
    return null;
  }, [perspectiveId]);

  // Get prompts from framework or use defaults
  const prompts = useMemo(() => {
    if (framework && framework.prompts.length > 0) {
      return framework.prompts.map(p => p.voicePrompt);
    }
    return mode === 'guided'
      ? [
          'How did your body feel today compared to yesterday?',
          'What emotions surfaced during PT?',
          "What's one win worth celebrating?",
        ]
      : ['Share anything on your mind. Try 2-3 minutes of honest reflection.'];
  }, [framework, mode]);

  const currentPrompt = prompts[currentPromptIndex];
  const isLastPrompt = currentPromptIndex >= prompts.length - 1;
  const hasFramework = framework && framework.id !== 'free-journal';

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

  // Handle completing the current prompt (for framework mode)
  const handleNextPrompt = useCallback(async () => {
    // Stop transcription for this prompt
    stopListening();
    const result = await stopAudioRecording();

    // Save the response for this prompt
    if (framework && result?.uri) {
      const promptData = framework.prompts[currentPromptIndex];
      const response: FrameworkPromptResponse = {
        promptId: promptData?.id || `prompt-${currentPromptIndex}`,
        promptText: currentPrompt,
        response: finalTranscript || '',
        audioUrl: result.uri,
        timestamp: new Date(),
        duration: result.durationMillis,
      };
      setPromptResponses(prev => [...prev, response]);
    }

    // Move to next prompt or finish
    if (!isLastPrompt) {
      setCurrentPromptIndex(prev => prev + 1);
      clearTranscript();
      // Auto-start recording for next prompt
      await startAudioRecording();
      startListening().catch(() => {});
    }
  }, [
    framework,
    currentPromptIndex,
    currentPrompt,
    isLastPrompt,
    finalTranscript,
    stopAudioRecording,
    stopListening,
    clearTranscript,
    startAudioRecording,
    startListening,
  ]);

  // Stop recording and save entry
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

    // If using framework, add final prompt response
    const allResponses = [...promptResponses];
    if (framework) {
      const promptData = framework.prompts[currentPromptIndex];
      allResponses.push({
        promptId: promptData?.id || `prompt-${currentPromptIndex}`,
        promptText: currentPrompt,
        response: finalTranscript || '',
        audioUrl: result.uri,
        timestamp: new Date(),
        duration: result.durationMillis,
      });
    }

    setIsSaving(true);
    try {
      const entryId = await createJournalEntry({
        localAudioUri: result.uri,
        duration: result.durationMillis,
        checkInType: hasFramework ? 'guided' : mode,
        transcript: finalTranscript || undefined,
        // Include framework data if using a framework
        frameworkData: framework
          ? {
              frameworkId: framework.id,
              frameworkName: framework.name,
              perspectiveId: perspectiveId,
              perspectiveName: perspective?.name,
              promptResponses: allResponses,
              extractedData: [], // Will be filled by AI analysis
              totalDuration: result.durationMillis,
              completedAt: new Date(),
            }
          : undefined,
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
  }, [
    mode,
    navigation,
    stopAudioRecording,
    stopListening,
    finalTranscript,
    framework,
    hasFramework,
    currentPromptIndex,
    currentPrompt,
    promptResponses,
    perspectiveId,
    perspective,
  ]);

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
        {/* Header with framework info */}
        <View style={styles.header}>
          {framework ? (
            <View style={styles.frameworkHeader}>
              <View style={[styles.frameworkBadge, { backgroundColor: framework.color + '20' }]}>
                <Feather
                  name={framework.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={framework.color}
                />
                <AppText style={[styles.frameworkName, { color: framework.color }]}>
                  {framework.shortName}
                </AppText>
              </View>
              {hasFramework && (
                <View style={styles.progressIndicator}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${((currentPromptIndex + 1) / prompts.length) * 100}%`,
                          backgroundColor: framework.color,
                        },
                      ]}
                    />
                  </View>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {currentPromptIndex + 1} of {prompts.length}
                  </AppText>
                </View>
              )}
            </View>
          ) : (
            <AppText variant="h2">Voice Journal</AppText>
          )}
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

        {/* Current Prompt */}
        <View style={[styles.promptCard, { backgroundColor: theme.colors.surface }]}>
          {hasFramework ? (
            <>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Question {currentPromptIndex + 1}
              </AppText>
              <AppText style={styles.currentPromptText}>{currentPrompt}</AppText>
              {framework.prompts[currentPromptIndex]?.followUp && !isRecording && (
                <AppText style={styles.followUpHint} color={theme.colors.muted}>
                  Tip: {framework.prompts[currentPromptIndex].followUp}
                </AppText>
              )}
            </>
          ) : (
            <>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Suggested prompt:
              </AppText>
              <AppText style={styles.currentPromptText}>{currentPrompt}</AppText>
            </>
          )}
        </View>

        {/* AI Perspective indicator */}
        {perspective && (
          <View style={[styles.perspectiveIndicator, { borderColor: perspective.color }]}>
            <Feather
              name={perspective.icon as keyof typeof Feather.glyphMap}
              size={14}
              color={perspective.color}
            />
            <AppText style={[styles.perspectiveText, { color: perspective.color }]}>
              {perspective.name} will respond
            </AppText>
          </View>
        )}

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
          hasFramework && !isLastPrompt ? (
            // Show "Next Question" for framework mode
            <View style={styles.recordingActions}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { backgroundColor: framework?.color || theme.colors.primary },
                ]}
                onPress={handleNextPrompt}
              >
                <AppText style={styles.nextButtonText}>Next Question</AppText>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishEarlyButton} onPress={handleStopRecording}>
                <AppText color={theme.colors.muted}>Finish early</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <PrimaryButton
              label={hasFramework ? 'Complete Journal' : 'Stop Recording'}
              onPress={handleStopRecording}
              isLoading={isSaving}
            />
          )
        ) : (
          <PrimaryButton label="Start Recording" onPress={handleStartRecording} />
        )}
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.helper}>
          {hasFramework
            ? `${framework?.duration.min}-${framework?.duration.max} minutes recommended`
            : 'Max duration 10 minutes'}
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
  currentPromptText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  errorContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  finishEarlyButton: {
    paddingVertical: 8,
  },
  followUpHint: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
  },
  frameworkBadge: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  frameworkHeader: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  frameworkName: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  helper: {
    textAlign: 'center',
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  perspectiveIndicator: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  perspectiveText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressBar: {
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 2,
    height: '100%',
  },
  progressIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  promptCard: {
    borderRadius: 12,
    gap: 8,
    padding: 16,
  },
  recordingActions: {
    alignItems: 'center',
    gap: 12,
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
