import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  /** Feather icon name */
  icon?: keyof typeof Feather.glyphMap;
  /** Custom icon color (defaults to theme muted) */
  iconColor?: string;
  /** Title text */
  title: string;
  /** Description message */
  message: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Optional action button callback */
  onAction?: () => void;
  /** Additional container styles */
  style?: ViewStyle;
}

/**
 * EmptyState Component
 * Displays a centered message with icon for empty data scenarios
 */
export const EmptyState = ({
  icon = 'inbox',
  iconColor,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.muted }]}>
        <Feather name={icon} size={48} color={iconColor ?? theme.colors.textSecondary} />
      </View>

      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color={theme.colors.textSecondary} style={styles.message}>
        {message}
      </AppText>

      {actionLabel && onAction && (
        <View style={styles.buttonContainer}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 24,
    minWidth: 200,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    marginBottom: 24,
    width: 96,
  },
  message: {
    lineHeight: 22,
    textAlign: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
