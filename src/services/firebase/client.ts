import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

import { env } from '@config/env';

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
    _firebaseAuth = getAuth(_firebaseApp);
    _firestore = getFirestore(_firebaseApp);
    _firebaseStorage = getStorage(_firebaseApp);
    _cloudFunctions = getFunctions(_firebaseApp);
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
