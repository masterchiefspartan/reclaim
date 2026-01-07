import { useCallback, useRef, useState } from 'react';
import { Audio } from 'expo-av';

interface RecorderState {
  isRecording: boolean;
  hasPermission: boolean;
  durationMillis: number;
  fileUri?: string;
  error?: string;
}

const INITIAL_STATE: RecorderState = {
  isRecording: false,
  hasPermission: false,
  durationMillis: 0,
};

export const useVoiceRecorder = () => {
  const [state, setState] = useState<RecorderState>(INITIAL_STATE);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const requestPermission = useCallback(async () => {
    const permission = await Audio.requestPermissionsAsync();
    const granted = permission.status === 'granted';
    setState(prev => ({ ...prev, hasPermission: granted }));
    return granted;
  }, []);

  const startRecording = useCallback(async () => {
    const hasPermission = state.hasPermission || (await requestPermission());
    if (!hasPermission) {
      setState(prev => ({ ...prev, error: 'Microphone permission is required.' }));
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY as Audio.RecordingOptions
      );
      recording.setOnRecordingStatusUpdate(status => {
        if (!status.isRecording) return;
        setState(prev => ({
          ...prev,
          durationMillis: status.durationMillis ?? prev.durationMillis,
        }));
      });
      await recording.startAsync();
      recordingRef.current = recording;
      setState(prev => ({
        ...prev,
        isRecording: true,
        durationMillis: 0,
        error: undefined,
      }));
    } catch (error) {
      console.error('Failed to start recording', error);
      setState(prev => ({ ...prev, error: 'Unable to start recording. Try again.' }));
    }
  }, [requestPermission, state.hasPermission]);

  const stopRecording = useCallback(async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return undefined;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI() ?? undefined;
      recordingRef.current = null;
      setState(prev => ({
        ...prev,
        isRecording: false,
        fileUri: uri,
      }));
      return {
        uri,
        durationMillis: state.durationMillis,
      };
    } catch (error) {
      console.error('Failed to stop recording', error);
      setState(prev => ({ ...prev, error: 'Unable to stop recording.' }));
      return undefined;
    }
  }, [state.durationMillis]);

  const reset = useCallback(() => {
    recordingRef.current = null;
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    reset,
  };
};
