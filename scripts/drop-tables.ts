import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) throw new Error('DATABASE_URL is not set');

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function dropTables() {
  console.log('Dropping tables...');
  await client`DROP TABLE IF EXISTS "vendor_order_items" CASCADE`;
  await client`DROP TABLE IF EXISTS "vendor_orders" CASCADE`;
  await client`DROP TABLE IF EXISTS "orders" CASCADE`;
  await client`DROP TABLE IF EXISTS "cart_items" CASCADE`;
  await client`DROP TABLE IF EXISTS "carts" CASCADE`;
  await client`DROP TABLE IF EXISTS "products" CASCADE`;
  await client`DROP TABLE IF EXISTS "categories" CASCADE`;
  await client`DROP TABLE IF EXISTS "vendors" CASCADE`;
  await client`DROP TABLE IF EXISTS "users" CASCADE`;
  console.log('Tables dropped.');
  process.exit(0);
}
dropTables();
