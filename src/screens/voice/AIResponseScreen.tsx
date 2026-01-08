import { useEffect, useRef, useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { MoodSelector } from '@components/common/MoodSelector';
import { useJournalEntry } from '@hooks/useJournalEntries';
import type { MoodLevel, ProcessingStage } from '@/types/journal';
import { updateEntryMood } from '@services/journal/journalService';
import type { RootStackParamList } from '@navigation/types';

type RouteProps = RouteProp<RootStackParamList, 'AIResponse'>;

export const AIResponseScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { entry, loading } = useJournalEntry(route.params?.entryId);
  const [mood, setMood] = useState<MoodLevel>('neutral');
  const [moodScore, setMoodScore] = useState('5');
  const [saving, setSaving] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (entry?.mood) {
      setMood(entry.mood);
    }
    if (entry?.moodScore) {
      setMoodScore(String(entry.moodScore));
    }
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
    await updateEntryMood(entry.id, mood, Number(moodScore) || 5);
    setSaving(false);
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
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <AppText>Loading entry...</AppText>
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
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <AppText variant="h3">{statusMessage}</AppText>
        <AppText style={styles.subtext}>This usually takes about 30 seconds.</AppText>
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
      <View style={styles.center}>
        <AppText variant="h3" style={styles.errorText}>
          Something went wrong
        </AppText>
        <AppText>We could not process your entry. You can still view it in your journal.</AppText>
        <PrimaryButton
          label="Go to Journal"
          onPress={() => navigation.navigate('Main', { screen: 'JournalTab' })}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="h2">Your AI Companion</AppText>

      <View style={styles.responseCard}>
        <AppText>{entry.aiResponse}</AppText>
        {entry.aiResponseAudioUrl ? (
          <PrimaryButton label="Listen to response" onPress={handlePlayResponse} />
        ) : null}
      </View>

      <View style={styles.section}>
        <AppText variant="h3">How do you feel now?</AppText>
        <MoodSelector value={mood} onChange={setMood} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={moodScore}
          onChangeText={setMoodScore}
          placeholder="Mood score (1-10)"
        />
        <PrimaryButton label="Save mood" onPress={handleSaveMood} isLoading={saving} />
      </View>

      <View style={styles.section}>
        <PrimaryButton
          label="View full entry"
          onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
        />
        <PrimaryButton
          label="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    gap: 24,
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  responseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 12,
    padding: 16,
  },
  section: {
    gap: 16,
  },
  subtext: {
    opacity: 0.6,
    textAlign: 'center',
  },
});
