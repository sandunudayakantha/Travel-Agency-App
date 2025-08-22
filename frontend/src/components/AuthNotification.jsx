import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import toast from 'react-hot-toast';

const AuthNotification = () => {
  const { isAuthenticated, user, loading, error } = useAuth();
  const { isSignedIn: isClerkSignedIn, clerkUser, loading: clerkLoading } = useClerkAuthContext();
  
  // Use refs to track if welcome messages have been shown
  const traditionalWelcomeShown = useRef(false);
  const clerkWelcomeShown = useRef(false);
  const errorShown = useRef(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Show welcome message when user logs in (not on page refresh)
    if (isAuthenticated && user && !traditionalWelcomeShown.current && !loading) {
      // Only show welcome message if this is NOT the initial load
      // Initial load means the user was already logged in from localStorage
      if (!isInitialLoad.current) {
        toast.success(`Welcome back, ${user.name}!`, {
          duration: 3000,
          position: 'top-right',
        });
        traditionalWelcomeShown.current = true;
      }
    }
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    // Show welcome message for Clerk users (not on page refresh)
    if (isClerkSignedIn && clerkUser && !clerkWelcomeShown.current && !clerkLoading) {
      // Only show welcome message if this is NOT the initial load
      if (!isInitialLoad.current) {
        toast.success(`Welcome back, ${clerkUser.name}!`, {
          duration: 3000,
          position: 'top-right',
        });
        clerkWelcomeShown.current = true;
      }
    }
  }, [isClerkSignedIn, clerkUser, clerkLoading]);

  useEffect(() => {
    // Show error message if authentication fails
    if (error && !loading && !errorShown.current) {
      toast.error(error, {
        duration: 5000,
        position: 'top-right',
      });
      errorShown.current = true;
    }
  }, [error, loading]);

  // Mark initial load as complete after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoad.current = false;
    }, 1000); // Wait 1 second to ensure all auth contexts have initialized

    return () => clearTimeout(timer);
  }, []);

  // Reset flags when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isClerkSignedIn) {
      traditionalWelcomeShown.current = false;
      clerkWelcomeShown.current = false;
      errorShown.current = false;
      isInitialLoad.current = true; // Reset for next login
    }
  }, [isAuthenticated, isClerkSignedIn]);

  // Don't render anything, just handle notifications
  return null;
};

export default AuthNotification; 