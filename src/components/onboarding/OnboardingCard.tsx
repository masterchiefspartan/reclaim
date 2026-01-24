/**
 * OnboardingCard - Selectable card for onboarding options
 * Uses simple TouchableOpacity for maximum Expo Go compatibility
 */

import { TouchableOpacity, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface OnboardingCardProps {
  emoji?: string;
  label: string;
  sublabel?: string;
  selected?: boolean;
  onPress: () => void;
  testID?: string;
}

export const OnboardingCard = ({
  emoji,
  label,
  sublabel,
  selected = false,
  onPress,
  testID,
}: OnboardingCardProps) => {
  const { theme } = useAppTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: selected ? theme.colors.primary + '15' : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      {emoji && (
        <View style={styles.emojiContainer}>
          <AppText style={styles.emoji}>{emoji}</AppText>
        </View>
      )}
      <View style={styles.textContainer}>
        <AppText variant="body" style={[styles.label, selected && { color: theme.colors.primary }]}>
          {label}
        </AppText>
        {sublabel && (
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {sublabel}
          </AppText>
        )}
      </View>
      {selected && (
        <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
          <AppText style={styles.checkmarkText}>✓</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  checkmark: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 24,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});
