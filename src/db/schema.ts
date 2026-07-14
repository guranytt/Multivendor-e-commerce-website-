import { pgTable, text, timestamp, integer, boolean, uuid, serial, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table matches Supabase auth.users mostly, but we can keep our own copy synced or just manage our own metadata.
export const users = pgTable('users', {
  id: text('id').primaryKey(), // We will use Clerk string ID here
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('customer'), // 'admin' | 'vendor' | 'customer'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  shopName: text('shop_name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  bankName: text('bank_name'),
  bankAccountNumber: text('bank_account_number'),
  bankAccountName: text('bank_account_name'),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'suspended'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  title: text('title').notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  inventoryCount: integer('inventory_count').notNull().default(0),
  images: jsonb('images').default('[]').notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'inactive'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').notNull().references(() => carts.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => users.id),
  totalCents: integer('total_cents').notNull(),
  platformFeeCents: integer('platform_fee_cents').notNull(),
  status: text('status').notNull(),
  paystackReference: text('paystack_reference'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vendorOrders = pgTable('vendor_orders', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id),
  subtotalCents: integer('subtotal_cents').notNull(),
  vendorPayoutCents: integer('vendor_payout_cents').notNull(),
  fulfillmentStatus: text('fulfillment_status').notNull().default('pending'), // 'pending'|'processing'|'shipped'|'delivered'|'cancelled'
  payoutStatus: text('payout_status').notNull().default('unpaid'), // 'unpaid'|'paid'
  payoutPaidAt: timestamp('payout_paid_at'),
  payoutPaidByAdminId: text('payout_paid_by_admin_id').references(() => users.id),
  payoutNote: text('payout_note'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
});

export const vendorOrderItems = pgTable('vendor_order_items', {
  id: serial('id').primaryKey(),
  vendorOrderId: integer('vendor_order_id').notNull().references(() => vendorOrders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchaseCents: integer('price_at_purchase_cents').notNull(),
});
