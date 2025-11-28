import { useEffect, useState } from 'react';

import { useAuth } from '@hooks/useAuth';
import type { JournalEntry } from '@/types/journal';
import { subscribeToEntries, subscribeToEntry } from '@services/journal/journalService';

export const useJournalEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEntries(user.uid, (nextEntries) => {
      setEntries(nextEntries);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return {
    entries,
    loading,
  };
};

export const useJournalEntry = (entryId: string | undefined) => {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entryId) {
      setEntry(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEntry(entryId, (nextEntry) => {
      setEntry(nextEntry);
      setLoading(false);
    });

    return unsubscribe;
  }, [entryId]);

  return { entry, loading };
};


