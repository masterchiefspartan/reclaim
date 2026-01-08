/**
 * ElevenLabs Text-to-Speech Service
 * Converts AI text responses to speech and plays them
 */

import { Audio, type AVPlaybackStatus } from 'expo-av';
import { logger } from '@/utils/logger';
import { CONVERSATION_CONSTANTS } from '@/types/voiceConversation';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

interface TTSConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

interface TTSCallbacks {
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onError?: (error: Error) => void;
}

class ElevenLabsTTSService {
  private config: TTSConfig | null = null;
  private sound: Audio.Sound | null = null;
  private isSpeaking = false;
  private callbacks: TTSCallbacks = {};
  private audioQueue: string[] = [];
  private isProcessingQueue = false;

  /**
   * Configure the TTS service with API key and settings
   */
  configure(config: TTSConfig): void {
    this.config = {
      voiceId: CONVERSATION_CONSTANTS.DEFAULT_VOICE_ID,
      modelId: 'eleven_turbo_v2_5', // Fast, low latency model
      stability: 0.5,
      similarityBoost: 0.75,
      ...config,
    };
    logger.info('ElevenLabsTTS: Configured');
  }

  /**
   * Set callbacks for TTS events
   */
  setCallbacks(callbacks: TTSCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Speak the given text
   */
  async speak(text: string): Promise<void> {
    if (!this.config?.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!text.trim()) {
      logger.warn('ElevenLabsTTS: Empty text, skipping');
      return;
    }

    try {
      // Stop any currently playing audio
      await this.stopSpeaking();

      this.isSpeaking = true;
      this.callbacks.onSpeakingStart?.();

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Generate speech from ElevenLabs
      const audioUri = await this.generateSpeech(text);

      // Play the audio
      await this.playAudio(audioUri);
    } catch (error) {
      this.isSpeaking = false;
      logger.error('ElevenLabsTTS: Failed to speak', { error });
      this.callbacks.onError?.(error instanceof Error ? error : new Error('TTS failed'));
      this.callbacks.onSpeakingEnd?.();
    }
  }

  /**
   * Queue text to speak (useful for streaming responses)
   */
  async queueSpeak(text: string): Promise<void> {
    this.audioQueue.push(text);

    if (!this.isProcessingQueue) {
      await this.processQueue();
    }
  }

  /**
   * Process the audio queue
   */
  private async processQueue(): Promise<void> {
    this.isProcessingQueue = true;

    while (this.audioQueue.length > 0) {
      const text = this.audioQueue.shift();
      if (text) {
        await this.speak(text);
        // Wait for playback to complete
        await this.waitForPlaybackComplete();
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Wait for current playback to complete
   */
  private waitForPlaybackComplete(): Promise<void> {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!this.isSpeaking) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 60000);
    });
  }

  /**
   * Stop any currently playing audio
   */
  async stopSpeaking(): Promise<void> {
    this.audioQueue = [];

    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (error) {
        logger.warn('ElevenLabsTTS: Error stopping audio', { error });
      }
      this.sound = null;
    }

    if (this.isSpeaking) {
      this.isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Generate speech audio from ElevenLabs API
   */
  private async generateSpeech(text: string): Promise<string> {
    if (!this.config) {
      throw new Error('TTS not configured');
    }

    const url = `${ELEVENLABS_API_URL}/${this.config.voiceId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: this.config.modelId,
        voice_settings: {
          stability: this.config.stability,
          similarity_boost: this.config.similarityBoost,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('ElevenLabsTTS: API error', { status: response.status, error: errorText });
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Convert response to blob and create a local URI
    const blob = await response.blob();
    const audioUri = await this.blobToDataUri(blob);

    return audioUri;
  }

  /**
   * Convert blob to data URI for expo-av playback
   */
  private blobToDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to data URI'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Play audio from URI
   */
  private async playAudio(uri: string): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        this.handlePlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      logger.info('ElevenLabsTTS: Playing audio');
    } catch (error) {
      logger.error('ElevenLabsTTS: Failed to play audio', { error });
      throw error;
    }
  }

  /**
   * Handle playback status updates
   */
  private handlePlaybackStatusUpdate(status: AVPlaybackStatus): void {
    if (!status.isLoaded) {
      // Audio is not loaded
      return;
    }

    if (status.didJustFinish) {
      // Playback finished
      this.isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
      logger.info('ElevenLabsTTS: Playback finished');

      // Clean up
      this.sound?.unloadAsync().catch(error => {
        logger.warn('ElevenLabsTTS: Error unloading sound', { error });
      });
      this.sound = null;
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    await this.stopSpeaking();
    this.config = null;
    this.callbacks = {};
    logger.info('ElevenLabsTTS: Cleaned up');
  }
}

// Export singleton instance
export const elevenLabsTTS = new ElevenLabsTTSService();
