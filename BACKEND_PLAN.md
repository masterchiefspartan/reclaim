# Backend Architecture Plan

# RecoverVoiceApp - Voice Journal with AI Integration

**Last Updated:** December 2024  
**Approach:** Backend-first implementation, then UI/UX

---

## Executive Summary

This document outlines the complete backend architecture for RecoverVoiceApp, a voice-powered journaling application with AI conversation capabilities. The backend is built on Firebase (Functions, Firestore, Auth) with integrations for Deepgram (speech-to-text), Claude API (AI conversations), and ElevenLabs (text-to-speech).

**Core Principle:** Build and test all backend functionality first, ensuring robust API contracts, data models, and service integrations before implementing the frontend UI.

---

## Architecture Overview

### Technology Stack

- **Backend Runtime:** Firebase Functions (Node.js 18+)
- **Database:** Cloud Firestore (NoSQL)
- **Authentication:** Firebase Authentication
- **File Storage:** Firebase Storage (for audio files)
- **API Integrations:**
  - Deepgram API (speech-to-text)
  - Claude API (Anthropic) - AI conversations
  - ElevenLabs API (text-to-speech)

### Architecture Pattern

```
Mobile App (React Native)
    ↓
Firebase Functions (Serverless API Layer)
    ↓
┌─────────────┬──────────────┬──────────────┐
│  Firestore  │ Firebase Auth│ Firebase     │
│  (Database) │ (Auth)        │ Storage      │
│             │               │ (Files)      │
└─────────────┴──────────────┴──────────────┘
    ↓
External APIs (Deepgram, Claude, ElevenLabs)
```

---

## Phase 1: Firebase Setup & Configuration

### 1.1 Firebase Project Setup

**Tasks:**

- Create Firebase project in Firebase Console
- Enable Authentication (Email/Password, Google Sign-In)
- Enable Firestore Database
- Enable Firebase Storage
- Enable Firebase Functions

**Configuration Files:**

```javascript
// functions/.env (local development)
DEEPGRAM_API_KEY = your_deepgram_key;
CLAUDE_API_KEY = your_claude_key;
ELEVENLABS_API_KEY = your_elevenlabs_key;
FIREBASE_PROJECT_ID = recovervoiceapp;
```

**Firebase Functions Setup:**

```bash
# Initialize Functions
cd functions
npm init -y
npm install firebase-functions@latest firebase-admin@latest
npm install axios  # For external API calls
npm install @deepgram/sdk  # Deepgram SDK
npm install @anthropic-ai/sdk  # Claude SDK
npm install dotenv  # Environment variables
```

**Firebase Project Structure:**

```
functions/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/
│   │   └── firebase.ts        # Firebase admin initialization
│   ├── services/
│   │   ├── deepgram.ts        # Deepgram integration
│   │   ├── claude.ts          # Claude API integration
│   │   └── elevenlabs.ts      # ElevenLabs integration
│   ├── handlers/
│   │   ├── auth.ts            # Authentication handlers
│   │   ├── voice.ts           # Voice processing handlers
│   │   ├── journal.ts         # Journal entry handlers
│   │   └── ai.ts              # AI conversation handlers
│   ├── utils/
│   │   ├── validators.ts      # Input validation
│   │   ├── errors.ts          # Error handling
│   │   └── responses.ts       # Standardized API responses
│   └── types/
│       ├── user.ts            # User type definitions
│       ├── journal.ts         # Journal type definitions
│       └── api.ts             # API request/response types
├── package.json
└── tsconfig.json
```

### 1.2 Firebase Admin Initialization

```typescript
// functions/src/config/firebase.ts
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
```

### 1.3 Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Journal entries
    match /journalEntries/{entryId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Phase 2: Authentication & User Management

### 2.1 User Data Model

**Firestore Collection: `users`**

```typescript
// types/user.ts
export interface User {
  uid: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  preferences: {
    notificationEnabled: boolean;
    defaultMoodReminder?: string; // Time of day
    language: string; // Default: 'en'
  };
  stats: {
    totalEntries: number;
    totalRecordingMinutes: number;
    streakDays: number;
    lastEntryDate?: FirebaseFirestore.Timestamp;
  };
}
```

### 2.2 Authentication Endpoints

**Create User Profile** (Triggered on Auth signup)

```typescript
// functions/src/handlers/auth.ts
import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

export const onUserCreate = functions.auth.user().onCreate(async user => {
  const userData = {
    uid: user.uid,
    email: user.email || '',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    preferences: {
      notificationEnabled: true,
      language: 'en',
    },
    stats: {
      totalEntries: 0,
      totalRecordingMinutes: 0,
      streakDays: 0,
    },
  };

  await db.collection('users').doc(user.uid).set(userData);
  console.log(`User profile created: ${user.uid}`);
});
```

**Get User Profile**

```typescript
// HTTP Function
export const getUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userDoc = await db.collection('users').doc(context.auth.uid).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User profile not found');
  }

  return { user: userDoc.data() };
});
```

**Update User Preferences**

```typescript
export const updateUserPreferences = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { preferences } = data;

  // Validate preferences
  if (!preferences || typeof preferences !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid preferences');
  }

  await db.collection('users').doc(context.auth.uid).update({
    preferences: preferences,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
```

### 2.3 Testing Authentication

**Test Cases:**

- [ ] User signup creates profile in Firestore
- [ ] User profile retrieval works
- [ ] User preferences update correctly
- [ ] Unauthenticated requests are rejected
- [ ] User can only access their own data

---

## Phase 3: Voice Processing Pipeline

### 3.1 Voice Recording Flow

```
1. Mobile App records audio → Uploads to Firebase Storage
2. Storage upload triggers Function
3. Function sends audio to Deepgram for transcription
4. Function stores transcript in Firestore
5. Function triggers AI processing (Phase 4)
```

### 3.2 Audio Storage Structure

**Firebase Storage Path:**

```
/audio/{userId}/{entryId}/{timestamp}.m4a
```

### 3.3 Voice Processing Endpoints

**Upload Audio & Process**

```typescript
// functions/src/handlers/voice.ts
import * as functions from 'firebase-functions';
import { storage } from '../config/firebase';
import { transcribeAudio } from '../services/deepgram';

export const processVoiceRecording = functions.storage.object().onFinalize(async object => {
  // Check if file is in audio directory
  if (!object.name?.startsWith('audio/')) {
    return null;
  }

  const userId = object.name.split('/')[1];
  const entryId = object.name.split('/')[2];
  const fileName = object.name;

  // Download audio file
  const bucket = storage.bucket();
  const file = bucket.file(fileName);
  const [fileBuffer] = await file.download();

  // Transcribe with Deepgram
  const transcript = await transcribeAudio(fileBuffer);

  // Store transcript in Firestore
  await db.collection('journalEntries').doc(entryId).update({
    transcript: transcript,
    transcriptionStatus: 'completed',
    transcriptionCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Trigger AI processing
  await processAIResponse(entryId, transcript, userId);

  return { success: true };
});
```

**Manual Transcription Request** (for retry scenarios)

```typescript
export const transcribeAudioManual = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { entryId } = data;

  // Get entry and audio URL
  const entryDoc = await db.collection('journalEntries').doc(entryId).get();

  if (!entryDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Entry not found');
  }

  const entry = entryDoc.data();

  if (entry?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied');
  }

  // Download and transcribe
  const audioUrl = entry.audioUrl;
  const transcript = await transcribeAudioFromUrl(audioUrl);

  // Update entry
  await db.collection('journalEntries').doc(entryId).update({
    transcript: transcript,
    transcriptionStatus: 'completed',
  });

  return { transcript, success: true };
});
```

### 3.4 Deepgram Integration Service

```typescript
// functions/src/services/deepgram.ts
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  words: WordTiming[];
}

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      punctuate: true,
      diarize: false,
    });

    if (error) {
      throw new Error(`Deepgram error: ${error.message}`);
    }

    return result?.results?.channels[0]?.alternatives[0]?.transcript || '';
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
}

export async function transcribeAudioFromUrl(audioUrl: string): Promise<string> {
  // Implementation for URL-based transcription
  // Similar to buffer-based, but uses URL instead
}
```

### 3.5 Testing Voice Processing

**Test Cases:**

- [ ] Audio upload triggers transcription
- [ ] Deepgram API integration works correctly
- [ ] Transcript is stored in Firestore
- [ ] Error handling for failed transcriptions
- [ ] Manual retry transcription works
- [ ] Long audio files (>5 minutes) handled correctly

---

## Phase 4: AI Integration Services

### 4.1 Journal Entry Data Model

**Firestore Collection: `journalEntries`**

```typescript
// types/journal.ts
export interface JournalEntry {
  id: string;
  userId: string;
  audioUrl: string; // Firebase Storage URL
  transcript: string;
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  aiResponse?: string;
  aiResponseStatus: 'pending' | 'processing' | 'completed' | 'failed';
  mood?: MoodLevel;
  moodScore?: number; // 1-10 scale
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  transcriptionCompletedAt?: FirebaseFirestore.Timestamp;
  aiResponseCompletedAt?: FirebaseFirestore.Timestamp;
  tags?: string[];
  insights?: {
    keyTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestedActions?: string[];
  };
}

export type MoodLevel =
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'anxious'
  | 'excited'
  | 'frustrated'
  | 'grateful';
```

### 4.2 Claude AI Integration Service

```typescript
// functions/src/services/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
});

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  response: string;
  tokensUsed: number;
  model: string;
}

export async function sendToClaude(
  message: string,
  conversationHistory?: ConversationMessage[]
): Promise<ClaudeResponse> {
  try {
    const messages: ConversationMessage[] = conversationHistory || [];
    messages.push({ role: 'user', content: message });

    const systemPrompt = `You are a compassionate AI journaling assistant for RecoverVoiceApp. 
    Your role is to:
    - Provide empathetic responses to journal entries
    - Identify mood and sentiment
    - Offer insights and gentle guidance
    - Maintain conversation context across sessions
    - Be supportive and non-judgmental
    
    Keep responses concise (2-3 paragraphs) and meaningful.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    return {
      response: content.text,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      model: response.model,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

export async function analyzeTranscript(transcript: string): Promise<{
  mood: MoodLevel;
  moodScore: number;
  insights: {
    keyTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestedActions?: string[];
  };
}> {
  const analysisPrompt = `Analyze this journal entry transcript and provide:
    1. Primary mood (happy, neutral, sad, anxious, excited, frustrated, grateful)
    2. Mood score (1-10, where 10 is most positive)
    3. Key topics mentioned (3-5 topics)
    4. Overall sentiment (positive, neutral, negative)
    5. Suggested actions or reflections (optional, 1-3 items)
    
    Return as JSON with this structure:
    {
      "mood": "mood_level",
      "moodScore": number,
      "insights": {
        "keyTopics": ["topic1", "topic2"],
        "sentiment": "positive|neutral|negative",
        "suggestedActions": ["action1", "action2"]
      }
    }
    
    Transcript: ${transcript}`;

  const response = await sendToClaude(analysisPrompt);

  try {
    // Parse JSON response from Claude
    const parsed = JSON.parse(response.response);
    return parsed;
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      mood: 'neutral',
      moodScore: 5,
      insights: {
        keyTopics: [],
        sentiment: 'neutral',
      },
    };
  }
}
```

### 4.3 AI Processing Handler

```typescript
// functions/src/handlers/ai.ts
import { db } from '../config/firebase';
import { sendToClaude, analyzeTranscript } from '../services/claude';

export async function processAIResponse(
  entryId: string,
  transcript: string,
  userId: string
): Promise<void> {
  try {
    // Update status to processing
    await db.collection('journalEntries').doc(entryId).update({
      aiResponseStatus: 'processing',
    });

    // Get conversation history
    const conversationHistory = await getConversationHistory(userId, 10);

    // Generate AI response
    const aiResponse = await sendToClaude(transcript, conversationHistory);

    // Analyze transcript for mood and insights
    const analysis = await analyzeTranscript(transcript);

    // Update entry with AI response and analysis
    await db.collection('journalEntries').doc(entryId).update({
      aiResponse: aiResponse.response,
      aiResponseStatus: 'completed',
      aiResponseCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
      mood: analysis.mood,
      moodScore: analysis.moodScore,
      insights: analysis.insights,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user stats
    await updateUserStats(userId);

    // Store conversation message
    await saveConversationMessage(userId, transcript, aiResponse.response);
  } catch (error) {
    console.error('AI processing failed:', error);

    // Update entry with failed status
    await db
      .collection('journalEntries')
      .doc(entryId)
      .update({
        aiResponseStatus: 'failed',
        aiResponseError: error instanceof Error ? error.message : 'Unknown error',
      });

    throw error;
  }
}

async function getConversationHistory(
  userId: string,
  limit: number
): Promise<ConversationMessage[]> {
  const messagesSnapshot = await db
    .collection('conversations')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  const messages: ConversationMessage[] = [];

  messagesSnapshot.docs.reverse().forEach(doc => {
    const data = doc.data();
    messages.push({ role: 'user', content: data.userMessage });
    messages.push({ role: 'assistant', content: data.aiResponse });
  });

  return messages;
}

async function saveConversationMessage(
  userId: string,
  userMessage: string,
  aiResponse: string
): Promise<void> {
  await db.collection('conversations').add({
    userId,
    userMessage,
    aiResponse,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
```

### 4.4 ElevenLabs Text-to-Speech Integration

```typescript
// functions/src/services/elevenlabs.ts
import axios from 'axios';

export interface TTSOptions {
  voice?: string; // Default: '21m00Tcm4TlvDq8ikWAM'
  stability?: number; // 0-1, default: 0.5
  similarityBoost?: number; // 0-1, default: 0.75
}

export async function generateSpeech(text: string, options: TTSOptions = {}): Promise<Buffer> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${options.voice || '21m00Tcm4TlvDq8ikWAM'}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarityBoost || 0.75,
        },
      },
      {
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

export async function generateAIResponseAudio(
  text: string
): Promise<{ audioUrl: string; audioBuffer: Buffer }> {
  const audioBuffer = await generateSpeech(text);

  // Upload to Firebase Storage
  const bucket = storage.bucket();
  const fileName = `ai-responses/${Date.now()}.mp3`;
  const file = bucket.file(fileName);

  await file.save(audioBuffer, {
    contentType: 'audio/mpeg',
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  const audioUrl = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500', // Far future expiration
  });

  return { audioUrl: audioUrl[0], audioBuffer };
}
```

### 4.5 Testing AI Integration

**Test Cases:**

- [ ] Claude API integration works correctly
- [ ] AI responses are generated and stored
- [ ] Conversation history is maintained correctly
- [ ] Mood analysis works accurately
- [ ] Insights extraction works
- [ ] Text-to-speech generation works
- [ ] Error handling for API failures
- [ ] Rate limiting is handled

---

## Phase 5: Journal & Data Management

### 5.1 Journal Entry Endpoints

**Create Journal Entry**

```typescript
// functions/src/handlers/journal.ts
export const createJournalEntry = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { audioUrl, duration } = data;

  if (!audioUrl || typeof audioUrl !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Audio URL required');
  }

  const entryData: Partial<JournalEntry> = {
    userId: context.auth.uid,
    audioUrl,
    transcript: '',
    transcriptionStatus: 'pending',
    aiResponseStatus: 'pending',
    duration: duration || 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const entryRef = await db.collection('journalEntries').add(entryData);

  return {
    entryId: entryRef.id,
    success: true,
  };
});
```

**Get Journal Entries**

```typescript
export const getJournalEntries = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { limit = 20, startAfter } = data;

  let query = db
    .collection('journalEntries')
    .where('userId', '==', context.auth.uid)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (startAfter) {
    const startAfterDoc = await db.collection('journalEntries').doc(startAfter).get();
    query = query.startAfter(startAfterDoc);
  }

  const snapshot = await query.get();
  const entries = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { entries };
});
```

**Get Single Journal Entry**

```typescript
export const getJournalEntry = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { entryId } = data;

  if (!entryId) {
    throw new functions.https.HttpsError('invalid-argument', 'Entry ID required');
  }

  const entryDoc = await db.collection('journalEntries').doc(entryId).get();

  if (!entryDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Entry not found');
  }

  const entry = entryDoc.data();

  if (entry?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied');
  }

  return { entry: { id: entryDoc.id, ...entry } };
});
```

**Update Journal Entry**

```typescript
export const updateJournalEntry = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { entryId, updates } = data;

  if (!entryId || !updates) {
    throw new functions.https.HttpsError('invalid-argument', 'Entry ID and updates required');
  }

  // Verify ownership
  const entryDoc = await db.collection('journalEntries').doc(entryId).get();
  if (!entryDoc.exists || entryDoc.data()?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied');
  }

  // Allowed fields for update
  const allowedFields = ['mood', 'tags', 'insights'];
  const sanitizedUpdates: any = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      sanitizedUpdates[key] = updates[key];
    }
  });

  await db.collection('journalEntries').doc(entryId).update(sanitizedUpdates);

  return { success: true };
});
```

**Delete Journal Entry**

```typescript
export const deleteJournalEntry = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { entryId } = data;

  if (!entryId) {
    throw new functions.https.HttpsError('invalid-argument', 'Entry ID required');
  }

  // Verify ownership
  const entryDoc = await db.collection('journalEntries').doc(entryId).get();
  if (!entryDoc.exists || entryDoc.data()?.userId !== context.auth.uid) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied');
  }

  // Delete audio file from Storage
  const entry = entryDoc.data();
  if (entry?.audioUrl) {
    const filePath = extractFilePathFromUrl(entry.audioUrl);
    await storage.bucket().file(filePath).delete().catch(console.error);
  }

  // Delete entry
  await db.collection('journalEntries').doc(entryId).delete();

  // Update user stats
  await updateUserStats(context.auth.uid);

  return { success: true };
});
```

### 5.2 User Stats Management

```typescript
// functions/src/utils/stats.ts
export async function updateUserStats(userId: string): Promise<void> {
  const entriesSnapshot = await db.collection('journalEntries').where('userId', '==', userId).get();

  const entries = entriesSnapshot.docs.map(doc => doc.data());

  const totalEntries = entries.length;
  const totalRecordingMinutes = entries.reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0);

  // Calculate streak
  const streakDays = calculateStreakDays(entries);

  // Get last entry date
  const sortedEntries = entries.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
  const lastEntryDate = sortedEntries[0]?.createdAt;

  await db.collection('users').doc(userId).update({
    'stats.totalEntries': totalEntries,
    'stats.totalRecordingMinutes': totalRecordingMinutes,
    'stats.streakDays': streakDays,
    'stats.lastEntryDate': lastEntryDate,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

function calculateStreakDays(entries: any[]): number {
  if (entries.length === 0) return 0;

  const sortedEntries = entries
    .map(e => e.createdAt?.toDate())
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = sortedEntries[i];
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
```

### 5.3 Testing Journal Management

**Test Cases:**

- [ ] Create journal entry works
- [ ] Get journal entries with pagination
- [ ] Get single entry works
- [ ] Update entry works (only allowed fields)
- [ ] Delete entry removes data and audio file
- [ ] User stats update correctly
- [ ] Streak calculation works
- [ ] Unauthorized access is blocked

---

## Phase 6: Analytics & Insights

### 6.1 Mood Tracking Endpoints

**Get Mood Trends**

```typescript
export const getMoodTrends = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { days = 30 } = data;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const entriesSnapshot = await db
    .collection('journalEntries')
    .where('userId', '==', context.auth.uid)
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
    .where('mood', '!=', null)
    .orderBy('createdAt', 'asc')
    .get();

  const moodData = entriesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      date: data.createdAt?.toDate(),
      mood: data.mood,
      moodScore: data.moodScore,
    };
  });

  // Calculate averages
  const moodCounts: Record<string, number> = {};
  let totalScore = 0;
  let scoreCount = 0;

  moodData.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    if (entry.moodScore) {
      totalScore += entry.moodScore;
      scoreCount++;
    }
  });

  return {
    moodData,
    averages: {
      moodDistribution: moodCounts,
      averageMoodScore: scoreCount > 0 ? totalScore / scoreCount : 0,
    },
  };
});
```

**Get Insights Summary**

```typescript
export const getInsightsSummary = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { days = 30 } = data;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const entriesSnapshot = await db
    .collection('journalEntries')
    .where('userId', '==', context.auth.uid)
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
    .get();

  const entries = entriesSnapshot.docs.map(doc => doc.data());

  // Aggregate insights
  const allTopics: Record<string, number> = {};
  const allSentiments: Record<string, number> = {};
  const allActions: string[] = [];

  entries.forEach(entry => {
    if (entry.insights) {
      // Count topics
      entry.insights.keyTopics?.forEach((topic: string) => {
        allTopics[topic] = (allTopics[topic] || 0) + 1;
      });

      // Count sentiments
      if (entry.insights.sentiment) {
        allSentiments[entry.insights.sentiment] =
          (allSentiments[entry.insights.sentiment] || 0) + 1;
      }

      // Collect suggested actions
      entry.insights.suggestedActions?.forEach((action: string) => {
        allActions.push(action);
      });
    }
  });

  // Get top topics
  const topTopics = Object.entries(allTopics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic);

  return {
    topTopics,
    sentimentDistribution: allSentiments,
    suggestedActions: allActions.slice(0, 10),
    totalEntries: entries.length,
  };
});
```

### 6.2 Testing Analytics

**Test Cases:**

- [ ] Mood trends calculation works
- [ ] Insights summary aggregates correctly
- [ ] Date range filtering works
- [ ] Empty data handled gracefully

---

## Database Schema Summary

### Collections

#### `users`

```
{
  uid: string (document ID)
  email: string
  displayName?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  preferences: {
    notificationEnabled: boolean
    defaultMoodReminder?: string
    language: string
  }
  stats: {
    totalEntries: number
    totalRecordingMinutes: number
    streakDays: number
    lastEntryDate?: Timestamp
  }
}
```

#### `journalEntries`

```
{
  id: string (document ID)
  userId: string
  audioUrl: string
  transcript: string
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  aiResponse?: string
  aiResponseStatus: 'pending' | 'processing' | 'completed' | 'failed'
  mood?: MoodLevel
  moodScore?: number
  createdAt: Timestamp
  updatedAt: Timestamp
  transcriptionCompletedAt?: Timestamp
  aiResponseCompletedAt?: Timestamp
  duration?: number (seconds)
  tags?: string[]
  insights?: {
    keyTopics: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    suggestedActions?: string[]
  }
}
```

#### `conversations`

```
{
  id: string (document ID)
  userId: string
  userMessage: string
  aiResponse: string
  createdAt: Timestamp
}
```

### Indexes Required

```javascript
// Firestore Indexes
- journalEntries: userId + createdAt (descending)
- journalEntries: userId + createdAt + mood
- conversations: userId + createdAt (descending)
```

---

## API Endpoints Summary

### Authentication

- `onUserCreate` - Triggered on user signup
- `getUserProfile` - Get user profile
- `updateUserPreferences` - Update user preferences

### Voice Processing

- `processVoiceRecording` - Triggered on audio upload
- `transcribeAudioManual` - Manual transcription retry

### Journal Management

- `createJournalEntry` - Create new journal entry
- `getJournalEntries` - Get paginated journal entries
- `getJournalEntry` - Get single journal entry
- `updateJournalEntry` - Update entry (mood, tags, insights)
- `deleteJournalEntry` - Delete entry and audio file

### AI Services

- `processAIResponse` - Process transcript with Claude (triggered)
- (Internal) `analyzeTranscript` - Analyze mood and insights
- (Internal) `generateSpeech` - Generate TTS audio

### Analytics

- `getMoodTrends` - Get mood trends over time
- `getInsightsSummary` - Get aggregated insights

---

## Error Handling & Validation

### Standard Error Responses

```typescript
// functions/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export function handleError(error: unknown): functions.https.HttpsError {
  if (error instanceof AppError) {
    return new functions.https.HttpsError(
      error.code as functions.https.FunctionsErrorCode,
      error.message
    );
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return new functions.https.HttpsError('internal', 'An unexpected error occurred');
  }

  return new functions.https.HttpsError('internal', 'Unknown error');
}
```

### Input Validation

```typescript
// functions/src/utils/validators.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateMood(mood: string): mood is MoodLevel {
  const validMoods: MoodLevel[] = [
    'happy',
    'neutral',
    'sad',
    'anxious',
    'excited',
    'frustrated',
    'grateful',
  ];
  return validMoods.includes(mood as MoodLevel);
}

export function validateEntryId(entryId: string): boolean {
  return typeof entryId === 'string' && entryId.length > 0;
}
```

---

## Security Considerations

### Authentication

- All endpoints require Firebase Auth token
- Verify `context.auth.uid` matches resource ownership
- Use Firestore Security Rules as additional layer

### Data Validation

- Validate all inputs server-side
- Sanitize user-provided text
- Check file sizes and types for uploads

### API Keys

- Store in Firebase Functions config (environment variables)
- Never expose in client code
- Rotate keys regularly

### Rate Limiting

- Implement rate limiting for external API calls
- Use Firebase Functions quotas
- Monitor API usage

### Error Messages

- Never expose internal errors to clients
- Log detailed errors server-side
- Return generic error messages to users

---

## Testing Strategy

### Unit Tests

- Test service functions independently
- Mock external API calls
- Test error handling

### Integration Tests

- Test Firebase Functions endpoints
- Test Firestore operations
- Test external API integrations

### Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @firebase/rules-unit-testing

# Test configuration
# jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

### Test Example

```typescript
// functions/src/__tests__/services/claude.test.ts
import { sendToClaude } from '../services/claude';

describe('Claude Service', () => {
  it('should send message to Claude API', async () => {
    const response = await sendToClaude('Test message');
    expect(response.response).toBeDefined();
    expect(response.tokensUsed).toBeGreaterThan(0);
  });

  it('should handle API errors', async () => {
    // Mock API failure
    await expect(sendToClaude('')).rejects.toThrow();
  });
});
```

---

## Deployment & Monitoring

### Firebase Functions Deployment

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:getUserProfile

# Set environment variables
firebase functions:config:set deepgram.api_key="your-key"
firebase functions:config:set claude.api_key="your-key"
```

### Monitoring

- Use Firebase Console for function logs
- Set up alerts for function errors
- Monitor API quota usage
- Track function execution times

### Performance Optimization

- Use Firestore indexes for queries
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize external API calls

---

## Implementation Checklist

### Phase 1: Firebase Setup ✓

- [ ] Initialize Firebase project
- [ ] Set up Firebase Functions
- [ ] Configure Firestore database
- [ ] Set up Firebase Storage
- [ ] Configure Security Rules
- [ ] Set up environment variables

### Phase 2: Authentication ✓

- [ ] Implement user creation trigger
- [ ] Implement getUserProfile endpoint
- [ ] Implement updateUserPreferences endpoint
- [ ] Test authentication flows

### Phase 3: Voice Processing ✓

- [ ] Set up Deepgram integration
- [ ] Implement audio upload trigger
- [ ] Implement transcription service
- [ ] Test voice processing pipeline

### Phase 4: AI Integration ✓

- [ ] Set up Claude API integration
- [ ] Implement AI response generation
- [ ] Implement mood analysis
- [ ] Set up ElevenLabs TTS
- [ ] Implement conversation history
- [ ] Test AI integrations

### Phase 5: Journal Management ✓

- [ ] Implement createJournalEntry
- [ ] Implement getJournalEntries (with pagination)
- [ ] Implement getJournalEntry
- [ ] Implement updateJournalEntry
- [ ] Implement deleteJournalEntry
- [ ] Implement user stats updates
- [ ] Test all journal operations

### Phase 6: Analytics ✓

- [ ] Implement getMoodTrends
- [ ] Implement getInsightsSummary
- [ ] Test analytics endpoints

### Final Steps

- [ ] Complete integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation completion
- [ ] Deploy to production

---

## Next Steps After Backend Completion

Once backend is fully implemented and tested:

1. **API Documentation:** Generate OpenAPI/Swagger docs
2. **Frontend Integration:** Connect React Native app to Firebase Functions
3. **UI/UX Implementation:** Build screens and components
4. **Testing:** End-to-end testing
5. **Launch:** Deploy to app stores

---

## Resources & References

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Deepgram API Documentation](https://developers.deepgram.com/)
- [Claude API Documentation](https://docs.anthropic.com/)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)

---

_This document is a living specification and should be updated as the backend evolves._
