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
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  message: {
    opacity: 0.8,
  },
});
