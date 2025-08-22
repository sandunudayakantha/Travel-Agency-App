import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios defaults
axios.defaults.withCredentials = false;

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  hasAdminSession: false
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
        hasAdminSession: action.payload.user?.role === 'admin'
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        hasAdminSession: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        hasAdminSession: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        hasAdminSession: action.payload?.role === 'admin'
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Token management utilities
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

const storeUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });

      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (!token) {
        dispatch({ type: 'AUTH_FAIL', payload: null });
        return;
      }

      // Set token in axios headers
      setAuthToken(token);

      // If we have a stored user, use it immediately for better UX
      if (storedUser) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: storedUser } 
        });
      }

      // Verify token with server
      try {
        const res = await axios.get('/api/auth/me');
        const user = res.data.data.user;
        
        // Update stored user data
        storeUser(user);
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user } 
        });
      } catch (error) {
        // Clear invalid token
        setAuthToken(null);
        dispatch({ type: 'AUTH_FAIL', payload: null });
        
        // Show error only if it's not a network error
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
        }
      }
    };

    initializeAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { user, token } = res.data.data;
      
      setAuthToken(token);
      storeUser(user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      toast.success('Registration successful! Welcome aboard!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const { user, token } = res.data.data;
      
      setAuthToken(token);
      storeUser(user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Admin login
  const adminLogin = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const { user, token } = res.data.data;
      
      if (user.role !== 'admin') {
        dispatch({ type: 'AUTH_FAIL', payload: 'Admin access required' });
        toast.error('Admin access required');
        return { success: false, error: 'Admin access required' };
      }
      
      setAuthToken(token);
      storeUser(user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call logout endpoint if authenticated
      if (state.isAuthenticated) {
        await axios.post('/api/auth/logout').catch(() => {
          // Ignore errors on logout
        });
      }
    } finally {
      setAuthToken(null);
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/auth/profile', userData);
      const updatedUser = res.data.data.user;
      
      storeUser(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await axios.post('/api/auth/change-password', passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Force logout (clears everything)
  const forceLogout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const res = await axios.post('/api/auth/refresh');
      const { user, token } = res.data.data;
      
      setAuthToken(token);
      storeUser(user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      setAuthToken(null);
      dispatch({ type: 'AUTH_FAIL', payload: null });
      return { success: false };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    hasAdminSession: state.hasAdminSession,
    register,
    login,
    adminLogin,
    logout,
    forceLogout,
    updateProfile,
    changePassword,
    clearError,
    refreshToken,
    isAdmin,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 