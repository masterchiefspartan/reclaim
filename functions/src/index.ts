import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { transcribeAudio } from './services/deepgram';
import { generateAIResponse } from './services/claude';
import { generateSpeech } from './services/elevenlabs';
import {
  generateOpeningMessage,
  generateConversationResponse,
  generateConversationSummary,
} from './services/conversationClaude';
import { JournalEntry, ProcessingStatus } from './types/shared';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Helper to update status safely
const updateStatus = async (entryId: string, updates: Partial<JournalEntry>) => {
  await db
    .collection('journalEntries')
    .doc(entryId)
    .update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

// Helper to handle errors
const handleError = async (entryId: string, stage: ProcessingStatus, error: unknown) => {
  console.error(`Error in stage ${stage} for entry ${entryId}:`, error);
  await updateStatus(entryId, {
    processingStage: 'failed',
    error: {
      stage,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    },
  });
};

/**
 * Trigger 1: Audio Ingestion & Transcription
 * Listens for new audio files in Storage -> Transcribes -> Updates Firestore
 */
export const onAudioUpload = functions.storage.object().onFinalize(async object => {
  // strict path check: audio/{userId}/{entryId}.m4a
  if (!object.name?.startsWith('audio/') || object.name.includes('_response')) {
    return console.log('Ignoring non-source audio file:', object.name);
  }

  const pathParts = object.name.split('/');
  if (pathParts.length !== 3) return console.log('Invalid path structure');

  // const userId = pathParts[1];
  const entryId = pathParts[2].replace(/\.[^/.]+$/, ''); // remove extension

  try {
    console.log(`[1/3] Transcribing entry: ${entryId}`);
    await updateStatus(entryId, { processingStage: 'transcribing' });

    const bucket = storage.bucket(object.bucket);
    const [fileBuffer] = await bucket.file(object.name).download();

    const transcript = await transcribeAudio(fileBuffer);

    await updateStatus(entryId, {
      transcript,
      transcriptionStatus: 'completed',
      processingStage: 'analyzing', // Trigger next stage
    });
    console.log(`[1/3] Transcription complete for: ${entryId}`);
  } catch (error) {
    await handleError(entryId, 'transcribing', error);
    // Also set specific status to failed so we can retry just this step
    await updateStatus(entryId, { transcriptionStatus: 'failed' });
  }
});

/**
 * Trigger 2: AI Analysis
 * Listens for completed transcription -> Calls Claude -> Updates Firestore
 */
export const onEntryTranscribed = functions.firestore
  .document('journalEntries/{entryId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as JournalEntry;
    const after = change.after.data() as JournalEntry;
    const entryId = context.params.entryId;

    // Idempotency check: Only run if status CHANGED to 'analyzing' (or transcription just completed)
    // We use processingStage as the main orchestrator
    const shouldRun =
      (before.processingStage !== 'analyzing' && after.processingStage === 'analyzing') ||
      (before.transcriptionStatus !== 'completed' &&
        after.transcriptionStatus === 'completed' &&
        after.aiResponseStatus === 'pending');

    if (!shouldRun) return null;
    if (!after.transcript) return console.error('No transcript available');

    try {
      console.log(`[2/3] Analyzing entry: ${entryId}`);

      // Get User Context
      const userDoc = await db.collection('users').doc(after.userId).get();
      const userData = userDoc.data();

      const aiResponse = await generateAIResponse(after.transcript, {
        recoveryType: userData?.recoveryContext?.injuryType,
        weeksIntoRecovery: userData?.recoveryContext?.weeksIntoRecovery,
      });

      await updateStatus(entryId, {
        aiResponse,
        aiResponseStatus: 'completed',
        processingStage: 'synthesizing', // Trigger next stage
      });
      console.log(`[2/3] Analysis complete for: ${entryId}`);
    } catch (error) {
      await handleError(entryId, 'analyzing', error);
      await updateStatus(entryId, { aiResponseStatus: 'failed' });
    }
  });

/**
 * Trigger 3: TTS Synthesis
 * Listens for completed AI response -> Calls ElevenLabs -> Uploads MP3 -> Updates Firestore
 */
export const onAiResponseGenerated = functions.firestore
  .document('journalEntries/{entryId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as JournalEntry;
    const after = change.after.data() as JournalEntry;
    const entryId = context.params.entryId;

    const shouldRun =
      (before.processingStage !== 'synthesizing' && after.processingStage === 'synthesizing') ||
      (before.aiResponseStatus !== 'completed' &&
        after.aiResponseStatus === 'completed' &&
        !after.aiResponseAudioUrl);

    if (!shouldRun) return null;
    if (!after.aiResponse) return console.error('No AI response available');

    try {
      console.log(`[3/3] Synthesizing audio for: ${entryId}`);

      const audioBuffer = await generateSpeech(after.aiResponse);

      // Upload to Storage
      const bucket = storage.bucket();
      const filePath = `audio/${after.userId}/${entryId}_response.mp3`;
      const file = bucket.file(filePath);

      await file.save(audioBuffer, {
        contentType: 'audio/mpeg',
        metadata: {
          userId: after.userId,
          entryId: entryId,
          type: 'ai-response',
        },
      });

      // Get long-lived signed URL (or public URL if bucket is public, but signed is safer for private user data)
      // Note: For a real production app, we might want to use client SDK to fetch download URL
      // or make the specific file public. Here we'll use a signed URL with long expiration.
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2100',
      });

      await updateStatus(entryId, {
        aiResponseAudioUrl: url,
        processingStage: 'completed',
      });
      console.log(`[3/3] Synthesis complete for: ${entryId}`);
    } catch (error) {
      await handleError(entryId, 'synthesizing', error);
    }
  });

// ============================================
// Voice Conversation Functions
// ============================================

/**
 * Get streaming API tokens for voice conversation
 * Returns Deepgram and ElevenLabs API keys for client-side streaming
 */
export const getStreamingTokens = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get API keys from environment variables
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    if (!deepgramApiKey || !elevenLabsApiKey) {
      console.error('Missing API keys in environment variables');
      throw new functions.https.HttpsError('internal', 'Service configuration error');
    }

    // Return tokens with expiration (for client-side caching)
    return {
      deepgramApiKey,
      elevenLabsApiKey,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    };
  } catch (error) {
    console.error('Failed to get streaming tokens:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get streaming tokens');
  }
});

/**
 * Get opening message for a new voice conversation
 */
export const getConversationOpening = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    // Fetch user context from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    const userContext = {
      userName: userData?.displayName || undefined,
      recoveryType: userData?.recoveryContext?.injuryDescription || undefined,
      daysSinceStart: userData?.recoveryContext?.surgeryDate
        ? Math.floor(
            (Date.now() - new Date(userData.recoveryContext.surgeryDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : undefined,
    };

    const openingMessage = await generateOpeningMessage(userContext);

    return {
      message: openingMessage,
      userContext,
    };
  } catch (error) {
    console.error('Failed to get conversation opening:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate opening message');
  }
});

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationResponseData {
  currentMessage: string;
  conversationHistory: ConversationTurn[];
  userContext?: {
    userName?: string;
    recoveryType?: string;
    daysSinceStart?: number;
  };
}

/**
 * Get AI response for ongoing voice conversation
 */
export const getConversationResponseFn = functions.https.onCall(
  async (data: ConversationResponseData, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { currentMessage, conversationHistory, userContext } = data;

    if (!currentMessage || typeof currentMessage !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'currentMessage is required');
    }

    try {
      const response = await generateConversationResponse(
        currentMessage,
        conversationHistory || [],
        userContext || {}
      );

      return {
        response,
      };
    } catch (error) {
      console.error('Failed to get conversation response:', error);
      throw new functions.https.HttpsError('internal', 'Failed to generate response');
    }
  }
);

interface SummaryRequestData {
  conversationHistory: ConversationTurn[];
  userContext?: {
    userName?: string;
    recoveryType?: string;
  };
}

/**
 * Generate summary of completed voice conversation
 */
export const getConversationSummaryFn = functions.https.onCall(
  async (data: SummaryRequestData, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { conversationHistory, userContext } = data;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      throw new functions.https.HttpsError('invalid-argument', 'conversationHistory is required');
    }

    try {
      const summary = await generateConversationSummary(conversationHistory, userContext || {});

      return summary;
    } catch (error) {
      console.error('Failed to generate conversation summary:', error);
      throw new functions.https.HttpsError('internal', 'Failed to generate summary');
    }
  }
);
