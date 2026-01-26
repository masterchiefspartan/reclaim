import Constants from 'expo-constants';

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
};

export interface AppEnv {
  firebase: FirebaseConfig;
  // Note: AI service keys (Deepgram, Claude, ElevenLabs) are intentionally
  // NOT exposed client-side. They are only available in Firebase Functions.
  // Use getStreamingTokens() callable function to get temporary tokens.

  // Firebase App Check - prevents unauthorized API access
  appCheckSiteKey?: string;

  // DEV ONLY: Skip paywall/onboarding for testing
  devBypassPaywall?: boolean;
}

const getExtra = (): Record<string, string | undefined> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expoConfig = Constants.expoConfig ?? (Constants.manifest as Record<string, unknown>);
  return (expoConfig?.extra as Record<string, string | undefined>) ?? {};
};

const extra = getExtra();

const envValue = (key: string) => process.env[key] ?? extra[key];

const requireValue = (key: string): string => {
  const value = envValue(key);
  if (!value) {
    console.warn(`[env] Missing value for ${key}. Please set it in app config or .env.`);
    return '';
  }
  return value;
};

export const env: AppEnv = {
  firebase: {
    apiKey: requireValue('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: envValue('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: requireValue('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: envValue('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: envValue('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireValue('EXPO_PUBLIC_FIREBASE_APP_ID'),
    measurementId: envValue('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
  },
  // Firebase App Check site key (optional - enables App Check protection)
  appCheckSiteKey: envValue('EXPO_PUBLIC_APP_CHECK_SITE_KEY'),
  // DEV ONLY: Set to true to bypass paywall/onboarding
  devBypassPaywall: envValue('EXPO_PUBLIC_DEV_BYPASS_PAYWALL') === 'true',
};

export const assertFirebaseConfig = () => {
  const requiredKeys: Array<keyof FirebaseConfig> = ['apiKey', 'projectId', 'appId'];
  requiredKeys.forEach(key => {
    if (!env.firebase[key]) {
      throw new Error(`Missing Firebase configuration for ${key}`);
    }
  });
};
