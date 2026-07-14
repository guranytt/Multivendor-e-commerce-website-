import { Router } from 'express';
import { db } from '../db/db';
import { orders, vendorOrders, vendors } from '../db/schema';
import { eq } from 'drizzle-orm';
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

// Customer gets their orders
router.get('/me', requireAuth, async (req: any, res: any) => {
  try {
    const customerOrders = await db.select().from(orders).where(eq(orders.customerId, req.user.id));
    
    // Fetch associated vendor orders
    const allVendorOrders = await db.select({
      vendorOrder: vendorOrders,
      vendor: vendors
    }).from(vendorOrders)
      .innerJoin(vendors, eq(vendorOrders.vendorId, vendors.id));

    const result = customerOrders.map(o => {
      const vOrders = allVendorOrders
        .filter(vo => vo.vendorOrder.orderId === o.id)
        .map(vo => ({
          ...vo.vendorOrder,
          vendorShopName: vo.vendor.shopName
        }));
      return {
        ...o,
        vendorOrders: vOrders
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

export default router;
