import { Router } from 'express';
import { db } from '../db/db';
import { carts, cartItems, products, vendors, orders, vendorOrders, vendorOrderItems } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import crypto from 'crypto';

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

const PLATFORM_COMMISSION_PERCENT = 10; // 10% platform fee

router.post('/initialize', requireAuth, async (req: any, res: any) => {
  try {
    const userCart = await db.select().from(carts).where(eq(carts.userId, req.user.id));
    if (!userCart.length) return res.status(400).json({ error: 'Cart empty' });
    const cartId = userCart[0].id;

    const items = await db.select({
      cartItem: cartItems,
      product: products,
    }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));

    if (!items.length) return res.status(400).json({ error: 'Cart empty' });

    const totalCents = items.reduce((sum, { cartItem, product }) => sum + (product.priceCents * cartItem.quantity), 0);
    
    // In a real app, call Paystack API to initialize transaction:
    // https://api.paystack.co/transaction/initialize
    // For this MVP backend logic, we will return a mock authorization URL and reference.
    // The client would normally redirect to the auth URL.
    const reference = `ORDER-${crypto.randomUUID()}`;

    // Normally we pass metadata with cartId and userId so webhook knows what to fulfill
    res.json({
      authorization_url: 'https://checkout.paystack.com/mock-url', // Mock URL
      reference,
      totalCents
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize checkout' });
  }
});

// Paystack Webhook
router.post('/webhook', async (req: any, res: any) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || 'mock_secret';
    // Validate signature using raw body to ensure exact match with what Paystack sent
    const hash = crypto.createHmac('sha512', secret).update(req.rawBody || JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      // In production, reject if mismatch. Since this is MVP without real Paystack, we'll allow it if testing mode
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      // Extract custom metadata passed during initialize
      const userId = event.data.metadata?.userId;
      const totalCents = event.data.amount; // Paystack sends amount in kobo/cents

      // Idempotency check
      const existingOrder = await db.select().from(orders).where(eq(orders.paystackReference, reference));
      if (existingOrder.length > 0) {
        return res.status(200).send('Already processed');
      }

      // We need the user's cart. 
      // If metadata doesn't contain userId, we can't easily fulfill it unless we stored pending orders.
      // Assuming metadata has userId:
      if (!userId) return res.status(400).send('No user ID in metadata');

      const userCart = await db.select().from(carts).where(eq(carts.userId, userId));
      if (!userCart.length) return res.status(400).send('Cart not found');
      const cartId = userCart[0].id;

      const items = await db.select({
        cartItem: cartItems,
        product: products,
        vendor: vendors
      }).from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .innerJoin(vendors, eq(products.vendorId, vendors.id))
        .where(eq(cartItems.cartId, cartId));

      if (!items.length) return res.status(400).send('Cart is empty');

      // Calculate totals
      let orderTotalCents = 0;
      const vendorSubtotals: Record<number, { items: any[], subtotal: number }> = {};

      for (const { cartItem, product, vendor } of items) {
        const itemTotal = product.priceCents * cartItem.quantity;
        orderTotalCents += itemTotal;
        if (!vendorSubtotals[vendor.id]) {
          vendorSubtotals[vendor.id] = { items: [], subtotal: 0 };
        }
        vendorSubtotals[vendor.id].items.push({ cartItem, product });
        vendorSubtotals[vendor.id].subtotal += itemTotal;
      }

      const platformFeeCents = Math.floor(orderTotalCents * (PLATFORM_COMMISSION_PERCENT / 100));

      // Transaction-like operations
      // 1. Create Order
      const newOrder = await db.insert(orders).values({
        customerId: userId,
        totalCents: orderTotalCents,
        platformFeeCents,
        status: 'paid',
        paystackReference: reference
      }).returning();

      // 2. Create Vendor Orders and Items
      for (const [vId, data] of Object.entries(vendorSubtotals)) {
        const vendorId = parseInt(vId);
        const subtotalCents = data.subtotal;
        const vendorPlatformFee = Math.floor(subtotalCents * (PLATFORM_COMMISSION_PERCENT / 100));
        const vendorPayoutCents = subtotalCents - vendorPlatformFee;

        const vOrder = await db.insert(vendorOrders).values({
          orderId: newOrder[0].id,
          vendorId,
          subtotalCents,
          vendorPayoutCents,
          fulfillmentStatus: 'pending',
          payoutStatus: 'unpaid'
        }).returning();

        const vItems = data.items.map(i => ({
          vendorOrderId: vOrder[0].id,
          productId: i.product.id,
          quantity: i.cartItem.quantity,
          priceAtPurchaseCents: i.product.priceCents
        }));

        await db.insert(vendorOrderItems).values(vItems);
      }

      // 3. Clear Cart
      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

      return res.status(200).send('Webhook processed');
    }

    res.status(200).send('Event not handled');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook failed');
  }
});

// Mock endpoint to simulate webhook for testing MVP
router.post('/simulate-payment', requireAuth, async (req: any, res: any) => {
  try {
    const userCart = await db.select().from(carts).where(eq(carts.userId, req.user.id));
    if (!userCart.length) return res.status(400).json({ error: 'Cart empty' });
    const cartId = userCart[0].id;

    const items = await db.select({
      cartItem: cartItems,
      product: products,
    }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartId));
      
    const totalCents = items.reduce((sum, { cartItem, product }) => sum + (product.priceCents * cartItem.quantity), 0);
    const reference = `ORDER-${crypto.randomUUID()}`;

    // Call webhook handler directly for simulation
    const mockEvent = {
      event: 'charge.success',
      data: {
        reference,
        amount: totalCents,
        metadata: {
          userId: req.user.id
        }
      }
    };

    // To simulate a webhook call, we can just fetch our own endpoint
    const url = `http://localhost:${process.env.PORT || 3000}/api/checkout/webhook`;
    const secret = process.env.PAYSTACK_SECRET_KEY || 'mock_secret';
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(mockEvent)).digest('hex');

    const webhookRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': hash
      },
      body: JSON.stringify(mockEvent)
    });

    if (webhookRes.ok) {
      res.json({ success: true, reference });
    } else {
      res.status(500).json({ error: 'Simulation failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

export default router;
