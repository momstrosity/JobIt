import * as BetterAuth from 'better-auth';

const authConfig = {
  secret: process.env.AUTH_SECRET || 'your_fallback_secret', // IMPORTANT: Use a secure, environment-specific secret
  tokenExpiration: '7d',
  passwordResetTokenExpiration: '1h',
  emailVerificationTokenExpiration: '24h',
  passwordHashRounds: 10,
  loginAttempts: {
    max: 5,
    resetTime: 60 * 60 * 1000, // 1 hour
  },
};

export default authConfig;