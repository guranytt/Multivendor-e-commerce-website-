const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/components/AdminCategories.tsx',
  'src/components/AdminVendors.tsx',
  'src/components/AdminPayouts.tsx',
  'src/components/VendorProducts.tsx',
  'src/components/VendorOrders.tsx',
  'src/components/Storefront.tsx',
  'src/pages/VendorOnboarding.tsx',
  'src/pages/Dashboards.tsx',
  'src/App.tsx'
];

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace supabase import
  content = content.replace(/import \{ supabase \} from '\.\.\/lib\/supabase';\n/g, '');
  content = content.replace(/import \{ supabase \} from '\.\/lib\/supabase';\n/g, '');

  if (content.includes('supabase.auth.getSession()')) {
    // We need to add useAuth from clerk
    if (!content.includes("import { useAuth } from '@clerk/clerk-react';")) {
       content = content.replace(/import React/g, "import { useAuth as useClerkAuth } from '@clerk/clerk-react';\nimport React");
    }

    // Inside the component, we need to extract getToken
    // We can just inject `const { getToken } = useClerkAuth();` at the top of the component
    // Let's assume standard functional component
    content = content.replace(/export default function ([a-zA-Z]+)\(\) \{/g, "export default function $1() {\n  const { getToken } = useClerkAuth();");
    content = content.replace(/export function ([a-zA-Z]+)\(\) \{/g, "export function $1() {\n  const { getToken } = useClerkAuth();");

    // Replace the specific lines getting token
    content = content.replace(/const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\);\n\s*const token = session\?\.access_token;/g, "const token = await getToken();");
  }

  fs.writeFileSync(filePath, content);
});
console.log('Replaced supabase client calls.');
