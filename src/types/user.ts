import type { Timestamp } from 'firebase/firestore';

export type SubscriptionPlan = 'monthly' | 'annual' | 'trial';

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'canceled' | 'expired';
  trialEndsAt?: Timestamp;
  renewedAt?: Timestamp;
}

export interface RecoveryContext {
  injuryDescription: string;
  surgeryDate?: string;
  biggestStruggle?: string;
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
  recoveryContext?: RecoveryContext;
  subscription?: UserSubscription;
  stats?: UserStats;
  permissions?: UserPermissions;
}

export interface EditableProfileFields {
  displayName?: string;
  recoveryContext?: RecoveryContext;
}

export interface OnboardingPayload {
  displayName: string;
  recoveryContext: RecoveryContext;
  plan: SubscriptionPlan;
}


