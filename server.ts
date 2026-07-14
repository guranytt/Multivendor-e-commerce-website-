import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  const PORT = 3000;

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

  const categoriesRouter = (await import('./src/api/categories.ts')).default;
  app.use('/api/categories', categoriesRouter);

  const vendorsRouter = (await import('./src/api/vendors.ts')).default;
  app.use('/api/vendors', vendorsRouter);

  const productsRouter = (await import('./src/api/products.ts')).default;
  app.use('/api/products', productsRouter);

  const cartRouter = (await import('./src/api/cart.ts')).default;
  app.use('/api/cart', cartRouter);

  const checkoutRouter = (await import('./src/api/checkout.ts')).default;
  app.use('/api/checkout', checkoutLimiter, checkoutRouter);

  const adminRouter = (await import('./src/api/admin.ts')).default;
  app.use('/api/admin', adminRouter);

  const ordersRouter = (await import('./src/api/orders.ts')).default;
  app.use('/api/orders', ordersRouter);
  const webhooksRouter = (await import('./src/api/webhooks.ts')).default;
  app.use('/api/webhooks', webhooksRouter);


  app.post('/api/users/sync', authLimiter, async (req, res) => {
    // Basic sync: receive token, check user, insert to DB
    const { verifyToken } = await import('@clerk/backend');
    const { db } = await import('./src/db/db.ts');
    const { users } = await import('./src/db/schema.ts');
    const { eq } = await import('drizzle-orm');

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
