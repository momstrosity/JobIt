import { beforeEach, describe, it, expect } from 'vitest';
import { authService } from '../services/auth-service';
import { RegisterCredentials, LoginCredentials } from '../types/auth';

describe('Authentication Service', () => {
  // Reset state before each test
  beforeEach(() => {
    // @ts-ignore
    authService.users = new Map();
  });

  const validUser: RegisterCredentials = {
    email: 'test@example.com',
    password: 'StrongPass123',
    confirmPassword: 'StrongPass123'
  };

  const validLogin: LoginCredentials = {
    email: 'test@example.com',
    password: 'StrongPass123'
  };

  it('should register a new user successfully', async () => {
    const user = await authService.register(validUser);
    expect(user.email).toBe(validUser.email);
    expect(user.id).toBeDefined();
  });

  it('should prevent registering a duplicate user', async () => {
    await authService.register(validUser);
    await expect(authService.register(validUser)).rejects.toThrow('User already exists');
  });

  it('should login with valid credentials', async () => {
    await authService.register(validUser);
    const user = await authService.login(validLogin);
    expect(user.email).toBe(validUser.email);
  });

  it('should reject login with invalid email', async () => {
    await authService.register(validUser);
    await expect(
      authService.login({ email: 'wrong@example.com', password: 'StrongPass123' })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should reject login with invalid password', async () => {
    await authService.register(validUser);
    await expect(
      authService.login({ email: validUser.email, password: 'WrongPassword' })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should validate email format', async () => {
    await expect(
      authService.register({
        email: 'invalid-email',
        password: 'StrongPass123',
        confirmPassword: 'StrongPass123'
      })
    ).rejects.toThrow('Invalid email format');
  });

  it('should validate password strength', async () => {
    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak'
      })
    ).rejects.toThrow('Password must be at least 8 characters');
  });

  it('should require matching passwords during registration', async () => {
    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'StrongPass123',
        confirmPassword: 'DifferentPassword'
      })
    ).rejects.toThrow('Passwords do not match');
  });
});