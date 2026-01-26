import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { transcribeAudio } from './services/deepgram';
import {
  generateAIResponse,
  extractEnhancedInsights,
  estimateRecoveryMetrics,
} from './services/claude';
import { generateSpeech } from './services/elevenlabs';
import {
  generateOpeningMessage,
  generateConversationResponse,
  generateConversationSummary,
} from './services/conversationClaude';
import {
  fetchEntriesForPeriod,
  fetchEntriesForWeek,
  buildMoodDataPoints,
  calculateMoodDistribution,
  calculateAverageMoodScore,
  calculateTrend,
  calculateSentimentDistribution,
  extractTopTopics,
  collectSuggestedActions,
  calculateTotalVoiceMinutes,
  calculateStreakDays,
  buildRecoveryProgress,
  buildPatternInsights,
  buildWeeklySummary,
} from './services/analytics';
import { JournalEntry, ProcessingStatus } from './types/shared';
import {
  MoodTrendsRequest,
  MoodTrendsResponse,
  InsightsSummaryRequest,
  InsightsSummaryResponse,
  RecoveryProgressRequest,
  RecoveryProgressResponse,
  PatternInsightsRequest,
  PatternInsightsResponse,
  WeeklySummaryRequest,
  WeeklySummaryResponse,
} from './types/analytics';
import { RateLimiters, cleanupRateLimits } from './utils/rateLimiter';
import {
  requireAuth,
  requireAppCheck,
  validateString,
  validateNumber,
  validateArray,
  validateConversationTurn,
  sanitizeUserContext,
  withSecureErrorHandling,
  ValidatedConversationTurn,
} from './utils/security';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// ============================================
// Security Constants
// ============================================

const MAX_MESSAGE_LENGTH = 10000;
const MAX_CONVERSATION_HISTORY = 50;

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
 * Trigger 2: AI Analysis (Enhanced)
 * Listens for completed transcription -> Extracts insights + Generates response -> Updates Firestore
 *
 * This is where the magic happens for Re:Claim's value proposition.
 * We extract rich recovery-focused insights from the transcript.
 */
export const onEntryTranscribed = functions.firestore
  .document('journalEntries/{entryId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as JournalEntry;
    const after = change.after.data() as JournalEntry;
    const entryId = context.params.entryId;

    // Idempotency check: Only run if status CHANGED to 'analyzing' (or transcription just completed)
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

      const userContext = {
        recoveryType: userData?.recoveryContext?.injuryDescription || userData?.recoveryContext?.injuryType,
        weeksIntoRecovery: userData?.recoveryContext?.weeksIntoRecovery,
        userName: userData?.displayName,
      };

      // Run all AI operations in parallel for speed
      const [aiResponse, enhancedInsights, recoveryMetrics] = await Promise.all([
        generateAIResponse(after.transcript, userContext),
        extractEnhancedInsights(after.transcript, userContext),
        estimateRecoveryMetrics(after.transcript, userContext),
      ]);

      // Prepare update with all extracted data
      const updateData: Partial<JournalEntry> = {
        aiResponse,
        aiResponseStatus: 'completed',
        processingStage: 'synthesizing',
        // Enhanced insights (new)
        enhancedInsights,
        // Recovery metrics (new) - merge with any user-provided metrics
        recoveryMetrics: {
          ...recoveryMetrics,
          ...(after.recoveryMetrics || {}), // User-provided values take precedence
        },
        // Legacy insights for backward compatibility
        insights: {
          keyTopics: enhancedInsights.keyTopics,
          sentiment: enhancedInsights.sentiment,
          suggestedActions: enhancedInsights.suggestedActions,
        },
      };

      await updateStatus(entryId, updateData);
      console.log(`[2/3] Analysis complete for: ${entryId} (enhanced insights extracted)`);
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
 *
 * SECURITY NOTES:
 * - Rate limited to prevent abuse (5 requests per minute)
 * - Tokens have short expiration (30 minutes)
 * - Ideally, use Deepgram's temporary key API for production
 * - Consider proxying requests through your backend for maximum security
 *
 * TODO for production: Replace with Deepgram temporary keys API
 * https://developers.deepgram.com/docs/create-project-key
 */
export const getStreamingTokens = functions.https.onCall(
  withSecureErrorHandling(async (data, context) => {
    // Verify authentication
    const userId = requireAuth(context);

    // Optional: Verify App Check
    requireAppCheck(context);

    // Rate limit: 5 requests per minute (tokens should be cached client-side)
    const rateLimitResult = await RateLimiters.veryStrict(userId);
    if (!rateLimitResult.allowed) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many token requests. Please wait before trying again.'
      );
    }

    // Get API keys from environment variables
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    if (!deepgramApiKey || !elevenLabsApiKey) {
      console.error('Missing API keys in environment variables');
      throw new functions.https.HttpsError('internal', 'Service configuration error');
    }

    // Log token request for audit trail (without exposing keys)
    console.log(`Streaming tokens requested by user: ${userId}`);

    // Return tokens with expiration (for client-side caching)
    // Client should cache and reuse until expiration
    return {
      deepgramApiKey,
      elevenLabsApiKey,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    };
  })
);

/**
 * Get opening message for a new voice conversation
 */
export const getConversationOpening = functions.https.onCall(
  withSecureErrorHandling(async (data, context) => {
    // Verify authentication
    const userId = requireAuth(context);
    requireAppCheck(context);

    // Rate limit: 10 requests per minute
    const rateLimitResult = await RateLimiters.strict(userId);
    if (!rateLimitResult.allowed) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests. Please wait before trying again.'
      );
    }

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
  })
);

interface ConversationResponseData {
  currentMessage: string;
  conversationHistory: ValidatedConversationTurn[];
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
  withSecureErrorHandling(async (data: ConversationResponseData, context) => {
    // Verify authentication
    const userId = requireAuth(context);
    requireAppCheck(context);

    // Rate limit: 10 requests per minute (AI calls are expensive)
    const rateLimitResult = await RateLimiters.strict(userId);
    if (!rateLimitResult.allowed) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests. Please wait before trying again.'
      );
    }

    // Validate inputs
    const currentMessage = validateString(data?.currentMessage, 'currentMessage', {
      required: true,
      minLength: 1,
      maxLength: MAX_MESSAGE_LENGTH,
    })!;

    const conversationHistory = validateArray<ValidatedConversationTurn>(
      data?.conversationHistory,
      'conversationHistory',
      {
        required: false,
        maxLength: MAX_CONVERSATION_HISTORY,
        itemValidator: validateConversationTurn,
      }
    ) || [];

    // Sanitize user context
    const userContext = data?.userContext
      ? sanitizeUserContext(data.userContext as Record<string, unknown>)
      : {};

    const response = await generateConversationResponse(
      currentMessage,
      conversationHistory,
      userContext
    );

    return {
      response,
    };
  })
);

interface SummaryRequestData {
  conversationHistory: ValidatedConversationTurn[];
  userContext?: {
    userName?: string;
    recoveryType?: string;
  };
}

/**
 * Generate summary of completed voice conversation
 */
export const getConversationSummaryFn = functions.https.onCall(
  withSecureErrorHandling(async (data: SummaryRequestData, context) => {
    // Verify authentication
    const userId = requireAuth(context);
    requireAppCheck(context);

    // Rate limit: 10 requests per minute
    const rateLimitResult = await RateLimiters.strict(userId);
    if (!rateLimitResult.allowed) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests. Please wait before trying again.'
      );
    }

    // Validate inputs
    const conversationHistory = validateArray<ValidatedConversationTurn>(
      data?.conversationHistory,
      'conversationHistory',
      {
        required: true,
        minLength: 1,
        maxLength: MAX_CONVERSATION_HISTORY,
        itemValidator: validateConversationTurn,
      }
    )!;

    // Sanitize user context
    const userContext = data?.userContext
      ? sanitizeUserContext(data.userContext as Record<string, unknown>)
      : {};

    const summary = await generateConversationSummary(conversationHistory, userContext);

    return summary;
  })
);

// ============================================
// Analytics Functions
// ============================================

/**
 * Get mood trends for a user over a specified time period
 * Used by the Dashboard to display mood charts and progress
 */
export const getMoodTrends = functions.https.onCall(
  withSecureErrorHandling(async (data: MoodTrendsRequest, context): Promise<MoodTrendsResponse> => {
    // Verify authentication
    const userId = requireAuth(context);
    requireAppCheck(context);

    // Rate limit: 60 requests per minute (read operation)
    const rateLimitResult = await RateLimiters.standard(userId);
    if (!rateLimitResult.allowed) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests. Please wait before trying again.'
      );
    }

    // Validate days parameter
    const days = validateNumber(data?.days, 'days', {
      required: false,
      min: 1,
      max: 365,
      integer: true,
    }) || 30;

    // Fetch entries for the period
    const entries = await fetchEntriesForPeriod(userId, days);

    // Calculate period boundaries
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);

    // Check for insufficient data
    const insufficientData = entries.length < 3;

    // Build mood data points
    const moodData = buildMoodDataPoints(entries);

    // Calculate statistics
    const moodDistribution = calculateMoodDistribution(entries);
    const averageMoodScore = calculateAverageMoodScore(entries);
    const trend = calculateTrend(entries);

    return {
      moodData,
      averages: {
        moodDistribution,
        averageMoodScore,
        totalEntries: entries.length,
      },
      trend,
      insufficientData,
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
    };
  })
);

/**
 * Get insights summary for a user
 * Used by the Dashboard to display topics, sentiment, and stats
 */
export const getInsightsSummary = functions.https.onCall(
  withSecureErrorHandling(
    async (data: InsightsSummaryRequest, context): Promise<InsightsSummaryResponse> => {
      // Verify authentication
      const userId = requireAuth(context);
      requireAppCheck(context);

      // Rate limit: 60 requests per minute (read operation)
      const rateLimitResult = await RateLimiters.standard(userId);
      if (!rateLimitResult.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please wait before trying again.'
        );
      }

      // Validate days parameter
      const days =
        validateNumber(data?.days, 'days', {
          required: false,
          min: 1,
          max: 365,
          integer: true,
        }) || 30;

      // Fetch entries for the period
      const entries = await fetchEntriesForPeriod(userId, days);

      // Check for insufficient data
      const insufficientData = entries.length < 3;

      // Extract insights
      const topTopics = extractTopTopics(entries, 5);
      const sentimentDistribution = calculateSentimentDistribution(entries);
      const suggestedActions = collectSuggestedActions(entries, 5);

      // Calculate stats
      const totalVoiceMinutes = calculateTotalVoiceMinutes(entries);
      const averageMoodScore = calculateAverageMoodScore(entries);
      const streakDays = await calculateStreakDays(userId);

      return {
        topTopics,
        sentimentDistribution,
        suggestedActions,
        totalEntries: entries.length,
        streakDays,
        totalVoiceMinutes,
        averageMoodScore,
        insufficientData,
      };
    }
  )
);

// ============================================
// NEW: Recovery Progress Analytics
// ============================================

/**
 * Get recovery progress for a user
 * Tracks mental/emotional recovery trajectory over time
 */
export const getRecoveryProgress = functions.https.onCall(
  withSecureErrorHandling(
    async (data: RecoveryProgressRequest, context): Promise<RecoveryProgressResponse> => {
      // Verify authentication
      const userId = requireAuth(context);
      requireAppCheck(context);

      // Rate limit: 60 requests per minute (read operation)
      const rateLimitResult = await RateLimiters.standard(userId);
      if (!rateLimitResult.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please wait before trying again.'
        );
      }

      // Validate days parameter
      const days =
        validateNumber(data?.days, 'days', {
          required: false,
          min: 1,
          max: 365,
          integer: true,
        }) || 30;

      // Fetch entries for the period
      const entries = await fetchEntriesForPeriod(userId, days);

      // Build comprehensive recovery progress
      const progress = await buildRecoveryProgress(userId, entries, days);

      return progress;
    }
  )
);

/**
 * Get pattern insights for a user
 * AI-powered analysis of correlations, triggers, and recommendations
 */
export const getPatternInsights = functions.https.onCall(
  withSecureErrorHandling(
    async (data: PatternInsightsRequest, context): Promise<PatternInsightsResponse> => {
      // Verify authentication
      const userId = requireAuth(context);
      requireAppCheck(context);

      // Rate limit: 10 requests per minute (AI-powered, expensive)
      const rateLimitResult = await RateLimiters.strict(userId);
      if (!rateLimitResult.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please wait before trying again.'
        );
      }

      // Validate days parameter
      const days =
        validateNumber(data?.days, 'days', {
          required: false,
          min: 1,
          max: 365,
          integer: true,
        }) || 30;

      // Fetch entries for the period
      const entries = await fetchEntriesForPeriod(userId, days);

      // Get user context for personalization
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      const userContext = {
        userName: userData?.displayName,
        recoveryType: userData?.recoveryContext?.injuryDescription,
      };

      // Build pattern insights with AI
      const insights = await buildPatternInsights(entries, userContext);

      return insights;
    }
  )
);

/**
 * Get weekly summary for a user
 * AI-generated recap of the week's emotional journey
 */
export const getWeeklySummary = functions.https.onCall(
  withSecureErrorHandling(
    async (data: WeeklySummaryRequest, context): Promise<WeeklySummaryResponse> => {
      // Verify authentication
      const userId = requireAuth(context);
      requireAppCheck(context);

      // Rate limit: 10 requests per minute (AI-powered, expensive)
      const rateLimitResult = await RateLimiters.strict(userId);
      if (!rateLimitResult.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please wait before trying again.'
        );
      }

      // Validate weekOffset parameter
      const weekOffset =
        validateNumber(data?.weekOffset, 'weekOffset', {
          required: false,
          min: 0,
          max: 52,
          integer: true,
        }) || 0;

      // Calculate week boundaries
      const now = new Date();
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - weekOffset * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      // Fetch entries for the week
      const entries = await fetchEntriesForWeek(userId, weekOffset);

      // Get user context for personalization
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      const userContext = {
        userName: userData?.displayName,
        recoveryType: userData?.recoveryContext?.injuryDescription,
      };

      // Build weekly summary with AI
      const summary = await buildWeeklySummary(entries, weekStart, weekEnd, userContext);

      return summary;
    }
  )
);

// ============================================
// Scheduled Functions
// ============================================

/**
 * Clean up old rate limit records daily
 * Prevents unbounded storage growth
 */
export const cleanupRateLimitsScheduled = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const deleted = await cleanupRateLimits();
    console.log(`Cleaned up ${deleted} old rate limit records`);
  });
