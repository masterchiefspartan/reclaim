/**
 * Conversation API Service
 * Wrapper for Firebase Functions calls related to voice conversation
 */

import { httpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { addDoc, collection, serverTimestamp, doc, updateDoc, Timestamp } from 'firebase/firestore';

import { getCloudFunctions, getFirestoreDb, getFirebaseAuth } from '@services/firebase/client';
import { withErrorHandling } from '@utils/errors';
import { logger } from '@/utils/logger';
import type {
  StreamingTokens,
  ConversationTurn,
  UserContext,
  VoiceConversationDocument,
  ConversationTurnDocument,
} from '@/types/voiceConversation';

// ============================================
// API Response Types
// ============================================

interface TokensResponse {
  deepgramApiKey: string;
  elevenLabsApiKey: string;
  expiresAt: number;
}

interface OpeningResponse {
  message: string;
  userContext: Partial<UserContext>;
}

interface ConversationResponse {
  response: string;
}

interface SummaryResponse {
  summary: string;
  keyTopics: string[];
  moodAssessment?: number;
}

// ============================================
// Token Caching
// ============================================

let cachedTokens: StreamingTokens | null = null;

/**
 * Fetch streaming API tokens from Firebase Functions
 * Tokens are cached and reused until they expire
 */
export const fetchStreamingTokens = async (): Promise<StreamingTokens> => {
  // Return cached tokens if still valid
  if (cachedTokens && cachedTokens.expiresAt > Date.now() + 60000) {
    logger.info('ConversationAPI: Using cached tokens');
    return cachedTokens;
  }

  return withErrorHandling(
    'fetchStreamingTokens',
    async () => {
      const functions = getCloudFunctions();
      const getTokensFn = httpsCallable<unknown, TokensResponse>(functions, 'getStreamingTokens');

      const result: HttpsCallableResult<TokensResponse> = await getTokensFn({});

      cachedTokens = {
        deepgramApiKey: result.data.deepgramApiKey,
        elevenLabsApiKey: result.data.elevenLabsApiKey,
        expiresAt: result.data.expiresAt,
      };

      logger.info('ConversationAPI: Fetched new tokens');
      return cachedTokens;
    },
    {}
  );
};

/**
 * Clear cached tokens (call when user logs out)
 */
export const clearCachedTokens = (): void => {
  cachedTokens = null;
};

// ============================================
// Conversation Functions
// ============================================

/**
 * Get the opening message for a new conversation
 */
export const getConversationOpening = async (): Promise<OpeningResponse> => {
  return withErrorHandling(
    'getConversationOpening',
    async () => {
      const functions = getCloudFunctions();
      const openingFn = httpsCallable<unknown, OpeningResponse>(
        functions,
        'getConversationOpening'
      );

      const result: HttpsCallableResult<OpeningResponse> = await openingFn({});

      logger.info('ConversationAPI: Got opening message');
      return result.data;
    },
    {}
  );
};

/**
 * Get AI response for the current message in the conversation
 */
export const getAIResponse = async (
  currentMessage: string,
  conversationHistory: ConversationTurn[],
  userContext: Partial<UserContext>
): Promise<string> => {
  return withErrorHandling(
    'getAIResponse',
    async () => {
      const functions = getCloudFunctions();
      const responseFn = httpsCallable<
        {
          currentMessage: string;
          conversationHistory: ConversationTurn[];
          userContext: Partial<UserContext>;
        },
        ConversationResponse
      >(functions, 'getConversationResponseFn');

      const result = await responseFn({
        currentMessage,
        conversationHistory,
        userContext,
      });

      logger.info('ConversationAPI: Got AI response');
      return result.data.response;
    },
    { messageLength: currentMessage.length, historyLength: conversationHistory.length }
  );
};

/**
 * Generate a summary for the completed conversation
 */
export const generateSummary = async (
  conversationHistory: ConversationTurn[],
  userContext: Partial<UserContext>
): Promise<SummaryResponse> => {
  return withErrorHandling(
    'generateSummary',
    async () => {
      const functions = getCloudFunctions();
      const summaryFn = httpsCallable<
        {
          conversationHistory: ConversationTurn[];
          userContext: Partial<UserContext>;
        },
        SummaryResponse
      >(functions, 'getConversationSummaryFn');

      const result = await summaryFn({
        conversationHistory,
        userContext,
      });

      logger.info('ConversationAPI: Generated summary');
      return result.data;
    },
    { historyLength: conversationHistory.length }
  );
};

// ============================================
// Firestore Storage
// ============================================

const CONVERSATIONS_COLLECTION = 'voiceConversations';
const JOURNAL_COLLECTION = 'journalEntries';

/**
 * Save a completed voice conversation to Firestore
 */
export const saveConversation = async (
  sessionId: string,
  startedAt: Date,
  endedAt: Date,
  turns: ConversationTurn[],
  summary?: string,
  keyTopics?: string[],
  moodAssessment?: number
): Promise<string> => {
  return withErrorHandling(
    'saveConversation',
    async () => {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const db = getFirestoreDb();
      const duration = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

      // Convert turns to Firestore format
      const turnDocuments: ConversationTurnDocument[] = turns.map(turn => ({
        id: turn.id,
        role: turn.role,
        content: turn.content,
        timestamp: Timestamp.fromDate(turn.timestamp),
      }));

      const conversationDoc: Omit<VoiceConversationDocument, 'id'> = {
        userId: user.uid,
        startedAt: Timestamp.fromDate(startedAt),
        endedAt: Timestamp.fromDate(endedAt),
        duration,
        turns: turnDocuments,
        summary,
        keyTopics,
        moodAssessment,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationDoc);

      logger.info('ConversationAPI: Saved conversation', { id: docRef.id });
      return docRef.id;
    },
    { sessionId, turnCount: turns.length }
  );
};

/**
 * Create a journal entry summary from the conversation
 */
export const createJournalSummaryEntry = async (
  conversationId: string,
  summary: string,
  keyTopics: string[],
  duration: number,
  moodAssessment?: number
): Promise<string> => {
  return withErrorHandling(
    'createJournalSummaryEntry',
    async () => {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const db = getFirestoreDb();

      // Create a journal entry that links to the conversation
      const journalEntry = {
        userId: user.uid,
        checkInType: 'conversation',
        conversationId, // Link to full conversation
        duration,
        transcript: summary, // Use summary as the "transcript"
        tags: keyTopics,
        moodScore: moodAssessment,
        transcriptionStatus: 'completed',
        aiResponseStatus: 'completed', // No separate AI response needed
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, JOURNAL_COLLECTION), journalEntry);

      logger.info('ConversationAPI: Created journal summary entry', { id: docRef.id });
      return docRef.id;
    },
    { conversationId }
  );
};

/**
 * Update an existing conversation with summary (if generated after save)
 */
export const updateConversationSummary = async (
  conversationId: string,
  summary: string,
  keyTopics: string[],
  moodAssessment?: number
): Promise<void> => {
  return withErrorHandling(
    'updateConversationSummary',
    async () => {
      const db = getFirestoreDb();
      const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);

      await updateDoc(docRef, {
        summary,
        keyTopics,
        moodAssessment,
        updatedAt: serverTimestamp(),
      });

      logger.info('ConversationAPI: Updated conversation summary', { id: conversationId });
    },
    { conversationId }
  );
};
