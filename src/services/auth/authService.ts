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
  runTransaction,
} from 'firebase/firestore';

import { getFirebaseAuth, getFirestoreDb } from '@services/firebase/client';
import { withErrorHandling, silentAsync } from '@utils/errors';
import type {
  EditableProfileFields,
  NewOnboardingPayload,
  OnboardingPayload,
  UserPermissions,
  UserProfile,
  UserStats,
  UserSubscription,
} from '@/types/user';

const usersCollection = 'users';

/**
 * Creates a new user account with email and password
 * @throws AppError with user-friendly message on failure
 */
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  return withErrorHandling(
    'signUpWithEmail',
    async () => {
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      if (credential.user && !credential.user.emailVerified) {
        await sendEmailVerification(credential.user);
      }
      return credential.user;
    },
    { email }
  );
};

/**
 * Signs in an existing user with email and password
 * @throws AppError with user-friendly message on failure
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  return withErrorHandling(
    'signInWithEmail',
    async () => {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      return credential.user;
    },
    { email }
  );
};

/**
 * Signs out the current user
 * @throws AppError with user-friendly message on failure
 */
export const signOut = (): Promise<void> => {
  return withErrorHandling('signOut', () => firebaseSignOut(getFirebaseAuth()));
};

/**
 * Fetches user profile from Firestore
 * @returns UserProfile or null if not found
 * @throws AppError on database errors
 */
export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  return withErrorHandling(
    'fetchUserProfile',
    async () => {
      const ref = doc(getFirestoreDb(), usersCollection, uid);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        return null;
      }
      return snapshot.data() as UserProfile;
    },
    { uid }
  );
};

/**
 * Creates or updates user profile in Firestore
 * @throws AppError on database errors
 */
export const upsertUserProfile = async (
  user: User,
  overrides?: Partial<UserProfile>
): Promise<void> => {
  return withErrorHandling(
    'upsertUserProfile',
    async () => {
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
        { merge: true }
      );
    },
    { uid: user.uid }
  );
};

/**
 * Saves onboarding profile data (legacy)
 * @deprecated Use saveNewOnboardingProfile instead
 * @throws AppError on database errors
 */
export const saveOnboardingProfile = async (
  uid: string,
  payload: OnboardingPayload
): Promise<void> => {
  return withErrorHandling(
    'saveOnboardingProfile',
    async () => {
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
    },
    { uid }
  );
};

/**
 * Saves the new agentic onboarding profile data
 * Focuses on the person and their emotional journey
 * @throws AppError on database errors
 */
export const saveNewOnboardingProfile = async (
  uid: string,
  payload: NewOnboardingPayload
): Promise<void> => {
  return withErrorHandling(
    'saveNewOnboardingProfile',
    async () => {
      const ref = doc(getFirestoreDb(), usersCollection, uid);
      await updateDoc(ref, {
        displayName: payload.displayName,
        recoveryProfile: {
          situation: payload.situation,
          situationDetail: payload.situationDetail || null,
          whatTheyMiss: payload.whatTheyMiss,
          customWhatTheyMiss: payload.customWhatTheyMiss || null,
          emotionalState: payload.emotionalState,
          supportNeed: payload.supportNeed,
          completedAt: serverTimestamp(),
        },
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
    },
    { uid }
  );
};

/**
 * Updates user permissions
 * @throws AppError on database errors
 */
export const updateUserPermissions = async (
  uid: string,
  permissions: UserPermissions
): Promise<void> => {
  return withErrorHandling(
    'updateUserPermissions',
    async () => {
      const ref = doc(getFirestoreDb(), usersCollection, uid);
      await updateDoc(ref, {
        permissions,
        updatedAt: serverTimestamp(),
      });
    },
    { uid }
  );
};

/**
 * Updates editable profile fields
 * @throws AppError on database errors
 */
export const updateUserProfile = async (
  uid: string,
  updates: EditableProfileFields
): Promise<void> => {
  return withErrorHandling(
    'updateUserProfile',
    async () => {
      const ref = doc(getFirestoreDb(), usersCollection, uid);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },
    { uid }
  );
};

/**
 * Updates user display name in both Firebase Auth and Firestore
 * @throws AppError on failure
 */
export const updateDisplayName = async (user: User, displayName: string): Promise<void> => {
  return withErrorHandling(
    'updateDisplayName',
    async () => {
      await firebaseUpdateProfile(user, { displayName });
      await updateUserProfile(user.uid, { displayName });
    },
    { uid: user.uid, displayName }
  );
};

/**
 * Increments user stats atomically
 * Non-critical operation - logs errors but doesn't throw
 */
export const incrementUserStats = async (uid: string, delta: Partial<UserStats>): Promise<void> => {
  await silentAsync(
    'incrementUserStats',
    async () => {
      const ref = doc(getFirestoreDb(), usersCollection, uid);
      await runTransaction(getFirestoreDb(), async transaction => {
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
    },
    { uid, delta }
  );
};
