const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerOrders.tsx', 'utf8');

content = content.replace(
  'border-b border-surface-variant-2 border-b border-surface-variantlue-600',
  'border-b-2 border-action-orange'
);

fs.writeFileSync('src/components/CustomerOrders.tsx', content);
