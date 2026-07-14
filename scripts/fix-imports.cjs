const fs = require('fs');
const path = require('path');

const files = [
  'src/components/AdminPayouts.tsx',
  'src/components/AdminVendors.tsx',
  'src/components/Storefront.tsx',
  'src/components/VendorOrders.tsx',
  'src/components/VendorProducts.tsx',
  'src/pages/VendorOnboarding.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("@clerk/clerk-react")) {
    content = `import { useAuth as useClerkAuth } from '@clerk/clerk-react';\n` + content;
    fs.writeFileSync(filePath, content);
  }
});
