import { logger } from '../logger';

// Mock console methods
global.console = {
  ...global.console,
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log info messages in DEV mode', () => {
    // Mock __DEV__ to true
    (global as any).__DEV__ = true;
    
    logger.info('Test message', { foo: 'bar' });
    
    expect(console.info).toHaveBeenCalledWith(
      '[RecoverVoice] Test message',
      { foo: 'bar' }
    );
  });

  it('should log warn messages in DEV mode', () => {
    (global as any).__DEV__ = true;
    logger.warn('Warning!');
    expect(console.warn).toHaveBeenCalledWith(
      '[RecoverVoice] Warning!',
      ''
    );
  });

  it('should log error messages in DEV mode', () => {
    (global as any).__DEV__ = true;
    logger.error('Error!', { err: 'oops' });
    expect(console.error).toHaveBeenCalledWith(
      '[RecoverVoice] Error!',
      { err: 'oops' }
    );
  });

  it('should NOT log in production mode', () => {
    // Mock __DEV__ to false
    (global as any).__DEV__ = false;
    
    logger.info('Test message');
    logger.warn('Warning');
    logger.error('Error');
    
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
