const fs = require('fs');
let content = fs.readFileSync('src/api/webhooks.ts', 'utf8');

const replacement = `
    if (table === 'vendor_orders' && type === 'UPDATE') {
      if (record.fulfillmentStatus !== old_record.fulfillmentStatus) {
         // Fulfillment status changed
         const { db } = await import('../db/db');
         const { users, orders } = await import('../db/schema');
         const { eq } = await import('drizzle-orm');
         
         const parentOrder = await db.select().from(orders).where(eq(orders.id, record.orderId));
         if (parentOrder.length) {
           const customer = await db.select().from(users).where(eq(users.id, parentOrder[0].customerId));
           if (customer.length) {
             await resend.emails.send({
               from: 'Marketplace <updates@yourdomain.com>',
               to: customer[0].email,
               subject: \`Order Update: \${record.fulfillmentStatus}\`,
               html: \`<p>A vendor updated your order status to: <b>\${record.fulfillmentStatus}</b>.</p>\`
             });
           }
         }
      }
      
      if (record.payoutStatus === 'paid' && old_record.payoutStatus === 'unpaid') {
         // Payout was processed
         const { db } = await import('../db/db');
         const { users, vendors } = await import('../db/schema');
         const { eq } = await import('drizzle-orm');
         
         const vendorRecord = await db.select().from(vendors).where(eq(vendors.id, record.vendorId));
         if (vendorRecord.length) {
           const vendorUser = await db.select().from(users).where(eq(users.id, vendorRecord[0].userId));
           if (vendorUser.length) {
             await resend.emails.send({
               from: 'Marketplace Admin <admin@yourdomain.com>',
               to: vendorUser[0].email,
               subject: 'Payout Processed',
               html: \`<p>Your payout has been processed. Note: \${record.payoutNote || 'None'}</p>\`
             });
           }
         }
      }
    }
`;

content = content.replace(/if \(table === 'vendor_orders' && type === 'UPDATE'\) \{[\s\S]*?res\.json\(\{ success: true \}\);/m, replacement + '\n    res.json({ success: true });');

fs.writeFileSync('src/api/webhooks.ts', content);
