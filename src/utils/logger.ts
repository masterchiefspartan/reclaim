type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, payload?: unknown) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console[level](`[RecoverVoice] ${message}`, payload ?? '');
  }
};

export const logger = {
  info: (message: string, payload?: unknown) => log('info', message, payload),
  warn: (message: string, payload?: unknown) => log('warn', message, payload),
  error: (message: string, payload?: unknown) => log('error', message, payload),
};

