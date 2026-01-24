/**
 * VoiceConversationScreen
 * Full-screen interface for active voice conversations with AI companion
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { SessionTimer } from '@components/voice-conversation/SessionTimer';
import { SpeakingIndicator } from '@components/voice-conversation/SpeakingIndicator';
import { useVoiceConversation } from '@hooks/useVoiceConversation';
import type { RootStackParamList } from '@navigation/types';

// Design tokens
const COLORS = {
  background: '#1F1F23',
  backgroundLight: '#2D2D33',
  surface: '#3D3D45',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  ai: '#8B5CF6',
  user: '#10B981',
  error: '#EF4444',
};

export const VoiceConversationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const { state, actions } = useVoiceConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.conversationHistory.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.conversationHistory.length, state.currentTranscript]);

  // Start conversation on mount
  useEffect(() => {
    actions.startConversation();

    return () => {
      // Cleanup will be handled by the hook
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle close button
  const handleClose = useCallback(() => {
    if (state.status !== 'idle' && state.status !== 'ended') {
      Alert.alert('End Conversation?', 'Are you sure you want to end this conversation?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            await actions.endConversation();
            navigation.goBack();
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  }, [state.status, actions, navigation]);

  // Handle end conversation button
  const handleEndConversation = useCallback(async () => {
    await actions.endConversation();
    // Show success message
    Alert.alert('Conversation Saved', 'Your conversation has been saved to your journal.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [actions, navigation]);

  // Handle time up
  const handleTimeUp = useCallback(async () => {
    await actions.endConversation();
    Alert.alert('Time Up', 'Your conversation has ended and been saved to your journal.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [actions, navigation]);

  // Determine speaking indicator props
  const getSpeakingIndicatorProps = () => {
    switch (state.status) {
      case 'ai_speaking':
        return { speaker: 'ai' as const, status: 'speaking' as const };
      case 'user_speaking':
        return { speaker: 'user' as const, status: 'speaking' as const };
      case 'processing':
        return { speaker: 'ai' as const, status: 'processing' as const };
      default:
        return { speaker: 'none' as const, status: 'waiting' as const };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <SessionTimer timeRemaining={state.timeRemaining} onTimeUp={handleTimeUp} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Speaking Indicator */}
        <View style={styles.indicatorContainer}>
          <SpeakingIndicator {...getSpeakingIndicatorProps()} />
        </View>

        {/* Transcript Area */}
        <View style={styles.transcriptContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {state.conversationHistory.map(turn => (
              <View
                key={turn.id}
                style={[
                  styles.messageContainer,
                  turn.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <AppText style={styles.messageRole}>
                  {turn.role === 'user' ? 'You' : 'Companion'}
                </AppText>
                <AppText style={styles.messageText}>{turn.content}</AppText>
              </View>
            ))}

            {/* Current transcript (interim) */}
            {state.currentTranscript && state.status === 'user_speaking' && (
              <View style={[styles.messageContainer, styles.userMessage, styles.interimMessage]}>
                <AppText style={styles.messageRole}>You</AppText>
                <AppText style={[styles.messageText, styles.interimText]}>
                  {state.currentTranscript}
                </AppText>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Error Display */}
        {state.error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <AppText style={styles.errorText}>{state.error}</AppText>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {state.status === 'ended' ? (
          <PrimaryButton label="Close" onPress={() => navigation.goBack()} />
        ) : (
          <PrimaryButton label="End Conversation" onPress={handleEndConversation} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.ai + '20',
    borderBottomLeftRadius: 4,
  },
  closeButton: {
    padding: 8,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.error + '20',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 12,
  },
  errorText: {
    color: COLORS.error,
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    borderTopColor: COLORS.surface,
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.surface,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  indicatorContainer: {
    borderBottomColor: COLORS.surface,
    borderBottomWidth: 1,
    paddingVertical: 24,
  },
  interimMessage: {
    opacity: 0.7,
  },
  interimText: {
    fontStyle: 'italic',
  },
  messageContainer: {
    borderRadius: 12,
    marginBottom: 16,
    maxWidth: '90%',
    padding: 12,
  },
  messageRole: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  transcriptContainer: {
    backgroundColor: COLORS.backgroundLight,
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.user + '20',
    borderBottomRightRadius: 4,
  },
});

export default VoiceConversationScreen;
