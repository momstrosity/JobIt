import { describe, it, expect } from 'vitest';
import { AuthService } from '../lib/auth/authentication';

describe('Authentication Service', () => {
  it('should create an instance of AuthService', () => {
    const authService = new AuthService();
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should have betterAuth property', () => {
    const authService = new AuthService();
    expect(authService.betterAuth).toBeDefined();
  });

  it('should have required authentication methods', () => {
    const authService = new AuthService();
    expect(authService.registerUser).toBeDefined();
    expect(authService.loginUser).toBeDefined();
    expect(authService.verifyToken).toBeDefined();
  });
});