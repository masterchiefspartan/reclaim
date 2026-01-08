import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { useAuth } from '@hooks/useAuth';

export const PermissionsScreen = (_props: OnboardingStackScreenProps<'Permissions'>) => {
  const { updatePermissions, refreshProfile } = useAuth();
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const requestMicrophone = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setMicrophoneGranted(status === 'granted');
  }, []);

  const requestNotifications = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationGranted(status === 'granted');
  }, []);

  const handleFinish = useCallback(async () => {
    if (!microphoneGranted || !notificationGranted) return;
    setIsSaving(true);
    try {
      await updatePermissions({
        microphone: microphoneGranted,
        notifications: notificationGranted,
      });
      await refreshProfile();
    } finally {
      setIsSaving(false);
    }
  }, [microphoneGranted, notificationGranted, refreshProfile, updatePermissions]);

  const canContinue = microphoneGranted && notificationGranted;

  return (
    <OnboardingLayout
      title="Stay connected"
      subtitle="We need a few permissions to power voice journaling and reminders."
    >
      <View style={styles.card}>
        <AppText variant="h3">🎙️ Microphone</AppText>
        <AppText>Record voice journals with high-quality audio.</AppText>
        <PrimaryButton
          label={microphoneGranted ? 'Granted' : 'Allow Microphone'}
          onPress={requestMicrophone}
          disabled={microphoneGranted}
        />
      </View>

      <View style={styles.card}>
        <AppText variant="h3">🔔 Notifications</AppText>
        <AppText>Daily check-in reminders and progress nudges.</AppText>
        <PrimaryButton
          label={notificationGranted ? 'Granted' : 'Enable Notifications'}
          onPress={requestNotifications}
          disabled={notificationGranted}
        />
      </View>

      <PrimaryButton
        label="Finish setup"
        onPress={handleFinish}
        disabled={!canContinue}
        isLoading={isSaving}
      />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: '#d1d5db',
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
});
