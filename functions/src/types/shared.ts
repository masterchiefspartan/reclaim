/**
 * Shared Types for Re:Claim Backend
 * Used across Firebase Functions for journal processing
 */

export type ProcessingStatus =
  | 'pending'
  | 'uploading'
  | 'transcribing'
  | 'analyzing'
  | 'synthesizing'
  | 'completed'
  | 'failed';

export interface ProcessingError {
  stage: ProcessingStatus;
  message: string;
  timestamp: number;
}

// ============================================
// Recovery-Specific Types
// ============================================

/** Emotional themes detected in journal entries */
export type EmotionalTheme =
  | 'frustration'
  | 'fear'
  | 'grief'
  | 'hope'
  | 'gratitude'
  | 'determination'
  | 'isolation'
  | 'acceptance'
  | 'celebration';

/** Recovery wellness metrics captured per entry */
export interface RecoveryMetrics {
  hopeLevel?: number; // 1-10
  energyLevel?: number; // 1-10
  fearLevel?: number; // 1-10 (of re-injury)
  identityScore?: number; // 1-10 (feeling like themselves)
  connectionScore?: number; // 1-10 (social support)
  sleepQuality?: number; // 1-10
  painLevel?: number; // 1-10
}

/** AI-extracted insights from transcript */
export interface EnhancedInsights {
  // Basic
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions: string[];

  // Recovery-specific
  emotionalThemes: EmotionalTheme[];
  recoveryPhaseIndicators: string[];
  winsAndProgress: string[];
  challengesAndSetbacks: string[];
  supportMentions: string[];
  goalsAndAspirations: string[];

  // AI confidence
  confidenceScore: number;
}

/** Basic insights (legacy compatibility) */
export interface BasicInsights {
  keyTopics?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  suggestedActions?: string[];
}

// ============================================
// Journal Entry (Enhanced)
// ============================================

export interface JournalEntry {
  id: string;
  userId: string;

  // Audio Source
  audioUrl?: string;
  localAudioUri?: string; // App only
  duration: number;

  // Content
  transcript?: string;
  aiResponse?: string;
  aiResponseAudioUrl?: string;

  // Status
  transcriptionStatus: 'pending' | 'completed' | 'failed';
  aiResponseStatus: 'pending' | 'completed' | 'failed';
  processingStage?: ProcessingStatus;
  error?: ProcessingError;

  // Metadata
  createdAt: any; // Firestore Timestamp or Date
  updatedAt: any;

  // Context
  checkInType: 'free' | 'guided';
  mood?: string;
  moodScore?: number; // 1-10
  tags?: string[];

  // Recovery Metrics (NEW)
  recoveryMetrics?: RecoveryMetrics;

  // Insights
  insights?: BasicInsights; // Legacy
  enhancedInsights?: EnhancedInsights; // New comprehensive insights

  // Structured Check-in Data
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };
}
