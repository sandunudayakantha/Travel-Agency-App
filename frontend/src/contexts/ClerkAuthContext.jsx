import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClerkAuthContext = createContext();

export const ClerkAuthProvider = ({ children }) => {
  const { isSignedIn, isLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { user } = useUser();
  const { session } = useClerk();
  const [clerkUser, setClerkUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    const existingUser = localStorage.getItem('user');
    
    if (existingToken && existingUser && !isSignedIn) {
      // User has a token but Clerk session is not active
      // This can happen on page refresh
      try {
        const userData = JSON.parse(existingUser);
        setClerkUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    if (isLoaded) {
      if (isSignedIn && user) {
        // Sync Clerk user with our database
        const syncUserWithDatabase = async () => {
          try {
            const userData = {
              clerkId: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
              email: user.primaryEmailAddress?.emailAddress,
              avatar: user.imageUrl || null,
              isVerified: user.emailAddresses?.[0]?.verification?.status === 'verified' || false,
              socialProvider: user.externalAccounts?.[0]?.provider || null
            };

            // Validate required fields
            if (!userData.email) {
              toast.error('Email address is required for authentication');
              return;
            }

            const response = await axios.post('/api/auth/clerk-sync', userData).catch(error => {
              console.warn('Clerk sync failed, using fallback authentication:', error);
              return null;
            });
            
            if (!response) {
              // Fallback: create a simple user object without Clerk sync
              const fallbackUser = {
                name: userData.name,
                email: userData.email,
                avatar: userData.avatar,
                isVerified: true
              };
              setClerkUser(fallbackUser);
              setLoading(false);
              return;
            }
            
            if (response.data.success) {
              // Use our database user instead of Clerk user
              const dbUser = response.data.data.user;
              const token = response.data.data.token;
              
              // Store our app's token and user data
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(dbUser));
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              setClerkUser(dbUser);
              
              // Only show success toast if this is a fresh login (not page refresh)
              // We'll let AuthNotification handle the welcome message instead
              // to avoid duplicate toasts
            } else {
              toast.error('Failed to sync user with database');
            }
          } catch (error) {
            // Show more specific error messages
            if (error.response?.data?.message) {
              toast.error(`Sync failed: ${error.response.data.message}`);
            } else if (error.response?.data?.errors) {
              toast.error(`Validation errors: ${error.response.data.errors.join(', ')}`);
            } else {
              toast.error('Failed to sync user with database');
            }
            
            // Fallback to Clerk user data
            const appUser = {
              _id: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
              email: user.primaryEmailAddress?.emailAddress,
              avatar: user.imageUrl,
              role: 'user',
              isVerified: user.emailAddresses?.[0]?.verification?.status === 'verified',
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              socialProvider: user.externalAccounts?.[0]?.provider || null
            };
            
            setClerkUser(appUser);
            
            // Set auth header for API calls
            if (session) {
              session.getToken().then(token => {
                if (token) {
                  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
              }).catch(err => {
                axios.defaults.headers.common['Authorization'] = `Bearer clerk-${user.id}`;
              });
            }
          }
        };

        syncUserWithDatabase();
      } else {
        setClerkUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    }
  }, [isSignedIn, isLoaded, user, session]);

  const signInWithSocial = async () => {
    try {
      // This will be handled by Clerk's SignIn component
      return { success: true };
    } catch (error) {
      toast.error('Failed to sign in with social account');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      setClerkUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to sign out');
      return { success: false, error: error.message };
    }
  };

  const value = {
    clerkUser,
    isSignedIn: isSignedIn || !!clerkUser, // Consider user signed in if we have clerkUser from localStorage
    isLoaded,
    loading,
    signInWithSocial,
    signOut,
    isAdmin: () => clerkUser?.role === 'admin'
  };



  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export const useClerkAuthContext = () => {
  const context = useContext(ClerkAuthContext);
  if (!context) {
    throw new Error('useClerkAuthContext must be used within a ClerkAuthProvider');
  }
  return context;
}; 