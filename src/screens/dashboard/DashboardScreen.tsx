import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { useJournalEntries } from '@hooks/useJournalEntries';
import type { MainTabScreenProps } from '@navigation/types';
import type { MoodLevel } from '@/types/journal';

type Props = MainTabScreenProps<'DashboardTab'>;

const moodOrder: MoodLevel[] = ['sad', 'anxious', 'neutral', 'hopeful', 'grateful', 'energized'];

const calculateStreak = (dates: dayjs.Dayjs[]) => {
  if (dates.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const diff = dates[i - 1].diff(dates[i], 'day');
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      break;
    }
  }
  return streak;
};

export const DashboardScreen = (_props: Props) => {
  const { entries } = useJournalEntries();

  const stats = useMemo(() => {
    const orderedEntries = [...entries].sort(
      (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0),
    );
    const dates = orderedEntries
      .map((entry) => entry.createdAt?.toDate())
      .filter(Boolean)
      .map((date) => dayjs(date as Date));

    const streak = calculateStreak(dates);
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration / 60000, 0);
    const moodCounts: Record<MoodLevel, number> = {
      sad: 0,
      anxious: 0,
      neutral: 0,
      hopeful: 0,
      grateful: 0,
      energized: 0,
    };
    entries.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood] += 1;
      }
    });
    const favoriteMood =
      moodOrder.reduce(
        (best, mood) => (moodCounts[mood] > (moodCounts[best] ?? 0) ? mood : best),
        'neutral' as MoodLevel,
      ) ?? 'neutral';

    return {
      streak,
      entriesCount: entries.length,
      totalMinutes: Math.round(totalMinutes),
      favoriteMood,
    };
  }, [entries]);

  return (
    <ScreenContainer scrollable testID="dashboard-screen">
      <AppText variant="h2">Progress Dashboard</AppText>
      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <AppText variant="h1">{stats.streak}</AppText>
          <AppText>Day Streak</AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="h1">{stats.entriesCount}</AppText>
          <AppText>Entries</AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="h1">{stats.totalMinutes}</AppText>
          <AppText>Voice Minutes</AppText>
        </View>
        <View style={styles.metricCard}>
          <AppText variant="h1">{stats.favoriteMood}</AppText>
          <AppText>Most common mood</AppText>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Milestones</AppText>
        <AppText>
          {stats.entriesCount >= 7
            ? '✅ 7-Day Warrior unlocked!'
            : `Log ${7 - stats.entriesCount} more entries to unlock 7-Day Warrior.`}
        </AppText>
        <AppText>
          {stats.streak >= 14
            ? '✅ Two Week Champion!'
            : `${14 - stats.streak} days to Two Week Champion.`}
        </AppText>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  metricCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },
  section: {
    marginTop: 24,
    gap: 8,
  },
});


