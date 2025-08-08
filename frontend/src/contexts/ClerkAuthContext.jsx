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

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Convert Clerk user to our app's user format
        const appUser = {
          _id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
          email: user.primaryEmailAddress?.emailAddress,
          avatar: user.imageUrl,
          role: 'user', // Default role for Clerk users
          isVerified: user.emailAddresses?.[0]?.verification?.status === 'verified',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Add social provider info
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
            console.log('Could not get session token:', err);
            // Fallback to user ID based token
            axios.defaults.headers.common['Authorization'] = `Bearer clerk-${user.id}`;
          });
        }
        
        // Determine which social platform was used
        const socialPlatform = user.externalAccounts?.[0]?.provider || 'social account';
        toast.success(`Signed in with ${socialPlatform}!`);
      } else {
        setClerkUser(null);
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
    isSignedIn,
    isLoaded,
    loading,
    signInWithSocial,
    signOut
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