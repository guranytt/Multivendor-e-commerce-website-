const fs = require('fs');
let content = fs.readFileSync('scripts/setup-webhooks.sql', 'utf8');

content = content.replace(
  /after update of fulfillment_status on public\.vendor_orders[\s\S]*?execute function public\.send_webhook\(\);/,
  `after update of fulfillment_status, payout_status on public.vendor_orders
  for each row
  when (OLD.fulfillment_status is distinct from NEW.fulfillment_status OR OLD.payout_status is distinct from NEW.payout_status)
  execute function public.send_webhook();`
);

fs.writeFileSync('scripts/setup-webhooks.sql', content);
