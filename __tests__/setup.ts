import dotenv from 'dotenv';
import path from 'path';

// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.example') });