import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CustomInquiryContext = createContext();

const initialState = {
  inquiries: [],
  currentInquiry: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const customInquiryReducer = (state, action) => {
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
    case 'SET_INQUIRIES':
      return {
        ...state,
        inquiries: action.payload.inquiries,
        pagination: action.payload.pagination,
        loading: false
      };
    case 'SET_CURRENT_INQUIRY':
      return {
        ...state,
        currentInquiry: action.payload,
        loading: false
      };
    case 'ADD_INQUIRY':
      return {
        ...state,
        inquiries: [action.payload, ...state.inquiries]
      };
    case 'UPDATE_INQUIRY':
      return {
        ...state,
        inquiries: state.inquiries.map(inquiry =>
          inquiry._id === action.payload._id ? action.payload : inquiry
        ),
        currentInquiry: state.currentInquiry?._id === action.payload._id 
          ? action.payload 
          : state.currentInquiry
      };
    case 'DELETE_INQUIRY':
      return {
        ...state,
        inquiries: state.inquiries.filter(inquiry => inquiry._id !== action.payload),
        currentInquiry: state.currentInquiry?._id === action.payload 
          ? null 
          : state.currentInquiry
      };
    default:
      return state;
  }
};

export const CustomInquiryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customInquiryReducer, initialState);

  // Create custom inquiry
  const createInquiry = useCallback(async (inquiryData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.post('/api/custom-inquiries', inquiryData);

      dispatch({
        type: 'ADD_INQUIRY',
        payload: res.data.data.inquiry
      });

      toast.success('Custom package inquiry submitted successfully!');
      return { success: true, inquiry: res.data.data.inquiry };
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating custom inquiry';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Get all inquiries
  const getInquiries = useCallback(async (filters = {}, page = 1) => {
    console.log('CustomInquiryContext: getInquiries called with:', { filters, page });
    
    // Prevent multiple simultaneous calls
    if (state.loading) {
      console.log('CustomInquiryContext: Already loading, skipping request');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Wait a bit for ClerkAuthContext to set the token
      let authHeader = axios.defaults.headers.common['Authorization'];
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!authHeader && attempts < maxAttempts) {
        console.log(`CustomInquiryContext: Waiting for auth header, attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        authHeader = axios.defaults.headers.common['Authorization'];
        attempts++;
      }
      
      console.log('CustomInquiryContext: Auth header found:', !!authHeader);
      console.log('CustomInquiryContext: Auth header value:', authHeader);
      
      // Fallback to localStorage token if axios header is not set
      if (!authHeader) {
        const localStorageToken = localStorage.getItem('token');
        console.log('CustomInquiryContext: Checking localStorage token:', !!localStorageToken);
        
        if (localStorageToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${localStorageToken}`;
          console.log('CustomInquiryContext: Set token from localStorage');
        } else {
          throw new Error('Authentication required');
        }
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });

      console.log('CustomInquiryContext: Making API request to:', `/api/custom-inquiries?${params}`);
      
      const res = await axios.get(`/api/custom-inquiries?${params}`);

      console.log('CustomInquiryContext: API response:', res.data);
      
      dispatch({
        type: 'SET_INQUIRIES',
        payload: res.data.data
      });
    } catch (error) {
      console.error('CustomInquiryContext: Error fetching inquiries:', error);
      const message = error.response?.data?.message || 'Error loading custom inquiries';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  }, []);

  // Get single inquiry
  const getInquiry = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Check if token is already set in axios headers (from ClerkAuthContext)
      const authHeader = axios.defaults.headers.common['Authorization'];
      if (!authHeader) {
        throw new Error('Authentication required');
      }

      const res = await axios.get(`/api/custom-inquiries/${id}`);

      dispatch({
        type: 'SET_CURRENT_INQUIRY',
        payload: res.data.data.inquiry
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading custom inquiry';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  }, []);

  // Update inquiry status (admin only)
  const updateInquiryStatus = useCallback(async (id, status, adminNotes = '') => {
    try {
      // Check if token is already set in axios headers (from ClerkAuthContext)
      const authHeader = axios.defaults.headers.common['Authorization'];
      if (!authHeader) {
        throw new Error('Authentication required');
      }

      const res = await axios.put(`/api/custom-inquiries/${id}/status`, {
        status,
        adminNotes
      });

      dispatch({
        type: 'UPDATE_INQUIRY',
        payload: res.data.data.inquiry
      });

      toast.success('Inquiry status updated successfully!');
      return { success: true, inquiry: res.data.data.inquiry };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating inquiry status';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Add quote to inquiry (admin only)
  const addQuoteToInquiry = useCallback(async (id, quoteData) => {
    try {
      // Check if token is already set in axios headers (from ClerkAuthContext)
      const authHeader = axios.defaults.headers.common['Authorization'];
      if (!authHeader) {
        throw new Error('Authentication required');
      }

      const res = await axios.put(`/api/custom-inquiries/${id}/quote`, quoteData);

      dispatch({
        type: 'UPDATE_INQUIRY',
        payload: res.data.data.inquiry
      });

      toast.success('Quote added successfully!');
      return { success: true, inquiry: res.data.data.inquiry };
    } catch (error) {
      const message = error.response?.data?.message || 'Error adding quote';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Delete inquiry
  const deleteInquiry = useCallback(async (id) => {
    try {
      // Check if token is already set in axios headers (from ClerkAuthContext)
      const authHeader = axios.defaults.headers.common['Authorization'];
      if (!authHeader) {
        throw new Error('Authentication required');
      }

      await axios.delete(`/api/custom-inquiries/${id}`);

      dispatch({
        type: 'DELETE_INQUIRY',
        payload: id
      });

      toast.success('Inquiry deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting inquiry';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    createInquiry,
    getInquiries,
    getInquiry,
    updateInquiryStatus,
    addQuoteToInquiry,
    deleteInquiry,
    clearError
  };

  return (
    <CustomInquiryContext.Provider value={value}>
      {children}
    </CustomInquiryContext.Provider>
  );
};

export const useCustomInquiry = () => {
  const context = useContext(CustomInquiryContext);
  if (!context) {
    throw new Error('useCustomInquiry must be used within a CustomInquiryProvider');
  }
  return context;
}; 