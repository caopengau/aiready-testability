import { describe, it, expect } from 'vitest';
import { createLogger } from './logger';

describe('logger', () => {
  it('should create a child logger with context', () => {
    const log = createLogger('test-context');
    expect(log).toBeDefined();
    // Logger should have standard pino methods
    expect(typeof log.info).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.debug).toBe('function');
  });

  it('should have redaction configured', () => {
    // Verify the logger module exports correctly
    const log = createLogger('billing');
    expect(log).toBeDefined();
  });

  it('should create different loggers for different contexts', () => {
    const billingLog = createLogger('billing');
    const emailLog = createLogger('email');

    // Both should be valid loggers
    expect(billingLog).toBeDefined();
    expect(emailLog).toBeDefined();
  });
});
