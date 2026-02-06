/**
 * EntryDetailScreen — Apple Glass Aesthetic
 * ===========================================
 * Clean detail view with glass cards, generous whitespace,
 * and Apple-style navigation chrome.
 */
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { MoodDropdown } from '@components/common/MoodDropdown';
import { AudioPlayer } from '@components/audio/AudioPlayer';
import { HighlightsList } from '@components/journal/HighlightsList';
import { useJournalEntry } from '@hooks/useJournalEntries';
import type { RootStackParamList } from '@navigation/types';
import type { MoodLevel } from '@/types/journal';
import { updateEntryMood } from '@services/journal/journalService';
import { useAppTheme } from '@hooks/useAppTheme';
import { getMoodEmoji } from '@utils/mood';

type RouteProps = RouteProp<RootStackParamList, 'EntryDetail'>;

export const EntryDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { entry, loading } = useJournalEntry(route.params?.entryId);
  const { theme } = useAppTheme();
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [isSavingMood, setIsSavingMood] = useState(false);

  useEffect(() => {
    if (entry?.mood) {
      setMood(entry.mood);
    }
  }, [entry?.mood]);

  const handleSaveMood = async () => {
    if (!entry) return;
    setIsSavingMood(true);
    await updateEntryMood(entry.id, mood, entry.moodScore ?? 5, entry.painLevel ?? undefined);
    setIsSavingMood(false);
  };

  const formattedDate = useMemo(() => {
    if (!entry?.createdAt) return '';
    return dayjs(entry.createdAt.toDate()).format('MMMM D, YYYY');
  }, [entry?.createdAt]);

  const tags = useMemo(() => {
    const result: string[] = [];
    if (entry?.frameworkData?.frameworkName) result.push(entry.frameworkData.frameworkName);
    if (entry?.mood) result.push(entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1));
    return result.length > 0 ? result : ['Personal'];
  }, [entry?.frameworkData?.frameworkName, entry?.mood]);

  const highlights = useMemo(() => {
    if (!entry?.aiResponse) return [];
    const lines = entry.aiResponse.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, 5).map(line => line.replace(/^[-*•]\s*/, '').trim());
  }, [entry?.aiResponse]);

  const entryTitle = entry?.frameworkData?.frameworkName || 'Morning Reflection';
  const moodEmoji = getMoodEmoji(entry?.mood);

  if (loading || !entry) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.colors.background, paddingTop: insets.top },
        ]}
      >
        <AppText variant="subheadline" color={theme.colors.textSecondary}>
          Loading entry...
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}
    >
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.navButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color={theme.colors.primary} />
        </Pressable>
        <AppText variant="headline" color={theme.colors.text}>
          {formattedDate}
        </AppText>
        <Pressable
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Feather name="more-horizontal" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <AppText variant="largeTitle" color={theme.colors.text}>
          {entryTitle}
        </AppText>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {tags.map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: theme.colors.fillQuaternary }]}
            >
              <AppText variant="caption1" color={theme.colors.textSecondary}>
                {tag}
              </AppText>
            </View>
          ))}
        </View>

        {/* Mood Hero */}
        <View style={[styles.moodHero, { backgroundColor: theme.colors.fillQuaternary }]}>
          <AppText style={styles.moodEmoji}>{moodEmoji}</AppText>
        </View>

        {/* Audio Player */}
        {entry.audioUrl && (
          <View style={styles.section}>
            <AudioPlayer
              audioUrl={entry.audioUrl}
              duration={entry.duration ? entry.duration / 1000 : undefined}
            />
          </View>
        )}

        {/* Transcript */}
        <GlassCard style={styles.transcriptCard} blurEnabled={false}>
          <AppText variant="footnote" color={theme.colors.textTertiary} style={styles.sectionLabel}>
            TRANSCRIPT
          </AppText>
          <AppText variant="body" color={theme.colors.text} style={styles.transcript}>
            {entry.transcript ?? 'Transcription pending...'}
          </AppText>
        </GlassCard>

        {/* Highlights */}
        {highlights.length > 0 && (
          <View style={styles.section}>
            <HighlightsList highlights={highlights} />
          </View>
        )}

        {/* Mood Section */}
        <GlassCard style={styles.moodCard} blurEnabled={false}>
          <AppText variant="headline" color={theme.colors.text}>
            How were you feeling?
          </AppText>
          <MoodDropdown value={mood} onChange={setMood} />
          <PrimaryButton
            label="Save Mood"
            onPress={handleSaveMood}
            isLoading={isSavingMood}
            size="md"
          />
        </GlassCard>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.colors.fillQuaternary }]}
            accessibilityRole="button"
            accessibilityLabel="Edit entry"
          >
            <Feather name="edit-2" size={18} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.colors.fillQuaternary }]}
            accessibilityRole="button"
            accessibilityLabel="Share entry"
          >
            <Feather name="share" size={18} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 59, 48, 0.08)' }]}
            accessibilityRole="button"
            accessibilityLabel="Delete entry"
          >
            <Feather name="trash-2" size={18} color="#FF3B30" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 28,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 48,
  },
  moodCard: {
    gap: 16,
    marginTop: 24,
    padding: 20,
  },
  moodEmoji: {
    fontSize: 56,
  },
  moodHero: {
    alignItems: 'center',
    borderRadius: 20,
    height: 140,
    justifyContent: 'center',
    marginTop: 20,
  },
  navBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  transcript: {
    lineHeight: 26,
  },
  transcriptCard: {
    marginTop: 20,
    padding: 18,
  },
  wrapper: {
    flex: 1,
  },
});
