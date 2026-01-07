import { StyleSheet, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { JournalEntryCard } from '@components/journal/JournalEntryCard';
import { useAppTheme } from '@hooks/useAppTheme';
import { useAuth } from '@hooks/useAuth';
import { useJournalEntries } from '@hooks/useJournalEntries';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const HomeScreen = () => {
  const { theme } = useAppTheme();
  const { profile } = useAuth();
  const { entries } = useJournalEntries();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const stats = useMemo(() => {
    const streak = profile?.stats?.streakDays ?? 0;
    const totalEntries = entries.length;
    const totalMinutes = Math.round(entries.reduce((sum, e) => sum + e.duration / 60000, 0));
    return { streak, totalEntries, totalMinutes };
  }, [entries, profile?.stats?.streakDays]);

  const handleStartRecording = useCallback(
    (mode: 'free' | 'guided' = 'free') => {
      navigation.navigate('VoiceJournal', { mode });
    },
    [navigation]
  );

  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);

  return (
    <ScreenContainer scrollable testID="home-screen">
      <View style={styles.header}>
        <AppText variant="h2">Hi {profile?.displayName ?? 'friend'} 👋</AppText>
        <AppText style={styles.subtitle}>Ready for your next recovery check-in?</AppText>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Feather name="activity" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.streak}</AppText>
          <AppText>Day streak</AppText>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Feather name="mic" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.totalEntries}</AppText>
          <AppText>Entries</AppText>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Feather name="clock" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.totalMinutes}</AppText>
          <AppText>Voice mins</AppText>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <PrimaryButton
          label="Start Voice Journal"
          onPress={() => handleStartRecording('free')}
          testID="start-recording-button"
        />
        <PrimaryButton label="Guided Check-In" onPress={() => handleStartRecording('guided')} />
        <AppText style={styles.helperText}>
          Real-time transcription and AI responses will appear after each recording.
        </AppText>
      </View>

      <View style={styles.recentHeader}>
        <AppText variant="h3">Recent Entries</AppText>
        <AppText>See how you’re progressing this week.</AppText>
      </View>
      <View style={styles.recentList}>
        {recentEntries.length === 0 ? (
          <AppText>No entries yet. Start recording to see your history here.</AppText>
        ) : (
          recentEntries.map(entry => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    gap: 8,
  },
  subtitle: {
    opacity: 0.8,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    gap: 4,
  },
  ctaSection: {
    marginTop: 32,
    gap: 12,
  },
  helperText: {
    opacity: 0.7,
  },
  recentHeader: {
    marginTop: 32,
    gap: 4,
  },
  recentList: {
    marginTop: 16,
    gap: 12,
  },
});
