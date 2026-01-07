import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  type UploadResult,
} from 'firebase/storage';

import { getFirebaseAuth, getFirebaseStorage, getFirestoreDb } from '@services/firebase/client';
import { withErrorHandling, logError, silentAsync } from '@utils/errors';
import type { CreateEntryPayload, JournalEntry, MoodLevel } from '@/types/journal';

const journalCollection = 'journalEntries';

const mapSnapshotToEntries = (snapshot: QuerySnapshot<DocumentData>): JournalEntry[] =>
  snapshot.docs.map(
    docSnapshot =>
      ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }) as JournalEntry
  );

/**
 * Subscribes to real-time updates of journal entries
 * @param uid - User ID to filter entries
 * @param onEntries - Callback for entry updates
 * @param onError - Optional error callback
 * @param entryLimit - Maximum entries to fetch
 * @returns Unsubscribe function
 */
export const subscribeToEntries = (
  uid: string,
  onEntries: (entries: JournalEntry[]) => void,
  onError?: (error: Error) => void,
  entryLimit = 50
): (() => void) => {
  const entriesRef = collection(getFirestoreDb(), journalCollection);
  const q = query(
    entriesRef,
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(entryLimit)
  );

  return onSnapshot(
    q,
    snapshot => {
      onEntries(mapSnapshotToEntries(snapshot));
    },
    error => {
      logError('subscribeToEntries', error, { uid });
      onError?.(error);
    }
  );
};

/**
 * Subscribes to real-time updates of a single journal entry
 * @param entryId - Entry ID to subscribe to
 * @param onEntry - Callback for entry updates
 * @param onError - Optional error callback
 * @returns Unsubscribe function
 */
export const subscribeToEntry = (
  entryId: string,
  onEntry: (entry: JournalEntry | null) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const refDoc = doc(getFirestoreDb(), journalCollection, entryId);
  return onSnapshot(
    refDoc,
    snapshot => {
      if (!snapshot.exists()) {
        onEntry(null);
        return;
      }
      onEntry({ id: snapshot.id, ...snapshot.data() } as JournalEntry);
    },
    error => {
      logError('subscribeToEntry', error, { entryId });
      onError?.(error);
    }
  );
};

/**
 * Uploads audio file to Firebase Storage
 */
const uploadAudio = async (uid: string, entryId: string, uri: string): Promise<UploadResult> => {
  const storageRef = ref(getFirebaseStorage(), `audio/${uid}/${entryId}.m4a`);
  const response = await fetch(uri);
  const blob = await response.blob();
  return uploadBytes(storageRef, blob, {
    contentType: 'audio/m4a',
  });
};

/**
 * Creates a new journal entry with audio upload
 * @throws AppError with user-friendly message on failure
 */
export const createJournalEntry = async (payload: CreateEntryPayload): Promise<string> => {
  return withErrorHandling(
    'createJournalEntry',
    async () => {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        throw new Error('User must be authenticated to create an entry');
      }

      const entriesRef = collection(getFirestoreDb(), journalCollection);
      const entryRef = await addDoc(entriesRef, {
        userId: user.uid,
        duration: payload.duration,
        checkInType: payload.checkInType,
        structuredAnswers: payload.structuredAnswers ?? null,
        transcriptionStatus: 'pending',
        aiResponseStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await uploadAudio(user.uid, entryRef.id, payload.localAudioUri);
      const storageRef = ref(getFirebaseStorage(), `audio/${user.uid}/${entryRef.id}.m4a`);
      const audioUrl = await getDownloadURL(storageRef);

      await updateDoc(entryRef, {
        audioUrl,
      });

      return entryRef.id;
    },
    { checkInType: payload.checkInType, duration: payload.duration }
  );
};

/**
 * Updates mood data for an entry
 * @throws AppError with user-friendly message on failure
 */
export const updateEntryMood = async (
  entryId: string,
  mood: MoodLevel,
  moodScore: number,
  painLevel?: number
): Promise<void> => {
  return withErrorHandling(
    'updateEntryMood',
    async () => {
      const refDoc = doc(getFirestoreDb(), journalCollection, entryId);
      await updateDoc(refDoc, {
        mood,
        moodScore,
        painLevel: painLevel ?? null,
        updatedAt: serverTimestamp(),
      });
    },
    { entryId, mood, moodScore }
  );
};

/**
 * Deletes a journal entry and its associated audio file
 * Audio deletion is non-critical - entry is deleted even if audio cleanup fails
 * @throws AppError with user-friendly message on entry deletion failure
 */
export const deleteEntry = async (entryId: string): Promise<void> => {
  return withErrorHandling(
    'deleteEntry',
    async () => {
      const refDoc = doc(getFirestoreDb(), journalCollection, entryId);
      const snapshot = await getDoc(refDoc);
      const entry = snapshot.data() as JournalEntry | undefined;

      // Delete the Firestore document first (critical operation)
      await deleteDoc(refDoc);

      // Clean up audio file (non-critical - use silentAsync)
      if (entry?.audioUrl) {
        await silentAsync(
          'deleteAudioFile',
          async () => {
            const url = new URL(entry.audioUrl as string);
            const path = decodeURIComponent(url.pathname.replace('/o/', ''));
            await deleteObject(ref(getFirebaseStorage(), path));
          },
          { entryId, audioUrl: entry.audioUrl }
        );
      }
    },
    { entryId }
  );
};
