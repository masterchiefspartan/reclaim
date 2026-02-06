/**
 * PrimaryButton — Apple-style button
 * ====================================
 * Clean, minimal button with subtle depth.
 * Supports primary (filled), secondary (gray fill),
 * outline (bordered), and glass (translucent) variants.
 */
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from './AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  testID?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryButton = ({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  testID,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  icon,
}: PrimaryButtonProps) => {
  const { theme } = useAppTheme();
  const isDisabled = disabled || isLoading;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const height = theme.buttons.height[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.primary,
          textColor: '#FFFFFF',
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: theme.shadows.button,
        };
      case 'secondary':
        return {
          bg: theme.colors.fillTertiary,
          textColor: theme.colors.text,
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: theme.shadows.none,
        };
      case 'outline':
        return {
          bg: 'transparent',
          textColor: theme.colors.primary,
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
          shadow: theme.shadows.none,
        };
      case 'glass':
        return {
          bg: theme.colors.surfaceGlass,
          textColor: theme.colors.text,
          borderWidth: 0.5,
          borderColor: theme.colors.borderLight,
          shadow: theme.shadows.glass,
        };
      default:
        return {
          bg: theme.colors.primary,
          textColor: '#FFFFFF',
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: theme.shadows.button,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.button,
        {
          height,
          backgroundColor: variantStyles.bg,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          borderRadius: theme.borderRadius.lg,
          opacity: isDisabled ? 0.4 : 1,
          alignSelf: fullWidth ? 'stretch' : 'center',
          paddingHorizontal: theme.buttons.paddingHorizontal[size],
        },
        variantStyles.shadow,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.textColor} size="small" />
      ) : (
        <View style={styles.labelRow}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <AppText
            variant={size === 'sm' ? 'labelSmall' : 'headline'}
            color={variantStyles.textColor}
            style={styles.label}
          >
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: 8,
  },
  label: {
    textAlign: 'center',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
