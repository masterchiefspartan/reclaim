/**
 * VoiceConversationButton
 * Entry point button for starting a voice conversation with AI companion
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import type { VoiceConversationButtonProps } from '@/types/voiceConversation';

// Design tokens
const BUTTON_SIZE = 80;
const PULSE_SCALE = 1.15;
const PULSE_DURATION = 2000;

export const VoiceConversationButton: React.FC<VoiceConversationButtonProps> = ({
  onPress,
  isLoading,
  disabled = false,
}) => {
  const { theme } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  // Pulse animation for idle state
  useEffect(() => {
    if (isLoading || disabled) {
      // Stop animation
      pulseAnim.setValue(1);
      opacityAnim.setValue(0);
      return;
    }

    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: PULSE_SCALE,
            duration: PULSE_DURATION / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: PULSE_DURATION / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: PULSE_DURATION / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: PULSE_DURATION / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [isLoading, disabled, pulseAnim, opacityAnim]);

  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? theme.colors.muted : '#8B5CF6',
    opacity: disabled ? 0.5 : 1,
  };

  const handlePress = () => {
    if (!disabled && !isLoading) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Pulse effect background */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: '#8B5CF6',
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      {/* Main button */}
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Ionicons name="mic" size={36} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      {/* Label */}
      <AppText style={[styles.label, { color: theme.colors.text }]}>
        {isLoading ? 'Connecting...' : 'Talk with your Recovery Companion'}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
    elevation: 8,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: BUTTON_SIZE,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  pulseRing: {
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    position: 'absolute',
    width: BUTTON_SIZE,
  },
});

export default VoiceConversationButton;
