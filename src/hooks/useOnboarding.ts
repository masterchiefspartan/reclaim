/**
 * useOnboarding Hook
 * Manages the onboarding flow state and profile data
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  OnboardingStep,
  OnboardingProfile,
  RecoverySituation,
  WhatTheyMiss,
  EmotionalState,
  SupportNeed,
} from '@/types/onboarding';

const STEPS: OnboardingStep[] = [
  'welcome',
  'name',
  'situation',
  'what_you_miss',
  'emotional_state',
  'support_need',
  'ready',
];

interface UseOnboardingReturn {
  // Current state
  currentStep: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  profile: Partial<OnboardingProfile>;
  isComplete: boolean;

  // Navigation
  goNext: () => void;
  goBack: () => void;
  canGoBack: boolean;
  canGoNext: boolean;

  // Profile setters
  setName: (name: string) => void;
  setSituation: (situation: RecoverySituation, detail?: string) => void;
  setWhatTheyMiss: (items: WhatTheyMiss[], custom?: string) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setSupportNeed: (need: SupportNeed) => void;

  // Completion
  completeOnboarding: () => OnboardingProfile | null;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({});

  const currentStep = STEPS[stepIndex];
  const totalSteps = STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  // Check if current step has required data to proceed
  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'name':
        return !!profile.name && profile.name.trim().length > 0;
      case 'situation':
        return !!profile.situation;
      case 'what_you_miss':
        return !!profile.whatTheyMiss && profile.whatTheyMiss.length > 0;
      case 'emotional_state':
        return !!profile.emotionalState;
      case 'support_need':
        return !!profile.supportNeed;
      case 'ready':
        return true;
      default:
        return false;
    }
  }, [currentStep, profile]);

  const canGoBack = stepIndex > 0 && currentStep !== 'ready';

  const goNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1 && canGoNext) {
      setStepIndex(prev => prev + 1);
    }
  }, [stepIndex, canGoNext]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  }, [stepIndex]);

  const setName = useCallback((name: string) => {
    setProfile(prev => ({ ...prev, name }));
  }, []);

  const setSituation = useCallback((situation: RecoverySituation, detail?: string) => {
    setProfile(prev => ({
      ...prev,
      situation,
      situationDetail: detail,
    }));
  }, []);

  const setWhatTheyMiss = useCallback((items: WhatTheyMiss[], custom?: string) => {
    setProfile(prev => ({
      ...prev,
      whatTheyMiss: items,
      customWhatTheyMiss: custom,
    }));
  }, []);

  const setEmotionalState = useCallback((emotionalState: EmotionalState) => {
    setProfile(prev => ({ ...prev, emotionalState }));
  }, []);

  const setSupportNeed = useCallback((supportNeed: SupportNeed) => {
    setProfile(prev => ({ ...prev, supportNeed }));
  }, []);

  const completeOnboarding = useCallback((): OnboardingProfile | null => {
    // Validate all required fields are present
    if (
      !profile.name ||
      !profile.situation ||
      !profile.whatTheyMiss ||
      !profile.emotionalState ||
      !profile.supportNeed
    ) {
      return null;
    }

    const completeProfile: OnboardingProfile = {
      name: profile.name,
      situation: profile.situation,
      situationDetail: profile.situationDetail,
      whatTheyMiss: profile.whatTheyMiss,
      customWhatTheyMiss: profile.customWhatTheyMiss,
      emotionalState: profile.emotionalState,
      supportNeed: profile.supportNeed,
      completedAt: new Date(),
    };

    return completeProfile;
  }, [profile]);

  const isComplete = currentStep === 'ready';

  return {
    currentStep,
    stepIndex,
    totalSteps,
    progress,
    profile,
    isComplete,
    goNext,
    goBack,
    canGoBack,
    canGoNext,
    setName,
    setSituation,
    setWhatTheyMiss,
    setEmotionalState,
    setSupportNeed,
    completeOnboarding,
  };
};
