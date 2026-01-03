import { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, reload, User } from 'firebase/auth';

import { firebaseAuth } from '@services/firebase/client';
import {
  fetchUserProfile,
  signOut as signOutService,
  updateUserPermissions,
  upsertUserProfile,
} from '@services/auth/authService';
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

  const hydrateProfile = useCallback(
    async (currentUser: User | null) => {
      if (!currentUser) {
        setProfile(null);
        setStatus('unauthenticated');
        return;
      }

      const existingProfile = await fetchUserProfile(currentUser.uid);
      if (!existingProfile) {
        await upsertUserProfile(currentUser);
        const createdProfile = await fetchUserProfile(currentUser.uid);
        setProfile(createdProfile);
        setStatus(deriveStatus(currentUser, createdProfile));
        return;
      }

      setProfile(existingProfile);
      setStatus(deriveStatus(currentUser, existingProfile));
    },
    [],
  );

  useEffect(() => {
    if (!firebaseAuth) {
      setStatus('unauthenticated');
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      await hydrateProfile(nextUser);
    });

    return unsubscribe;
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
    [refreshProfile, user],
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
    [handleSignOut, handleUpdatePermissions, profile, refreshProfile, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


