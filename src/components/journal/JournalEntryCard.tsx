import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import type { JournalEntry } from '@/types/journal';
import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress?: (entry: JournalEntry) => void;
}

export const JournalEntryCard = ({ entry, onPress }: JournalEntryCardProps) => {
  const { theme } = useAppTheme();
  const createdAt = entry.createdAt ? dayjs(entry.createdAt.toDate()) : dayjs();

  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.header}>
        <AppText variant="h3">{createdAt.format('MMM D, h:mm A')}</AppText>
        {entry.mood ? (
          <AppText style={styles.moodLabel}>{entry.mood.toUpperCase()}</AppText>
        ) : null}
      </View>
      <AppText numberOfLines={2} style={styles.preview}>
        {entry.transcript ?? 'Transcription in progress...'}
      </AppText>
      <View style={styles.meta}>
        <AppText style={styles.metaText}>{Math.round(entry.duration / 1000)} sec</AppText>
        <AppText style={styles.metaText}>
          {entry.aiResponseStatus === 'completed' ? 'AI ready' : 'AI thinking'}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  preview: {
    opacity: 0.9,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    opacity: 0.7,
    fontSize: 12,
  },
});


