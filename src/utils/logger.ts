/**
 * Centralized Logger Utility
 * Provides consistent logging with context and environment awareness.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

const formatPayload = (payload: unknown): string => {
  if (payload === undefined || payload === null || payload === '') {
    return '';
  }
  try {
    return typeof payload === 'object' ? JSON.stringify(payload, null, 2) : String(payload);
  } catch {
    return '[Unable to serialize]';
  }
};

const log = (level: LogLevel, message: string, context?: LogContext): void => {
  // Only log in development or if explicitly enabled
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

  if (!isDev && level !== 'error') {
    return; // Only log errors in production
  }

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [RecoverVoice]`;
  const formattedContext = formatPayload(context);

  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.log(`${prefix} DEBUG: ${message}`, formattedContext);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.log(`${prefix} INFO: ${message}`, formattedContext);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(`${prefix} WARN: ${message}`, formattedContext);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(`${prefix} ERROR: ${message}`, formattedContext);
      break;
  }
};

export const logger = {
  debug: (message: string, context?: LogContext): void => log('debug', message, context),
  info: (message: string, context?: LogContext): void => log('info', message, context),
  warn: (message: string, context?: LogContext): void => log('warn', message, context),
  error: (message: string, context?: LogContext): void => log('error', message, context),
};
