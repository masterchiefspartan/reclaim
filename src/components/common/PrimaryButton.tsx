import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { useAppTheme } from '@hooks/useAppTheme';

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
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
