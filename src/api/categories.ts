import { Router } from 'express';
import { db } from '../db/db';
import { categories, users } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();



// Auth middleware
const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { verifyToken } = await import('@clerk/backend');
    const verifiedSession = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    req.user = { id: verifiedSession.sub };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const requireAdmin = async (req: any, res: any, next: any) => {
  const dbUser = await db.select().from(users).where(eq(users.id, req.user.id));
  if (!dbUser.length || dbUser[0].role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Get all categories
router.get('/', async (req: any, res: any) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const { name, slug, parentId } = req.body;
    const newCategory = await db.insert(categories).values({ name, slug, parentId }).returning();
    res.status(201).json(newCategory[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, slug, parentId } = req.body;
    const updated = await db.update(categories)
      .set({ name, slug, parentId })
      .where(eq(categories.id, parseInt(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.delete(categories).where(eq(categories.id, parseInt(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
