import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
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
  app.use('/api/checkout', checkoutRouter);

  const adminRouter = (await import('./src/api/admin.ts')).default;
  app.use('/api/admin', adminRouter);

  const ordersRouter = (await import('./src/api/orders.ts')).default;
  app.use('/api/orders', ordersRouter);

  app.post('/api/users/sync', async (req, res) => {
    // Basic sync: receive token, check user, insert to DB
    const { createClient } = await import('@supabase/supabase-js');
    const { db } = await import('./src/db/db.ts');
    const { users } = await import('./src/db/schema.ts');
    const { eq } = await import('drizzle-orm');

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || '',
      process.env.VITE_SUPABASE_ANON_KEY || ''
    );
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await db.select().from(users).where(eq(users.id, user.id));
    if (!existing.length) {
      await db.insert(users).values({
        id: user.id,
        email: user.email!,
        role: 'customer' // default role
      });
    }
    res.json({ success: true });
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
