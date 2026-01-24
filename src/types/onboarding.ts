/**
 * Onboarding Types
 * Re:Claim - The Mental Side of Recovery
 *
 * These types focus on understanding the PERSON and their emotional journey,
 * not medical details. We're here for the mental side, not the physical.
 */

/**
 * What brings someone to Re:Claim
 */
export type RecoverySituation = 'surgery' | 'injury' | 'chronic_condition' | 'supporting_someone';

/**
 * What they miss most - what they want to RECLAIM
 */
export type WhatTheyMiss =
  | 'being_active'
  | 'time_with_loved_ones'
  | 'feeling_like_myself'
  | 'independence'
  | 'custom';

/**
 * Current emotional state
 */
export type EmotionalState = 'struggling' | 'getting_by' | 'fighting_through' | 'hopeful';

/**
 * What kind of support they need most
 */
export type SupportNeed =
  | 'space_to_vent'
  | 'staying_positive'
  | 'someone_who_understands'
  | 'tracking_progress';

/**
 * The user's onboarding profile
 * Minimal but meaningful - enough to personalize without interrogating
 */
export interface OnboardingProfile {
  // Who they are
  name: string;

  // Their situation (not medical details, just context)
  situation: RecoverySituation;
  situationDetail?: string; // Optional brief description

  // What they want to reclaim - their emotional anchor
  whatTheyMiss: WhatTheyMiss[];
  customWhatTheyMiss?: string; // If they chose "custom"

  // How they're doing emotionally
  emotionalState: EmotionalState;

  // What they need from Re:Claim
  supportNeed: SupportNeed;

  // Metadata
  completedAt: Date;
}

/**
 * Onboarding step tracking
 */
export type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'situation'
  | 'what_you_miss'
  | 'emotional_state'
  | 'support_need'
  | 'ready';

/**
 * Onboarding state machine
 */
export interface OnboardingState {
  currentStep: OnboardingStep;
  profile: Partial<OnboardingProfile>;
  isComplete: boolean;
}

/**
 * Display data for the "what you miss" options
 */
export const WHAT_YOU_MISS_OPTIONS: Array<{
  id: WhatTheyMiss;
  emoji: string;
  label: string;
}> = [
  { id: 'being_active', emoji: '🏃', label: 'Being active and free' },
  { id: 'time_with_loved_ones', emoji: '👨‍👩‍👧', label: 'Doing things with people I love' },
  { id: 'feeling_like_myself', emoji: '🙂', label: 'Feeling like myself' },
  { id: 'independence', emoji: '💪', label: 'My independence' },
  { id: 'custom', emoji: '✨', label: 'Something else...' },
];

/**
 * Display data for emotional state options
 */
export const EMOTIONAL_STATE_OPTIONS: Array<{
  id: EmotionalState;
  emoji: string;
  label: string;
}> = [
  { id: 'struggling', emoji: '😔', label: 'Struggling' },
  { id: 'getting_by', emoji: '😐', label: 'Getting by' },
  { id: 'fighting_through', emoji: '💪', label: 'Fighting through' },
  { id: 'hopeful', emoji: '😊', label: 'Hopeful' },
];

/**
 * Display data for support need options
 */
export const SUPPORT_NEED_OPTIONS: Array<{
  id: SupportNeed;
  emoji: string;
  label: string;
}> = [
  { id: 'space_to_vent', emoji: '💭', label: 'A space to vent and process' },
  { id: 'staying_positive', emoji: '☀️', label: 'Help staying positive' },
  { id: 'someone_who_understands', emoji: '🤝', label: 'Someone who understands' },
  { id: 'tracking_progress', emoji: '📈', label: 'Seeing my emotional progress' },
];

/**
 * Display data for situation options
 */
export const SITUATION_OPTIONS: Array<{
  id: RecoverySituation;
  label: string;
  sublabel: string;
}> = [
  { id: 'surgery', label: 'Recovering from surgery', sublabel: '' },
  { id: 'injury', label: 'Dealing with an injury', sublabel: '' },
  { id: 'chronic_condition', label: 'Managing a chronic condition', sublabel: '' },
  { id: 'supporting_someone', label: 'Supporting someone in recovery', sublabel: '' },
];
