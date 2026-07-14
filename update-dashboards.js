const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboards.tsx', 'utf8');

content = content.replace("import VendorOrders from '../components/VendorOrders';", "import VendorOrders from '../components/VendorOrders';\nimport VendorSettings from '../components/VendorSettings';");

const oldVendorDashboard = `export function VendorDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4 text-gray-600">Welcome back, Vendor {user?.email}</p>
      <VendorOrders />
      <VendorProducts />
    </div>
  );
}`;

const newVendorDashboard = `export function VendorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="flex items-center space-x-6 border-b pb-4 mb-4">
        <button 
          onClick={() => setActiveTab('orders')}
          className={\`font-medium \${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}\`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={\`font-medium \${activeTab === 'products' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}\`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={\`font-medium \${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}\`}
        >
          Settings
        </button>
      </div>

      <p className="text-gray-600 mb-4">Welcome back, Vendor {user?.email}</p>

      {activeTab === 'orders' && <VendorOrders />}
      {activeTab === 'products' && <VendorProducts />}
      {activeTab === 'settings' && <VendorSettings />}
    </div>
  );
}`;

content = content.replace(oldVendorDashboard, newVendorDashboard);

fs.writeFileSync('src/pages/Dashboards.tsx', content);
