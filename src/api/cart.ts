import { Router } from 'express';
import { db } from '../db/db';
import { carts, cartItems, products, vendors } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();


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

// Get current user's cart
router.get('/', requireAuth, async (req: any, res: any) => {
  try {
    let cart = await db.select().from(carts).where(eq(carts.userId, req.user.id));
    if (!cart.length) {
      cart = await db.insert(carts).values({ userId: req.user.id }).returning();
    }
    const cartId = cart[0].id;

    const items = await db.select({
      cartItem: cartItems,
      product: products,
      vendor: vendors
    }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .innerJoin(vendors, eq(products.vendorId, vendors.id))
      .where(eq(cartItems.cartId, cartId));
    
    // Group by vendor
    const grouped: Record<number, any> = {};
    for (const row of items) {
      const vId = row.vendor.id;
      if (!grouped[vId]) {
        grouped[vId] = {
          vendor: row.vendor,
          items: []
        };
      }
      grouped[vId].items.push({
        ...row.cartItem,
        product: row.product
      });
    }

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/items', requireAuth, async (req: any, res: any) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await db.select().from(carts).where(eq(carts.userId, req.user.id));
    if (!cart.length) {
      cart = await db.insert(carts).values({ userId: req.user.id }).returning();
    }
    const cartId = cart[0].id;

    const existing = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));
    
    if (existing.length) {
      await db.update(cartItems)
        .set({ quantity: existing[0].quantity + quantity })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      await db.insert(cartItems).values({ cartId, productId, quantity });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Update cart item quantity
router.put('/items/:itemId', requireAuth, async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, parseInt(itemId)));
    } else {
      await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, parseInt(itemId)));
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove from cart
router.delete('/items/:itemId', requireAuth, async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    await db.delete(cartItems).where(eq(cartItems.id, parseInt(itemId)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

export default router;
