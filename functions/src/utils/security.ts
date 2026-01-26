/**
 * Security Utilities for Firebase Functions
 *
 * Input validation, sanitization, and security helpers.
 * All callable functions should use these utilities.
 */

import * as functions from 'firebase-functions/v1';

// ============================================
// Input Validation
// ============================================

/**
 * Validates and sanitizes a string input
 * Throws HttpsError if validation fails
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {}
): string | undefined {
  const { required = false, minLength = 0, maxLength = 10000, pattern } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new functions.https.HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be a string`);
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} cannot be empty`);
  }

  if (trimmed.length < minLength) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} must be at least ${minLength} characters`
    );
  }

  if (trimmed.length > maxLength) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} exceeds maximum length of ${maxLength} characters`
    );
  }

  if (pattern && !pattern.test(trimmed)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} has invalid format`);
  }

  return trimmed;
}

/**
 * Validates a number input
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number | undefined {
  const { required = false, min, max, integer = false } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new functions.https.HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return undefined;
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be a number`);
  }

  if (integer && !Number.isInteger(value)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be an integer`);
  }

  if (min !== undefined && value < min) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} must be at least ${min}`
    );
  }

  if (max !== undefined && value > max) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} must be at most ${max}`
    );
  }

  return value;
}

/**
 * Validates an array input
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    itemValidator?: (item: unknown, index: number) => T;
  } = {}
): T[] | undefined {
  const { required = false, minLength = 0, maxLength = 100, itemValidator } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new functions.https.HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be an array`);
  }

  if (value.length < minLength) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} must have at least ${minLength} items`
    );
  }

  if (value.length > maxLength) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `${fieldName} exceeds maximum of ${maxLength} items`
    );
  }

  if (itemValidator) {
    return value.map((item, index) => itemValidator(item, index));
  }

  return value as T[];
}

/**
 * Validates an object input
 */
export function validateObject<T>(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
  } = {}
): T | undefined {
  const { required = false } = options;

  if (value === undefined || value === null) {
    if (required) {
      throw new functions.https.HttpsError('invalid-argument', `${fieldName} is required`);
    }
    return undefined;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be an object`);
  }

  return value as T;
}

// ============================================
// Conversation Turn Validation
// ============================================

export interface ValidatedConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Validates a conversation turn
 */
export function validateConversationTurn(
  turn: unknown,
  index: number
): ValidatedConversationTurn {
  if (!turn || typeof turn !== 'object') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `conversationHistory[${index}] must be an object`
    );
  }

  const turnObj = turn as Record<string, unknown>;

  if (turnObj.role !== 'user' && turnObj.role !== 'assistant') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `conversationHistory[${index}].role must be 'user' or 'assistant'`
    );
  }

  const content = validateString(turnObj.content, `conversationHistory[${index}].content`, {
    required: true,
    maxLength: 5000,
  });

  return {
    role: turnObj.role,
    content: content!,
  };
}

// ============================================
// Authentication Helpers
// ============================================

/**
 * Ensures the request is authenticated
 * Throws if not authenticated
 */
export function requireAuth(context: functions.https.CallableContext): string {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  return context.auth.uid;
}

/**
 * Ensures the request has App Check token (if enforced)
 */
export function requireAppCheck(context: functions.https.CallableContext): void {
  // App Check is optional but recommended
  // Set APP_CHECK_REQUIRED=true in environment to enforce
  if (process.env.APP_CHECK_REQUIRED === 'true' && !context.app) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'App Check verification failed'
    );
  }
}

// ============================================
// Sanitization
// ============================================

/**
 * Sanitizes a string for safe storage/display
 * Removes potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitizes user context object
 */
export function sanitizeUserContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value).substring(0, 500);
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    }
    // Skip other types for safety
  }

  return sanitized;
}

// ============================================
// Error Handling
// ============================================

/**
 * Wraps a function handler with standardized error handling
 * Ensures errors don't leak sensitive information
 */
export function withSecureErrorHandling<T, R>(
  handler: (data: T, context: functions.https.CallableContext) => Promise<R>
): (data: T, context: functions.https.CallableContext) => Promise<R> {
  return async (data: T, context: functions.https.CallableContext) => {
    try {
      return await handler(data, context);
    } catch (error) {
      // Re-throw HttpsErrors as-is (they're already safe)
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      // Log the actual error for debugging
      console.error('Unhandled error in function:', error);

      // Return generic error to client
      throw new functions.https.HttpsError(
        'internal',
        'An unexpected error occurred. Please try again.'
      );
    }
  };
}
