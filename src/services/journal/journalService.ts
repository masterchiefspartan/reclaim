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

import { firebaseAuth, firebaseStorage, firestore } from '@services/firebase/client';
import type { CreateEntryPayload, JournalEntry, MoodLevel } from '@/types/journal';

const journalCollection = 'journalEntries';

const mapSnapshotToEntries = (snapshot: QuerySnapshot<DocumentData>) =>
  snapshot.docs.map(
    (docSnapshot) =>
      ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }) as JournalEntry,
  );

export const subscribeToEntries = (
  uid: string,
  onEntries: (entries: JournalEntry[]) => void,
  entryLimit = 50,
) => {
  const entriesRef = collection(firestore, journalCollection);
  const q = query(
    entriesRef,
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(entryLimit),
  );

  return onSnapshot(q, (snapshot) => {
    onEntries(mapSnapshotToEntries(snapshot));
  });
};

export const subscribeToEntry = (entryId: string, onEntry: (entry: JournalEntry | null) => void) => {
  const refDoc = doc(firestore, journalCollection, entryId);
  return onSnapshot(refDoc, (snapshot) => {
    if (!snapshot.exists()) {
      onEntry(null);
      return;
    }
    onEntry({ id: snapshot.id, ...snapshot.data() } as JournalEntry);
  });
};

const uploadAudio = async (uid: string, entryId: string, uri: string): Promise<UploadResult> => {
  const storageRef = ref(firebaseStorage, `audio/${uid}/${entryId}.m4a`);
  const response = await fetch(uri);
  const blob = await response.blob();
  return uploadBytes(storageRef, blob, {
    contentType: 'audio/m4a',
  });
};

export const createJournalEntry = async (payload: CreateEntryPayload): Promise<string> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to create an entry');
  }

  const entriesRef = collection(firestore, journalCollection);
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
  const storageRef = ref(firebaseStorage, `audio/${user.uid}/${entryRef.id}.m4a`);
  const audioUrl = await getDownloadURL(storageRef);

  await updateDoc(entryRef, {
    audioUrl,
  });

  return entryRef.id;
};

export const updateEntryMood = async (
  entryId: string,
  mood: MoodLevel,
  moodScore: number,
  painLevel?: number,
) => {
  const refDoc = doc(firestore, journalCollection, entryId);
  await updateDoc(refDoc, {
    mood,
    moodScore,
    painLevel: painLevel ?? null,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEntry = async (entryId: string) => {
  const refDoc = doc(firestore, journalCollection, entryId);
  const snapshot = await getDoc(refDoc);
  const entry = snapshot.data() as JournalEntry | undefined;
  await deleteDoc(refDoc);
  if (entry?.audioUrl) {
    try {
      const url = new URL(entry.audioUrl);
      const path = decodeURIComponent(url.pathname.replace('/o/', ''));
      await deleteObject(ref(firebaseStorage, path));
    } catch (error) {
      console.warn('Failed to delete audio file', error);
    }
  }
};


