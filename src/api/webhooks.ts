import { Router } from 'express';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const adminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.com';

// Webhook listener for Database changes
router.post('/db', async (req: any, res: any) => {
  try {
    const payload = req.body;
    
    // Security check: ensure the request is from our database (e.g., matching a secret)
    const webhookSecret = process.env.DB_WEBHOOK_SECRET;
    if (webhookSecret && req.headers['x-webhook-secret'] !== webhookSecret) {
      return res.status(401).json({ error: 'Unauthorized webhook' });
    }

    const table = payload.table;
    const type = payload.type;
    const record = payload.record;
    const old_record = payload.old_record;

    if (table === 'users' && type === 'INSERT') {
      if (record.role === 'customer') {
        // Welcome Customer
        await resend.emails.send({
          from: 'Marketplace <welcome@yourdomain.com>',
          to: record.email,
          subject: 'Welcome to the Marketplace!',
          html: `<p>Hi there, welcome to our marketplace!</p>`
        });
        // Notify Admin
        await resend.emails.send({
          from: 'Marketplace <system@yourdomain.com>',
          to: adminEmail,
          subject: 'New Customer Signup',
          html: `<p>A new customer signed up: ${record.email}</p>`
        });
      } else if (record.role === 'vendor') {
        // Welcome Vendor
        await resend.emails.send({
          from: 'Marketplace <welcome@yourdomain.com>',
          to: record.email,
          subject: 'Welcome Vendor!',
          html: `<p>Hi, welcome! Please complete your onboarding in the dashboard.</p>`
        });
        // Notify Admin
        await resend.emails.send({
          from: 'Marketplace <system@yourdomain.com>',
          to: adminEmail,
          subject: 'New Vendor Signup',
          html: `<p>A new vendor signed up: ${record.email}</p>`
        });
      }
    }

    if (table === 'orders' && type === 'INSERT') {
      // Fetch customer email
      const { db } = await import('../db/db');
      const { users, vendors, vendorOrders } = await import('../db/schema');
      const { eq } = await import('drizzle-orm');
      
      const customer = await db.select().from(users).where(eq(users.id, record.customerId));
      if (customer.length) {
        // Email Customer
        await resend.emails.send({
          from: 'Marketplace <orders@yourdomain.com>',
          to: customer[0].email,
          subject: 'Order Confirmed!',
          html: `<p>Your order ${record.paystackReference} for $${(record.totalCents / 100).toFixed(2)} has been confirmed.</p>`
        });
        
        // Notify Admin
        await resend.emails.send({
          from: 'Marketplace <system@yourdomain.com>',
          to: adminEmail,
          subject: 'New Order Received',
          html: `<p>New order ${record.paystackReference} for $${(record.totalCents / 100).toFixed(2)} has been paid.</p>`
        });
      }
    }

    if (table === 'vendor_orders' && type === 'INSERT') {
      // Notify Vendor about their sub-order
      const { db } = await import('../db/db');
      const { users, vendors } = await import('../db/schema');
      const { eq } = await import('drizzle-orm');
      
      const vendorRecord = await db.select().from(vendors).where(eq(vendors.id, record.vendorId));
      if (vendorRecord.length) {
        const vendorUser = await db.select().from(users).where(eq(users.id, vendorRecord[0].userId));
        if (vendorUser.length) {
          await resend.emails.send({
            from: 'Marketplace <orders@yourdomain.com>',
            to: vendorUser[0].email,
            subject: 'You have a new order!',
            html: `<p>You received a new order for $${(record.subtotalCents / 100).toFixed(2)}!</p>`
          });
        }
      }
    }

    
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
               subject: `Order Update: ${record.fulfillmentStatus}`,
               html: `<p>A vendor updated your order status to: <b>${record.fulfillmentStatus}</b>.</p>`
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
               html: `<p>Your payout has been processed. Note: ${record.payoutNote || 'None'}</p>`
             });
           }
         }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook failed' });
  }
});

export default router;
