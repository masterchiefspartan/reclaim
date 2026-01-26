/**
 * Recovery Frameworks Type Definitions
 *
 * Structured journaling templates for guided recovery reflection.
 * Inspired by Mindsera's mental models but tailored for physical recovery.
 */

import { MoodLevel } from './journal';

// Use simplified phase names for framework triggers (mapped from journal.ts RecoveryPhase)
export type FrameworkRecoveryPhase = 'early' | 'active' | 'late' | 'maintenance';

// Extended mood levels for framework triggers (superset of MoodLevel)
export type FrameworkMoodTrigger = MoodLevel | 'frustrated' | 'worried';

// ============================================================================
// Core Framework Types
// ============================================================================

export type FrameworkId =
  | 'daily-check-in'
  | 'pain-processing'
  | 'pt-reflection'
  | 'fear-inventory'
  | 'support-audit'
  | 'progress-gratitude'
  | 'identity-meaning'
  | 'free-journal';

export type FrameworkSchedule = 'daily' | 'weekly' | 'post-pt' | 'on-demand';

export type DataPointType = 'number' | 'text' | 'emotion' | 'boolean' | 'scale';

export interface FrameworkPrompt {
  id: string;
  order: number;
  text: string;
  voicePrompt: string; // More conversational version for voice
  followUp?: string; // If response is too short
  dataPoint?: string; // Which data point this captures
  required: boolean;
}

export interface DataPointDefinition {
  key: string;
  type: DataPointType;
  label: string;
  extractionHint: string; // Helps AI extract the data
  range?: { min: number; max: number }; // For number/scale types
}

export interface FrameworkTriggers {
  phases?: FrameworkRecoveryPhase[];
  emotions?: FrameworkMoodTrigger[];
  keywords?: string[]; // Detected in recent entries
  schedule?: FrameworkSchedule;
  painThreshold?: number; // Suggest if pain > this
  daysSinceLastUse?: number; // Minimum days between suggestions
}

export interface AIGuidance {
  tone: string;
  focusAreas: string[];
  avoidTopics: string[];
  historyReferences: boolean;
  responseLength: 'short' | 'medium' | 'long';
  systemPromptAddition: string;
}

export interface RecoveryFramework {
  id: FrameworkId;
  name: string;
  slug: string;
  shortName: string; // For UI chips/buttons
  description: string;
  purpose: string;
  duration: {
    min: number; // minutes
    max: number;
  };
  icon: string;
  color: string;
  triggers: FrameworkTriggers;
  prompts: FrameworkPrompt[];
  aiGuidance: AIGuidance;
  dataPoints: DataPointDefinition[];
  isDefault?: boolean;
}

// ============================================================================
// Framework Entry Data
// ============================================================================

export interface PromptResponse {
  promptId: string;
  promptText: string;
  response: string;
  audioUrl?: string;
  timestamp: Date;
  duration?: number; // seconds of audio
}

export interface ExtractedDataPoint {
  key: string;
  value: string | number | boolean;
  confidence: number; // 0-1, how confident AI is in extraction
}

export interface FrameworkEntryData {
  frameworkId: FrameworkId;
  frameworkName: string;
  promptResponses: PromptResponse[];
  extractedData: ExtractedDataPoint[];
  totalDuration: number; // Total recording time
  completedAt: Date;
}

// ============================================================================
// AI Perspectives (Multiple Minds)
// ============================================================================

export type PerspectiveId =
  | 'compassionate-companion' // Default
  | 'pt-coach'
  | 'therapist'
  | 'fellow-recoverer'
  | 'medical-explainer'
  | 'future-self'
  | 'stoic-mentor';

export interface AIPerspective {
  id: PerspectiveId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  personality: string;
  systemPrompt: string;
  exampleResponse: string;
  bestFor: string[];
  isPremium: boolean;
}

// ============================================================================
// Framework Analytics
// ============================================================================

export interface FrameworkUsageStats {
  frameworkId: FrameworkId;
  totalUses: number;
  lastUsed?: Date;
  averageDuration: number;
  completionRate: number; // % of started sessions completed
}

export interface PatternInsight {
  type: 'pain' | 'mood' | 'fear' | 'progress' | 'support';
  title: string;
  description: string;
  evidence: string[];
  suggestion?: string;
  confidence: number;
  detectedAt: Date;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface FrameworkSessionState {
  framework: RecoveryFramework;
  currentPromptIndex: number;
  responses: PromptResponse[];
  isRecording: boolean;
  isPaused: boolean;
  startedAt: Date;
  selectedPerspective?: PerspectiveId;
}

export interface FrameworkSuggestion {
  framework: RecoveryFramework;
  reason: string;
  priority: number; // Higher = more relevant
  isPersonalized: boolean;
}

// ============================================================================
// Helper Types
// ============================================================================

export type FrameworkCategory =
  | 'daily' // Daily routines
  | 'processing' // Processing difficult moments
  | 'growth' // Progress and meaning
  | 'connection'; // Support and relationships

export interface FrameworkCategoryGroup {
  category: FrameworkCategory;
  title: string;
  description: string;
  frameworks: RecoveryFramework[];
}
