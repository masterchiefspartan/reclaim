import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import Animated from 'react-native-reanimated';

import type { JournalEntry } from '@/types/journal';
import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import { usePressAnimation, PRESS_ANIMATION_PRESETS } from '@hooks/usePressAnimation';
import { getMoodEmoji } from '@utils/mood';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress?: (entry: JournalEntry) => void;
}

export const JournalEntryCard = ({ entry, onPress }: JournalEntryCardProps) => {
  const { theme } = useAppTheme();
  const createdAt = entry.createdAt ? dayjs(entry.createdAt.toDate()) : dayjs();
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation(
    PRESS_ANIMATION_PRESETS.card
  );

  const emoji = getMoodEmoji(entry.mood);

  return (
    <AnimatedPressable
      onPress={() => onPress?.(entry)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <AppText style={styles.emoji}>{emoji}</AppText>
        <View style={styles.content}>
          <View style={styles.header}>
            <AppText variant="h4" style={[styles.title, { color: theme.colors.text }]}>
              {entry.frameworkData?.frameworkName || 'Voice Entry'}
            </AppText>
            <AppText style={[styles.time, { color: theme.colors.textSecondary }]}>
              {createdAt.format('h:mm A')}
            </AppText>
          </View>
          <AppText
            numberOfLines={2}
            style={[styles.preview, { color: theme.colors.textSecondary }]}
          >
            {entry.transcript ?? 'Transcription in progress...'}
          </AppText>
          <View style={styles.meta}>
            <AppText style={[styles.metaText, { color: theme.colors.textMuted }]}>
              {createdAt.format('MMM D, YYYY')}
            </AppText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    entry.aiResponseStatus === 'completed'
                      ? theme.colors.primarySubtle
                      : theme.colors.surface,
                },
              ]}
            >
              <AppText
                style={[
                  styles.statusText,
                  {
                    color:
                      entry.aiResponseStatus === 'completed'
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                  },
                ]}
              >
                {entry.aiResponseStatus === 'completed' ? 'AI ready' : 'Processing...'}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  emoji: {
    fontSize: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  time: {
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
