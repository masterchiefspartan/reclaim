/**
 * AffirmationCard — Glass card with subtle gradient
 * Apple-style card displaying a daily affirmation.
 */
import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface AffirmationCardProps {
  title: string;
  message: string;
  author?: string;
  onPress?: () => void;
}

export const AffirmationCard = ({ title, message, author, onPress }: AffirmationCardProps) => {
  const { theme } = useAppTheme();

  const content = (
    <LinearGradient
      colors={
        theme.isDark
          ? ['rgba(10, 132, 255, 0.15)', 'rgba(88, 86, 214, 0.12)']
          : ['rgba(0, 122, 255, 0.08)', 'rgba(88, 86, 214, 0.06)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.inner}>
        <View style={styles.titleRow}>
          <View style={[styles.iconDot, { backgroundColor: theme.colors.primarySubtle }]}>
            <Feather name="sun" size={14} color={theme.colors.primary} />
          </View>
          <AppText variant="footnote" color={theme.colors.primary} style={styles.titleText}>
            {title.toUpperCase()}
          </AppText>
        </View>

        <AppText variant="title3" color={theme.colors.text} style={styles.message}>
          {message}
        </AppText>

        {author && (
          <AppText variant="caption1" color={theme.colors.textTertiary} style={styles.author}>
            — {author}
          </AppText>
        )}
      </View>
    </LinearGradient>
  );

  const card = (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 122, 255, 0.1)',
        },
        theme.shadows.glass,
      ]}
    >
      {content}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${message}`}
        style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        {card}
      </Pressable>
    );
  }

  return card;
};

const styles = StyleSheet.create({
  author: {
    fontStyle: 'italic',
    marginTop: 12,
  },
  container: {
    borderRadius: 20,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
  },
  iconDot: {
    alignItems: 'center',
    borderRadius: 10,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  inner: {
    padding: 20,
  },
  message: {
    marginTop: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  titleText: {
    fontWeight: '600',
    letterSpacing: 1,
  },
});
