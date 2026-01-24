import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';

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
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.primary,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.labelContainer}>
          <AppText variant="body" style={styles.label} color="#FFFFFF">
            {label}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 14,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
