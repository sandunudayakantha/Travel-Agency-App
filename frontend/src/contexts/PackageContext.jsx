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
      console.log('Setting vehicles in reducer:', action.payload);
      return {
        ...state,
        vehicles: action.payload
      };
    case 'SET_GUIDES':
      console.log('Setting guides in reducer:', action.payload);
      return {
        ...state,
        guides: action.payload
      };
    case 'SET_PLACES':
      console.log('Setting places in reducer:', action.payload);
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
  
  console.log('PackageProvider initial state:', initialState);
  console.log('PackageProvider current state:', state);

  // Load only tour types on mount (for package page)
  useEffect(() => {
    console.log('PackageProvider useEffect running - loading tour types only...');
    loadTourTypes();
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

  // Load tour types
  const loadTourTypes = async () => {
    try {
      console.log('Loading tour types...');
      const res = await axios.get('/api/tour-types');
      console.log('Tour types response:', res.data);
      dispatch({ type: 'SET_TOUR_TYPES', payload: res.data.tourTypes });
    } catch (error) {
      console.error('Error loading tour types:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_TOUR_TYPES', payload: [] });
    }
  };

  // Load packages (Admin)
  const loadPackages = async () => {
    try {
      console.log('Loading packages...');
      const res = await axios.get('/api/packages');
      console.log('Packages response:', res.data);
      dispatch({ 
        type: 'SET_PACKAGES', 
        payload: {
          packages: res.data.data.packages,
          pagination: res.data.data.pagination
        }
      });
    } catch (error) {
      console.error('Error loading packages:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_PACKAGES', payload: { packages: [], pagination: initialState.pagination } });
    }
  };

  const loadVehicles = async () => {
    try {
      console.log('Loading vehicles...');
      const res = await axios.get('/api/vehicles');
      console.log('Vehicles response:', res.data);
      dispatch({ type: 'SET_VEHICLES', payload: res.data.vehicles });
    } catch (error) {
      console.error('Error loading vehicles:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_VEHICLES', payload: [] });
    }
  };

  const loadGuides = async () => {
    try {
      console.log('Loading guides...');
      const res = await axios.get('/api/tour-guides');
      console.log('Guides response:', res.data);
      dispatch({ type: 'SET_GUIDES', payload: res.data.tourGuides });
    } catch (error) {
      console.error('Error loading guides:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_GUIDES', payload: [] });
    }
  };

  const loadPlaces = async () => {
    try {
      console.log('Loading places...');
      const res = await axios.get('/api/places');
      console.log('Places response:', res.data);
      dispatch({ type: 'SET_PLACES', payload: res.data.places });
    } catch (error) {
      console.error('Error loading places:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_PLACES', payload: [] });
    }
  };

  // Create tour type
  const createTourType = async (tourTypeData) => {
    try {
      console.log('Creating tour type with data:', tourTypeData);
      
      const formData = new FormData();
      formData.append('name', tourTypeData.name);
      if (tourTypeData.description) {
        formData.append('description', tourTypeData.description);
      }
      if (tourTypeData.image) {
        formData.append('image', tourTypeData.image);
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to create tour types');
        return { success: false, error: 'Authentication required' };
      }

      console.log('Sending request to create tour type...');
      const res = await axios.post('/api/tour-types', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Tour type created successfully:', res.data);
      dispatch({
        type: 'ADD_TOUR_TYPE',
        payload: res.data.tourType
      });
      toast.success('Tour type created successfully!');
      return { success: true, tourType: res.data.tourType };
    } catch (error) {
      console.error('Error creating tour type:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Error creating tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update tour type
  const updateTourType = async (id, tourTypeData) => {
    try {
      console.log('Updating tour type with data:', tourTypeData);
      
      const formData = new FormData();
      formData.append('name', tourTypeData.name);
      if (tourTypeData.description) {
        formData.append('description', tourTypeData.description);
      }
      if (tourTypeData.image) {
        formData.append('image', tourTypeData.image);
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to update tour types');
        return { success: false, error: 'Authentication required' };
      }

      const res = await axios.put(`/api/tour-types/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch({
        type: 'UPDATE_TOUR_TYPE',
        payload: res.data.tourType
      });
      toast.success('Tour type updated successfully!');
      return { success: true, tourType: res.data.tourType };
    } catch (error) {
      console.error('Error updating tour type:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Error updating tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete tour type
  const deleteTourType = async (id) => {
    try {
      console.log('Deleting tour type with ID:', id);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to delete tour types');
        return { success: false, error: 'Authentication required' };
      }

      await axios.delete(`/api/tour-types/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch({
        type: 'DELETE_TOUR_TYPE',
        payload: id
      });
      toast.success('Tour type deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting tour type:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Error deleting tour type';
      toast.error(message);
      return { success: false, error: message };
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
      console.log('Creating package with data:', packageData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to create packages');
        return { success: false, error: 'Authentication required' };
      }

      const res = await axios.post('/api/packages', packageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Package created successfully:', res.data);
      dispatch({
        type: 'ADD_PACKAGE',
        payload: res.data.data.package
      });
      toast.success('Package created successfully!');
      return { success: true, package: res.data.data.package };
    } catch (error) {
      console.error('Error creating package:', error);
      console.error('Error response:', error.response?.data);
      
      // Log detailed validation errors if they exist
      if (error.response?.data?.errors) {
        console.error('Validation errors:');
        error.response.data.errors.forEach((err, index) => {
          console.error(`${index + 1}. ${err.msg} (field: ${err.path})`);
        });
      }
      
      const message = error.response?.data?.message || 'Error creating package';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update package (Admin only)
  const updatePackage = async (id, packageData) => {
    try {
      console.log('Updating package with data:', packageData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to update packages');
        return { success: false, error: 'Authentication required' };
      }

      const res = await axios.put(`/api/packages/${id}`, packageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Package updated successfully:', res.data);
      dispatch({
        type: 'UPDATE_PACKAGE',
        payload: res.data.data.package
      });
      toast.success('Package updated successfully!');
      return { success: true, package: res.data.data.package };
    } catch (error) {
      console.error('Error updating package:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Error updating package';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete package (Admin only)
  const deletePackage = async (id) => {
    try {
      console.log('Deleting package with ID:', id);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to delete packages');
        return { success: false, error: 'Authentication required' };
      }

      await axios.delete(`/api/packages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Package deleted successfully');
      dispatch({
        type: 'DELETE_PACKAGE',
        payload: id
      });
      toast.success('Package deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting package:', error);
      console.error('Error response:', error.response?.data);
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