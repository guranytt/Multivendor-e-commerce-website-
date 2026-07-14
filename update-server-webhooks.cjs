const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const webhookImport = `
  const webhooksRouter = (await import('./src/api/webhooks.ts')).default;
  app.use('/api/webhooks', webhooksRouter);
`;

content = content.replace("app.use('/api/orders', ordersRouter);", "app.use('/api/orders', ordersRouter);" + webhookImport);

fs.writeFileSync('server.ts', content);
