import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { signUpWithEmail, signInWithEmail } from '@services/auth/authService';
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
  const [isSignInMode, setIsSignInMode] = useState(false);
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

    // Only check confirm password for sign up mode
    if (!isSignInMode && password !== confirmPassword) {
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
  }, [confirmPassword, email, navigation, password, refreshProfile, isSignInMode]);

  const handleSignIn = useCallback(async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signInWithEmail(email.trim(), password);
      await refreshProfile();
      // After sign in, auth state change will handle navigation
    } catch (err) {
      setError(getUserFriendlyMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, refreshProfile]);

  const toggleMode = () => {
    setIsSignInMode(!isSignInMode);
    setError('');
  };

  return (
    <OnboardingLayout
      eyebrow={isSignInMode ? 'Welcome back' : 'Create account'}
      title={isSignInMode ? 'Sign in' : 'Create your account'}
      subtitle={
        isSignInMode
          ? 'Sign in to continue your recovery journey.'
          : 'A few details to personalize your recovery experience.'
      }
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
          placeholder={isSignInMode ? 'Your password' : 'At least 6 characters'}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (error) setError('');
          }}
          autoComplete={isSignInMode ? 'password' : 'password-new'}
          textContentType={isSignInMode ? 'password' : 'newPassword'}
        />
      </View>

      {!isSignInMode && (
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
      )}

      {error ? (
        <View style={[styles.errorContainer, themedStyles.errorContainer]}>
          <AppText style={[styles.error, themedStyles.errorText]}>{error}</AppText>
        </View>
      ) : null}

      <PrimaryButton
        label={isSignInMode ? 'Sign in' : 'Create account'}
        onPress={isSignInMode ? handleSignIn : handleSignUp}
        isLoading={isLoading}
      />

      <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
        <AppText color={theme.colors.primary} style={styles.toggleText}>
          {isSignInMode ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
        </AppText>
      </TouchableOpacity>
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
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 15,
  },
});
