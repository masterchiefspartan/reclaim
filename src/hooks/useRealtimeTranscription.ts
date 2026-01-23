import { useCallback, useRef, useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';

import { cloudFunctions } from '@services/firebase/client';
import { logger } from '@utils/logger';

interface StreamingTokens {
  deepgramApiKey: string;
  elevenLabsApiKey: string;
  expiresAt: number;
}

interface UseRealtimeTranscriptionOptions {
  /** Called when listening starts */
  onStart?: () => void;
  /** Called when listening stops */
  onStop?: () => void;
  /** Silence threshold in ms before considering speech ended */
  silenceThreshold?: number;
}

interface UseRealtimeTranscriptionReturn {
  /** Current transcript text (interim + final) */
  transcript: string;
  /** Final confirmed transcript */
  finalTranscript: string;
  /** Whether actively listening */
  isListening: boolean;
  /** Whether connected to transcription service */
  isConnected: boolean;
  /** Error message if any */
  error: string | null;
  /** Start listening for speech */
  startListening: () => Promise<void>;
  /** Stop listening */
  stopListening: () => void;
  /** Clear the transcript */
  clearTranscript: () => void;
}

// Deepgram WebSocket URL
const DEEPGRAM_WS_URL = 'wss://api.deepgram.com/v1/listen';

/**
 * Hook for real-time speech-to-text transcription
 * Uses Deepgram's WebSocket API for streaming transcription
 */
export const useRealtimeTranscription = (
  options: UseRealtimeTranscriptionOptions = {}
): UseRealtimeTranscriptionReturn => {
  const { onStart, onStop, silenceThreshold = 1500 } = options;

  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);
  const tokensRef = useRef<StreamingTokens | null>(null);
  const accumulatedTranscriptRef = useRef('');

  /**
   * Fetch streaming tokens from backend
   */
  const fetchTokens = useCallback(async (): Promise<StreamingTokens | null> => {
    // Check if we have valid cached tokens
    if (tokensRef.current && tokensRef.current.expiresAt > Date.now()) {
      return tokensRef.current;
    }

    if (!cloudFunctions) {
      setError('Services not available');
      return null;
    }

    try {
      const getStreamingTokensFn = httpsCallable<void, StreamingTokens>(
        cloudFunctions,
        'getStreamingTokens'
      );
      const result = await getStreamingTokensFn();
      tokensRef.current = result.data;
      return result.data;
    } catch (err) {
      logger.error('Failed to fetch streaming tokens', { error: err });
      setError('Failed to connect to transcription service');
      return null;
    }
  }, []);

  /**
   * Connect to Deepgram WebSocket
   */
  const connectWebSocket = useCallback(
    async (apiKey: string): Promise<boolean> => {
      return new Promise(resolve => {
        const params = new URLSearchParams({
          model: 'nova-2',
          language: 'en-US',
          punctuate: 'true',
          interim_results: 'true',
          endpointing: silenceThreshold.toString(),
          smart_format: 'true',
          utterance_end_ms: '1000',
        });

        const wsUrl = `${DEEPGRAM_WS_URL}?${params.toString()}`;
        const ws = new WebSocket(wsUrl, ['token', apiKey]);

        ws.onopen = () => {
          logger.info('Transcription WebSocket connected');
          setIsConnected(true);
          setError(null);
          resolve(true);
        };

        ws.onmessage = event => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
              const text = data.channel.alternatives[0].transcript;
              const isFinal = data.is_final;

              if (text) {
                if (isFinal) {
                  // Append to accumulated transcript
                  const newAccumulated =
                    accumulatedTranscriptRef.current +
                    (accumulatedTranscriptRef.current ? ' ' : '') +
                    text;
                  accumulatedTranscriptRef.current = newAccumulated;
                  setFinalTranscript(newAccumulated);
                  setTranscript(newAccumulated);
                } else {
                  // Show interim with accumulated
                  const interimTranscript = accumulatedTranscriptRef.current
                    ? `${accumulatedTranscriptRef.current} ${text}`
                    : text;
                  setTranscript(interimTranscript);
                }
              }
            }
          } catch (parseError) {
            logger.error('Failed to parse transcription message', { error: parseError });
          }
        };

        ws.onerror = () => {
          logger.error('Transcription WebSocket error');
          setError('Connection to transcription service failed');
          setIsConnected(false);
          resolve(false);
        };

        ws.onclose = () => {
          logger.info('Transcription WebSocket closed');
          setIsConnected(false);
        };

        websocketRef.current = ws;

        // Timeout
        setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
            resolve(false);
          }
        }, 10000);
      });
    },
    [silenceThreshold]
  );

  /**
   * Start listening for speech
   */
  const startListening = useCallback(async () => {
    if (isListening) return;

    setError(null);
    setIsListening(true);

    try {
      // Get API tokens
      const tokens = await fetchTokens();
      if (!tokens) {
        setIsListening(false);
        return;
      }

      // Connect to WebSocket
      const connected = await connectWebSocket(tokens.deepgramApiKey);
      if (!connected) {
        setIsListening(false);
        return;
      }

      onStart?.();
      logger.info('Real-time transcription started');
    } catch (err) {
      logger.error('Failed to start transcription', { error: err });
      setError('Failed to start transcription');
      setIsListening(false);
    }
  }, [isListening, fetchTokens, connectWebSocket, onStart]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setIsListening(false);
    setIsConnected(false);
    onStop?.();
    logger.info('Real-time transcription stopped');
  }, [onStop]);

  /**
   * Clear the transcript
   */
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
    accumulatedTranscriptRef.current = '';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return {
    transcript,
    finalTranscript,
    isListening,
    isConnected,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
};
