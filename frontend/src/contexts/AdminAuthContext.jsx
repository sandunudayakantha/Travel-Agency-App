import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useClerkAuthContext } from './ClerkAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const { clerkUser, isSignedIn, loading: clerkLoading } = useClerkAuthContext();
  
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing admin session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Check if user is admin
          if (user.role === 'admin') {
            setAdminUser(user);
            setIsAdminAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Verify token is still valid
            try {
              const response = await axios.get('/api/auth/me');
              if (response.data.success && response.data.user.role === 'admin') {
                // Update user data with latest from server
                setAdminUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
              } else {
                clearAdminSession();
              }
            } catch (error) {
              clearAdminSession();
            }
          } else {
            clearAdminSession();
          }
        } catch (error) {
          clearAdminSession();
        }
      } else {
        clearAdminSession();
      }
      
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  // Monitor auth contexts for changes
  useEffect(() => {
    if (!loading) {
      const currentUser = clerkUser || authUser;
      const isUserLoggedIn = isSignedIn || isAuthenticated;
      
      if (currentUser && isUserLoggedIn && currentUser.role === 'admin') {
        setAdminUser(currentUser);
        setIsAdminAuthenticated(true);
        
        // Ensure token is set
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } else if (!isUserLoggedIn) {
        clearAdminSession();
      }
    }
  }, [authUser, clerkUser, isAuthenticated, isSignedIn, authLoading, clerkLoading, loading]);

  const clearAdminSession = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const makeCurrentUserAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No authentication token found');
      return { success: false, error: 'No token found' };
    }

    try {
      const response = await axios.post('/api/auth/make-admin');
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        // Update state and localStorage
        setAdminUser(updatedUser);
        setIsAdminAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('You are now an admin!');
        return { success: true, user: updatedUser };
      } else {
        toast.error(response.data.message || 'Failed to make user admin');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Failed to make user admin: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const adminSignOut = async () => {
    clearAdminSession();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    return { success: true };
  };

  const value = {
    admin: adminUser,
    isAdminAuthenticated,
    loading: loading || authLoading || clerkLoading,
    makeCurrentUserAdmin,
    adminSignOut
  };



  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
