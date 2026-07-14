import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import AdminCategories from '../components/AdminCategories';
import AdminVendors from '../components/AdminVendors';
import AdminPayouts from '../components/AdminPayouts';
import VendorProducts from '../components/VendorProducts';
import VendorOrders from '../components/VendorOrders';
import VendorSettings from '../components/VendorSettings';
import Storefront from '../components/Storefront';
import CustomerOrders from '../components/CustomerOrders';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

const LogoutButton = () => (
  <SignOutButton>
    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
      Log out
    </button>
  </SignOutButton>
);

export function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4 text-gray-600">Welcome back, Admin {user?.email}</p>
      
      <AdminPayouts />
      <AdminCategories />
      <AdminVendors />
    </div>
  );
}

export function VendorDashboard() {
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
}

export function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'store' | 'orders'>('store');

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('store')}
              className={`font-medium ${activeTab === 'store' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Store
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`font-medium ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              My Orders
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/vendor-onboarding" className="text-sm font-medium text-blue-600 hover:underline">
            Become a Vendor
          </Link>
          <LogoutButton />
        </div>
      </header>
      
      {activeTab === 'store' ? (
        <Storefront />
      ) : (
        <div className="max-w-7xl mx-auto px-8 w-full">
          <CustomerOrders />
        </div>
      )}
    </div>
  );
}
