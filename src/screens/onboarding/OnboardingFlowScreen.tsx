/**
 * OnboardingFlowScreen
 * The new agentic onboarding experience
 * "We are the mental side of recovery. Not physical."
 */

import { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { OnboardingCard } from '@components/onboarding/OnboardingCard';
import { useAppTheme } from '@hooks/useAppTheme';
import { useAuth } from '@hooks/useAuth';
import { useOnboarding } from '@hooks/useOnboarding';
import { saveNewOnboardingProfile } from '@services/auth/authService';
import {
  SITUATION_OPTIONS,
  WHAT_YOU_MISS_OPTIONS,
  EMOTIONAL_STATE_OPTIONS,
  SUPPORT_NEED_OPTIONS,
  type WhatTheyMiss,
} from '@/types/onboarding';
import type { OnboardingStackScreenProps } from '@navigation/types';

export const OnboardingFlowScreen = ({ navigation }: OnboardingStackScreenProps<'Welcome'>) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const {
    currentStep,
    profile,
    progress,
    canGoNext,
    canGoBack,
    goNext,
    goBack,
    setName,
    setSituation,
    setWhatTheyMiss,
    setEmotionalState,
    setSupportNeed,
    completeOnboarding,
  } = useOnboarding();

  // Local state for multi-select and saving
  const [selectedMissItems, setSelectedMissItems] = useState<WhatTheyMiss[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleMissItemToggle = (item: WhatTheyMiss) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMissItems(prev => {
      const newItems = prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item];
      setWhatTheyMiss(newItems);
      return newItems;
    });
  };

  const handleComplete = async () => {
    const completedProfile = completeOnboarding();
    if (!completedProfile) {
      Alert.alert('Missing Information', 'Please complete all steps before continuing.');
      return;
    }

    if (!user) {
      // Navigate to sign up screen instead of showing alert
      navigation.navigate('SignUp');
      return;
    }

    setIsSaving(true);

    try {
      // Save profile to Firestore
      await saveNewOnboardingProfile(user.uid, {
        displayName: completedProfile.name,
        situation: completedProfile.situation,
        situationDetail: completedProfile.situationDetail,
        whatTheyMiss: completedProfile.whatTheyMiss,
        customWhatTheyMiss: completedProfile.customWhatTheyMiss,
        emotionalState: completedProfile.emotionalState,
        supportNeed: completedProfile.supportNeed,
      });

      // Refresh the auth profile so status updates
      await refreshProfile();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to paywall (subscription selection)
      navigation.navigate('Paywall');
    } catch (error) {
      console.error('[Onboarding] Failed to save profile:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Something went wrong', "We couldn't save your profile. Please try again.", [
        { text: 'OK' },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h1" style={styles.welcomeTitle}>
              {"Recovery isn't\njust physical."}
            </AppText>
            <AppText style={styles.welcomeSubtitle} color={theme.colors.textSecondary}>
              Re:Claim is here for the mental side — the frustration, the fear, the fight to feel
              like yourself again.
            </AppText>
          </View>
        );

      case 'name':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.stepTitle}>
              {"First, what's your name?"}
            </AppText>
            <AppText style={styles.stepSubtitle} color={theme.colors.textSecondary}>
              We see you as a person first, not a patient.
            </AppText>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Your first name"
              placeholderTextColor={theme.colors.textSecondary}
              value={profile.name || ''}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={goNext}
            />
          </View>
        );

      case 'situation':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.stepTitle}>
              What brings you to{'\n'}Re:Claim, {profile.name}?
            </AppText>
            <View style={styles.cardsContainer}>
              {SITUATION_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  label={option.label}
                  selected={profile.situation === option.id}
                  onPress={() => setSituation(option.id)}
                />
              ))}
            </View>
          </View>
        );

      case 'what_you_miss':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.stepTitle}>
              What do you miss{'\n'}most right now?
            </AppText>
            <AppText style={styles.stepSubtitle} color={theme.colors.textSecondary}>
              {"Select all that apply. This is what you're working to reclaim."}
            </AppText>
            <View style={styles.cardsContainer}>
              {WHAT_YOU_MISS_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  selected={selectedMissItems.includes(option.id)}
                  onPress={() => handleMissItemToggle(option.id)}
                />
              ))}
            </View>
          </View>
        );

      case 'emotional_state':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.stepTitle}>
              How are you holding{'\n'}up emotionally?
            </AppText>
            <AppText style={styles.stepSubtitle} color={theme.colors.textSecondary}>
              No judgment. Wherever you are is okay.
            </AppText>
            <View style={styles.emotionalContainer}>
              {EMOTIONAL_STATE_OPTIONS.map(option => (
                <View key={option.id} style={styles.emotionalOption}>
                  <OnboardingCard
                    emoji={option.emoji}
                    label={option.label}
                    selected={profile.emotionalState === option.id}
                    onPress={() => setEmotionalState(option.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        );

      case 'support_need':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.stepTitle}>
              What would help you{'\n'}most right now?
            </AppText>
            <View style={styles.cardsContainer}>
              {SUPPORT_NEED_OPTIONS.map(option => (
                <OnboardingCard
                  key={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  selected={profile.supportNeed === option.id}
                  onPress={() => setSupportNeed(option.id)}
                />
              ))}
            </View>
          </View>
        );

      case 'ready':
        return (
          <View style={styles.stepContent}>
            <AppText variant="h2" style={styles.readyTitle}>
              {`${profile.name}, I'm here\nfor you.`}
            </AppText>
            <AppText style={styles.readyMessage} color={theme.colors.textSecondary}>
              {
                'Recovery is hard. The frustration, the waiting, the feeling of losing yourself — I get it.'
              }
            </AppText>
            <AppText style={styles.readyMessage} color={theme.colors.textSecondary}>
              {"Let's start reclaiming your life, one conversation at a time."}
            </AppText>
          </View>
        );

      default:
        return null;
    }
  };

  const getButtonLabel = () => {
    if (currentStep === 'ready' && isSaving) {
      return 'Saving...';
    }
    switch (currentStep) {
      case 'welcome':
        return "I'm Ready";
      case 'ready':
        return 'Start My First Entry';
      default:
        return 'Continue';
    }
  };

  const handleButtonPress = () => {
    if (currentStep === 'ready') {
      handleComplete();
    } else {
      goNext();
    }
  };

  const isButtonDisabled = !canGoNext || isSaving;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress bar - hidden on welcome and ready screens */}
      {currentStep !== 'welcome' && currentStep !== 'ready' && (
        <View style={[styles.progressContainer, { paddingTop: insets.top + 16 }]}>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: currentStep === 'welcome' || currentStep === 'ready' ? insets.top + 60 : 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {canGoBack && (
          <PrimaryButton
            label="Back"
            onPress={goBack}
            // Use a ghost style for back button
          />
        )}
        <View style={styles.primaryButtonContainer}>
          <PrimaryButton
            label={getButtonLabel()}
            onPress={handleButtonPress}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    marginTop: 24,
  },
  container: {
    flex: 1,
  },
  emotionalContainer: {
    marginTop: 24,
  },
  emotionalOption: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  nameInput: {
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 18,
    height: 56,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  primaryButtonContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
  },
  progressFill: {
    borderRadius: 4,
    height: '100%',
  },
  progressTrack: {
    borderRadius: 4,
    height: 4,
    overflow: 'hidden',
  },
  readyMessage: {
    fontSize: 17,
    lineHeight: 26,
    marginTop: 16,
  },
  readyTitle: {
    fontSize: 28,
    lineHeight: 36,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  stepTitle: {
    fontSize: 26,
    lineHeight: 34,
  },
  welcomeSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    marginTop: 16,
  },
  welcomeTitle: {
    fontSize: 34,
    lineHeight: 42,
  },
});
