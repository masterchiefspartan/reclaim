import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { signUpWithEmail } from '@services/auth/authService';
import { useAuth } from '@hooks/useAuth';
import { getUserFriendlyMessage } from '@utils/errors';

export const SignUpScreen = ({ navigation }: OnboardingStackScreenProps<'SignUp'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();

  const validateInputs = (): string | null => {
    if (!email.trim()) {
      return 'Please enter your email address.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Please enter a password.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSignUp = useCallback(async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signUpWithEmail(email.trim(), password);
      await refreshProfile();
      navigation.navigate('EmailVerification');
    } catch (err) {
      // Use centralized error handling for user-friendly messages
      setError(getUserFriendlyMessage(err));
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
          onChangeText={text => {
            setEmail(text);
            if (error) setError('');
          }}
          autoComplete="email"
          textContentType="emailAddress"
        />
      </View>
      <View style={styles.field}>
        <AppText>Password</AppText>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="At least 6 characters"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (error) setError('');
          }}
          autoComplete="password-new"
          textContentType="newPassword"
        />
      </View>
      <View style={styles.field}>
        <AppText>Confirm Password</AppText>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Repeat password"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (error) setError('');
          }}
          autoComplete="password-new"
          textContentType="newPassword"
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <AppText style={styles.error}>{error}</AppText>
        </View>
      ) : null}

      <PrimaryButton label="Create account" onPress={handleSignUp} isLoading={isLoading} />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  error: {
    color: '#dc2626',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
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
});
