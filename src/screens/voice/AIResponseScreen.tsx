import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { MoodSelector } from '@components/common/MoodSelector';
import { useJournalEntry } from '@hooks/useJournalEntries';
import type { MoodLevel } from '@/types/journal';
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

  if (loading || !entry) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <AppText>Waiting for your AI companion...</AppText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText variant="h2">Your AI Companion</AppText>
      {entry.aiResponseStatus !== 'completed' ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <AppText>Analyzing your entry. This usually takes less than a minute.</AppText>
        </View>
      ) : (
        <View style={styles.responseCard}>
          <AppText>{entry.aiResponse}</AppText>
          {entry.aiResponseAudioUrl ? (
            <PrimaryButton label="Listen to response" onPress={handlePlayResponse} />
          ) : null}
        </View>
      )}

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
        <PrimaryButton label="Back to Home" onPress={() => navigation.navigate('Main')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  responseCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  section: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
});


