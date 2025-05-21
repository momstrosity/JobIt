import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection configuration
const dbConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jobit_database',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  max: 20, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
};

// Create connection pool with option to disable real connections in test
function createPoolInstance(config: PoolConfig = dbConfig) {
  if (process.env.NODE_ENV === 'test') {
    // For testing, return a mock pool
    return {
      connect: () => Promise.resolve({
        query: () => Promise.resolve({ rows: [] }),
        release: () => {}
      }),
      query: () => Promise.resolve({ rows: [] }),
      end: () => Promise.resolve()
    } as any;
  }
  return new Pool(config);
}

const pool = createPoolInstance();

// Export database connection pool
export default pool;

// Helper function to execute queries with error handling
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to test database connection
export const testConnection = async () => {
  if (process.env.NODE_ENV === 'test') return true;

  try {
    const client = await pool.connect();
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};