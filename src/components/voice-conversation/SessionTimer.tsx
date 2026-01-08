/**
 * SessionTimer
 * Countdown timer showing remaining conversation time
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import { AppText } from '@components/common/AppText';
import { CONVERSATION_CONSTANTS } from '@/types/voiceConversation';
import type { SessionTimerProps } from '@/types/voiceConversation';

// Design tokens
const COLORS = {
  normal: '#FFFFFF',
  warning: '#F59E0B', // Amber - under 60 seconds
  critical: '#EF4444', // Red - under 30 seconds
};

export const SessionTimer: React.FC<SessionTimerProps> = ({ timeRemaining, onTimeUp }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const prevTimeRef = useRef(timeRemaining);

  // Determine color based on time remaining
  const getTimerColor = (): string => {
    if (timeRemaining <= CONVERSATION_CONSTANTS.CRITICAL_THRESHOLD_SECONDS) {
      return COLORS.critical;
    }
    if (timeRemaining <= CONVERSATION_CONSTANTS.WARNING_THRESHOLD_SECONDS) {
      return COLORS.warning;
    }
    return COLORS.normal;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger onTimeUp callback when timer reaches 0
  useEffect(() => {
    if (prevTimeRef.current > 0 && timeRemaining <= 0) {
      onTimeUp();
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, onTimeUp]);

  // Pulse animation for critical time
  useEffect(() => {
    if (timeRemaining <= CONVERSATION_CONSTANTS.CRITICAL_THRESHOLD_SECONDS && timeRemaining > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
      return undefined;
    }
  }, [timeRemaining, pulseAnim]);

  const timerColor = getTimerColor();
  const isCritical = timeRemaining <= CONVERSATION_CONSTANTS.CRITICAL_THRESHOLD_SECONDS;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timerContainer,
          {
            transform: [{ scale: isCritical ? pulseAnim : 1 }],
          },
        ]}
      >
        <AppText style={[styles.timerText, { color: timerColor }]}>
          {formatTime(timeRemaining)}
        </AppText>
        {timeRemaining <= CONVERSATION_CONSTANTS.WARNING_THRESHOLD_SECONDS && (
          <AppText style={[styles.labelText, { color: timerColor }]}>remaining</AppText>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.8,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
});

export default SessionTimer;
