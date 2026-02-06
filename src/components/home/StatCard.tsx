/**
 * StatCard — Apple-style glass stat card
 * Minimal, with a centered value and label.
 */
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { useAppTheme } from '@hooks/useAppTheme';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface StatCardProps {
  icon: FeatherIconName;
  value: number | string;
  label: string;
  iconColor?: string;
}

export const StatCard = ({ icon, value, label, iconColor }: StatCardProps) => {
  const { theme } = useAppTheme();

  return (
    <GlassCard style={styles.content} blurEnabled={false}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.fillQuaternary }]}>
        <Feather name={icon} size={16} color={iconColor || theme.colors.primary} />
      </View>
      <AppText variant="title2" color={theme.colors.text} style={styles.value}>
        {value}
      </AppText>
      <AppText variant="caption1" color={theme.colors.textTertiary}>
        {label}
      </AppText>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    paddingVertical: 16,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
});
