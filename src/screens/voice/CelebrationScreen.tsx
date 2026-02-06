/**
 * CelebrationScreen — Apple Glass Aesthetic
 * ==========================================
 * Clean celebration with glass card and subtle stats.
 */
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
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
      <View style={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <AppText style={styles.checkmark}>✓</AppText>
          <AppText variant="title1" color={theme.colors.text}>
            Entry complete
          </AppText>
          <AppText variant="subheadline" color={theme.colors.textSecondary} style={styles.subtitle}>
            You showed up for yourself today. That matters.
          </AppText>
        </View>

        {/* Stats */}
        <GlassCard style={styles.statsCard} blurEnabled={false}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <AppText variant="largeTitle" color={theme.colors.primary}>
                {profile?.stats?.streakDays ?? 1}
              </AppText>
              <AppText variant="footnote" color={theme.colors.textTertiary}>
                Day streak
              </AppText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
            <View style={styles.stat}>
              <AppText variant="largeTitle" color={theme.colors.primary}>
                {entry?.duration ? Math.round(entry.duration / 60) : 0}
              </AppText>
              <AppText variant="footnote" color={theme.colors.textTertiary}>
                Minutes
              </AppText>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          label="View Entry"
          onPress={() => navigation.replace('EntryDetail', { entryId: route.params.entryId })}
          variant="primary"
        />
        <PrimaryButton
          label="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  checkmark: {
    color: '#34C759',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  divider: {
    height: '60%',
    width: 0.5,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statsCard: {
    padding: 24,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subtitle: {
    textAlign: 'center',
  },
});
