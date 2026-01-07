import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { useAuth } from '@hooks/useAuth';

export const EmailVerificationScreen = ({
  navigation,
}: OnboardingStackScreenProps<'EmailVerification'>) => {
  const { user, refreshProfile } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = useCallback(async () => {
    if (!user) return;
    setIsChecking(true);
    setError('');
    try {
      await refreshProfile();
      if (user.emailVerified) {
        navigation.navigate('Paywall');
      } else {
        setError('Still waiting for verification. Tap the link in your email.');
      }
    } finally {
      setIsChecking(false);
    }
  }, [navigation, refreshProfile, user]);

  return (
    <OnboardingLayout
      title="Verify your email"
      subtitle="We sent a link to your inbox. Tap it to continue."
    >
      <View style={styles.content}>
        <AppText>
          We use email verification to keep your recovery data safe. If you can’t find the email,
          check spam or promotions folders.
        </AppText>
        {error ? <AppText style={styles.error}>{error}</AppText> : null}
        <PrimaryButton label="I've verified" onPress={handleContinue} isLoading={isChecking} />
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  error: {
    color: '#dc2626',
  },
});
