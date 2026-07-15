import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { 
  prepare: false,
  ssl: isLocal ? false : 'require',
  connect_timeout: 8, // Fail fast before Vercel 10s timeout
});
export const db = drizzle(client, { schema });
