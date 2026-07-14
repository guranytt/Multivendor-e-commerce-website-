import { Router } from 'express';
import { db } from '../db/db';
import { vendors, users, vendorOrders, orders } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  
  req.user = user;
  next();
};

const requireAdmin = async (req: any, res: any, next: any) => {
  const dbUser = await db.select().from(users).where(eq(users.id, req.user.id));
  if (!dbUser.length || dbUser[0].role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const requireVendor = async (req: any, res: any, next: any) => {
  const dbVendors = await db.select().from(vendors).where(eq(vendors.userId, req.user.id));
  if (!dbVendors.length || dbVendors[0].status !== 'approved') {
    return res.status(403).json({ error: 'Forbidden. Vendor not approved.' });
  }
  req.vendor = dbVendors[0];
  next();
};

// Vendor Onboarding
router.post('/onboard', requireAuth, async (req: any, res: any) => {
  try {
    const { shopName, description, bankName, bankAccountNumber, bankAccountName } = req.body;
    
    // Create or update vendor profile
    const existing = await db.select().from(vendors).where(eq(vendors.userId, req.user.id));
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Vendor profile already exists' });
    }

    // Insert vendor
    const newVendor = await db.insert(vendors).values({
      userId: req.user.id,
      shopName,
      description,
      bankName,
      bankAccountNumber,
      bankAccountName,
      status: 'pending',
    }).returning();

    // Ensure user exists in our users table and update role
    const existingUser = await db.select().from(users).where(eq(users.id, req.user.id));
    if (!existingUser.length) {
      await db.insert(users).values({
        id: req.user.id,
        email: req.user.email,
        role: 'vendor'
      });
    } else {
      await db.update(users).set({ role: 'vendor' }).where(eq(users.id, req.user.id));
    }

    res.status(201).json(newVendor[0]);
  } catch (error) {
    console.error('Onboard error:', error);
    res.status(500).json({ error: 'Failed to onboard vendor' });
  }
});

// Admin getting pending/all vendors
router.get('/', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const allVendors = await db.select().from(vendors);
    res.json(allVendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get current vendor profile
router.get('/me', requireAuth, async (req: any, res: any) => {
  try {
    const profile = await db.select().from(vendors).where(eq(vendors.userId, req.user.id));
    if (profile.length > 0) {
      res.json(profile[0]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Admin approves vendor
router.put('/:id/approve', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updated = await db.update(vendors)
      .set({ status: 'approved' })
      .where(eq(vendors.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve vendor' });
  }
});

// Vendor gets their orders
router.get('/orders', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    // We join with `orders` to get customer details or order date
    const vOrders = await db.select({
      vendorOrder: vendorOrders,
      order: orders
    }).from(vendorOrders)
      .innerJoin(orders, eq(vendorOrders.orderId, orders.id))
      .where(eq(vendorOrders.vendorId, req.vendor.id));
      
    res.json(vOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor orders' });
  }
});

// Vendor updates their order status
router.put('/orders/:id/status', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Must include eq(vendorOrders.vendorId, req.vendor.id) to ensure they own it!
    const updated = await db.update(vendorOrders)
      .set({
        fulfillmentStatus: status,
        ...(status === 'shipped' ? { shippedAt: new Date() } : {}),
        ...(status === 'delivered' ? { deliveredAt: new Date() } : {})
      })
      .where(
        and(
          eq(vendorOrders.id, parseInt(id)),
          eq(vendorOrders.vendorId, req.vendor.id)
        )
      ).returning();
      
    if (!updated.length) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }
    
    console.log(`[Email Mock] Sent customer update email for order ${id} new status: ${status}`);
    
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
