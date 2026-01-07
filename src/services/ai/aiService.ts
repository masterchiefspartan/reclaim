import { httpsCallable } from 'firebase/functions';

import { getCloudFunctions } from '@services/firebase/client';
import { silentAsync, withErrorHandling } from '@utils/errors';

/**
 * Requests AI response for a journal entry
 * Non-critical operation - logs errors but doesn't throw
 * The backend trigger should handle this automatically, this is a manual fallback
 */
export const requestAiResponse = async (entryId: string): Promise<void> => {
  await silentAsync(
    'requestAiResponse',
    async () => {
      const callable = httpsCallable(getCloudFunctions(), 'processAIResponse');
      await callable({ entryId });
    },
    { entryId }
  );
};

/**
 * Requests transcription for a journal entry
 * Non-critical operation - logs errors but doesn't throw
 * The backend trigger should handle this automatically, this is a manual fallback
 */
export const requestEntryTranscription = async (entryId: string): Promise<void> => {
  await silentAsync(
    'requestEntryTranscription',
    async () => {
      const callable = httpsCallable(getCloudFunctions(), 'transcribeAudioManual');
      await callable({ entryId });
    },
    { entryId }
  );
};

/**
 * Requests AI response with error handling for critical flows
 * @throws AppError if the request fails
 */
export const requestAiResponseRequired = async (entryId: string): Promise<void> => {
  return withErrorHandling(
    'requestAiResponseRequired',
    async () => {
      const callable = httpsCallable(getCloudFunctions(), 'processAIResponse');
      await callable({ entryId });
    },
    { entryId }
  );
};
