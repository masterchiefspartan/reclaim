import type { Timestamp } from 'firebase/firestore';
import type { RecoverySituation, WhatTheyMiss, EmotionalState, SupportNeed } from './onboarding';

export type SubscriptionPlan = 'monthly' | 'annual' | 'trial';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'canceled' | 'expired';
  trialEndsAt?: Timestamp;
  renewedAt?: Timestamp;
}

/**
 * Legacy recovery context - kept for backwards compatibility
 * @deprecated Use RecoveryProfile instead
 */
export interface RecoveryContext {
  injuryDescription: string;
  surgeryDate?: string;
  biggestStruggle?: string;
}

/**
 * New recovery profile from agentic onboarding
 * Focuses on the PERSON and their emotional journey, not medical details
 */
export interface RecoveryProfile {
  // Their situation (context, not medical details)
  situation: RecoverySituation;
  situationDetail?: string;

  // What they want to reclaim - their emotional anchor
  whatTheyMiss: WhatTheyMiss[];
  customWhatTheyMiss?: string;

  // How they're doing emotionally (baseline)
  emotionalState: EmotionalState;

  // What they need from Re:Claim
  supportNeed: SupportNeed;

  // When they completed onboarding
  completedAt: Timestamp;
}

export interface UserStats {
  totalEntries: number;
  totalRecordingMinutes: number;
  streakDays: number;
  lastEntryDate?: Timestamp;
}

export interface UserPermissions {
  microphone: boolean;
  notifications: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  onboardingCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  /** @deprecated Use recoveryProfile instead */
  recoveryContext?: RecoveryContext;
  /** New agentic onboarding profile */
  recoveryProfile?: RecoveryProfile;
  subscription?: UserSubscription;
  stats?: UserStats;
  permissions?: UserPermissions;
}

export interface EditableProfileFields {
  displayName?: string;
  /** @deprecated Use recoveryProfile instead */
  recoveryContext?: RecoveryContext;
  recoveryProfile?: Partial<RecoveryProfile>;
}

/**
 * @deprecated Use NewOnboardingPayload instead
 */
export interface OnboardingPayload {
  displayName: string;
  recoveryContext: RecoveryContext;
  plan: SubscriptionPlan;
}

/**
 * Payload for the new agentic onboarding flow
 */
export interface NewOnboardingPayload {
  displayName: string;
  situation: RecoverySituation;
  situationDetail?: string;
  whatTheyMiss: WhatTheyMiss[];
  customWhatTheyMiss?: string;
  emotionalState: EmotionalState;
  supportNeed: SupportNeed;
}
