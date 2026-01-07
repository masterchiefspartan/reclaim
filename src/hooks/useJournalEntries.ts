import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@hooks/useAuth';
import type { JournalEntry } from '@/types/journal';
import { subscribeToEntries, subscribeToEntry } from '@services/journal/journalService';
import { getUserFriendlyMessage } from '@utils/errors';

interface UseJournalEntriesResult {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export const useJournalEntries = (): UseJournalEntriesResult => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToEntries(
      user.uid,
      nextEntries => {
        setEntries(nextEntries);
        setLoading(false);
        setError(null);
      },
      err => {
        setError(getUserFriendlyMessage(err));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, retryCount]);

  return {
    entries,
    loading,
    error,
    retry,
  };
};

interface UseJournalEntryResult {
  entry: JournalEntry | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export const useJournalEntry = (entryId: string | undefined): UseJournalEntryResult => {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!entryId) {
      setEntry(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToEntry(
      entryId,
      nextEntry => {
        setEntry(nextEntry);
        setLoading(false);
        setError(null);
      },
      err => {
        setError(getUserFriendlyMessage(err));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [entryId, retryCount]);

  return { entry, loading, error, retry };
};
