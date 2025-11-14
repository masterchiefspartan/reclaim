import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Switch, TextInput, View } from 'react-native';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { useAuth } from '@hooks/useAuth';
import { updateUserProfile } from '@services/auth/authService';

export const SettingsScreen = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile?.permissions?.notifications ?? true,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        recoveryContext: profile?.recoveryContext,
      });
      await refreshProfile();
    } finally {
      setIsSaving(false);
    }
  }, [displayName, profile?.recoveryContext, refreshProfile, user]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const handleToggleNotifications = useCallback(
    async (value: boolean) => {
      setNotificationsEnabled(value);
      Alert.alert(
        'Reminder',
        'Notification preferences sync with system settings. Adjust them in device settings if needed.',
      );
    },
    [],
  );

  return (
    <ScreenContainer scrollable testID="settings-screen">
      <AppText variant="h2">Settings</AppText>

      <View style={styles.section}>
        <AppText variant="h3">Profile</AppText>
        <AppText>Email: {profile?.email}</AppText>
        <TextInput
          style={styles.input}
          placeholder="Display name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <PrimaryButton label="Save profile" onPress={handleSaveProfile} isLoading={isSaving} />
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Notifications</AppText>
        <View style={styles.row}>
          <AppText>Daily check-in reminders</AppText>
          <Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} />
        </View>
      </View>

      <View style={styles.section}>
        <PrimaryButton label="Sign out" onPress={handleSignOut} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});


