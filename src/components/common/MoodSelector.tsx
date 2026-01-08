import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import type { MoodLevel } from '@/types/journal';
import { useAppTheme } from '@hooks/useAppTheme';

const MOOD_EMOJIS: Record<MoodLevel, string> = {
  sad: '😢',
  neutral: '😐',
  hopeful: '🙂',
  grateful: '😊',
  energized: '✨',
  anxious: '😟',
};

interface MoodSelectorProps {
  value?: MoodLevel;
  onChange: (mood: MoodLevel) => void;
}

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => {
        const typedMood = mood as MoodLevel;
        const isActive = value === typedMood;
        return (
          <Pressable
            key={mood}
            onPress={() => onChange(typedMood)}
            style={[
              styles.mood,
              {
                borderColor: isActive ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <AppText style={styles.emoji}>{emoji}</AppText>
            <AppText style={styles.moodLabel}>{typedMood}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  mood: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    gap: 4,
    padding: 12,
    width: '30%',
  },
  moodLabel: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
