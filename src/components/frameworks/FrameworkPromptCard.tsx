/**
 * FrameworkPromptCard Component
 *
 * Displays a single framework prompt during the guided journaling session.
 * Shows the prompt text, progress indicator, and recording status.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { FrameworkPrompt, RecoveryFramework } from '../../types/frameworks';

interface FrameworkPromptCardProps {
  framework: RecoveryFramework;
  prompt: FrameworkPrompt;
  currentIndex: number;
  totalPrompts: number;
  isRecording: boolean;
  hasResponse: boolean;
}

export const FrameworkPromptCard: React.FC<FrameworkPromptCardProps> = ({
  framework,
  prompt,
  currentIndex,
  totalPrompts,
  isRecording,
  hasResponse,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentIndex + 1) / totalPrompts) * 100}%`,
                backgroundColor: framework.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {totalPrompts}
        </Text>
      </View>

      {/* Framework Badge */}
      <View style={[styles.badge, { backgroundColor: framework.color + '20' }]}>
        <Feather
          name={framework.icon as keyof typeof Feather.glyphMap}
          size={14}
          color={framework.color}
        />
        <Text style={[styles.badgeText, { color: framework.color }]}>{framework.shortName}</Text>
      </View>

      {/* Prompt Text */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{prompt.voicePrompt}</Text>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        {isRecording ? (
          <View style={styles.statusRow}>
            <View style={[styles.recordingDot, { backgroundColor: '#FF4444' }]} />
            <Text style={styles.statusText}>Recording...</Text>
          </View>
        ) : hasResponse ? (
          <View style={styles.statusRow}>
            <Feather name="check-circle" size={16} color="#52C41A" />
            <Text style={[styles.statusText, { color: '#52C41A' }]}>Response recorded</Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            <Feather name="mic" size={16} color="#7F8C8D" />
            <Text style={styles.statusText}>Tap to start recording</Text>
          </View>
        )}
      </View>

      {/* Follow-up hint if available */}
      {prompt.followUp && !hasResponse && (
        <Text style={styles.followUpHint}>Tip: {prompt.followUp}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    margin: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  followUpHint: {
    color: '#95A5A6',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: 12,
  },
  progressBar: {
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  progressFill: {
    borderRadius: 2,
    height: '100%',
  },
  progressText: {
    color: '#7F8C8D',
    fontSize: 13,
    fontWeight: '500',
  },
  promptContainer: {
    marginBottom: 20,
  },
  promptText: {
    color: '#2C3E50',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  recordingDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusContainer: {
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statusText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
});

export default FrameworkPromptCard;
