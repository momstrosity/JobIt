import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../lib/auth';

describe('Authentication Utilities', () => {
  const testPassword = 'securePassword123!';

  describe('Password Hashing', () => {
    it('should hash password with salt', () => {
      const hashedPassword = hashPassword(testPassword);
      expect(hashedPassword).toContain(':');
      expect(hashedPassword.split(':').length).toBe(2);
    });

    it('should verify correct password', () => {
      const hashedPassword = hashPassword(testPassword);
      const isValid = verifyPassword(hashedPassword, testPassword);
      expect(isValid).toBeTruthy();
    });

    it('should not verify incorrect password', () => {
      const hashedPassword = hashPassword(testPassword);
      const isValid = verifyPassword(hashedPassword, 'wrongPassword');
      expect(isValid).toBeFalsy();
    });
  });

  describe('Token Generation and Verification', () => {
    it('should generate and verify token', () => {
      const userId = '12345';
      const token = generateToken(userId);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.userId).toBe(userId);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalidToken';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });
  });
});