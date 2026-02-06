import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import type { SubscriptionPlan } from '@/types/user';
import type { FrameworkId, PerspectiveId } from '@/types/frameworks';

export type RootStackParamList = {
  Loading: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  FrameworkSelection: undefined;
  VoiceJournal:
    | {
        mode: 'free' | 'guided';
        frameworkId?: FrameworkId;
        perspectiveId?: PerspectiveId;
      }
    | undefined;
  ChatJournal: undefined;
  VoiceConversation: undefined;
  Processing: { entryId: string };
  AIResponse: { entryId: string };
  Celebration: { entryId: string };
  EntryDetail: { entryId: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  EmailVerification: undefined;
  Paywall: undefined;
  ProfileSetup: { plan: SubscriptionPlan };
  Permissions: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  JourneyTab: undefined;
  ProfileTab: undefined;
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
