import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isSignedIn: isClerkSignedIn, loading: clerkLoading } = useClerkAuthContext();

  if (loading || clerkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (isAuthenticated || isClerkSignedIn) ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 