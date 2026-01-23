import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import RevenueCatUI from 'react-native-purchases-ui';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { updateUserProfile } from '@services/auth/authService';
import { useAppTheme } from '@hooks/useAppTheme';
import { logger } from '@utils/logger';

export const SettingsScreen = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { theme } = useAppTheme();
  const { isSubscribed, isTrialing, status, expirationDate, willRenew, openManagement } =
    useSubscription();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile?.permissions?.notifications ?? true
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
      Alert.alert('Success', 'Profile updated successfully');
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [displayName, profile?.recoveryContext, refreshProfile, user]);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }, [signOut]);

  const handleToggleNotifications = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    Alert.alert(
      'Reminder',
      'Notification preferences sync with system settings. Adjust them in device settings if needed.'
    );
  }, []);

  // Open RevenueCat Customer Center
  const handleOpenCustomerCenter = useCallback(async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error) {
      logger.error('Failed to open Customer Center', { error });
      // Fallback to store management
      openManagement();
    }
  }, [openManagement]);

  // Format expiration date
  const formattedExpiration = expirationDate
    ? expirationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Get subscription status text
  const getSubscriptionStatusText = () => {
    if (!isSubscribed && !isTrialing) return 'No active subscription';
    if (isTrialing) return 'Free Trial';
    if (status === 'canceled') return 'Canceled (active until expiration)';
    if (status === 'grace_period') return 'Payment Issue - Please update payment';
    return 'Active';
  };

  return (
    <ScreenContainer scrollable testID="settings-screen">
      <AppText variant="h2">Settings</AppText>

      {/* Subscription Section */}
      <View style={styles.section}>
        <AppText variant="h3">Subscription</AppText>

        <View
          style={[
            styles.subscriptionCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {/* Status */}
          <View style={styles.subscriptionRow}>
            <AppText color={theme.colors.textSecondary}>Status</AppText>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      isSubscribed || isTrialing ? theme.colors.secondary : theme.colors.error,
                  },
                ]}
              />
              <AppText
                variant="body"
                color={isSubscribed || isTrialing ? theme.colors.secondary : theme.colors.error}
              >
                {getSubscriptionStatusText()}
              </AppText>
            </View>
          </View>

          {/* Expiration */}
          {formattedExpiration && (
            <View style={styles.subscriptionRow}>
              <AppText color={theme.colors.textSecondary}>
                {willRenew ? 'Renews' : 'Expires'}
              </AppText>
              <AppText>{formattedExpiration}</AppText>
            </View>
          )}

          {/* Manage Subscription Button */}
          <Pressable
            onPress={handleOpenCustomerCenter}
            style={[styles.manageButton, { backgroundColor: theme.colors.muted }]}
          >
            <Feather name="credit-card" size={18} color={theme.colors.text} />
            <AppText style={styles.manageButtonText}>Manage Subscription</AppText>
            <Feather name="chevron-right" size={18} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <AppText variant="h3">Profile</AppText>
        <View style={styles.infoRow}>
          <Feather name="mail" size={18} color={theme.colors.textSecondary} />
          <AppText color={theme.colors.textSecondary}>{profile?.email}</AppText>
        </View>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Display name"
          placeholderTextColor={theme.colors.textSecondary}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <PrimaryButton label="Save Profile" onPress={handleSaveProfile} isLoading={isSaving} />
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <AppText variant="h3">Notifications</AppText>
        <View style={styles.row}>
          <View style={styles.rowContent}>
            <AppText>Daily check-in reminders</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              Get reminded to journal each day
            </AppText>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ true: theme.colors.primary }}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <AppText variant="h3">Support</AppText>

        <SettingsLink
          icon="help-circle"
          label="Help & FAQ"
          onPress={() => Alert.alert('Coming Soon', 'Help documentation coming soon.')}
          theme={theme}
        />

        <SettingsLink
          icon="message-square"
          label="Contact Support"
          onPress={() => Alert.alert('Contact Support', 'Email us at support@reclaim.app')}
          theme={theme}
        />

        <SettingsLink
          icon="file-text"
          label="Privacy Policy"
          onPress={() => Alert.alert('Coming Soon', 'Privacy policy link coming soon.')}
          theme={theme}
        />

        <SettingsLink
          icon="book"
          label="Terms of Service"
          onPress={() => Alert.alert('Coming Soon', 'Terms of service link coming soon.')}
          theme={theme}
        />
      </View>

      {/* Sign Out Section */}
      <View style={styles.section}>
        <PrimaryButton label="Sign Out" onPress={handleSignOut} />
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.versionText}>
          Re:Claim v1.0.0
        </AppText>
      </View>
    </ScreenContainer>
  );
};

// Settings Link Component
interface SettingsLinkProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ icon, label, onPress, theme }) => (
  <Pressable
    onPress={onPress}
    style={[styles.settingsLink, { borderBottomColor: theme.colors.border }]}
  >
    <Feather name={icon} size={20} color={theme.colors.textSecondary} />
    <AppText style={styles.settingsLinkText}>{label}</AppText>
    <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
  </Pressable>
);

const styles = StyleSheet.create({
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    padding: 12,
  },
  manageButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    padding: 12,
  },
  manageButtonText: {
    flex: 1,
    fontWeight: '500',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  section: {
    gap: 12,
    marginTop: 24,
  },
  settingsLink: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  settingsLinkText: {
    flex: 1,
  },
  statusBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  subscriptionCard: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  subscriptionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionText: {
    marginTop: 8,
    textAlign: 'center',
  },
});
