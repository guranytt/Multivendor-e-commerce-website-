import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL is not set in the environment');
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Starting seed...');

  // 1. Create seed users
  const vendorUser1Id = crypto.randomUUID();
  const vendorUser2Id = crypto.randomUUID();

  console.log('Inserting users...');
  await db.insert(schema.users).values([
    {
      id: vendorUser1Id,
      email: 'vendor1@example.com',
      role: 'vendor',
    },
    {
      id: vendorUser2Id,
      email: 'vendor2@example.com',
      role: 'vendor',
    },
  ]).onConflictDoNothing();

  // 2. Create vendors
  console.log('Inserting vendors...');
  const insertedVendors = await db.insert(schema.vendors).values([
    {
      userId: vendorUser1Id,
      shopName: 'Tech Haven',
      description: 'All your tech needs',
      bankName: 'Test Bank',
      bankAccountNumber: '1234567890',
      bankAccountName: 'Tech Haven Ltd',
      status: 'approved',
    },
    {
      userId: vendorUser2Id,
      shopName: 'Green Life',
      description: 'Eco-friendly products',
      bankName: 'Test Bank',
      bankAccountNumber: '0987654321',
      bankAccountName: 'Green Life Inc',
      status: 'approved',
    },
  ]).returning({ id: schema.vendors.id }).onConflictDoNothing();

  let v1Id = insertedVendors[0]?.id;
  let v2Id = insertedVendors[1]?.id;

  if (!v1Id || !v2Id) {
    // If they already exist, fetch them
    const existing = await db.select().from(schema.vendors);
    v1Id = existing[0]?.id;
    v2Id = existing[1]?.id;
  }

  // 3. Create categories
  console.log('Inserting categories...');
  const insertedCategories = await db.insert(schema.categories).values([
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Toys', slug: 'toys' },
  ]).returning({ id: schema.categories.id }).onConflictDoNothing();

  let c1Id = insertedCategories[0]?.id;
  let c2Id = insertedCategories[1]?.id;

  if (!c1Id || !c2Id) {
    const existing = await db.select().from(schema.categories);
    c1Id = existing.find(c => c.slug === 'electronics')?.id;
    c2Id = existing.find(c => c.slug === 'home-garden')?.id;
  }

  // 4. Create products
  console.log('Inserting products...');
  if (v1Id && v2Id && c1Id && c2Id) {
    await db.insert(schema.products).values([
      { vendorId: v1Id, categoryId: c1Id, title: 'Wireless Mouse', description: 'Ergonomic mouse', priceCents: 2500, inventoryCount: 100 },
      { vendorId: v1Id, categoryId: c1Id, title: 'Mechanical Keyboard', description: 'Clicky keys', priceCents: 8500, inventoryCount: 50 },
      { vendorId: v1Id, categoryId: c1Id, title: 'USB-C Hub', description: '7 in 1', priceCents: 3500, inventoryCount: 200 },
      { vendorId: v1Id, categoryId: c1Id, title: 'Monitor Stand', description: 'Adjustable', priceCents: 4500, inventoryCount: 75 },
      { vendorId: v1Id, categoryId: c1Id, title: 'Webcam 1080p', description: 'Clear video', priceCents: 6000, inventoryCount: 40 },
      { vendorId: v2Id, categoryId: c2Id, title: 'Bamboo Toothbrush', description: 'Pack of 4', priceCents: 1200, inventoryCount: 300 },
      { vendorId: v2Id, categoryId: c2Id, title: 'Reusable Water Bottle', description: 'Stainless steel', priceCents: 2200, inventoryCount: 150 },
      { vendorId: v2Id, categoryId: c2Id, title: 'Cotton Tote Bag', description: 'Durable', priceCents: 800, inventoryCount: 500 },
      { vendorId: v2Id, categoryId: c2Id, title: 'Beeswax Wraps', description: 'Eco friendly plastic wrap alternative', priceCents: 1800, inventoryCount: 120 },
      { vendorId: v2Id, categoryId: c2Id, title: 'Compost Bin', description: 'Countertop size', priceCents: 3500, inventoryCount: 80 },
    ]).onConflictDoNothing();
  }

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
