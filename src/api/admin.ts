import { Router } from 'express';
import { db } from '../db/db';
import { vendors, vendorOrders, users } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
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

// Admin gets unpaid vendor_orders grouped by vendor
router.get('/payouts', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const unpaidOrders = await db.select({
      vendor: vendors,
      vendorOrder: vendorOrders
    }).from(vendorOrders)
      .innerJoin(vendors, eq(vendorOrders.vendorId, vendors.id))
      .where(eq(vendorOrders.payoutStatus, 'unpaid'));

    const grouped: Record<number, any> = {};
    for (const row of unpaidOrders) {
      const vId = row.vendor.id;
      if (!grouped[vId]) {
        grouped[vId] = {
          vendor: row.vendor,
          totalOwedCents: 0,
          orders: []
        };
      }
      grouped[vId].totalOwedCents += row.vendorOrder.vendorPayoutCents;
      grouped[vId].orders.push(row.vendorOrder);
    }
    
    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

// Admin marks a vendor's unpaid orders as paid
router.post('/payouts/:vendorId/pay', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const { vendorId } = req.params;
    const { note } = req.body;
    
    const updated = await db.update(vendorOrders)
      .set({
        payoutStatus: 'paid',
        payoutPaidAt: new Date(),
        payoutPaidByAdminId: req.user.id,
        payoutNote: note || null
      })
      .where(
        and(
          eq(vendorOrders.vendorId, parseInt(vendorId)),
          eq(vendorOrders.payoutStatus, 'unpaid')
        )
      ).returning();

    // In a real application, send Resend email to vendor here
    // e.g. await resend.emails.send({...})
    console.log(`[Email Mock] Sent payout notification to vendor ${vendorId}`);

    res.json({ success: true, updatedCount: updated.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payout' });
  }
});

export default router;
