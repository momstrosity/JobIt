import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const SALT_ROUNDS = parseInt(process.env.AUTH_SALT_ROUNDS || '10', 10);

export const hashPassword = (password: string): string => {
  const salt = createHash('sha256').update(String(Math.random())).digest('hex').slice(0, SALT_ROUNDS);
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (storedPassword: string, providedPassword: string): boolean => {
  const [salt, originalHash] = storedPassword.split(':');
  const hashedProvided = createHash('sha256').update(providedPassword + salt).digest('hex');
  return hashedProvided === originalHash;
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};