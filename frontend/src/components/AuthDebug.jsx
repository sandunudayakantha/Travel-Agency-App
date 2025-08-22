import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';

const AuthDebug = () => {
  const { admin, isAdminAuthenticated, loading: adminLoading } = useAdminAuth();
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const { clerkUser, isSignedIn, loading: clerkLoading } = useClerkAuthContext();
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    const updateLocalStorageData = () => {
      setLocalStorageData({
        token: localStorage.getItem('token') ? 'Present' : 'Not found',
        user: localStorage.getItem('user') ? 'Present' : 'Not found',
        travel_agency_token: localStorage.getItem('travel_agency_token') ? 'Present' : 'Not found',
        travel_agency_user: localStorage.getItem('travel_agency_user') ? 'Present' : 'Not found'
      });
    };

    updateLocalStorageData();
    const interval = setInterval(updateLocalStorageData, 1000);
    return () => clearInterval(interval);
  }, []);

  const testApiAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      alert(`API Test Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`API Test Error: ${error.message}`);
    }
  };

  const makeAdmin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/make-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      alert(`Make Admin Result: ${JSON.stringify(data, null, 2)}`);
      window.location.reload();
    } catch (error) {
      alert(`Make Admin Error: ${error.message}`);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug</h3>
      
      <div className="text-xs space-y-1">
        <div><strong>AdminAuthContext:</strong></div>
        <div>• Admin: {admin ? `${admin.name} (${admin.role})` : 'None'}</div>
        <div>• Admin Authenticated: {isAdminAuthenticated ? 'Yes' : 'No'}</div>
        <div>• Loading: {adminLoading ? 'Yes' : 'No'}</div>
        
        <div className="mt-2"><strong>AuthContext:</strong></div>
        <div>• User: {authUser ? `${authUser.name} (${authUser.role})` : 'None'}</div>
        <div>• Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>• Loading: {authLoading ? 'Yes' : 'No'}</div>
        
        <div className="mt-2"><strong>ClerkAuthContext:</strong></div>
        <div>• User: {clerkUser ? `${clerkUser.name} (${clerkUser.role})` : 'None'}</div>
        <div>• Signed In: {isSignedIn ? 'Yes' : 'No'}</div>
        <div>• Loading: {clerkLoading ? 'Yes' : 'No'}</div>
        
        <div className="mt-2"><strong>localStorage:</strong></div>
        <div>• Token: {localStorageData.token}</div>
        <div>• User: {localStorageData.user}</div>
        <div>• Old Token: {localStorageData.travel_agency_token}</div>
        <div>• Old User: {localStorageData.travel_agency_user}</div>
      </div>
      
      <div className="mt-3 space-y-1">
        <button 
          onClick={testApiAuth}
          className="w-full bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
        >
          Test API Auth
        </button>
        <button 
          onClick={makeAdmin}
          className="w-full bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
        >
          Make Admin
        </button>
        <button 
          onClick={clearStorage}
          className="w-full bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
