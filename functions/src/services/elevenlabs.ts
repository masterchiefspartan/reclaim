import axios from 'axios';
import * as functions from 'firebase-functions/v1';

const ELEVENLABS_API_KEY = functions.config().elevenlabs.api_key;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice (warm, empathetic)

export async function generateSpeech(text: string): Promise<Buffer> {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('ElevenLabs TTS failed:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate speech'
    );
  }
}

