import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { useAppTheme } from '@hooks/useAppTheme';
import { useAuth } from '@hooks/useAuth';
import { useJournalEntry } from '@hooks/useJournalEntries';
import type { RootStackParamList } from '@navigation/types';

type RouteProps = RouteProp<RootStackParamList, 'Celebration'>;

export const CelebrationScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useAppTheme();
  const { profile } = useAuth();
  const { entry } = useJournalEntry(route.params?.entryId);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <AppText variant="h2">Entry complete</AppText>
        <AppText style={styles.subtitle}>You showed up for yourself today. That matters.</AppText>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <AppText variant="h1">{profile?.stats?.streakDays ?? 1}</AppText>
            <AppText>Day streak</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="h1">{entry?.duration ? Math.round(entry.duration / 60) : 0}</AppText>
            <AppText>Minutes</AppText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="View Dashboard"
          onPress={() => navigation.navigate('Main', { screen: 'DashboardTab' })}
        />
        <PrimaryButton
          label="View Entry"
          onPress={() => navigation.replace('EntryDetail', { entryId: route.params.entryId })}
        />
        <PrimaryButton
          label="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  subtitle: {
    opacity: 0.75,
  },
});
