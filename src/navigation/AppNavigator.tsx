import { useMemo } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import type { MainTabParamList, OnboardingStackParamList, RootStackParamList } from './types';
import { LoadingScreen } from '@screens/LoadingScreen';
import { useAppTheme } from '@hooks/useAppTheme';
import { useAuth } from '@hooks/useAuth';
import { OnboardingFlowScreen } from '@screens/onboarding/OnboardingFlowScreen';
import { SignUpScreen } from '@screens/onboarding/SignUpScreen';
import { EmailVerificationScreen } from '@screens/onboarding/EmailVerificationScreen';
import { PaywallScreen } from '@screens/onboarding/PaywallScreen';
import { ProfileSetupScreen } from '@screens/onboarding/ProfileSetupScreen';
import { PermissionsScreen } from '@screens/onboarding/PermissionsScreen';
import { HomeScreen } from '@screens/HomeScreen';
import { JournalListScreen } from '@screens/journal/JournalListScreen';
import { DashboardScreen } from '@screens/dashboard/DashboardScreen';
import { SettingsScreen } from '@screens/settings/SettingsScreen';
import { VoiceJournalScreen } from '@screens/voice/VoiceJournalScreen';
import { ChatJournalScreen } from '@screens/voice/ChatJournalScreen';
import { VoiceConversationScreen } from '@screens/voice/VoiceConversationScreen';
import { AIResponseScreen } from '@screens/voice/AIResponseScreen';
import { ProcessingScreen } from '@screens/voice/ProcessingScreen';
import { CelebrationScreen } from '@screens/voice/CelebrationScreen';
import { FrameworkSelectionScreen } from '@screens/voice/FrameworkSelectionScreen';
import { EntryDetailScreen } from '@screens/journal/EntryDetailScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const OnboardingNavigator = ({
  initialRouteName,
}: {
  initialRouteName: keyof OnboardingStackParamList;
}) => (
  <OnboardingStack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={initialRouteName}
  >
    <OnboardingStack.Screen name="Welcome" component={OnboardingFlowScreen} />
    <OnboardingStack.Screen name="SignUp" component={SignUpScreen} />
    <OnboardingStack.Screen name="EmailVerification" component={EmailVerificationScreen} />
    <OnboardingStack.Screen name="Paywall" component={PaywallScreen} />
    <OnboardingStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <OnboardingStack.Screen name="Permissions" component={PermissionsScreen} />
  </OnboardingStack.Navigator>
);

const MainTabs = () => {
  const { theme } = useAppTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Feather.glyphMap> = {
            HomeTab: 'home',
            ExploreTab: 'compass',
            JourneyTab: 'book',
            ProfileTab: 'user',
          };
          const name = iconMap[route.name as keyof MainTabParamList] ?? 'circle';
          return <Feather name={name} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tabs.Screen name="ExploreTab" component={DashboardScreen} options={{ title: 'Explore' }} />
      <Tabs.Screen name="JourneyTab" component={JournalListScreen} options={{ title: 'Journey' }} />
      <Tabs.Screen name="ProfileTab" component={SettingsScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
};

export const AppNavigator = () => {
  const { theme } = useAppTheme();
  const { status } = useAuth();

  const navigationTheme: NavigationTheme = useMemo(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        primary: theme.colors.primary,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'checking' ? (
          <RootStack.Screen name="Loading" component={LoadingScreen} />
        ) : (
          <>
            {status === 'authenticated' ? (
              <RootStack.Screen name="Main" component={MainTabs} />
            ) : (
              <RootStack.Screen
                name="Onboarding"
                // eslint-disable-next-line react/no-children-prop
                children={() => (
                  <OnboardingNavigator
                    initialRouteName={
                      status === 'email_verification'
                        ? 'EmailVerification'
                        : status === 'onboarding'
                          ? 'Paywall'
                          : status === 'permissions'
                            ? 'Permissions'
                            : 'Welcome'
                    }
                  />
                )}
              />
            )}
            <RootStack.Screen
              name="FrameworkSelection"
              component={FrameworkSelectionScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="VoiceJournal"
              component={VoiceJournalScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="ChatJournal"
              component={ChatJournalScreen}
              options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
            />
            <RootStack.Screen
              name="VoiceConversation"
              component={VoiceConversationScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <RootStack.Screen name="Processing" component={ProcessingScreen} />
            <RootStack.Screen
              name="AIResponse"
              component={AIResponseScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="Celebration"
              component={CelebrationScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen name="EntryDetail" component={EntryDetailScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
