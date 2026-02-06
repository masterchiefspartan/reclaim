/**
 * HomeScreen — Apple Glass Aesthetic
 * ====================================
 * Clean, minimal home with glass surfaces, generous whitespace,
 * and a calming, Apple-inspired layout.
 */
import { StyleSheet, View, Pressable } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { CalendarStrip } from '@components/calendar/CalendarStrip';
import { AffirmationCard } from '@components/home/AffirmationCard';
import { QuickJournalCard } from '@components/home/QuickJournalCard';
import { StatCard } from '@components/home/StatCard';
import { EntryListItem } from '@components/journal/EntryListItem';
import { useAppTheme } from '@hooks/useAppTheme';
import { useAuth } from '@hooks/useAuth';
import { useJournalEntries } from '@hooks/useJournalEntries';
import { useFeatureGate } from '@hooks/useFeatureGate';
import type { RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Affirmations
const AFFIRMATIONS = [
  {
    title: 'Daily reflection',
    message: 'Every step forward is progress, no matter how small.',
    author: 'Recovery Coach',
  },
  {
    title: 'Daily reflection',
    message: 'Your voice matters. Your story deserves to be heard.',
    author: 'Wellness Guide',
  },
  {
    title: 'Daily reflection',
    message: 'Begin each day with a mindful breath and an open heart.',
    author: 'Mindfulness Teacher',
  },
];

// Quick prompts
const QUICK_PROMPTS = [
  {
    emoji: '🌿',
    title: 'Pause & Reflect',
    prompt: 'What are you grateful for today?',
    tags: ['Gratitude'],
  },
  {
    emoji: '🌅',
    title: 'Set Intentions',
    prompt: 'How do you want to feel today?',
    tags: ['Morning'],
  },
];

export const HomeScreen = () => {
  const { theme } = useAppTheme();
  const { profile } = useAuth();
  const { entries } = useJournalEntries();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { allowed: canAddEntry, showPaywall } = useFeatureGate('unlimited_entries');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = useMemo(() => {
    const streak = profile?.stats?.streakDays ?? 0;
    const totalEntries = entries.length;
    const totalMinutes = Math.round(entries.reduce((sum, e) => sum + e.duration / 60000, 0));
    return { streak, totalEntries, totalMinutes };
  }, [entries, profile?.stats?.streakDays]);

  const todayAffirmation = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
  }, []);

  const handleStartFrameworkJournal = useCallback(() => {
    navigation.navigate('FrameworkSelection');
  }, [navigation]);

  const handleStartRecording = useCallback(
    (mode: 'free' | 'guided' = 'free') => {
      if (!canAddEntry) {
        showPaywall();
        return;
      }
      navigation.navigate('VoiceJournal', { mode });
    },
    [navigation, canAddEntry, showPaywall]
  );

  const handleQuickPrompt = useCallback(
    (_prompt: (typeof QUICK_PROMPTS)[0]) => {
      navigation.navigate('VoiceJournal', { mode: 'guided' });
    },
    [navigation]
  );

  const entriesForDate = useMemo(() => {
    return entries.filter(entry => {
      if (!entry.createdAt) return false;
      const entryDate = entry.createdAt.toDate();
      return (
        entryDate.getDate() === selectedDate.getDate() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [entries, selectedDate]);

  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);
  const firstName = profile?.displayName?.split(' ')[0] || '';

  return (
    <ScreenContainer scrollable testID="home-screen">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText variant="largeTitle" color={theme.colors.text}>
            {firstName ? `Hi, ${firstName}` : 'Good morning'}
          </AppText>
          <AppText variant="subheadline" color={theme.colors.textSecondary}>
            How are you feeling today?
          </AppText>
        </View>
        <Pressable
          style={[styles.profileButton, { backgroundColor: theme.colors.fillQuaternary }]}
          onPress={() => navigation.navigate('Main', { screen: 'ProfileTab' })}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Feather name="user" size={20} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Calendar */}
      <View style={styles.calendarWrap}>
        <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </View>

      {/* Affirmation */}
      <View style={styles.section}>
        <AffirmationCard
          title={todayAffirmation.title}
          message={todayAffirmation.message}
          author={todayAffirmation.author}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon="zap" value={stats.streak} label="Day streak" />
        <StatCard icon="mic" value={stats.totalEntries} label="Entries" />
        <StatCard icon="clock" value={stats.totalMinutes} label="Minutes" />
      </View>

      {/* Record CTA */}
      <View style={styles.section}>
        <GlassCard variant="tinted" style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <View style={styles.ctaText}>
              <AppText variant="headline" color={theme.colors.text}>
                Ready to journal?
              </AppText>
              <AppText variant="subheadline" color={theme.colors.textSecondary}>
                Speak your thoughts freely or follow a guided framework.
              </AppText>
            </View>
            <Pressable
              onPress={() => handleStartRecording('free')}
              style={[styles.recordButton, { backgroundColor: theme.colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Start recording"
            >
              <Feather name="mic" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </GlassCard>
      </View>

      {/* Entries for selected date */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="title3" color={theme.colors.text}>
            Entries
          </AppText>
          <AppText variant="footnote" color={theme.colors.textTertiary}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </AppText>
        </View>

        {entriesForDate.length === 0 ? (
          <GlassCard style={styles.emptyCard} blurEnabled={false}>
            <Feather name="book-open" size={24} color={theme.colors.textMuted} />
            <AppText
              variant="subheadline"
              color={theme.colors.textTertiary}
              style={styles.emptyText}
            >
              No entries for this day yet
            </AppText>
          </GlassCard>
        ) : (
          <GlassCard style={styles.entryListCard} blurEnabled={false}>
            {entriesForDate.slice(0, 3).map((entry, index) => (
              <View key={entry.id}>
                {index > 0 && (
                  <View style={[styles.separator, { backgroundColor: theme.colors.divider }]} />
                )}
                <EntryListItem
                  id={entry.id}
                  title={entry.frameworkData?.frameworkName || 'Voice Entry'}
                  date={entry.createdAt?.toDate() || new Date()}
                  mood={entry.mood}
                  preview={entry.transcript?.slice(0, 60)}
                  onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
                />
              </View>
            ))}
          </GlassCard>
        )}
      </View>

      {/* Quick Journal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="title3" color={theme.colors.text}>
            Quick Journal
          </AppText>
          <Pressable onPress={handleStartFrameworkJournal}>
            <AppText variant="footnote" color={theme.colors.primary} style={styles.seeAll}>
              See All
            </AppText>
          </Pressable>
        </View>

        <View style={styles.promptsRow}>
          {QUICK_PROMPTS.map((prompt, index) => (
            <QuickJournalCard
              key={index}
              emoji={prompt.emoji}
              title={prompt.title}
              prompt={prompt.prompt}
              tags={prompt.tags}
              onPress={() => handleQuickPrompt(prompt)}
            />
          ))}
        </View>
      </View>

      {/* Guided Journal CTA */}
      <View style={styles.section}>
        <PrimaryButton
          label="Start Guided Journal"
          onPress={handleStartFrameworkJournal}
          variant="primary"
          testID="start-recording-button"
          icon={<Feather name="compass" size={18} color="#FFFFFF" />}
        />
      </View>

      {/* Recent Activity */}
      {recentEntries.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="title3" color={theme.colors.text}>
              Recent Activity
            </AppText>
          </View>
          <GlassCard style={styles.entryListCard} blurEnabled={false}>
            {recentEntries.map((entry, index) => (
              <View key={entry.id}>
                {index > 0 && (
                  <View style={[styles.separator, { backgroundColor: theme.colors.divider }]} />
                )}
                <EntryListItem
                  id={entry.id}
                  title={entry.frameworkData?.frameworkName || 'Voice Entry'}
                  date={entry.createdAt?.toDate() || new Date()}
                  mood={entry.mood}
                  preview={entry.transcript?.slice(0, 60)}
                  onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
                />
              </View>
            ))}
          </GlassCard>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  bottomPadding: {
    height: 40,
  },
  calendarWrap: {
    marginTop: 20,
  },
  ctaCard: {
    padding: 20,
  },
  ctaContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  ctaText: {
    flex: 1,
    gap: 4,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
  entryListCard: {
    padding: 0,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  profileButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  promptsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recordButton: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAll: {
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    marginHorizontal: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
});
