/**
 * Unit tests for journalService
 * Tests the journal entry CRUD operations with mocked Firebase
 */

import { createJournalEntry, updateEntryMood, deleteEntry } from '../journalService';

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ _serverTimestamp: true })),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock('@services/firebase/client', () => ({
  firebaseAuth: {
    currentUser: { uid: 'test-user-123' },
  },
  firebaseStorage: {},
  firestore: {},
}));

// Mock global fetch for audio upload
global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(['audio-data'], { type: 'audio/m4a' })),
  })
) as jest.Mock;

// Import mocked modules for assertions
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseAuth } from '@services/firebase/client';

describe('journalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJournalEntry', () => {
    it('should create a journal entry with correct data', async () => {
      // Setup mocks
      const mockEntryRef = { id: 'entry-123' };
      (addDoc as jest.Mock).mockResolvedValue(mockEntryRef);
      (collection as jest.Mock).mockReturnValue('entries-collection');
      (ref as jest.Mock).mockReturnValue('storage-ref');
      (uploadBytes as jest.Mock).mockResolvedValue({});
      (getDownloadURL as jest.Mock).mockResolvedValue('https://example.com/audio.m4a');
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const payload = {
        localAudioUri: 'file:///local/audio.m4a',
        duration: 120000,
        checkInType: 'free' as const,
      };

      const result = await createJournalEntry(payload);

      // Verify entry was created with correct data
      expect(addDoc).toHaveBeenCalledWith('entries-collection', {
        userId: 'test-user-123',
        duration: 120000,
        checkInType: 'free',
        structuredAnswers: null,
        transcriptionStatus: 'pending',
        aiResponseStatus: 'pending',
        createdAt: expect.any(Object),
        updatedAt: expect.any(Object),
      });

      // Verify audio was uploaded
      expect(uploadBytes).toHaveBeenCalled();

      // Verify entry was updated with audio URL
      expect(updateDoc).toHaveBeenCalledWith(mockEntryRef, {
        audioUrl: 'https://example.com/audio.m4a',
      });

      // Verify correct entry ID returned
      expect(result).toBe('entry-123');
    });

    it('should throw error if user is not authenticated', async () => {
      // Temporarily remove currentUser
      const originalUser = firebaseAuth.currentUser;
      (firebaseAuth as any).currentUser = null;

      const payload = {
        localAudioUri: 'file:///local/audio.m4a',
        duration: 60000,
        checkInType: 'guided' as const,
      };

      await expect(createJournalEntry(payload)).rejects.toThrow(
        'User must be authenticated to create an entry'
      );

      // Restore currentUser
      (firebaseAuth as any).currentUser = originalUser;
    });

    it('should include structuredAnswers when provided', async () => {
      const mockEntryRef = { id: 'entry-456' };
      (addDoc as jest.Mock).mockResolvedValue(mockEntryRef);
      (collection as jest.Mock).mockReturnValue('entries-collection');
      (ref as jest.Mock).mockReturnValue('storage-ref');
      (uploadBytes as jest.Mock).mockResolvedValue({});
      (getDownloadURL as jest.Mock).mockResolvedValue('https://example.com/audio.m4a');
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      const payload = {
        localAudioUri: 'file:///local/audio.m4a',
        duration: 180000,
        checkInType: 'guided' as const,
        structuredAnswers: {
          physicalProgress: 'Better range of motion',
          painLevel: 3,
          emotionalState: 'Hopeful',
          smallWins: 'Walked without cane today',
        },
      };

      await createJournalEntry(payload);

      expect(addDoc).toHaveBeenCalledWith(
        'entries-collection',
        expect.objectContaining({
          structuredAnswers: {
            physicalProgress: 'Better range of motion',
            painLevel: 3,
            emotionalState: 'Hopeful',
            smallWins: 'Walked without cane today',
          },
        })
      );
    });
  });

  describe('updateEntryMood', () => {
    it('should update mood with all fields', async () => {
      (doc as jest.Mock).mockReturnValue('doc-ref');
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await updateEntryMood('entry-123', 'hopeful', 7, 2);

      expect(doc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith('doc-ref', {
        mood: 'hopeful',
        moodScore: 7,
        painLevel: 2,
        updatedAt: expect.any(Object),
      });
    });

    it('should set painLevel to null when not provided', async () => {
      (doc as jest.Mock).mockReturnValue('doc-ref');
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await updateEntryMood('entry-123', 'grateful', 9);

      expect(updateDoc).toHaveBeenCalledWith('doc-ref', {
        mood: 'grateful',
        moodScore: 9,
        painLevel: null,
        updatedAt: expect.any(Object),
      });
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry and associated audio file', async () => {
      const mockSnapshot = {
        data: () => ({
          audioUrl: 'https://firebasestorage.googleapis.com/o/audio%2Fuser-123%2Fentry-123.m4a',
        }),
      };

      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockSnapshot);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);
      (ref as jest.Mock).mockReturnValue('storage-ref');
      (deleteObject as jest.Mock).mockResolvedValue(undefined);

      await deleteEntry('entry-123');

      expect(deleteDoc).toHaveBeenCalledWith('doc-ref');
      expect(deleteObject).toHaveBeenCalledWith('storage-ref');
    });

    it('should delete entry even if no audio URL exists', async () => {
      const mockSnapshot = {
        data: () => ({}),
      };

      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockSnapshot);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await deleteEntry('entry-789');

      expect(deleteDoc).toHaveBeenCalledWith('doc-ref');
      expect(deleteObject).not.toHaveBeenCalled();
    });

    it('should handle audio deletion errors gracefully', async () => {
      const mockSnapshot = {
        data: () => ({
          audioUrl: 'https://firebasestorage.googleapis.com/o/audio%2Fuser-123%2Fentry-123.m4a',
        }),
      };

      (doc as jest.Mock).mockReturnValue('doc-ref');
      (getDoc as jest.Mock).mockResolvedValue(mockSnapshot);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);
      (ref as jest.Mock).mockReturnValue('storage-ref');
      (deleteObject as jest.Mock).mockRejectedValue(new Error('Storage error'));

      // Should not throw, should handle gracefully
      await expect(deleteEntry('entry-123')).resolves.toBeUndefined();
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});

