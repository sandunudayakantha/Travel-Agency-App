import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isSignedIn: isClerkSignedIn, loading: clerkLoading } = useClerkAuthContext();

  // Show loading spinner while authentication is being checked
  if (loading || clerkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated through either method
  const isAuthenticatedUser = isAuthenticated || isClerkSignedIn;

  if (!isAuthenticatedUser) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default PrivateRoute; 