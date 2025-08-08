import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PackageContext = createContext();

const initialState = {
  packages: [],
  featuredPackages: [],
  currentPackage: null,
  categories: [],
  destinations: [],
  countries: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    destination: '',
    country: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    difficulty: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  }
};

const packageReducer = (state, action) => {
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
    case 'SET_PACKAGES':
      return {
        ...state,
        packages: action.payload.packages,
        pagination: action.payload.pagination,
        loading: false
      };
    case 'SET_FEATURED_PACKAGES':
      return {
        ...state,
        featuredPackages: action.payload,
        loading: false
      };
    case 'SET_CURRENT_PACKAGE':
      return {
        ...state,
        currentPackage: action.payload,
        loading: false
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_DESTINATIONS':
      return {
        ...state,
        destinations: action.payload.destinations,
        countries: action.payload.countries
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };
    case 'ADD_PACKAGE':
      return {
        ...state,
        packages: [action.payload, ...state.packages]
      };
    case 'UPDATE_PACKAGE':
      return {
        ...state,
        packages: state.packages.map(pkg => 
          pkg._id === action.payload._id ? action.payload : pkg
        ),
        currentPackage: state.currentPackage?._id === action.payload._id 
          ? action.payload 
          : state.currentPackage
      };
    case 'DELETE_PACKAGE':
      return {
        ...state,
        packages: state.packages.filter(pkg => pkg._id !== action.payload)
      };
    default:
      return state;
  }
};

export const PackageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(packageReducer, initialState);

  // Load categories and destinations on mount
  useEffect(() => {
    loadCategories();
    loadDestinations();
  }, []);

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await axios.get('/api/packages/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: res.data.data.categories });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load destinations
  const loadDestinations = async () => {
    try {
      const res = await axios.get('/api/packages/destinations');
      dispatch({ 
        type: 'SET_DESTINATIONS', 
        payload: res.data.data 
      });
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  // Get all packages with filters
  const getPackages = async (filters = {}, page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...filters
      });

      const res = await axios.get(`/api/packages?${params}`);
      dispatch({
        type: 'SET_PACKAGES',
        payload: res.data.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading packages';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get featured packages
  const getFeaturedPackages = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/packages/featured');
      dispatch({
        type: 'SET_FEATURED_PACKAGES',
        payload: res.data.data.packages
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading featured packages';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get single package
  const getPackage = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/packages/${id}`);
      dispatch({
        type: 'SET_CURRENT_PACKAGE',
        payload: res.data.data.package
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading package';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create package (Admin only)
  const createPackage = async (packageData) => {
    try {
      const res = await axios.post('/api/packages', packageData);
      dispatch({
        type: 'ADD_PACKAGE',
        payload: res.data.data.package
      });
      toast.success('Package created successfully!');
      return { success: true, package: res.data.data.package };
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating package';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update package (Admin only)
  const updatePackage = async (id, packageData) => {
    try {
      const res = await axios.put(`/api/packages/${id}`, packageData);
      dispatch({
        type: 'UPDATE_PACKAGE',
        payload: res.data.data.package
      });
      toast.success('Package updated successfully!');
      return { success: true, package: res.data.data.package };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating package';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete package (Admin only)
  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packages/${id}`);
      dispatch({
        type: 'DELETE_PACKAGE',
        payload: id
      });
      toast.success('Package deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting package';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Add review to package
  const addReview = async (packageId, reviewData) => {
    try {
      const res = await axios.post(`/api/packages/${packageId}/reviews`, reviewData);
      dispatch({
        type: 'UPDATE_PACKAGE',
        payload: res.data.data.package
      });
      toast.success('Review added successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error adding review';
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
    packages: state.packages,
    featuredPackages: state.featuredPackages,
    currentPackage: state.currentPackage,
    categories: state.categories,
    destinations: state.destinations,
    countries: state.countries,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    getPackages,
    getFeaturedPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    addReview,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <PackageContext.Provider value={value}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackage = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
}; 