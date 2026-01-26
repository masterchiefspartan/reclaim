/**
 * Rate Limiter Utility for Firebase Functions
 *
 * Uses Firestore for persistent rate limiting across function invocations.
 * Implements sliding window algorithm for smooth rate limiting.
 */

import * as admin from 'firebase-admin';

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Collection name in Firestore for storing rate limit data */
  collection?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULT_COLLECTION = '_rateLimits';

/**
 * Check if a request is allowed under the rate limit
 * Uses Firestore for persistent storage across function invocations
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowMs, collection = DEFAULT_COLLECTION } = config;
  const now = Date.now();
  const windowStart = now - windowMs;

  const db = admin.firestore();
  const docRef = db.collection(collection).doc(identifier);

  try {
    const result = await db.runTransaction(async transaction => {
      const doc = await transaction.get(docRef);
      const data = doc.data() || { requests: [] };

      // Filter out requests outside the current window
      const recentRequests: number[] = (data.requests || []).filter(
        (timestamp: number) => timestamp > windowStart
      );

      // Check if under limit
      if (recentRequests.length >= maxRequests) {
        // Find when the oldest request in window will expire
        const oldestInWindow = Math.min(...recentRequests);
        const resetAt = oldestInWindow + windowMs;

        return {
          allowed: false,
          remaining: 0,
          resetAt,
        };
      }

      // Add current request
      recentRequests.push(now);

      // Update document
      transaction.set(docRef, {
        requests: recentRequests,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        allowed: true,
        remaining: maxRequests - recentRequests.length,
        resetAt: now + windowMs,
      };
    });

    return result;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if rate limiting fails
    // You may want to fail closed in high-security scenarios
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: now + windowMs,
    };
  }
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const RateLimiters = {
  /**
   * Standard API rate limit: 60 requests per minute
   */
  standard: (userId: string) =>
    checkRateLimit(`standard:${userId}`, {
      maxRequests: 60,
      windowMs: 60 * 1000, // 1 minute
    }),

  /**
   * Strict rate limit for expensive operations: 10 requests per minute
   * Use for: AI generation, token requests
   */
  strict: (userId: string) =>
    checkRateLimit(`strict:${userId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
    }),

  /**
   * Very strict rate limit: 5 requests per minute
   * Use for: Token generation, expensive AI calls
   */
  veryStrict: (userId: string) =>
    checkRateLimit(`veryStrict:${userId}`, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
    }),

  /**
   * Burst limit: 100 requests per minute
   * Use for: Read operations, lightweight calls
   */
  burst: (userId: string) =>
    checkRateLimit(`burst:${userId}`, {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
    }),

  /**
   * Daily limit: 500 requests per day
   * Use for: Premium features, costly operations
   */
  daily: (userId: string) =>
    checkRateLimit(`daily:${userId}`, {
      maxRequests: 500,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
    }),
};

/**
 * Clean up old rate limit records (run periodically)
 * Call this from a scheduled function to prevent unbounded storage growth
 */
export async function cleanupRateLimits(olderThanMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  const db = admin.firestore();
  const collection = db.collection(DEFAULT_COLLECTION);
  const cutoff = new Date(Date.now() - olderThanMs);

  const snapshot = await collection.where('updatedAt', '<', cutoff).limit(500).get();

  if (snapshot.empty) {
    return 0;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  return snapshot.size;
}
