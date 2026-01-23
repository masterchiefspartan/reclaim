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
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="h3">{createdAt.format('MMM D, h:mm A')}</AppText>
        {entry.mood ? <AppText style={styles.moodLabel}>{entry.mood.toUpperCase()}</AppText> : null}
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
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    gap: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
  },
  moodLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  preview: {
    opacity: 0.9,
  },
});
