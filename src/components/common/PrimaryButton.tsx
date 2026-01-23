import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from './AppText';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  testID?: string;
}

export const PrimaryButton = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  testID,
}: PrimaryButtonProps) => {
  const { theme } = useAppTheme();
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.surface} />
      ) : (
        <AppText variant="body" style={styles.label} color={theme.colors.surface}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
