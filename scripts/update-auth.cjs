const fs = require('fs');
const path = require('path');

const files = [
  'src/api/categories.ts',
  'src/api/vendors.ts',
  'src/api/products.ts',
  'src/api/cart.ts',
  'src/api/checkout.ts',
  'src/api/admin.ts',
  'src/api/orders.ts'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove supabase imports and client setup
  content = content.replace(/import \{ createClient \} from '@supabase\/supabase-js';\n/g, '');
  content = content.replace(/const supabase = createClient\(\s*process\.env\.VITE_SUPABASE_URL \|\| '',\s*process\.env\.VITE_SUPABASE_ANON_KEY \|\| ''\s*\);\n/g, '');

  // Replace requireAuth
  const newRequireAuth = `const requireAuth = async (req: any, res: any, next: any) => {
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
};`;

  content = content.replace(/const requireAuth = async \(req: any, res: any, next: any\) => \{[\s\S]*?req\.user = user;\s*next\(\);\s*\};/m, newRequireAuth);

  fs.writeFileSync(filePath, content);
});
console.log('Auth updated.');
