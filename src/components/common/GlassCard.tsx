/**
 * GlassCard — Frosted glass surface component
 * =============================================
 * Apple-inspired translucent card with blur backdrop.
 * The foundational surface component for the glass aesthetic.
 *
 * Usage:
 *   <GlassCard>
 *     <AppText>Content on glass</AppText>
 *   </GlassCard>
 *
 *   <GlassCard variant="elevated" onPress={handleTap}>
 *     <AppText>Tappable glass card</AppText>
 *   </GlassCard>
 */
import { PropsWithChildren } from 'react';
import { StyleSheet, View, Pressable, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';

import { useAppTheme } from '@hooks/useAppTheme';

type GlassVariant = 'card' | 'elevated' | 'chrome' | 'tinted';

interface GlassCardProps {
  /** Glass intensity variant */
  variant?: GlassVariant;
  /** Optional press handler — makes the card tappable */
  onPress?: () => void;
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
  /** Whether to show the blur effect (disable for performance on lists) */
  blurEnabled?: boolean;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const GlassCard = ({
  children,
  variant = 'card',
  onPress,
  style,
  blurEnabled = true,
  testID,
  accessibilityLabel,
}: PropsWithChildren<GlassCardProps>) => {
  const { theme } = useAppTheme();
  const glassTokens = theme.glass[variant];

  const containerStyle: ViewStyle = {
    backgroundColor: glassTokens.backgroundColor,
    borderRadius: theme.borderRadius.xl,
    borderWidth: glassTokens.borderWidth,
    borderColor: glassTokens.borderColor,
    overflow: 'hidden',
  };

  const innerContent = <View style={[styles.content, style]}>{children}</View>;

  const card = (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={[containerStyle, theme.shadows.glass]}
    >
      {blurEnabled ? (
        <BlurView
          intensity={glassTokens.blurIntensity}
          tint={glassTokens.blurTint}
          style={styles.blur}
        >
          {innerContent}
        </BlurView>
      ) : (
        innerContent
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      >
        {card}
      </Pressable>
    );
  }

  return card;
};

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});
