/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling patterns across the app.
 */

import { FirebaseError } from 'firebase/app';

import { logger } from './logger';

// ============================================================================
// Custom Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly userMessage: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string, userMessage: string, originalError?: unknown) {
    super(message, code, userMessage, originalError);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(
      message,
      'NETWORK_ERROR',
      'Unable to connect. Please check your internet.',
      originalError
    );
    this.name = 'NetworkError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'STORAGE_ERROR', 'Failed to save data. Please try again.', originalError);
    this.name = 'StorageError';
  }
}

// ============================================================================
// Firebase Error Mapping
// ============================================================================

const FIREBASE_AUTH_ERROR_MAP: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/invalid-credential': 'Invalid email or password.',
};

const FIREBASE_FIRESTORE_ERROR_MAP: Record<string, string> = {
  'permission-denied': "You don't have permission to perform this action.",
  unavailable: 'Service temporarily unavailable. Please try again.',
  'not-found': 'The requested data was not found.',
};

// ============================================================================
// Error Handling Functions
// ============================================================================

/**
 * Extracts a user-friendly message from any error type
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  // Handle our custom errors
  if (error instanceof AppError) {
    return error.userMessage;
  }

  // Handle Firebase errors
  if (error instanceof FirebaseError) {
    const authMessage = FIREBASE_AUTH_ERROR_MAP[error.code];
    if (authMessage) return authMessage;

    const firestoreMessage = FIREBASE_FIRESTORE_ERROR_MAP[error.code];
    if (firestoreMessage) return firestoreMessage;
  }

  // Handle standard errors
  if (error instanceof Error) {
    // Don't expose internal error messages
    if (error.message.includes('Firebase') || error.message.includes('firestore')) {
      return 'Something went wrong. Please try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Logs error with full context (internal use only)
 */
export const logError = (
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
): void => {
  const errorDetails = {
    operation,
    timestamp: new Date().toISOString(),
    ...context,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  };

  logger.error(`[${operation}] Failed`, errorDetails);
};

/**
 * Wraps an async function with consistent error handling
 * @param operation - Name of the operation for logging
 * @param fn - Async function to execute
 * @param context - Optional context for logging
 * @returns Result of fn, or throws AppError with user-friendly message
 */
export const withErrorHandling = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    logError(operation, error, context);
    throw new AppError(
      `${operation} failed`,
      'OPERATION_FAILED',
      getUserFriendlyMessage(error),
      error
    );
  }
};

/**
 * Safe async execution that doesn't throw
 * Returns { data, error } tuple
 */
export const safeAsync = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    logError(operation, error, context);
    const appError = new AppError(
      `${operation} failed`,
      'OPERATION_FAILED',
      getUserFriendlyMessage(error),
      error
    );
    return { data: null, error: appError };
  }
};

/**
 * For operations that can fail silently (non-critical)
 * Logs error but doesn't throw
 */
export const silentAsync = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    logError(operation, error, { ...context, silent: true });
    return null;
  }
};
