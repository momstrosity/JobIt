import { LoginCredentials, RegisterCredentials } from '../types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateLoginCredentials = (credentials: LoginCredentials): string[] => {
  const errors: string[] = [];

  if (!validateEmail(credentials.email)) {
    errors.push('Invalid email format');
  }

  if (!validatePassword(credentials.password)) {
    errors.push('Password must be at least 8 characters, include uppercase, lowercase, and number');
  }

  return errors;
};

export const validateRegisterCredentials = (credentials: RegisterCredentials): string[] => {
  const errors = validateLoginCredentials(credentials);

  if (credentials.password !== credentials.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};