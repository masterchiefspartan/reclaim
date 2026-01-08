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
  createdAt: Date | { toDate: () => Date }; // Firestore Timestamp or Date
  updatedAt: Date | { toDate: () => Date };

  // Context
  checkInType: 'free' | 'guided';
  mood?: string;
  tags?: string[];
}
