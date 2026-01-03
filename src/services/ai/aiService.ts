import { httpsCallable } from 'firebase/functions';

import { getCloudFunctions } from '@services/firebase/client';

export const requestAiResponse = async (entryId: string) => {
  try {
    const callable = httpsCallable(getCloudFunctions(), 'processAIResponse');
    await callable({ entryId });
  } catch (error) {
    console.warn('AI response request failed', error);
  }
};

export const requestEntryTranscription = async (entryId: string) => {
  try {
    const callable = httpsCallable(getCloudFunctions(), 'transcribeAudioManual');
    await callable({ entryId });
  } catch (error) {
    console.warn('Transcription request failed', error);
  }
};


