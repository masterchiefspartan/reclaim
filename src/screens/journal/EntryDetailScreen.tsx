import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { MoodSelector } from '@components/common/MoodSelector';
import { useJournalEntry } from '@hooks/useJournalEntries';
import type { RootStackParamList } from '@navigation/types';
import type { MoodLevel } from '@/types/journal';
import { updateEntryMood } from '@services/journal/journalService';
import { useAppTheme } from '@hooks/useAppTheme';

type RouteProps = RouteProp<RootStackParamList, 'EntryDetail'>;

export const EntryDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const { entry, loading } = useJournalEntry(route.params?.entryId);
  const { theme } = useAppTheme();
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [moodScore, setMoodScore] = useState('5');
  const [painLevel, setPainLevel] = useState('5');
  const [isSavingMood, setIsSavingMood] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (entry?.mood) {
      setMood(entry.mood);
    }
    if (entry?.moodScore) {
      setMoodScore(String(entry.moodScore));
    }
    if (entry?.painLevel) {
      setPainLevel(String(entry.painLevel));
    }
  }, [entry?.mood, entry?.moodScore, entry?.painLevel]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    if (!entry?.audioUrl) return;
    if (soundRef.current) {
      await soundRef.current.replayAsync();
      return;
    }
    const { sound } = await Audio.Sound.createAsync({ uri: entry.audioUrl });
    soundRef.current = sound;
    await sound.playAsync();
  };

  const handleSaveMood = async () => {
    if (!entry) return;
    setIsSavingMood(true);
    await updateEntryMood(entry.id, mood, Number(moodScore) ?? 5, Number(painLevel) ?? undefined);
    setIsSavingMood(false);
  };

  const statusBadge = useMemo(() => {
    if (!entry) return 'Loading entry...';
    if (entry.aiResponseStatus === 'failed') return 'AI response failed';
    if (entry.aiResponseStatus === 'processing') return 'AI processing...';
    return 'AI ready';
  }, [entry]);

  if (loading || !entry) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <AppText>Loading entry...</AppText>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <AppText variant="h2">Entry Details</AppText>
        <AppText>{statusBadge}</AppText>
        <PrimaryButton label="Play audio" onPress={handlePlayAudio} />
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Transcript</AppText>
        <AppText>{entry.transcript ?? 'Transcription pending...'}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="h3">AI Response</AppText>
        <AppText>{entry.aiResponse ?? 'Response will appear once ready.'}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Mood & Pain</AppText>
        <MoodSelector value={mood} onChange={setMood} />
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <AppText>Mood Score (1-10)</AppText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
              keyboardType="numeric"
              maxLength={2}
              value={moodScore}
              onChangeText={setMoodScore}
            />
          </View>
          <View style={styles.inputGroup}>
            <AppText>Pain (1-10)</AppText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
              keyboardType="numeric"
              maxLength={2}
              value={painLevel}
              onChangeText={setPainLevel}
            />
          </View>
        </View>
        <PrimaryButton label="Save mood" onPress={handleSaveMood} isLoading={isSavingMood} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
});
