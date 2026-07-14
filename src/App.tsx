/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import { AdminDashboard, VendorDashboard, CustomerDashboard } from './pages/Dashboards';
import VendorOnboarding from './pages/VendorOnboarding';

// A smart redirector that sends logged-in users to their respective home pages
const HomeRedirect = () => {
  const { role, loading, user } = useAuth();
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'vendor') return <Navigate to="/vendor" replace />;
  return <Navigate to="/customer" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vendor/*" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vendor-onboarding" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <VendorOnboarding />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/customer/*" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
