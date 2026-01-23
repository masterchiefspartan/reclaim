import { View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from './AppText';

type LoadingVariant = 'spinner' | 'dots';
type LoadingSize = 'small' | 'medium' | 'large';

interface LoadingStateProps {
  /** Optional message to display */
  message?: string;
  /** Loading indicator variant */
  variant?: LoadingVariant;
  /** Size of the loading indicator */
  size?: LoadingSize;
  /** Additional container styles */
  style?: ViewStyle;
  /** Whether to fill the container */
  fullScreen?: boolean;
}

const sizeMap: Record<LoadingSize, 'small' | 'large'> = {
  small: 'small',
  medium: 'large',
  large: 'large',
};

const indicatorSizes: Record<LoadingSize, number> = {
  small: 24,
  medium: 36,
  large: 48,
};

/**
 * LoadingState Component
 * Displays loading indicator with optional message
 */
export const LoadingState = ({
  message,
  variant = 'spinner',
  size = 'medium',
  style,
  fullScreen = true,
}: LoadingStateProps) => {
  const { theme } = useAppTheme();

  const renderIndicator = () => {
    if (variant === 'dots') {
      return (
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.colors.primary,
                  width: indicatorSizes[size] / 3,
                  height: indicatorSizes[size] / 3,
                },
              ]}
            />
          ))}
        </View>
      );
    }

    return (
      <ActivityIndicator
        size={sizeMap[size]}
        color={theme.colors.primary}
        accessibilityLabel="Loading"
      />
    );
  };

  return (
    <View
      style={[styles.container, fullScreen && styles.fullScreen, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Loading'}
    >
      {renderIndicator()}

      {message && (
        <AppText variant="body" color={theme.colors.textSecondary} style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dot: {
    borderRadius: 100,
    opacity: 0.7,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
