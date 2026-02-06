/**
 * SettingsScreen — Apple Glass Aesthetic
 * ========================================
 * Clean settings with glass cards, subscription management,
 * and Apple-style grouped list rows.
 */
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { GlassCard } from '@components/common/GlassCard';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { updateUserProfile } from '@services/auth/authService';
import { useAppTheme } from '@hooks/useAppTheme';

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

  const formattedExpiration = expirationDate
    ? expirationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const getSubscriptionStatusText = () => {
    if (!isSubscribed && !isTrialing) return 'No active subscription';
    if (isTrialing) return 'Free Trial';
    if (status === 'canceled') return 'Canceled (active until expiration)';
    if (status === 'grace_period') return 'Payment Issue';
    return 'Active';
  };

  return (
    <ScreenContainer scrollable testID="settings-screen">
      <AppText variant="largeTitle" color={theme.colors.text} style={styles.screenTitle}>
        Settings
      </AppText>

      {/* Subscription */}
      <View style={styles.section}>
        <AppText variant="footnote" color={theme.colors.textTertiary} style={styles.sectionLabel}>
          SUBSCRIPTION
        </AppText>
        <GlassCard style={styles.cardContent} blurEnabled={false}>
          <View style={styles.subscriptionRow}>
            <AppText variant="subheadline" color={theme.colors.textSecondary}>
              Status
            </AppText>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      isSubscribed || isTrialing ? theme.colors.success : theme.colors.textMuted,
                  },
                ]}
              />
              <AppText
                variant="subheadline"
                color={
                  isSubscribed || isTrialing ? theme.colors.success : theme.colors.textSecondary
                }
              >
                {getSubscriptionStatusText()}
              </AppText>
            </View>
          </View>

          {formattedExpiration && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
              <View style={styles.subscriptionRow}>
                <AppText variant="subheadline" color={theme.colors.textSecondary}>
                  {willRenew ? 'Renews' : 'Expires'}
                </AppText>
                <AppText variant="subheadline" color={theme.colors.text}>
                  {formattedExpiration}
                </AppText>
              </View>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

          <Pressable
            onPress={openManagement}
            style={styles.manageRow}
            accessibilityRole="button"
            accessibilityLabel="Manage Subscription"
          >
            <Feather name="credit-card" size={18} color={theme.colors.primary} />
            <AppText variant="subheadline" color={theme.colors.primary} style={styles.manageText}>
              Manage Subscription
            </AppText>
            <Feather name="chevron-right" size={16} color={theme.colors.textMuted} />
          </Pressable>
        </GlassCard>
      </View>

      {/* Profile */}
      <View style={styles.section}>
        <AppText variant="footnote" color={theme.colors.textTertiary} style={styles.sectionLabel}>
          PROFILE
        </AppText>
        <GlassCard style={styles.cardContent} blurEnabled={false}>
          <View style={styles.infoRow}>
            <Feather name="mail" size={16} color={theme.colors.textTertiary} />
            <AppText variant="subheadline" color={theme.colors.textSecondary}>
              {profile?.email}
            </AppText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.fillQuaternary,
                color: theme.colors.text,
              },
            ]}
            placeholder="Display name"
            placeholderTextColor={theme.colors.textMuted}
            value={displayName}
            onChangeText={setDisplayName}
          />
          <PrimaryButton
            label="Save Profile"
            onPress={handleSaveProfile}
            isLoading={isSaving}
            size="md"
          />
        </GlassCard>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <AppText variant="footnote" color={theme.colors.textTertiary} style={styles.sectionLabel}>
          NOTIFICATIONS
        </AppText>
        <GlassCard style={styles.cardContent} blurEnabled={false}>
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <AppText variant="body" color={theme.colors.text}>
                Daily check-in reminders
              </AppText>
              <AppText variant="footnote" color={theme.colors.textTertiary}>
                Get reminded to journal each day
              </AppText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ true: theme.colors.primary, false: theme.colors.fillTertiary }}
            />
          </View>
        </GlassCard>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <AppText variant="footnote" color={theme.colors.textTertiary} style={styles.sectionLabel}>
          SUPPORT
        </AppText>
        <GlassCard style={styles.linkListCard} blurEnabled={false}>
          <SettingsLink
            icon="help-circle"
            label="Help & FAQ"
            onPress={() => Alert.alert('Coming Soon', 'Help documentation coming soon.')}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <SettingsLink
            icon="message-square"
            label="Contact Support"
            onPress={() => Alert.alert('Contact Support', 'Email us at support@reclaim.app')}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <SettingsLink
            icon="file-text"
            label="Privacy Policy"
            onPress={() => Alert.alert('Coming Soon', 'Privacy policy link coming soon.')}
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <SettingsLink
            icon="book"
            label="Terms of Service"
            onPress={() => Alert.alert('Coming Soon', 'Terms of service link coming soon.')}
            theme={theme}
          />
        </GlassCard>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <PrimaryButton label="Sign Out" onPress={handleSignOut} variant="secondary" />
        <AppText variant="caption2" color={theme.colors.textMuted} style={styles.versionText}>
          Re:Claim v1.0.0
        </AppText>
      </View>

      <View style={styles.bottomPad} />
    </ScreenContainer>
  );
};

// ============================================
// Sub-Components
// ============================================

interface SettingsLinkProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const SettingsLink = ({ icon, label, onPress, theme }: SettingsLinkProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
    accessibilityRole="button"
  >
    <Feather name={icon} size={18} color={theme.colors.textSecondary} />
    <AppText variant="body" color={theme.colors.text} style={styles.linkText}>
      {label}
    </AppText>
    <Feather name="chevron-right" size={16} color={theme.colors.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  bottomPad: {
    height: 40,
  },
  cardContent: {
    gap: 12,
    padding: 16,
  },
  divider: {
    height: 0.5,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderRadius: 10,
    fontSize: 17,
    padding: 12,
  },
  linkListCard: {
    padding: 0,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkText: {
    flex: 1,
  },
  manageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  manageText: {
    flex: 1,
  },
  screenTitle: {
    paddingTop: 8,
  },
  section: {
    marginTop: 28,
  },
  sectionLabel: {
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
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
  subscriptionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    gap: 2,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  versionText: {
    marginTop: 8,
    textAlign: 'center',
  },
});
