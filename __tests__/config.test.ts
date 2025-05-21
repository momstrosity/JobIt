import { describe, it, expect } from 'vitest';
import pool from '../lib/config/postgres';
import authConfig from '../lib/config/auth';

describe('Configuration Setup', () => {
  it('should have a valid PostgreSQL connection pool', () => {
    expect(pool).toBeDefined();
  });

  it('should have a valid authentication configuration', () => {
    expect(authConfig).toBeDefined();
    expect(authConfig.secret).toBeTruthy();
    expect(authConfig.tokenExpiration).toBe('7d');
  });
});