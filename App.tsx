import 'react-native-gesture-handler';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import { AppProviders } from '@/providers/AppProviders';
import { AppNavigator } from '@/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {
  // noop when splash screen already hidden
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowPreview: true,
  }),
});

export default function App() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => undefined);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
