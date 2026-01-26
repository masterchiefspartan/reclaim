import { StyleSheet, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { JournalEntryCard } from '@components/journal/JournalEntryCard';
import { VoiceConversationButton } from '@components/voice-conversation/VoiceConversationButton';
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

  // Navigate to framework selection for guided journaling
  const handleStartFrameworkJournal = useCallback(() => {
    navigation.navigate('FrameworkSelection');
  }, [navigation]);

  const handleStartRecording = useCallback(
    (mode: 'free' | 'guided' = 'free') => {
      navigation.navigate('VoiceJournal', { mode });
    },
    [navigation]
  );

  const handleStartConversation = useCallback(() => {
    navigation.navigate('VoiceConversation');
  }, [navigation]);

  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);

  return (
    <ScreenContainer scrollable testID="home-screen">
      <View style={styles.header}>
        <AppText variant="h2">
          Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}
        </AppText>
        <AppText style={styles.subtitle}>Ready to journal?</AppText>
      </View>

      <View style={styles.cardsRow}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Feather name="activity" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.streak}</AppText>
          <AppText>Day streak</AppText>
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Feather name="mic" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.totalEntries}</AppText>
          <AppText>Entries</AppText>
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Feather name="clock" size={20} color={theme.colors.primary} />
          <AppText variant="h1">{stats.totalMinutes}</AppText>
          <AppText>Voice mins</AppText>
        </View>
      </View>

      <View style={styles.conversationSection}>
        <VoiceConversationButton onPress={handleStartConversation} isLoading={false} />
      </View>

      <View style={styles.ctaSection}>
        <PrimaryButton
          label="Start Guided Journal"
          onPress={handleStartFrameworkJournal}
          testID="start-recording-button"
        />
        <PrimaryButton label="Quick Free Talk" onPress={() => handleStartRecording('free')} />
        <AppText style={styles.helperText}>
          Choose a framework for guided reflection, or just talk freely.
        </AppText>
      </View>

      <View style={styles.recentHeader}>
        <AppText variant="h3">Your Recovery Journey</AppText>
        <AppText style={styles.subtitle}>Track your progress over time</AppText>
      </View>
      <View style={styles.recentList}>
        {recentEntries.length === 0 ? (
          <AppText style={styles.emptyText}>
            You have not started journaling yet. Tap a button above to record your first entry!
          </AppText>
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
  card: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    marginHorizontal: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  conversationSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  ctaSection: {
    gap: 12,
    marginTop: 32,
  },
  emptyText: {
    lineHeight: 22,
    opacity: 0.7,
    textAlign: 'center',
  },
  header: {
    gap: 8,
    marginTop: 16,
  },
  helperText: {
    opacity: 0.7,
    textAlign: 'center',
  },
  recentHeader: {
    gap: 4,
    marginTop: 32,
  },
  recentList: {
    gap: 12,
    marginTop: 16,
    paddingBottom: 32,
  },
  subtitle: {
    opacity: 0.7,
  },
});
