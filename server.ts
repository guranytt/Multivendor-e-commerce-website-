import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';

import categoriesRouter from './src/api/categories';
import vendorsRouter from './src/api/vendors';
import productsRouter from './src/api/products';
import cartRouter from './src/api/cart';
import checkoutRouter from './src/api/checkout';
import adminRouter from './src/api/admin';
import ordersRouter from './src/api/orders';
import webhooksRouter from './src/api/webhooks';

import { verifyToken, createClerkClient } from '@clerk/backend';
import { db } from './src/db/db';
import { users } from './src/db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 checkout requests per windowMs
  message: { error: 'Too many checkout attempts from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { error: 'Too many auth requests from this IP, please try again later' }
});

app.use('/api/categories', categoriesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutLimiter, checkoutRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/webhooks', webhooksRouter);

app.post('/api/users/sync', authLimiter, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const verifiedSession = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    const userId = verifiedSession.sub;
    
    const existing = await db.select().from(users).where(eq(users.id, userId));
    if (!existing.length) {
      await db.insert(users).values({
        id: userId,
        email: req.body.email || `${userId}@example.com`,
        role: req.body.role || 'customer'
      });
    } else if (req.body.role && existing[0].role !== req.body.role) {
      // Update role if requested
      await db.update(users).set({ role: req.body.role }).where(eq(users.id, userId));
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/users/make-admin', authLimiter, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const verifiedSession = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const userId = verifiedSession.sub;

    // Update in Clerk using Clerk Backend SDK
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'admin'
      }
    });

    // Update in our DB too
    await db.update(users).set({ role: 'admin' }).where(eq(users.id, userId));

    res.json({ success: true, role: 'admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to promote to admin. Ensure CLERK_SECRET_KEY is configured.' });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then(vite => {
    app.use(vite.middlewares);
  }).catch(console.error);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
