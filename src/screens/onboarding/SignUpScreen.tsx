import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { signUpWithEmail } from '@services/auth/authService';
import { useAuth } from '@hooks/useAuth';
import { getUserFriendlyMessage } from '@utils/errors';
import { useAppTheme } from '@hooks/useAppTheme';

export const SignUpScreen = ({ navigation }: OnboardingStackScreenProps<'SignUp'>) => {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const themedStyles = useMemo(
    () =>
      StyleSheet.create({
        errorContainer: {
          backgroundColor: theme.colors.muted,
          borderColor: theme.colors.border,
        },
        errorText: {
          color: theme.colors.error,
        },
        input: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          color: theme.colors.text,
        },
      }),
    [theme]
  );

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
    <OnboardingLayout
      eyebrow="Create account"
      title="Create your account"
      subtitle="A few details to personalize your recovery experience."
    >
      <View style={styles.field}>
        <AppText>Email</AppText>
        <TextInput
          style={[styles.input, themedStyles.input]}
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
          style={[styles.input, themedStyles.input]}
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
          style={[styles.input, themedStyles.input]}
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
        <View style={[styles.errorContainer, themedStyles.errorContainer]}>
          <AppText style={[styles.error, themedStyles.errorText]}>{error}</AppText>
        </View>
      ) : null}

      <PrimaryButton label="Create account" onPress={handleSignUp} isLoading={isLoading} />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
  },
  errorContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  field: {
    gap: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
  },
});
