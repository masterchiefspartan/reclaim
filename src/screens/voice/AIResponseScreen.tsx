/**
 * AIResponseScreen — Apple Glass Aesthetic
 * ==========================================
 * Clean AI response display with glass cards,
 * mood selection, and Apple-style navigation.
 */
import { useEffect, useRef, useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { MoodSelector } from '@components/common/MoodSelector';
import { useJournalEntry } from '@hooks/useJournalEntries';
import { useAppTheme } from '@hooks/useAppTheme';
import type { MoodLevel, ProcessingStage } from '@/types/journal';
import { updateEntryMood } from '@services/journal/journalService';
import { getUserFriendlyMessage } from '@utils/errors';
import type { RootStackParamList } from '@navigation/types';

type RouteProps = RouteProp<RootStackParamList, 'AIResponse'>;

export const AIResponseScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { entry, loading } = useJournalEntry(route.params?.entryId);
  const { theme } = useAppTheme();
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [moodScore, setMoodScore] = useState('5');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (entry?.mood) setMood(entry.mood);
    if (entry?.moodScore) setMoodScore(String(entry.moodScore));
  }, [entry?.mood, entry?.moodScore]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  const handlePlayResponse = async () => {
    if (!entry?.aiResponseAudioUrl) return;
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync({ uri: entry.aiResponseAudioUrl });
      soundRef.current = sound;
    }
    await soundRef.current.playAsync();
  };

  const handleSaveMood = async () => {
    if (!entry) return;
    setSaving(true);
    try {
      setSaveError(null);
      await updateEntryMood(entry.id, mood, Number(moodScore) || 5);
      navigation.replace('Celebration', { entryId: entry.id });
    } catch (error) {
      setSaveError(getUserFriendlyMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const statusMessage = useMemo(() => {
    if (!entry?.processingStage) return 'Initializing...';
    const messages: Record<ProcessingStage, string> = {
      uploading: 'Uploading audio...',
      transcribing: 'Transcribing your voice...',
      analyzing: 'AI is analyzing your thoughts...',
      synthesizing: 'Preparing voice response...',
      completed: 'Response ready',
      failed: 'Processing failed',
    };
    return messages[entry.processingStage] ?? 'Processing...';
  }, [entry?.processingStage]);

  if (loading || !entry) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText variant="subheadline" color={theme.colors.textSecondary}>
          Loading entry...
        </AppText>
      </View>
    );
  }

  // Still processing
  if (
    entry.processingStage &&
    entry.processingStage !== 'completed' &&
    entry.processingStage !== 'failed'
  ) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText variant="title3" color={theme.colors.text}>
          {statusMessage}
        </AppText>
        <AppText variant="footnote" color={theme.colors.textTertiary}>
          This usually takes about 30 seconds.
        </AppText>
      </View>
    );
  }

  // Failed state
  if (
    entry.processingStage === 'failed' ||
    entry.transcriptionStatus === 'failed' ||
    entry.aiResponseStatus === 'failed'
  ) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <AppText variant="title3" color={theme.colors.text}>
          Something went wrong
        </AppText>
        <AppText
          variant="subheadline"
          color={theme.colors.textSecondary}
          style={styles.centeredText}
        >
          We couldn&apos;t process your entry. You can still view it in your journal.
        </AppText>
        <View style={styles.buttonWrap}>
          <PrimaryButton
            label="Go to Journal"
            onPress={() => navigation.navigate('Main', { screen: 'JourneyTab' })}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <AppText variant="largeTitle" color={theme.colors.text}>
        Your AI Companion
      </AppText>

      {/* AI Response Card */}
      <GlassCard style={styles.responseCard} blurEnabled={false}>
        <AppText variant="body" color={theme.colors.text}>
          {entry.aiResponse}
        </AppText>
        {entry.aiResponseAudioUrl && (
          <PrimaryButton
            label="Listen to response"
            onPress={handlePlayResponse}
            variant="secondary"
            size="md"
            icon={<Feather name="play" size={16} color={theme.colors.text} />}
          />
        )}
      </GlassCard>

      {/* Mood Section */}
      <GlassCard style={styles.moodCard} blurEnabled={false}>
        <AppText variant="headline" color={theme.colors.text}>
          How do you feel now?
        </AppText>
        <MoodSelector value={mood} onChange={setMood} />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.fillQuaternary,
              color: theme.colors.text,
            },
          ]}
          keyboardType="numeric"
          value={moodScore}
          onChangeText={setMoodScore}
          placeholder="Mood score (1-10)"
          placeholderTextColor={theme.colors.textMuted}
        />
        {saveError && (
          <AppText variant="footnote" color={theme.colors.error}>
            {saveError}
          </AppText>
        )}
        <PrimaryButton label="Save mood" onPress={handleSaveMood} isLoading={saving} />
      </GlassCard>

      {/* Navigation */}
      <View style={styles.navSection}>
        <PrimaryButton
          label="View Full Entry"
          onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
          variant="secondary"
        />
        <PrimaryButton
          label="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          variant="outline"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonWrap: {
    marginTop: 8,
    width: '100%',
  },
  center: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  centeredText: {
    textAlign: 'center',
  },
  container: {
    gap: 20,
    padding: 24,
    paddingBottom: 48,
  },
  input: {
    borderRadius: 10,
    fontSize: 17,
    padding: 12,
  },
  moodCard: {
    gap: 16,
    padding: 20,
  },
  navSection: {
    gap: 10,
  },
  responseCard: {
    gap: 14,
    padding: 20,
  },
});
