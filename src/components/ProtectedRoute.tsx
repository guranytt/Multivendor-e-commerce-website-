import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from './AuthProvider';

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect unauthorized users to their respective dashboards based on role
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'vendor') return <Navigate to="/vendor" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
