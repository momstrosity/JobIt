import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { validateLoginCredentials, validateRegisterCredentials } from '../lib/auth-utils';

class AuthService {
  private users: Map<string, User & { password: string }> = new Map();

  async register(credentials: RegisterCredentials): Promise<User> {
    const validationErrors = validateRegisterCredentials(credentials);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const existingUser = Array.from(this.users.values()).find(
      user => user.email === credentials.email
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email: credentials.email,
      password: this.hashPassword(credentials.password)
    };

    this.users.set(newUser.id, newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Validate email format first
    if (!credentials.email) {
      throw new Error('Invalid email or password');
    }

    // Find user by email
    const user = Array.from(this.users.values()).find(
      u => u.email === credentials.email
    );

    // Check if user exists
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if password is valid
    const isPasswordValid = this.comparePasswords(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private hashPassword(password: string): string {
    // Simple hashing for demonstration - use a robust library in production
    return btoa(password);
  }

  private comparePasswords(inputPassword: string, storedPassword: string): boolean {
    return btoa(inputPassword) === storedPassword;
  }
}

export const authService = new AuthService();