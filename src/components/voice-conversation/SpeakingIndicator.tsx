/**
 * SpeakingIndicator
 * Visual indicator showing who is currently speaking in the conversation
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import { AppText } from '@components/common/AppText';
import type { SpeakingIndicatorProps } from '@/types/voiceConversation';

// Design tokens
const COLORS = {
  ai: '#8B5CF6', // Purple
  user: '#10B981', // Green
  processing: '#6B7280', // Gray
  waiting: '#A78BFA', // Light purple
};

const INDICATOR_SIZE = 12;
const DOT_COUNT = 3;

export const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({ speaker, status }) => {
  const dotAnims = useRef(
    Array(DOT_COUNT)
      .fill(0)
      .map(() => new Animated.Value(1))
  ).current;

  // Get indicator color based on speaker/status
  const getIndicatorColor = (): string => {
    if (status === 'processing') return COLORS.processing;
    if (speaker === 'ai') return COLORS.ai;
    if (speaker === 'user') return COLORS.user;
    return COLORS.waiting;
  };

  // Get status text
  const getStatusText = (): string => {
    if (status === 'processing') return 'Thinking...';
    if (speaker === 'ai' && status === 'speaking') return 'Companion is speaking';
    if (speaker === 'user' && status === 'speaking') return 'Listening to you';
    return "Go ahead, I'm listening";
  };

  // Animated dots for speaking/processing states
  useEffect(() => {
    if (status === 'speaking' || status === 'processing') {
      const animations = dotAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 150),
            Animated.timing(anim, {
              toValue: 1.5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        )
      );

      animations.forEach(anim => anim.start());

      return () => {
        animations.forEach(anim => anim.stop());
      };
    } else {
      // Reset dots
      dotAnims.forEach(anim => anim.setValue(1));
      return undefined;
    }
  }, [status, dotAnims]);

  const indicatorColor = getIndicatorColor();
  const statusText = getStatusText();

  return (
    <View style={styles.container}>
      {/* Speaker label */}
      <AppText style={styles.speakerLabel}>
        {speaker === 'ai' ? 'Recovery Companion' : speaker === 'user' ? 'You' : ''}
      </AppText>

      {/* Animated dots indicator */}
      <View style={styles.dotsContainer}>
        {dotAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: indicatorColor,
                transform: [{ scale: anim }],
                opacity: anim.interpolate({
                  inputRange: [1, 1.5],
                  outputRange: [0.5, 1],
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Status text */}
      <AppText style={[styles.statusText, { color: indicatorColor }]}>{statusText}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    borderRadius: INDICATOR_SIZE / 2,
    height: INDICATOR_SIZE,
    marginHorizontal: 4,
    width: INDICATOR_SIZE,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    marginBottom: 8,
  },
  speakerLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SpeakingIndicator;
