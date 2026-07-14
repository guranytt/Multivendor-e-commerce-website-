-- Enable the pg_net extension for HTTP requests
create extension if not exists pg_net;

-- Create a generic function that sends a webhook payload to your Express backend
-- Replace 'https://your-production-url.com/api/webhooks/db' with your actual Vercel/Railway URL
create or replace function public.send_webhook()
returns trigger as $$
declare
  payload jsonb;
begin
  payload = jsonb_build_object(
    'table', TG_TABLE_NAME,
    'type', TG_OP,
    'record', row_to_json(NEW),
    'old_record', case when TG_OP = 'UPDATE' or TG_OP = 'DELETE' then row_to_json(OLD) else null end
  );

  -- Send the HTTP POST request to your webhook endpoint
  -- Add x-webhook-secret header matching your DB_WEBHOOK_SECRET environment variable
  perform net.http_post(
    url := 'https://your-production-url.com/api/webhooks/db',
    body := payload,
    headers := '{"Content-Type": "application/json", "x-webhook-secret": "your_secret_here"}'::jsonb
  );

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger for new users (Admin notification & Welcome emails)
drop trigger if exists on_user_created on public.users;
create trigger on_user_created
  after insert on public.users
  for each row
  execute function public.send_webhook();

-- Trigger for new orders (Order confirmation emails)
drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row
  execute function public.send_webhook();

-- Trigger for new vendor_orders (Vendor notification emails)
drop trigger if exists on_vendor_order_created on public.vendor_orders;
create trigger on_vendor_order_created
  after insert on public.vendor_orders
  for each row
  execute function public.send_webhook();

-- Trigger for vendor_orders status updates (Customer fulfillment notification)
drop trigger if exists on_vendor_order_updated on public.vendor_orders;
create trigger on_vendor_order_updated
  after update of fulfillment_status, payout_status on public.vendor_orders
  for each row
  when (OLD.fulfillment_status is distinct from NEW.fulfillment_status OR OLD.payout_status is distinct from NEW.payout_status)
  execute function public.send_webhook();
