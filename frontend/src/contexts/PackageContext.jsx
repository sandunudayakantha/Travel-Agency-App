import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
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
  tourTypes: [],
  vehicles: [],
  guides: [],
  places: [],
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
    case 'SET_TOUR_TYPES':
      return {
        ...state,
        tourTypes: action.payload
      };
    case 'ADD_TOUR_TYPE':
      return {
        ...state,
        tourTypes: [action.payload, ...state.tourTypes]
      };
    case 'UPDATE_TOUR_TYPE':
      return {
        ...state,
                tourTypes: state.tourTypes.map(type =>
          type._id === action.payload._id ? action.payload : type
        )
      };
    case 'DELETE_TOUR_TYPE':
      return {
        ...state,
        tourTypes: state.tourTypes.filter(type => type._id !== action.payload)
      };
    case 'SET_VEHICLES':
      return {
        ...state,
        vehicles: action.payload
      };
    case 'SET_GUIDES':
      return {
        ...state,
        guides: action.payload
      };
    case 'SET_PLACES':
      return {
        ...state,
        places: action.payload
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

  // Load only tour types on mount (for package page)
  useEffect(() => {
    loadTourTypes();
  }, []);

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await axios.get('/api/packages/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: res.data.data.categories });
    } catch (error) {
      // Handle error silently
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
      // Handle error silently
    }
  };

  // Load tour types
  const loadTourTypes = async () => {
    try {
      const res = await axios.get('/api/tour-types');
      dispatch({ type: 'SET_TOUR_TYPES', payload: res.data.tourTypes });
    } catch (error) {
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_TOUR_TYPES', payload: [] });
    }
  };

  // Load packages (Admin)
  const loadPackages = async () => {
    try {
      const res = await axios.get('/api/packages');
      dispatch({ 
        type: 'SET_PACKAGES', 
        payload: {
          packages: res.data.data.packages,
          pagination: res.data.data.pagination
        }
      });
    } catch (error) {
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_PACKAGES', payload: { packages: [], pagination: initialState.pagination } });
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await axios.get('/api/vehicles');
      dispatch({ type: 'SET_VEHICLES', payload: res.data.vehicles });
    } catch (error) {
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_VEHICLES', payload: [] });
    }
  };

  const loadGuides = async () => {
    try {
      const res = await axios.get('/api/tour-guides');
      dispatch({ type: 'SET_GUIDES', payload: res.data.tourGuides });
    } catch (error) {
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_GUIDES', payload: [] });
    }
  };

  const loadPlaces = async () => {
    try {
      const res = await axios.get('/api/places');
      dispatch({ type: 'SET_PLACES', payload: res.data.places });
    } catch (error) {
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_PLACES', payload: [] });
    }
  };

  // Create tour type
  const createTourType = async (tourTypeData) => {
    try {
      const formData = new FormData();
      formData.append('name', tourTypeData.name);
      if (tourTypeData.description) {
        formData.append('description', tourTypeData.description);
      }
      if (tourTypeData.image) {
        formData.append('image', tourTypeData.image);
      }

      const res = await axios.post('/api/tour-types', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: 'ADD_TOUR_TYPE',
        payload: res.data.tourType
      });
      toast.success('Tour type created successfully!');
      return { success: true, tourType: res.data.tourType };
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update tour type
  const updateTourType = async (id, tourTypeData) => {
    try {
      const formData = new FormData();
      formData.append('name', tourTypeData.name);
      if (tourTypeData.description) {
        formData.append('description', tourTypeData.description);
      }
      if (tourTypeData.image) {
        formData.append('image', tourTypeData.image);
      }

      const res = await axios.put(`/api/tour-types/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({
        type: 'UPDATE_TOUR_TYPE',
        payload: res.data.tourType
      });
      toast.success('Tour type updated successfully!');
      return { success: true, tourType: res.data.tourType };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete tour type
  const deleteTourType = async (id) => {
    try {
      await axios.delete(`/api/tour-types/${id}`);
      dispatch({
        type: 'DELETE_TOUR_TYPE',
        payload: id
      });
      toast.success('Tour type deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get all packages with filters
  const getPackages = useCallback(async (filters = {}, page = 1) => {
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
  }, []);

  // Get featured packages
  const getFeaturedPackages = useCallback(async () => {
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
  }, []);

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
      const res = await axios.post('/api/packages', packageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
      const res = await axios.put(`/api/packages/${id}`, packageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
    tourTypes: state.tourTypes,
    vehicles: state.vehicles,
    guides: state.guides,
    places: state.places,
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
    clearError,
    loadPackages,
    loadTourTypes,
    loadVehicles,
    loadGuides,
    loadPlaces,
    createTourType,
    updateTourType,
    deleteTourType
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