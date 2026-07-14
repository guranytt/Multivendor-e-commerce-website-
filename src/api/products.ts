import { Router } from 'express';
import { db } from '../db/db';
import { products, vendors } from '../db/schema';
import { eq, and, ilike, or } from 'drizzle-orm';
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

const requireVendor = async (req: any, res: any, next: any) => {
  const dbVendors = await db.select().from(vendors).where(eq(vendors.userId, req.user.id));
  if (!dbVendors.length || dbVendors[0].status !== 'approved') {
    return res.status(403).json({ error: 'Forbidden. Vendor not approved.' });
  }
  req.vendor = dbVendors[0];
  next();
};

// Vendor creates product
router.post('/', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    const { title, description, categoryId, priceCents, inventoryCount } = req.body;
    const newProduct = await db.insert(products).values({
      vendorId: req.vendor.id,
      title,
      description,
      categoryId,
      priceCents,
      inventoryCount
    }).returning();
    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Vendor gets their products
router.get('/me', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    const myProducts = await db.select().from(products).where(eq(products.vendorId, req.vendor.id));
    res.json(myProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Vendor updates product (Must check vendor_id == req.vendor.id!)
router.put('/:id', requireAuth, requireVendor, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, priceCents, inventoryCount } = req.body;
    const updated = await db.update(products)
      .set({ title, description, categoryId, priceCents, inventoryCount })
      .where(and(eq(products.id, parseInt(id)), eq(products.vendorId, req.vendor.id)))
      .returning();
    
    if (!updated.length) return res.status(404).json({ error: 'Not found or not your product' });
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Get all products (Public)
router.get('/', async (req: any, res: any) => {
  try {
    const { search } = req.query;
    let query = db.select().from(products);
    
    if (search && typeof search === 'string') {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          ilike(products.title, searchTerm),
          ilike(products.description, searchTerm)
        )
      ) as any;
    }
    
    const allProducts = await query;
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
