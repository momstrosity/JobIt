import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../lib/auth-service';
import { LoginSchema, RegisterSchema } from '../lib/auth-schema';

describe('Authentication Service', () => {
  const validUser = {
    email: 'test@example.com',
    password: 'ValidPassword123!'
  };

  beforeEach(async () => {
    try {
      await authService.register({
        ...validUser,
        name: 'Test User'
      });
    } catch {
      // User might already exist, which is fine
    }
  });

  describe('Registration', () => {
    it('should successfully register a new user', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'NewPassword456!',
        name: 'New User'
      };

      const registeredUser = await authService.register(newUser);
      expect(registeredUser.email).toBe(newUser.email);
      expect(registeredUser.id).toBeDefined();
    });

    it('should prevent duplicate email registration', async () => {
      await expect(authService.register({
        ...validUser,
        name: 'Duplicate User'
      })).rejects.toThrow('User already exists');
    });
  });

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const user = await authService.login(validUser);
      expect(user.email).toBe(validUser.email);
    });

    it('should throw error for invalid login credentials', async () => {
      await expect(authService.login({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Validation Schemas', () => {
    it('should validate login credentials correctly', () => {
      const result = LoginSchema.safeParse(validUser);
      expect(result.success).toBeTruthy();
    });

    it('should reject invalid email', () => {
      const result = LoginSchema.safeParse({
        ...validUser,
        email: 'invalid-email'
      });
      expect(result.success).toBeFalsy();
    });

    it('should reject short password', () => {
      const result = LoginSchema.safeParse({
        ...validUser,
        password: 'short'
      });
      expect(result.success).toBeFalsy();
    });
  });
});