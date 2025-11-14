import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

export const LoadingScreen = () => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText style={styles.message}>Preparing your recovery journey...</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  message: {
    opacity: 0.8,
  },
});

