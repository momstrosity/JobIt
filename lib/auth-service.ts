import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

// Simulated in-memory storage (replace with actual database later)
const USERS: User[] = [];

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const existingUser = USERS.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      email: credentials.email,
      name: credentials.name
    };

    USERS.push(newUser);
    return newUser;
  },

  login: async (credentials: LoginCredentials): Promise<User> => {
    const user = USERS.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  },

  getCurrentUser: (): User | null => {
    return USERS.length > 0 ? USERS[0] : null;
  }
};