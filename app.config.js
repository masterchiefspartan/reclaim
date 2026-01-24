export default {
  expo: {
    name: 'Re:Claim',
    slug: 'RecoverVoiceApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    plugins: [
      'expo-secure-store',
      [
        'expo-av',
        {
          microphonePermission:
            'Re:Claim needs microphone access to record your voice journal entries.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#C85A8C',
        },
      ],
    ],
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FFF7FA',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.masterchiefspartan.recovervoice',
      buildNumber: '1',
      infoPlist: {
        NSMicrophoneUsageDescription:
          'Re:Claim needs microphone access to record your voice journal entries.',
        UIBackgroundModes: ['audio'],
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.masterchiefspartan.recovervoice',
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
  },
};
