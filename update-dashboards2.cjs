const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboards.tsx', 'utf8');

const newImports = `
import AdminLayout from '../components/AdminLayout';
import VendorLayout from '../components/VendorLayout';
`;

content = content.replace("import CustomerLayout from '../components/CustomerLayout';", "import CustomerLayout from '../components/CustomerLayout';" + newImports);

const adminRegex = /export function AdminDashboard\(\) \{[\s\S]*\}\n\nexport function VendorDashboard/m;
const newAdminDashboard = `
export function AdminDashboard() {
  const { user } = useAuth();
  return (
    <AdminLayout>
      <div id="payouts"><AdminPayouts /></div>
      <div id="categories"><AdminCategories /></div>
      <div id="vendors"><AdminVendors /></div>
    </AdminLayout>
  );
}

export function VendorDashboard`;

content = content.replace(adminRegex, newAdminDashboard);

const vendorRegex = /export function VendorDashboard\(\) \{[\s\S]*\}\n\nexport function CustomerDashboard/m;
const newVendorDashboard = `
export function VendorDashboard() {
  const { user } = useAuth();
  return (
    <VendorLayout>
      <div id="orders"><VendorOrders /></div>
      <div id="products"><VendorProducts /></div>
    </VendorLayout>
  );
}

export function CustomerDashboard`;

content = content.replace(vendorRegex, newVendorDashboard);

fs.writeFileSync('src/pages/Dashboards.tsx', content);
