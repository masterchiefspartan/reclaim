import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import type { SubscriptionPlan } from '@/types/user';

export type RootStackParamList = {
  Loading: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  VoiceJournal: { mode: 'free' | 'guided' } | undefined;
  AIResponse: { entryId: string };
  EntryDetail: { entryId: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  ValueSlides: undefined;
  SignUp: undefined;
  EmailVerification: undefined;
  Paywall: undefined;
  ProfileSetup: { plan: SubscriptionPlan };
  Permissions: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  JournalTab: undefined;
  DashboardTab: undefined;
  SettingsTab: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type OnboardingStackScreenProps<Screen extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, Screen>;

export type MainTabScreenProps<Screen extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  Screen
>;
