import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SiteSettingsContext = createContext();

const initialState = {
  settings: null,
  loading: false,
  error: null
};

const siteSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const SiteSettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(siteSettingsReducer, initialState);

  // Get site settings
  const getSiteSettings = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/site-settings');
      dispatch({
        type: 'SET_SETTINGS',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching site settings'
      });
      throw error;
    }
  }, []);

  // Update site settings (admin only)
  const updateSiteSettings = useCallback(async (settingsData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.put('/api/site-settings', settingsData);
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: res.data.data
      });
      toast.success('Site settings updated successfully!');
      return res.data.data;
    } catch (error) {
      console.error('Error updating site settings:', error);
      const errorMessage = error.response?.data?.message || 'Error updating site settings';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    getSiteSettings();
  }, [getSiteSettings]);

  const value = {
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    getSiteSettings,
    updateSiteSettings
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
