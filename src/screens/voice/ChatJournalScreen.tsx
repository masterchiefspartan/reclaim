/**
 * ChatJournalScreen
 *
 * A ChatGPT-style voice journal interface.
 * Minimal UI, maximum power. Voice-first, conversational.
 *
 * Design principles:
 * - Less is more
 * - Single screen, no navigation during session
 * - Real-time transcription as you speak
 * - AI responses stream inline
 * - Dark, immersive, focused
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { AppText } from '@components/common/AppText';
import { useVoiceRecorder } from '@hooks/useVoiceRecorder';
import { useRealtimeTranscription } from '@hooks/useRealtimeTranscription';
import { useAuth } from '@hooks/useAuth';
import { createJournalEntry } from '@services/journal/journalService';
import type { RootStackParamList } from '@navigation/types';

// Design tokens - Dark, immersive theme
const COLORS = {
  background: '#0D0D0F',
  surface: '#1A1A1E',
  surfaceLight: '#242428',
  border: '#2D2D33',
  textPrimary: '#FFFFFF',
  textSecondary: '#71717A',
  textMuted: '#52525B',
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  userBubble: '#1E3A5F',
  aiBubble: '#1F1F23',
  recording: '#EF4444',
  success: '#10B981',
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const ChatJournalScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const scrollViewRef = useRef<ScrollView>(null);
  const { profile } = useAuth();

  // Voice recording
  const {
    isRecording,
    durationMillis,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
  } = useVoiceRecorder();

  // Real-time transcription
  const {
    transcript,
    finalTranscript,
    // isListening - available but not currently displayed
    startListening,
    stopListening,
    clearTranscript,
  } = useRealtimeTranscription();

  // Local state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInput, setTextInput] = useState('');

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const micScale = useRef(new Animated.Value(1)).current;

  // Generate opening message on mount
  useEffect(() => {
    const userName = profile?.displayName?.split(' ')[0] || '';
    const greeting = getTimeBasedGreeting();
    const openingMessage: Message = {
      id: 'opening',
      role: 'assistant',
      content: userName
        ? `${greeting}, ${userName}. What's on your mind?`
        : `${greeting}. I'm here to listen. What's on your mind?`,
      timestamp: new Date(),
    };
    setMessages([openingMessage]);
  }, [profile?.displayName]);

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, transcript]);

  // Pulse animation when recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  // Handle mic button press
  const handleMicPress = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      await handleStopRecording();
    } else {
      // Start recording
      await handleStartRecording();
    }
  }, [isRecording]);

  const handleStartRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearTranscript();

    // Animate mic
    Animated.spring(micScale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();

    await startAudioRecording();
    startListening().catch(() => {
      // Transcription can fail, recording continues
    });
  };

  const handleStopRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate mic back
    Animated.spring(micScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    stopListening();
    const result = await stopAudioRecording();

    if (!result?.uri) return;

    // Get the final transcript
    const userContent = finalTranscript || transcript || '';

    if (!userContent.trim()) {
      // No transcript, don't save
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Show processing state
    setIsProcessing(true);

    try {
      // Create journal entry (backend will process and generate AI response)
      const entryId = await createJournalEntry({
        localAudioUri: result.uri,
        duration: result.durationMillis,
        checkInType: 'free',
        transcript: userContent,
      });

      // Navigate to see the AI response (or we could fetch it here)
      // For now, go to Processing which will show the AI response
      navigation.replace('Processing', { entryId });
    } catch (_error) {
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I could not save that. Want to try again?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text input submit
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    Keyboard.dismiss();
    const content = textInput.trim();
    setTextInput('');
    setShowKeyboard(false);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // TODO: Handle text-only entries
    // For now, show a message that voice is preferred
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content:
        "I hear you. Tap the mic to share more - your voice carries emotion that text can't capture.",
      timestamp: new Date(),
    };
    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  // Handle close
  const handleClose = () => {
    if (messages.length > 1) {
      // Has content, maybe confirm?
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-down" size={28} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <AppText style={styles.recordingTime}>{formatDuration(durationMillis)}</AppText>
          </View>
        )}

        <View style={styles.headerSpacer} />
      </View>

      {/* Message Thread */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <AppText style={styles.messageText}>{message.content}</AppText>
            </View>
          ))}

          {/* Live transcript while recording */}
          {isRecording && transcript && (
            <View style={[styles.messageBubble, styles.userBubble, styles.streamingBubble]}>
              <AppText style={[styles.messageText, styles.streamingText]}>{transcript}</AppText>
            </View>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <AppText style={styles.processingText}>...</AppText>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          {showKeyboard ? (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={COLORS.textMuted}
                value={textInput}
                onChangeText={setTextInput}
                multiline
                maxLength={500}
                autoFocus
              />
              <TouchableOpacity onPress={handleTextSubmit} style={styles.sendButton}>
                <Ionicons name="arrow-up-circle" size={32} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.voiceInputContainer}>
              {/* Keyboard toggle */}
              <TouchableOpacity onPress={() => setShowKeyboard(true)} style={styles.keyboardButton}>
                <Ionicons name="text" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>

              {/* Main mic button */}
              <Animated.View
                style={[
                  styles.micButtonContainer,
                  {
                    transform: [{ scale: isRecording ? pulseAnim : micScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={handleMicPress}
                  style={[styles.micButton, isRecording && styles.micButtonRecording]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isRecording ? 'stop' : 'mic'}
                    size={32}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Spacer for symmetry */}
              <View style={styles.keyboardButton} />
            </View>
          )}

          {/* Helper text */}
          {!showKeyboard && !isRecording && (
            <AppText style={styles.helperText}>Tap to speak</AppText>
          )}
          {isRecording && <AppText style={styles.helperText}>Tap to stop</AppText>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper function
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.aiBubble,
    borderBottomLeftRadius: 4,
  },
  closeButton: {
    padding: 4,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 36,
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  inputArea: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    gap: 8,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  keyboardButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  messageBubble: {
    borderRadius: 20,
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 24,
  },
  messageText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  micButton: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 32,
    elevation: 8,
    height: 64,
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 64,
  },
  micButtonContainer: {
    // Container for animation
  },
  micButtonRecording: {
    backgroundColor: COLORS.recording,
    shadowColor: COLORS.recording,
  },
  processingText: {
    color: COLORS.textSecondary,
    fontSize: 24,
    letterSpacing: 4,
  },
  recordingDot: {
    backgroundColor: COLORS.recording,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  recordingIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  recordingTime: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
  sendButton: {
    padding: 4,
  },
  streamingBubble: {
    opacity: 0.8,
  },
  streamingText: {
    fontStyle: 'italic',
  },
  textInput: {
    color: COLORS.textPrimary,
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  textInputContainer: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  voiceInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    width: '100%',
  },
});

export default ChatJournalScreen;
