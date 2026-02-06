/**
 * EntryListItem — Apple-style list row
 * Clean row with emoji, content, and chevron disclosure indicator.
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import { getMoodEmoji } from '@utils/mood';
import { formatDate } from '@utils/formatters';
import type { MoodLevel } from '@/types/journal';

interface EntryListItemProps {
  id: string;
  title: string;
  date: Date;
  mood?: MoodLevel;
  preview?: string;
  onPress: () => void;
}

export const EntryListItem = ({ title, date, mood, preview, onPress }: EntryListItemProps) => {
  const { theme } = useAppTheme();
  const emoji = getMoodEmoji(mood);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${formatDate(date)}`}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surface,
        },
        pressed && { backgroundColor: theme.colors.fillQuaternary },
      ]}
    >
      {/* Emoji indicator */}
      <View style={[styles.emojiWrap, { backgroundColor: theme.colors.fillQuaternary }]}>
        <AppText style={styles.emoji}>{emoji}</AppText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppText variant="headline" color={theme.colors.text} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="footnote" color={theme.colors.textTertiary}>
          {formatDate(date)}
        </AppText>
        {preview && (
          <AppText
            variant="subheadline"
            color={theme.colors.textSecondary}
            numberOfLines={1}
            style={styles.preview}
          >
            {preview}
          </AppText>
        )}
      </View>

      {/* Disclosure indicator */}
      <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  emoji: {
    fontSize: 22,
  },
  emojiWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  preview: {
    marginTop: 2,
  },
});
