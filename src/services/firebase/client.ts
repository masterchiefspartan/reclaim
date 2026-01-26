import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { env } from '@config/env';

// Import React Native persistence helper
// This is a dynamic import to avoid bundling issues
let getReactNativePersistence: ((storage: typeof ReactNativeAsyncStorage) => unknown) | null = null;
try {
  // Firebase v10+ exports this from the main auth package
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const authModule = require('firebase/auth');
  if (authModule.getReactNativePersistence) {
    getReactNativePersistence = authModule.getReactNativePersistence;
  }
} catch {
  console.warn('[Firebase] React Native persistence not available');
}

let _firebaseApp: FirebaseApp | null = null;
let _firebaseAuth: Auth | null = null;
let _firestore: Firestore | null = null;
let _firebaseStorage: FirebaseStorage | null = null;
let _cloudFunctions: Functions | null = null;

export const isFirebaseConfigured = (): boolean => {
  return !!(env.firebase.apiKey && env.firebase.projectId && env.firebase.appId);
};

const createFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    console.warn('[Firebase] Not configured. Running in demo mode.');
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(env.firebase);
};

try {
  _firebaseApp = createFirebaseApp();
  if (_firebaseApp) {
    // Initialize Auth with AsyncStorage persistence for secure token storage
    // This ensures auth tokens are persisted securely across app restarts
    try {
      if (getReactNativePersistence) {
        // Use React Native specific persistence with AsyncStorage
        _firebaseAuth = initializeAuth(_firebaseApp, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage) as never,
        });
        console.log('[Firebase] Auth initialized with AsyncStorage persistence');
      } else {
        // Fallback to default auth (memory persistence)
        _firebaseAuth = getAuth(_firebaseApp);
        // eslint-disable-next-line no-console
        console.warn('[Firebase] Auth initialized without persistent storage');
      }
    } catch (_) {
      // Fallback: Auth might already be initialized (hot reload case)
      // This can happen during development with Fast Refresh
      // eslint-disable-next-line no-console
      console.warn('[Firebase] Auth may already be initialized, using getAuth');
      _firebaseAuth = getAuth(_firebaseApp);
    }

    _firestore = getFirestore(_firebaseApp);
    _firebaseStorage = getStorage(_firebaseApp);
    _cloudFunctions = getFunctions(_firebaseApp);

    // Initialize App Check if configured (prevents unauthorized API access)
    // Note: Requires setup in Firebase Console and reCAPTCHA Enterprise
    if (env.appCheckSiteKey) {
      try {
        initializeAppCheck(_firebaseApp, {
          provider: new ReCaptchaEnterpriseProvider(env.appCheckSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
        console.log('[Firebase] App Check initialized');
      } catch (appCheckError) {
        console.warn('[Firebase] App Check initialization failed:', appCheckError);
      }
    }
  }
} catch (error) {
  console.warn('[Firebase] Initialization failed:', error);
}

// Export nullable versions for optional checks
export const firebaseAuth = _firebaseAuth;
export const firestore = _firestore;
export const firebaseStorage = _firebaseStorage;
export const cloudFunctions = _cloudFunctions;
export const app = _firebaseApp;

// Helper functions that throw if Firebase is not configured
const assertConfigured = <T>(value: T | null, name: string): T => {
  if (!value) {
    throw new Error(`Firebase ${name} is not configured. Please set up your .env file.`);
  }
  return value;
};

export const getFirebaseAuth = (): Auth => assertConfigured(_firebaseAuth, 'Auth');
export const getFirestoreDb = (): Firestore => assertConfigured(_firestore, 'Firestore');
export const getFirebaseStorage = (): FirebaseStorage =>
  assertConfigured(_firebaseStorage, 'Storage');
export const getCloudFunctions = (): Functions => assertConfigured(_cloudFunctions, 'Functions');
