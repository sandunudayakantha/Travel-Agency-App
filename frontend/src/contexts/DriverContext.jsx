import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DriverContext = createContext();

const initialState = {
  drivers: [],
  currentDriver: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    rating: '',
    availability: '',
    licenseType: '',
    vehicleType: '',
    language: '',
    search: ''
  }
};

const driverReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_DRIVERS':
      return {
        ...state,
        drivers: action.payload.drivers,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_DRIVER':
      return {
        ...state,
        currentDriver: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_DRIVER':
      return {
        ...state,
        drivers: [action.payload, ...state.drivers],
        loading: false,
        error: null
      };
    case 'UPDATE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.map(driver =>
          driver._id === action.payload._id ? action.payload : driver
        ),
        currentDriver: state.currentDriver?._id === action.payload._id ? action.payload : state.currentDriver,
        loading: false,
        error: null
      };
    case 'DELETE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.filter(driver => driver._id !== action.payload),
        currentDriver: state.currentDriver?._id === action.payload ? null : state.currentDriver,
        loading: false,
        error: null
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const DriverProvider = ({ children }) => {
  const [state, dispatch] = useReducer(driverReducer, initialState);

  // Get all drivers with filters and pagination
  const getDrivers = async (filters = {}, page = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: state.pagination.itemsPerPage.toString(),
        ...filters
      });

      const response = await axios.get(`/api/drivers?${params}`);
      
      dispatch({
        type: 'SET_DRIVERS',
        payload: {
          drivers: response.data.drivers,
          pagination: response.data.pagination
        }
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading drivers';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get single driver
  const getDriver = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get(`/api/drivers/${id}`);
      
      dispatch({
        type: 'SET_CURRENT_DRIVER',
        payload: response.data.driver
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading driver';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create new driver
  const createDriver = async (driverData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('DriverContext: Sending driver data:', driverData);
      
      // Log the FormData contents
      console.log('DriverContext: FormData contents:');
      for (let [key, value] of driverData.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      const response = await axios.post('/api/drivers', driverData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: 'ADD_DRIVER',
        payload: response.data.driver
      });
      
      toast.success('Driver created successfully');
      return { success: true, driver: response.data.driver };
    } catch (error) {
      console.error('DriverContext: Error creating driver:', error);
      console.error('DriverContext: Error response:', error.response?.data);
      
      let message = 'Error creating driver';
      
      if (error.response?.data?.errors) {
        console.error('DriverContext: Validation errors:', error.response.data.errors);
        // Show the first validation error message
        if (error.response.data.errors.length > 0) {
          message = error.response.data.errors[0].msg || error.response.data.errors[0].message;
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update driver
  const updateDriver = async (id, driverData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.put(`/api/drivers/${id}`, driverData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: 'UPDATE_DRIVER',
        payload: response.data.driver
      });
      
      toast.success('Driver updated successfully');
      return { success: true, driver: response.data.driver };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating driver';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete driver
  const deleteDriver = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.delete(`/api/drivers/${id}`);
      
      dispatch({
        type: 'DELETE_DRIVER',
        payload: id
      });
      
      toast.success('Driver deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting driver';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    getDrivers,
    getDriver,
    createDriver,
    updateDriver,
    deleteDriver,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <DriverContext.Provider value={value}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
}; 