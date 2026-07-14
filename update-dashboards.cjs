const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboards.tsx', 'utf8');

// Replace CustomerDashboard completely
const customerRegex = /export function CustomerDashboard\(\) \{[\s\S]*\}\n/m;
const newCustomerDashboard = `
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';
import CustomerHome from './CustomerHome';
import CustomerCategories from './CustomerCategories';
import CustomerProduct from './CustomerProduct';
import CustomerCart from './CustomerCart';

export function CustomerDashboard() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/categories" element={<CustomerCategories />} />
        <Route path="/product/:id" element={<CustomerProduct />} />
        <Route path="/cart" element={<CustomerCart />} />
        <Route path="/orders" element={<div className="w-full px-margin-mobile md:px-margin-desktop py-lg"><CustomerOrders /></div>} />
      </Routes>
    </CustomerLayout>
  );
}
`;

content = content.replace(customerRegex, newCustomerDashboard);

// I need to make sure the imports at the top are updated, but since I am injecting the new components I will just add the imports.
// Actually I included the imports in the replacement block above which will put them in the middle of the file. That's fine for TypeScript/Vite, but let's fix it properly.
