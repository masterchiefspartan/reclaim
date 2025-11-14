import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { signUpWithEmail } from '@services/auth/authService';
import { useAuth } from '@hooks/useAuth';

export const SignUpScreen = ({ navigation }: OnboardingStackScreenProps<'SignUp'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();

  const handleSignUp = useCallback(async () => {
    if (!email || !password || password !== confirmPassword) {
      setError('Please enter matching passwords and a valid email.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await signUpWithEmail(email.trim(), password);
      await refreshProfile();
      navigation.navigate('EmailVerification');
    } catch (err) {
      setError((err as Error).message ?? 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  }, [confirmPassword, email, navigation, password, refreshProfile]);

  return (
    <OnboardingLayout title="Create your account">
      <View style={styles.field}>
        <AppText>Email</AppText>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.field}>
        <AppText>Password</AppText>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.field}>
        <AppText>Confirm Password</AppText>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Repeat password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <PrimaryButton label="Create account" onPress={handleSignUp} isLoading={isLoading} />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
  },
});


