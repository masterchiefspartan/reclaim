export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface AIResponsePayload {
  entryId: string;
  transcript: string;
  conversationHistory?: ConversationMessage[];
}

export interface TTSOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}
