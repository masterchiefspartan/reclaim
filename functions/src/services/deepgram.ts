import { createClient } from '@deepgram/sdk';
import * as functions from 'firebase-functions/v1';

const deepgram = createClient(functions.config().deepgram.api_key);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      punctuate: true,
      utterances: true,
      language: 'en-US',
      model: 'nova-2',
      smart_format: true,
    });

    if (error) {
      throw error;
    }

    const transcript = result?.results?.channels[0]?.alternatives[0]?.transcript;

    if (!transcript) {
      throw new Error('No transcript returned from Deepgram');
    }

    return transcript;
  } catch (error) {
    console.error('Deepgram transcription failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to transcribe audio');
  }
}
