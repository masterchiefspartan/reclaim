/**
 * QuickJournalCard — Apple-style prompt card
 * Glass surface with emoji, prompt text, and subtle tags.
 */
import { View, StyleSheet } from 'react-native';

import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { useAppTheme } from '@hooks/useAppTheme';

interface QuickJournalCardProps {
  emoji: string;
  title: string;
  prompt: string;
  tags?: string[];
  onPress: () => void;
  width?: number | string;
}

export const QuickJournalCard = ({
  emoji,
  title,
  prompt,
  tags = [],
  onPress,
}: QuickJournalCardProps) => {
  const { theme } = useAppTheme();

  return (
    <GlassCard onPress={onPress} style={styles.content} blurEnabled={false}>
      <AppText style={styles.emoji}>{emoji}</AppText>
      <AppText variant="headline" color={theme.colors.text} numberOfLines={1}>
        {title}
      </AppText>
      <AppText variant="subheadline" color={theme.colors.textSecondary} numberOfLines={2}>
        {prompt}
      </AppText>
      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: theme.colors.fillQuaternary }]}
            >
              <AppText variant="caption2" color={theme.colors.textTertiary}>
                {tag}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 6,
    minWidth: 150,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
});
