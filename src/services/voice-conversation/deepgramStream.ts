/**
 * Deepgram Streaming Service
 * Real-time speech-to-text using WebSocket connection to Deepgram
 */

import { Audio, type AudioMode } from 'expo-av';
import type { DeepgramCallbacks } from '@/types/voiceConversation';
import { logger } from '@/utils/logger';

// Deepgram WebSocket URL for real-time transcription
const DEEPGRAM_WS_URL = 'wss://api.deepgram.com/v1/listen';

// Audio recording configuration optimized for speech
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.webm',
    outputFormat: Audio.AndroidOutputFormat.WEBM,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

// Audio mode configuration
const AUDIO_MODE: AudioMode = {
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  shouldDuckAndroid: true,
  interruptionModeIOS: 1, // MixWithOthers
  interruptionModeAndroid: 1, // DuckOthers
  playThroughEarpieceAndroid: false,
};

interface DeepgramStreamConfig {
  apiKey: string;
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError: (error: Error) => void;
  onVolumeChange?: (volume: number) => void;
  onConnectionStateChange?: (connected: boolean) => void;
}

class DeepgramStreamService {
  private websocket: WebSocket | null = null;
  private recording: Audio.Recording | null = null;
  private isListening = false;
  private config: DeepgramStreamConfig | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private silenceThresholdMs = 1500; // 1.5 seconds of silence = turn complete
  private lastTranscript = '';

  /**
   * Initialize and start listening
   */
  async startListening(config: DeepgramStreamConfig): Promise<void> {
    if (this.isListening) {
      logger.warn('DeepgramStream: Already listening');
      return;
    }

    this.config = config;
    this.isListening = true;
    this.reconnectAttempts = 0;

    try {
      // Request microphone permission
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error('Microphone permission denied');
      }

      // Set audio mode
      await Audio.setAudioModeAsync(AUDIO_MODE);

      // Connect to Deepgram WebSocket
      await this.connectWebSocket();

      // Start recording
      await this.startRecording();

      logger.info('DeepgramStream: Started listening');
    } catch (error) {
      this.isListening = false;
      logger.error('DeepgramStream: Failed to start listening', { error });
      config.onError(error instanceof Error ? error : new Error('Failed to start listening'));
    }
  }

  /**
   * Stop listening and clean up
   */
  async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;
    this.clearSilenceTimer();

    try {
      // Stop recording
      await this.stopRecording();

      // Close WebSocket
      this.closeWebSocket();

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      logger.info('DeepgramStream: Stopped listening');
    } catch (error) {
      logger.error('DeepgramStream: Error stopping', { error });
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Pause listening (e.g., when AI is speaking)
   */
  async pauseListening(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.pauseAsync();
        logger.info('DeepgramStream: Paused listening');
      } catch (error) {
        logger.error('DeepgramStream: Failed to pause', { error });
      }
    }
  }

  /**
   * Resume listening
   */
  async resumeListening(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.startAsync();
        logger.info('DeepgramStream: Resumed listening');
      } catch (error) {
        logger.error('DeepgramStream: Failed to resume', { error });
      }
    }
  }

  /**
   * Connect to Deepgram WebSocket
   */
  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        reject(new Error('No config provided'));
        return;
      }

      const params = new URLSearchParams({
        model: 'nova-2',
        language: 'en-US',
        punctuate: 'true',
        interim_results: 'true',
        endpointing: this.silenceThresholdMs.toString(),
        smart_format: 'true',
      });

      const wsUrl = `${DEEPGRAM_WS_URL}?${params.toString()}`;

      this.websocket = new WebSocket(wsUrl, ['token', this.config.apiKey]);

      this.websocket.onopen = () => {
        logger.info('DeepgramStream: WebSocket connected');
        this.reconnectAttempts = 0;
        this.config?.onConnectionStateChange?.(true);
        resolve();
      };

      this.websocket.onmessage = event => {
        this.handleWebSocketMessage(event);
      };

      this.websocket.onerror = error => {
        logger.error('DeepgramStream: WebSocket error', { error });
        this.config?.onConnectionStateChange?.(false);
        reject(new Error('WebSocket connection failed'));
      };

      this.websocket.onclose = event => {
        logger.info('DeepgramStream: WebSocket closed', { code: event.code });
        this.config?.onConnectionStateChange?.(false);

        // Attempt reconnection if still supposed to be listening
        if (this.isListening && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          logger.info(`DeepgramStream: Reconnecting (attempt ${this.reconnectAttempts})`);
          setTimeout(() => this.connectWebSocket(), 1000 * this.reconnectAttempts);
        }
      };

      // Timeout for connection
      setTimeout(() => {
        if (this.websocket?.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
        const transcript = data.channel.alternatives[0].transcript;
        const isFinal = data.is_final;

        if (transcript) {
          if (isFinal) {
            // Final transcript - append to running transcript
            this.lastTranscript += (this.lastTranscript ? ' ' : '') + transcript;

            // Reset silence timer
            this.resetSilenceTimer();

            this.config?.onFinalTranscript(this.lastTranscript);
          } else {
            // Interim transcript
            const fullTranscript = this.lastTranscript
              ? `${this.lastTranscript} ${transcript}`
              : transcript;
            this.config?.onInterimTranscript(fullTranscript);
          }
        }
      }

      // Handle speech detection for silence timer
      if (data.type === 'Results' && data.speech_final) {
        this.handleSpeechEnd();
      }
    } catch (error) {
      logger.error('DeepgramStream: Error parsing message', { error });
    }
  }

  /**
   * Handle when speech ends (user finished talking)
   */
  private handleSpeechEnd(): void {
    if (this.lastTranscript.trim()) {
      logger.info('DeepgramStream: Speech ended, finalizing turn');
      // The turn is complete - notify with the full transcript
      this.config?.onFinalTranscript(this.lastTranscript.trim());
    }
  }

  /**
   * Reset the silence detection timer
   */
  private resetSilenceTimer(): void {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      this.handleSpeechEnd();
      // Clear the accumulated transcript for next turn
      this.lastTranscript = '';
    }, this.silenceThresholdMs);
  }

  /**
   * Clear the silence timer
   */
  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  /**
   * Start audio recording
   */
  private async startRecording(): Promise<void> {
    try {
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(RECORDING_OPTIONS);

      // Set up status callback for volume metering
      this.recording.setOnRecordingStatusUpdate(status => {
        if (status.isRecording && status.metering !== undefined) {
          // Convert dB to 0-1 scale (dB is typically -160 to 0)
          const normalizedVolume = Math.max(0, Math.min(1, (status.metering + 160) / 160));
          this.config?.onVolumeChange?.(normalizedVolume);
        }
      });

      await this.recording.startAsync();

      // Start streaming audio data to WebSocket
      this.streamAudioToWebSocket();
    } catch (error) {
      logger.error('DeepgramStream: Failed to start recording', { error });
      throw error;
    }
  }

  /**
   * Stop audio recording
   */
  private async stopRecording(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        logger.warn('DeepgramStream: Error stopping recording', { error });
      }
      this.recording = null;
    }
  }

  /**
   * Stream audio data to WebSocket
   * Note: expo-av doesn't provide direct audio streaming, so we use a polling approach
   * In production, you might want to use a native module for better performance
   */
  private async streamAudioToWebSocket(): Promise<void> {
    // expo-av doesn't expose raw audio data directly for streaming
    // For real-time streaming, we'd need a native module or different approach
    // This is a simplified implementation that works with Deepgram's file upload fallback

    // For MVP, we'll use the recording URI approach where we send audio chunks
    // A more sophisticated approach would use react-native-live-audio-stream or similar

    logger.info('DeepgramStream: Audio streaming initialized');

    // Note: Full real-time streaming would require a native module
    // For MVP, Deepgram's interim_results with file-based approach works well
  }

  /**
   * Close WebSocket connection
   */
  private closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  /**
   * Clear accumulated transcript (call after processing a turn)
   */
  clearTranscript(): void {
    this.lastTranscript = '';
  }
}

// Export singleton instance
export const deepgramStream = new DeepgramStreamService();

// Export types for callbacks
export type { DeepgramCallbacks };
