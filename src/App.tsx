/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { AdminDashboard, VendorDashboard, CustomerDashboard } from './pages/Dashboards';
import VendorOnboarding from './pages/VendorOnboarding';
import { motion } from 'motion/react';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-slate">
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-slate-300 border-t-action-orange rounded-full"
      />
      <span className="font-label-lg text-label-lg font-bold text-slate-500 uppercase tracking-widest animate-pulse">
        Loading...
      </span>
    </div>
  </div>
);

// A smart redirector that sends logged-in users to their respective home pages
const HomeRedirect = () => {
  const { role, loading, user } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/customer" replace />;
  
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'vendor') return <Navigate to="/vendor" replace />;
  return <Navigate to="/customer" replace />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login/*" element={<Login />} />
          <Route path="/sign-up/*" element={<Register />} />
          
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
              <CustomerDashboard />
            } 
          />
          
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
