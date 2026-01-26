import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, reload, User } from 'firebase/auth';

import { firebaseAuth } from '@services/firebase/client';
import {
  fetchUserProfile,
  signOut as signOutService,
  updateUserPermissions,
  upsertUserProfile,
} from '@services/auth/authService';
import { env } from '@/config/env';
import type { UserPermissions, UserProfile } from '@/types/user';

type AuthStatus =
  | 'checking'
  | 'unauthenticated'
  | 'email_verification'
  | 'onboarding'
  | 'permissions'
  | 'authenticated';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePermissions: (permissions: UserPermissions) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const deriveStatus = (user: User | null, profile: UserProfile | null): AuthStatus => {
  if (!user) {
    return 'unauthenticated';
  }

  // DEV ONLY: Bypass ALL checks (email, onboarding, permissions) for testing
  if (env.devBypassPaywall) {
    console.log(
      '[Auth] DEV BYPASS: Skipping email verification, onboarding, and permissions checks'
    );
    return 'authenticated';
  }

  if (!user.emailVerified) {
    return 'email_verification';
  }

  if (!profile?.onboardingCompleted) {
    return 'onboarding';
  }

  if (!profile.permissions?.microphone || !profile.permissions?.notifications) {
    return 'permissions';
  }

  return 'authenticated';
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(firebaseAuth?.currentUser ?? null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(firebaseAuth ? 'checking' : 'unauthenticated');

  const hydrateProfile = useCallback(async (currentUser: User | null) => {
    console.log('[Auth] hydrateProfile called, user:', currentUser?.uid ?? 'null');

    if (!currentUser) {
      console.log('[Auth] No user, setting unauthenticated');
      setProfile(null);
      setStatus('unauthenticated');
      return;
    }

    try {
      console.log('[Auth] Fetching user profile...');
      const existingProfile = await fetchUserProfile(currentUser.uid);
      console.log('[Auth] Existing profile:', existingProfile ? 'found' : 'not found');

      if (!existingProfile) {
        console.log('[Auth] Creating new profile...');
        await upsertUserProfile(currentUser);
        const createdProfile = await fetchUserProfile(currentUser.uid);
        setProfile(createdProfile);
        const newStatus = deriveStatus(currentUser, createdProfile);
        console.log('[Auth] New user status:', newStatus);
        setStatus(newStatus);
        return;
      }

      setProfile(existingProfile);
      const newStatus = deriveStatus(currentUser, existingProfile);
      console.log('[Auth] Existing user status:', newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error('[Auth] Error hydrating profile:', error);
      // On error, still allow user to proceed as unauthenticated
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    if (!firebaseAuth) {
      setStatus('unauthenticated');
      return;
    }

    let didResolve = false;

    console.log('[Auth] Setting up onAuthStateChanged listener...');
    const unsubscribe = onAuthStateChanged(firebaseAuth, async nextUser => {
      console.log('[Auth] onAuthStateChanged fired, user:', nextUser?.uid ?? 'null');
      didResolve = true;
      setUser(nextUser);
      await hydrateProfile(nextUser);
    });

    // Timeout fallback - if auth doesn't resolve in 5 seconds, assume unauthenticated
    const timeout = setTimeout(() => {
      if (!didResolve) {
        console.warn('[Auth] Timeout waiting for auth state, defaulting to unauthenticated');
        setStatus('unauthenticated');
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [hydrateProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setStatus('unauthenticated');
      return;
    }
    await reload(user);
    await hydrateProfile(user);
  }, [hydrateProfile, user]);

  const handleSignOut = useCallback(async () => {
    await signOutService();
    setProfile(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const handleUpdatePermissions = useCallback(
    async (permissions: UserPermissions) => {
      if (!user) return;
      await updateUserPermissions(user.uid, permissions);
      await refreshProfile();
    },
    [refreshProfile, user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      status,
      refreshProfile,
      signOut: handleSignOut,
      updatePermissions: handleUpdatePermissions,
    }),
    [handleSignOut, handleUpdatePermissions, profile, refreshProfile, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
