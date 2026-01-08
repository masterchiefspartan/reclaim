import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface RecordingVisualizerProps {
  isRecording: boolean;
}

const AnimatedPulse = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scale]);

  return <Animated.View style={[styles.pulse, { transform: [{ scale }] }]} />;
};

const RecordingVisualizerComponent = ({ isRecording }: RecordingVisualizerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        {Array.from({ length: 24 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: Math.random() * 60 + 10,
                opacity: isRecording ? 0.9 : 0.4,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.centerButton}>
        {isRecording ? <AnimatedPulse /> : <View style={styles.idleDot} />}
      </View>
    </View>
  );
};

RecordingVisualizerComponent.displayName = 'RecordingVisualizer';
export const RecordingVisualizer = memo(RecordingVisualizerComponent);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#ef4444',
    borderRadius: 999,
    width: 4,
  },
  centerButton: {
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  container: {
    alignItems: 'center',
    gap: 16,
  },
  idleDot: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  pulse: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  waveform: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
