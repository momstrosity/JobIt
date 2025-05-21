import pool from '../config/database';
import { testConnection } from '../config/database';

// Define custom error for authentication
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthService {
  betterAuth: any;

  constructor() {
    // Configuration for authentication
    const authConfig = {
      database: {
        pool,
        usersTable: 'users',
        identityTable: 'user_identities'
      },
      security: {
        saltRounds: 10,
        tokenExpiration: '1h',
        jwtSecret: process.env.JWT_SECRET || 'fallback_secret'
      },
      validation: {
        email: {
          required: true,
          minLength: 5,
          maxLength: 100
        },
        password: {
          required: true,
          minLength: 8,
          maxLength: 72
        }
      }
    };

    // Only verify connection in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      this.verifyDatabaseConnection();
    }

    // Mock implementation for better-auth
    this.betterAuth = {
      register: async (data: any) => {
        // Simulated registration
        return { id: 'mock-user-id', email: data.email };
      },
      login: async (data: any) => {
        // Simulated login
        return { token: 'mock-token', userId: 'mock-user-id' };
      },
      verifyToken: async (token: string) => {
        // Simulated token verification
        return { valid: true, userId: 'mock-user-id' };
      }
    };
  }

  // Verify database connection during initialization
  private async verifyDatabaseConnection() {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new AuthenticationError('Database connection failed');
    }
  }

  // User registration method
  async registerUser(
    email: string, 
    password: string, 
    additionalData?: Record<string, any>
  ) {
    try {
      return await this.betterAuth.register({
        email,
        password,
        ...additionalData
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw new AuthenticationError('User registration failed');
    }
  }

  // User login method
  async loginUser(
    email: string, 
    password: string
  ) {
    try {
      return await this.betterAuth.login({
        email,
        password
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new AuthenticationError('Invalid credentials');
    }
  }

  // JWT token verification
  async verifyToken(token: string) {
    try {
      return await this.betterAuth.verifyToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      throw new AuthenticationError('Invalid or expired token');
    }
  }
}

const authService = new AuthService();
export default authService;