import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  FirestoreError,
  runTransaction,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirestoreDb } from '@services/firebase/client';
import type {
  EditableProfileFields,
  OnboardingPayload,
  UserPermissions,
  UserProfile,
  UserStats,
  UserSubscription,
} from '@/types/user';

const usersCollection = 'users';

export const signUpWithEmail = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  if (credential.user && !credential.user.emailVerified) {
    await sendEmailVerification(credential.user);
  }
  return credential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return credential.user;
};

export const signOut = () => firebaseSignOut(getFirebaseAuth());

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const ref = doc(getFirestoreDb(), usersCollection, uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as UserProfile;
};

export const upsertUserProfile = async (user: User, overrides?: Partial<UserProfile>) => {
  const ref = doc(getFirestoreDb(), usersCollection, user.uid);
  const now = serverTimestamp();
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email ?? '',
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    },
    { merge: true },
  );
};

export const saveOnboardingProfile = async (uid: string, payload: OnboardingPayload) => {
  const ref = doc(getFirestoreDb(), usersCollection, uid);
  await updateDoc(ref, {
    displayName: payload.displayName,
    recoveryContext: payload.recoveryContext,
    onboardingCompleted: true,
    subscription: {
      plan: payload.plan,
      status: payload.plan === 'trial' ? 'trialing' : 'active',
    } satisfies UserSubscription,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserPermissions = async (uid: string, permissions: UserPermissions) => {
  const ref = doc(getFirestoreDb(), usersCollection, uid);
  await updateDoc(ref, {
    permissions,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserProfile = async (uid: string, updates: EditableProfileFields) => {
  const ref = doc(getFirestoreDb(), usersCollection, uid);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const updateDisplayName = async (user: User, displayName: string) => {
  await firebaseUpdateProfile(user, { displayName });
  await updateUserProfile(user.uid, { displayName });
};

export const incrementUserStats = async (uid: string, delta: Partial<UserStats>) => {
  const ref = doc(getFirestoreDb(), usersCollection, uid);
  try {
    await runTransaction(getFirestoreDb(), async (transaction) => {
      const snapshot = await transaction.get(ref);
      const stats = (snapshot.data()?.stats ?? {}) as UserStats;
      const nextStats: UserStats = {
        totalEntries: (stats.totalEntries ?? 0) + (delta.totalEntries ?? 0),
        totalRecordingMinutes:
          (stats.totalRecordingMinutes ?? 0) + (delta.totalRecordingMinutes ?? 0),
        streakDays: delta.streakDays ?? stats.streakDays ?? 0,
        lastEntryDate: delta.lastEntryDate ?? stats.lastEntryDate,
      };

      transaction.update(ref, {
        stats: nextStats,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    const err = error as FirestoreError;
    console.error('Failed to increment stats', err);
  }
};


