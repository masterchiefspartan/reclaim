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
  deepgramApiKey?: string;
  claudeApiKey?: string;
  elevenLabsApiKey?: string;
}

const getExtra = (): Record<string, string | undefined> => {
  const expoConfig = Constants.expoConfig ?? (Constants.manifest as any);
  return expoConfig?.extra ?? {};
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
  deepgramApiKey: envValue('EXPO_PUBLIC_DEEPGRAM_API_KEY'),
  claudeApiKey: envValue('EXPO_PUBLIC_CLAUDE_API_KEY'),
  elevenLabsApiKey: envValue('EXPO_PUBLIC_ELEVENLABS_API_KEY'),
};

export const assertFirebaseConfig = () => {
  const requiredKeys: Array<keyof FirebaseConfig> = ['apiKey', 'projectId', 'appId'];
  requiredKeys.forEach((key) => {
    if (!env.firebase[key]) {
      throw new Error(`Missing Firebase configuration for ${key}`);
    }
  });
};

