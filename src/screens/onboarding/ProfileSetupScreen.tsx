import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { saveOnboardingProfile } from '@services/auth/authService';
import { useAuth } from '@hooks/useAuth';

export const ProfileSetupScreen = ({
  route,
  navigation,
}: OnboardingStackScreenProps<'ProfileSetup'>) => {
  const plan = route.params?.plan ?? 'trial';
  const { user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [injuryDescription, setInjuryDescription] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [biggestStruggle, setBiggestStruggle] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = useCallback(async () => {
    if (!user) return;
    if (!displayName || !injuryDescription) {
      setError('Please fill in your name and recovery details.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      await saveOnboardingProfile(user.uid, {
        displayName,
        plan,
        recoveryContext: {
          injuryDescription,
          surgeryDate,
          biggestStruggle,
        },
      });
      await refreshProfile();
      navigation.navigate('Permissions');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }, [
    biggestStruggle,
    displayName,
    injuryDescription,
    navigation,
    plan,
    refreshProfile,
    surgeryDate,
    user,
  ]);

  return (
    <OnboardingLayout
      title="Tell us about your recovery"
      subtitle="We’ll personalize prompts and AI support."
    >
      <View style={styles.field}>
        <AppText>Preferred Name</AppText>
        <TextInput
          style={styles.input}
          placeholder="Sarah"
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>
      <View style={styles.field}>
        <AppText>What are you recovering from?</AppText>
        <TextInput
          style={styles.input}
          placeholder="ACL reconstruction, hip replacement..."
          value={injuryDescription}
          onChangeText={setInjuryDescription}
        />
      </View>
      <View style={styles.field}>
        <AppText>Surgery date (optional)</AppText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={surgeryDate}
          onChangeText={setSurgeryDate}
        />
      </View>
      <View style={styles.field}>
        <AppText>Biggest struggle right now?</AppText>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Staying motivated, pain at night..."
          multiline
          value={biggestStruggle}
          onChangeText={setBiggestStruggle}
        />
      </View>

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <PrimaryButton label="Continue" onPress={handleContinue} isLoading={isSaving} />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  error: {
    color: '#dc2626',
  },
  field: {
    gap: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
