import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  /** Feather icon name */
  icon?: keyof typeof Feather.glyphMap;
  /** Title text (defaults to "Something went wrong") */
  title?: string;
  /** Error message to display */
  message: string;
  /** Retry button label (defaults to "Try Again") */
  retryLabel?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Show contact support link */
  showContactSupport?: boolean;
  /** Contact support callback */
  onContactSupport?: () => void;
  /** Additional container styles */
  style?: ViewStyle;
}

/**
 * ErrorState Component
 * Displays error message with retry option
 */
export const ErrorState = ({
  icon = 'alert-circle',
  title = 'Something went wrong',
  message,
  retryLabel = 'Try Again',
  onRetry,
  showContactSupport = false,
  onContactSupport,
  style,
}: ErrorStateProps) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${title}. ${message}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.error}20` }]}>
        <Feather name={icon} size={48} color={theme.colors.error} />
      </View>

      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color={theme.colors.textSecondary} style={styles.message}>
        {message}
      </AppText>

      {onRetry && (
        <View style={styles.buttonContainer}>
          <PrimaryButton label={retryLabel} onPress={onRetry} />
        </View>
      )}

      {showContactSupport && onContactSupport && (
        <Pressable
          onPress={onContactSupport}
          style={styles.supportLink}
          accessibilityRole="link"
          accessibilityLabel="Contact support"
        >
          <AppText variant="caption" color={theme.colors.primary}>
            Contact Support
          </AppText>
        </Pressable>
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
  supportLink: {
    marginTop: 16,
    padding: 8,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
