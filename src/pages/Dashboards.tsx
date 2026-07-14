import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import AdminCategories from '../components/AdminCategories';
import AdminVendors from '../components/AdminVendors';
import AdminPayouts from '../components/AdminPayouts';
import VendorProducts from '../components/VendorProducts';
import VendorOrders from '../components/VendorOrders';
import CustomerOrders from '../components/CustomerOrders';
import { Link, Routes, Route } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';
import CustomerLayout from '../components/CustomerLayout';
import AdminLayout from '../components/AdminLayout';
import VendorLayout from '../components/VendorLayout';
import CustomerHome from './CustomerHome';
import CustomerCategories from './CustomerCategories';
import CustomerProduct from './CustomerProduct';
import CustomerCart from './CustomerCart';
import { ProtectedRoute } from '../components/ProtectedRoute';

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
    <AdminLayout>
      <div id="payouts"><AdminPayouts /></div>
      <div id="categories"><AdminCategories /></div>
      <div id="vendors"><AdminVendors /></div>
    </AdminLayout>
  );
}


export function VendorDashboard() {
  const { user } = useAuth();
  return (
    <VendorLayout>
      <div id="orders"><VendorOrders /></div>
      <div id="products"><VendorProducts /></div>
    </VendorLayout>
  );
}

export function CustomerDashboard() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/categories" element={<CustomerCategories />} />
        <Route path="/product/:id" element={<CustomerProduct />} />
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerCart />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <div className="w-full px-margin-mobile md:px-margin-desktop py-lg"><CustomerOrders /></div>
          </ProtectedRoute>
        } />
      </Routes>
    </CustomerLayout>
  );
}
