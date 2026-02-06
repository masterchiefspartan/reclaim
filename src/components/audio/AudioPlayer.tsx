/**
 * AudioPlayer - Audio playback component with progress bar
 * Shows play/pause, progress, and duration
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import { usePressAnimation } from '@hooks/usePressAnimation';
import { formatTime } from '@utils/formatters';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

interface AudioPlayerProps {
  /** URL or local URI of the audio file */
  audioUrl: string;
  /** Duration in seconds (optional - will be calculated if not provided) */
  duration?: number;
  /** Callback when play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Callback when playback completes */
  onComplete?: () => void;
}

export const AudioPlayer = ({
  audioUrl,
  duration: initialDuration,
  onPlayStateChange,
  onComplete,
}: AudioPlayerProps) => {
  const { theme } = useAppTheme();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(initialDuration || 0);

  const {
    animatedStyle: buttonAnimatedStyle,
    handlePressIn,
    handlePressOut,
  } = usePressAnimation({
    pressedScale: 0.9,
  });
  const progressWidth = useSharedValue(0);

  // Load audio on mount
  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      if (status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }
      setIsPlaying(status.isPlaying);

      // Update progress bar animation
      if (status.durationMillis) {
        const progress = status.positionMillis / status.durationMillis;
        progressWidth.value = withTiming(progress * 100, { duration: 100 });
      }

      if (status.didJustFinish) {
        onComplete?.();
        progressWidth.value = withTiming(0, { duration: 200 });
      }
    },
    [onComplete, progressWidth]
  );

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      onPlayStateChange?.(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleSeek = async (
    event: { nativeEvent: { locationX: number } },
    containerWidth: number
  ) => {
    if (!sound || !duration) return;

    const seekPosition = (event.nativeEvent.locationX / containerWidth) * duration;
    await sound.setPositionAsync(seekPosition * 1000);
  };

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Play/Pause Button */}
      <AnimatedPressable
        onPress={togglePlayPause}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[buttonAnimatedStyle, styles.playButton, { backgroundColor: theme.colors.primary }]}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      >
        <Feather
          name={isLoading ? 'loader' : isPlaying ? 'pause' : 'play'}
          size={20}
          color="#FFFFFF"
        />
      </AnimatedPressable>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Pressable
          style={styles.progressBarContainer}
          onPress={e => {
            const containerWidth = 200; // Approximate width, could measure dynamically
            handleSeek(e, containerWidth);
          }}
        >
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <AnimatedView
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary },
                progressAnimatedStyle,
              ]}
            />
          </View>
        </Pressable>

        {/* Duration */}
        <AppText style={[styles.duration, { color: theme.colors.textSecondary }]}>
          {formatTime(duration)}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  duration: {
    fontSize: 13,
    fontWeight: '500',
    minWidth: 45,
    textAlign: 'right',
  },
  playButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  progressFill: {
    borderRadius: 2,
    height: '100%',
    minWidth: 4,
  },
  progressSection: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  progressTrack: {
    borderRadius: 2,
    height: 4,
    overflow: 'hidden',
    width: '100%',
  },
});
