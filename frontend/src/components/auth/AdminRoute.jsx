import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { isAdminAuthenticated, admin, loading } = useAdminAuth();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!isAdminAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated and has admin role, render the admin content
  return children;
};

export default AdminRoute; 