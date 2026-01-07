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

export const RecordingVisualizer = memo(({ isRecording }: RecordingVisualizerProps) => {
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
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: 4,
    backgroundColor: '#ef4444',
    borderRadius: 999,
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },
  pulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
  },
});
