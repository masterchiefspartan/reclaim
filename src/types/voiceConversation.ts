import type { Timestamp } from 'firebase/firestore';

/**
 * Voice Conversation Types
 * Types for the real-time voice conversation feature with AI recovery companion
 */

// ============================================
// Conversation State Types
// ============================================

export type ConversationStatus =
  | 'idle'
  | 'initializing'
  | 'ai_speaking'
  | 'user_speaking'
  | 'processing'
  | 'ended'
  | 'error';

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ============================================
// User Context Types
// ============================================

export interface MoodEntry {
  date: Date;
  mood: number; // 1-5 scale
  label: string; // e.g., "great", "okay", "struggling"
}

export interface JournalSummary {
  id: string;
  date: Date;
  summary: string;
  themes: string[];
  mood?: number;
}

export interface UserContext {
  userId: string;
  userName: string;
  recoveryType: string; // e.g., "shoulder surgery", "ACL reconstruction"
  recoveryStartDate?: Date;
  daysSinceStart?: number;
  recentMoods: MoodEntry[];
  recentJournalSummaries: JournalSummary[];
  painPoints: string[]; // extracted themes from journals
  wins: string[]; // positive moments mentioned
  lastConversationDate?: Date;
}

// ============================================
// Voice Conversation State
// ============================================

export interface VoiceConversationState {
  status: ConversationStatus;
  sessionId: string | null;
  sessionStartTime: Date | null;
  timeRemaining: number; // seconds, starts at 600 (10 min)
  conversationHistory: ConversationTurn[];
  currentTranscript: string; // live transcript as user speaks
  userContext: UserContext | null;
  error: string | null;
  isMicrophoneActive: boolean;
  volume: number; // 0-1, for waveform visualization
}

export interface VoiceConversationActions {
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  pauseListening: () => void;
  resumeListening: () => void;
}

// ============================================
// Conversation Summary (for storage)
// ============================================

export interface ConversationSummary {
  sessionId: string;
  date: Date;
  duration: number; // seconds
  turnCount: number;
  aiSummary: string;
  keyTopics: string[];
  moodAssessment?: number;
}

// ============================================
// Firestore Document Types
// ============================================

export interface VoiceConversationDocument {
  id: string;
  userId: string;
  startedAt: Timestamp;
  endedAt: Timestamp;
  duration: number; // seconds
  turns: ConversationTurnDocument[];
  summary?: string;
  keyTopics?: string[];
  moodAssessment?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConversationTurnDocument {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
}

// ============================================
// API Types
// ============================================

export interface StreamingTokens {
  deepgramApiKey: string;
  elevenLabsApiKey: string;
  expiresAt: number; // Unix timestamp
}

export interface ConversationResponseRequest {
  currentMessage: string;
  conversationHistory: ConversationTurn[];
  userContext: Partial<UserContext>;
}

export interface ConversationResponseResult {
  response: string;
  shouldEndConversation?: boolean;
}

export interface GenerateSummaryRequest {
  conversationHistory: ConversationTurn[];
  userContext: Partial<UserContext>;
}

export interface GenerateSummaryResult {
  summary: string;
  keyTopics: string[];
  moodAssessment?: number;
}

// ============================================
// Component Props Types
// ============================================

export interface VoiceConversationButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface ActiveConversationProps {
  state: VoiceConversationState;
  onEndConversation: () => void;
  onClose: () => void;
}

export interface ConversationWaveformProps {
  isActive: boolean;
  volume: number; // 0-1
  color: string;
  variant: 'ai' | 'user' | 'idle';
}

export interface SpeakingIndicatorProps {
  speaker: 'ai' | 'user' | 'none';
  status: 'speaking' | 'processing' | 'waiting';
}

export interface SessionTimerProps {
  timeRemaining: number; // seconds
  onTimeUp: () => void;
}

// ============================================
// Deepgram Service Types
// ============================================

export interface DeepgramConfig {
  apiKey: string;
  model: 'nova-2';
  language: 'en-US';
  punctuate: boolean;
  interimResults: boolean;
  endpointing: number; // ms of silence to finalize
}

export interface DeepgramCallbacks {
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError: (error: Error) => void;
  onVolumeChange?: (volume: number) => void;
}

// ============================================
// ElevenLabs Service Types
// ============================================

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

export interface TTSCallbacks {
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onError?: (error: Error) => void;
}

// ============================================
// Constants
// ============================================

export const CONVERSATION_CONSTANTS = {
  MAX_DURATION_SECONDS: 600, // 10 minutes
  WARNING_THRESHOLD_SECONDS: 60, // Show warning at 1 minute left
  CRITICAL_THRESHOLD_SECONDS: 30, // Critical warning at 30 seconds
  SILENCE_DETECTION_MS: 1500, // 1.5 seconds of silence = turn complete
  DEFAULT_VOICE_ID: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice (warm, empathetic)
} as const;
