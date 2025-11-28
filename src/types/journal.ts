import type { Timestamp } from 'firebase/firestore';

export type MoodLevel = 'sad' | 'neutral' | 'hopeful' | 'grateful' | 'energized' | 'anxious';

export interface EntryInsights {
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions?: string[];
}

export type EntryStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ProcessingStage = 'uploading' | 'transcribing' | 'analyzing' | 'synthesizing' | 'completed' | 'failed';

export interface JournalEntry {
  id: string;
  userId: string;
  audioUrl: string;
  duration: number;
  processingStage?: ProcessingStage;
  transcript?: string;
  transcriptionStatus: EntryStatus;
  aiResponse?: string;
  aiResponseAudioUrl?: string;
  aiResponseStatus: EntryStatus;
  mood?: MoodLevel;
  moodScore?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  transcriptionCompletedAt?: Timestamp;
  aiResponseCompletedAt?: Timestamp;
  tags?: string[];
  insights?: EntryInsights;
  painLevel?: number;
  mobilityProgress?: number;
  checkInType?: 'free' | 'guided';
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };
}

export interface CreateEntryPayload {
  localAudioUri: string;
  duration: number;
  checkInType: 'free' | 'guided';
  structuredAnswers?: {
    physicalProgress?: string;
    painLevel?: number;
    emotionalState?: string;
    smallWins?: string;
  };
}

export interface MoodTrendPoint {
  date: string;
  moodScore: number;
}


