/**
 * useVoiceConversation Hook
 * Main orchestration hook for real-time voice conversations with AI companion
 *
 * State Machine:
 * idle → initializing → ai_speaking → user_speaking → processing → ai_speaking → ... → ended
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { deepgramStream } from '@services/voice-conversation/deepgramStream';
import { elevenLabsTTS } from '@services/voice-conversation/elevenLabsTTS';
import {
  fetchStreamingTokens,
  getConversationOpening,
  getAIResponse,
  generateSummary,
  saveConversation,
  createJournalSummaryEntry,
} from '@services/voice-conversation/conversationApi';
import { logger } from '@/utils/logger';
import type {
  ConversationStatus,
  ConversationTurn,
  UserContext,
  VoiceConversationState,
  VoiceConversationActions,
} from '@/types/voiceConversation';

// ============================================
// Constants
// ============================================

const MAX_DURATION_SECONDS = 600; // 10 minutes
const TIMER_INTERVAL_MS = 1000;

// ============================================
// State Types
// ============================================

type ConversationAction =
  | { type: 'START_INITIALIZING'; sessionId: string }
  | { type: 'SET_USER_CONTEXT'; userContext: Partial<UserContext> }
  | { type: 'SET_STATUS'; status: ConversationStatus }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'ADD_TURN'; turn: ConversationTurn }
  | { type: 'UPDATE_TRANSCRIPT'; transcript: string }
  | { type: 'UPDATE_TIME'; timeRemaining: number }
  | { type: 'UPDATE_VOLUME'; volume: number }
  | { type: 'SET_MIC_ACTIVE'; active: boolean }
  | { type: 'RESET' };

const initialState: VoiceConversationState = {
  status: 'idle',
  sessionId: null,
  sessionStartTime: null,
  timeRemaining: MAX_DURATION_SECONDS,
  conversationHistory: [],
  currentTranscript: '',
  userContext: null,
  error: null,
  isMicrophoneActive: false,
  volume: 0,
};

// ============================================
// Reducer
// ============================================

function conversationReducer(
  state: VoiceConversationState,
  action: ConversationAction
): VoiceConversationState {
  switch (action.type) {
    case 'START_INITIALIZING':
      return {
        ...initialState,
        status: 'initializing',
        sessionId: action.sessionId,
        sessionStartTime: new Date(),
      };

    case 'SET_USER_CONTEXT':
      return {
        ...state,
        userContext: {
          userId: action.userContext.userId || '',
          userName: action.userContext.userName || '',
          recoveryType: action.userContext.recoveryType || '',
          recentMoods: action.userContext.recentMoods || [],
          recentJournalSummaries: action.userContext.recentJournalSummaries || [],
          painPoints: action.userContext.painPoints || [],
          wins: action.userContext.wins || [],
          ...action.userContext,
        },
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };

    case 'SET_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'ADD_TURN':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.turn],
        currentTranscript: '',
      };

    case 'UPDATE_TRANSCRIPT':
      return {
        ...state,
        currentTranscript: action.transcript,
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.timeRemaining,
      };

    case 'UPDATE_VOLUME':
      return {
        ...state,
        volume: action.volume,
      };

    case 'SET_MIC_ACTIVE':
      return {
        ...state,
        isMicrophoneActive: action.active,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ============================================
// Hook
// ============================================

export function useVoiceConversation(): {
  state: VoiceConversationState;
  actions: VoiceConversationActions;
} {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  // Refs for managing async state
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isEndingRef = useRef(false);
  const userContextRef = useRef<Partial<UserContext>>({});

  // ============================================
  // Timer Management
  // ============================================

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let timeLeft = MAX_DURATION_SECONDS;

    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      dispatch({ type: 'UPDATE_TIME', timeRemaining: timeLeft });

      if (timeLeft <= 0) {
        // Time's up - end conversation
        logger.info('VoiceConversation: Time limit reached');
        // Will trigger endConversation
      }
    }, TIMER_INTERVAL_MS);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ============================================
  // Conversation Flow
  // ============================================

  /**
   * Handle when AI finishes speaking - start listening for user
   */
  const handleAISpeakingEnd = useCallback(async () => {
    if (isEndingRef.current || state.status === 'ended') {
      return;
    }

    logger.info('VoiceConversation: AI finished speaking, starting to listen');
    dispatch({ type: 'SET_STATUS', status: 'user_speaking' });

    // Resume listening for user input
    await deepgramStream.resumeListening();
  }, [state.status]);

  /**
   * Handle when user finishes speaking (silence detected)
   */
  const handleUserFinishedSpeaking = useCallback(
    async (transcript: string) => {
      if (isEndingRef.current || !transcript.trim()) {
        return;
      }

      logger.info('VoiceConversation: User finished speaking', {
        transcriptLength: transcript.length,
      });

      // Pause listening while processing
      await deepgramStream.pauseListening();
      dispatch({ type: 'SET_STATUS', status: 'processing' });

      // Add user turn to history
      const userTurn: ConversationTurn = {
        id: uuidv4(),
        role: 'user',
        content: transcript,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_TURN', turn: userTurn });

      // Clear the transcript in Deepgram for next turn
      deepgramStream.clearTranscript();

      try {
        // Get AI response
        const aiResponse = await getAIResponse(
          transcript,
          [...state.conversationHistory, userTurn],
          userContextRef.current
        );

        // Add AI turn to history
        const aiTurn: ConversationTurn = {
          id: uuidv4(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_TURN', turn: aiTurn });

        // Speak the AI response
        dispatch({ type: 'SET_STATUS', status: 'ai_speaking' });
        await elevenLabsTTS.speak(aiResponse);
      } catch (error) {
        logger.error('VoiceConversation: Failed to get AI response', { error });
        dispatch({ type: 'SET_ERROR', error: 'Failed to get response. Please try again.' });
      }
    },
    [state.conversationHistory]
  );

  // ============================================
  // Main Actions
  // ============================================

  /**
   * Start a new conversation
   */
  const startConversation = useCallback(async () => {
    if (state.status !== 'idle' && state.status !== 'error') {
      logger.warn('VoiceConversation: Cannot start - already active');
      return;
    }

    isEndingRef.current = false;
    const sessionId = uuidv4();

    logger.info('VoiceConversation: Starting conversation', { sessionId });
    dispatch({ type: 'START_INITIALIZING', sessionId });

    try {
      // 1. Fetch streaming tokens
      const tokens = await fetchStreamingTokens();

      // 2. Get opening message and user context
      const { message: openingMessage, userContext } = await getConversationOpening();
      userContextRef.current = userContext;
      dispatch({ type: 'SET_USER_CONTEXT', userContext });

      // 3. Configure TTS
      elevenLabsTTS.configure({
        apiKey: tokens.elevenLabsApiKey,
      });

      elevenLabsTTS.setCallbacks({
        onSpeakingStart: () => {
          dispatch({ type: 'SET_STATUS', status: 'ai_speaking' });
        },
        onSpeakingEnd: handleAISpeakingEnd,
        onError: error => {
          logger.error('VoiceConversation: TTS error', { error });
          // Continue without audio - show text instead
          handleAISpeakingEnd();
        },
      });

      // 4. Start Deepgram listening
      await deepgramStream.startListening({
        apiKey: tokens.deepgramApiKey,
        onInterimTranscript: transcript => {
          dispatch({ type: 'UPDATE_TRANSCRIPT', transcript });
        },
        onFinalTranscript: transcript => {
          handleUserFinishedSpeaking(transcript);
        },
        onError: error => {
          logger.error('VoiceConversation: Deepgram error', { error });
          dispatch({ type: 'SET_ERROR', error: 'Microphone error. Please try again.' });
        },
        onVolumeChange: volume => {
          dispatch({ type: 'UPDATE_VOLUME', volume });
        },
      });

      dispatch({ type: 'SET_MIC_ACTIVE', active: true });

      // 5. Start timer
      startTimer();

      // 6. Add opening message to history and speak it
      const openingTurn: ConversationTurn = {
        id: uuidv4(),
        role: 'assistant',
        content: openingMessage,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_TURN', turn: openingTurn });

      // Pause listening while AI speaks
      await deepgramStream.pauseListening();

      // Speak opening message
      dispatch({ type: 'SET_STATUS', status: 'ai_speaking' });
      await elevenLabsTTS.speak(openingMessage);

      logger.info('VoiceConversation: Started successfully');
    } catch (error) {
      logger.error('VoiceConversation: Failed to start', { error });
      dispatch({
        type: 'SET_ERROR',
        error: error instanceof Error ? error.message : 'Failed to start conversation',
      });

      // Clean up
      await deepgramStream.stopListening();
      await elevenLabsTTS.cleanup();
      stopTimer();
    }
  }, [state.status, startTimer, stopTimer, handleAISpeakingEnd, handleUserFinishedSpeaking]);

  /**
   * End the current conversation
   */
  const endConversation = useCallback(async () => {
    if (isEndingRef.current) {
      return;
    }

    isEndingRef.current = true;
    logger.info('VoiceConversation: Ending conversation');

    // Stop all services
    stopTimer();
    await deepgramStream.stopListening();
    await elevenLabsTTS.stopSpeaking();

    dispatch({ type: 'SET_STATUS', status: 'ended' });
    dispatch({ type: 'SET_MIC_ACTIVE', active: false });

    // Save conversation and generate summary
    if (state.sessionId && state.conversationHistory.length > 0 && state.sessionStartTime) {
      try {
        // Generate summary
        const { summary, keyTopics, moodAssessment } = await generateSummary(
          state.conversationHistory,
          userContextRef.current
        );

        // Save conversation to Firestore
        const endedAt = new Date();
        const conversationId = await saveConversation(
          state.sessionId,
          state.sessionStartTime,
          endedAt,
          state.conversationHistory,
          summary,
          keyTopics,
          moodAssessment
        );

        // Create journal entry
        const duration = Math.floor((endedAt.getTime() - state.sessionStartTime.getTime()) / 1000);
        await createJournalSummaryEntry(
          conversationId,
          summary,
          keyTopics,
          duration,
          moodAssessment
        );

        logger.info('VoiceConversation: Saved conversation', { conversationId });
      } catch (error) {
        logger.error('VoiceConversation: Failed to save conversation', { error });
        // Don't throw - the conversation is already ended
      }
    }

    // Clean up TTS
    await elevenLabsTTS.cleanup();
  }, [state.sessionId, state.conversationHistory, state.sessionStartTime, stopTimer]);

  /**
   * Pause listening (e.g., user wants to pause)
   */
  const pauseListening = useCallback(() => {
    deepgramStream.pauseListening();
    dispatch({ type: 'SET_MIC_ACTIVE', active: false });
  }, []);

  /**
   * Resume listening
   */
  const resumeListening = useCallback(() => {
    deepgramStream.resumeListening();
    dispatch({ type: 'SET_MIC_ACTIVE', active: true });
  }, []);

  // ============================================
  // Cleanup on unmount
  // ============================================

  useEffect(() => {
    return () => {
      stopTimer();
      deepgramStream.stopListening();
      elevenLabsTTS.cleanup();
    };
  }, [stopTimer]);

  // ============================================
  // Auto-end when time is up
  // ============================================

  useEffect(() => {
    if (state.timeRemaining <= 0 && state.status !== 'ended' && state.status !== 'idle') {
      endConversation();
    }
  }, [state.timeRemaining, state.status, endConversation]);

  // ============================================
  // Return
  // ============================================

  return {
    state,
    actions: {
      startConversation,
      endConversation,
      pauseListening,
      resumeListening,
    },
  };
}
