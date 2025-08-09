import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlaceContext = createContext();

const initialState = {
  places: [],
  currentPlace: null,
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
    category: '',
    status: '',
    featured: '',
    country: '',
    city: '',
    search: ''
  },
  categories: []
};

const placeReducer = (state, action) => {
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
    case 'SET_PLACES':
      return {
        ...state,
        places: action.payload.places,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_PLACE':
      return {
        ...state,
        currentPlace: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_PLACE':
      return {
        ...state,
        places: [action.payload, ...state.places],
        loading: false,
        error: null
      };
    case 'UPDATE_PLACE':
      return {
        ...state,
        places: state.places.map(place =>
          place._id === action.payload._id ? action.payload : place
        ),
        currentPlace: state.currentPlace?._id === action.payload._id ? action.payload : state.currentPlace,
        loading: false,
        error: null
      };
    case 'DELETE_PLACE':
      return {
        ...state,
        places: state.places.filter(place => place._id !== action.payload),
        currentPlace: state.currentPlace?._id === action.payload ? null : state.currentPlace,
        loading: false,
        error: null
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
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

export const PlaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(placeReducer, initialState);

  // Get all places with filters and pagination
  const getPlaces = async (filters = {}, page = 1) => {
    console.log('=== FRONTEND GET PLACES START ===');
    console.log('Filters:', filters);
    console.log('Page:', page);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: state.pagination.itemsPerPage.toString(),
        ...filters
      });

      console.log('API request params:', params.toString());

      const res = await axios.get(`/api/places?${params}`);
      console.log('Places API response:', res.data);

      dispatch({
        type: 'SET_PLACES',
        payload: {
          places: res.data.data.places,
          pagination: res.data.data.pagination
        }
      });
      console.log('=== FRONTEND GET PLACES SUCCESS ===');
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error('=== FRONTEND GET PLACES ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      
      const message = error.response?.data?.message || 'Error fetching places';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND GET PLACES ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Get single place by ID
  const getPlaceById = async (id) => {
    console.log('=== FRONTEND GET PLACE BY ID START ===');
    console.log('Place ID:', id);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/places/${id}`);
      console.log('Place by ID response:', res.data);

      dispatch({
        type: 'SET_CURRENT_PLACE',
        payload: res.data.data.place
      });
      console.log('=== FRONTEND GET PLACE BY ID SUCCESS ===');
      return { success: true, place: res.data.data.place };
    } catch (error) {
      console.error('=== FRONTEND GET PLACE BY ID ERROR ===');
      console.error('Error object:', error);
      
      const message = error.response?.data?.message || 'Error fetching place';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND GET PLACE BY ID ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Create place (Admin only)
  const createPlace = async (placeData) => {
    console.log('=== FRONTEND PLACE CREATION START ===');
    console.log('Original place data:', placeData);
    
    // Check authentication token
    const token = localStorage.getItem('token');
    console.log('🔐 Authentication token present:', !!token);
    console.log('🔐 Token length:', token ? token.length : 0);
    
    // Check axios default headers
    console.log('🔐 Axios default auth header:', axios.defaults.headers.common['Authorization']);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData...');
      
      // Add text fields
      Object.keys(placeData).forEach(key => {
        if (key !== 'files' && key !== 'imagesMetadata' && key !== 'videosMetadata') {
          if (typeof placeData[key] === 'object' && placeData[key] !== null) {
            const jsonString = JSON.stringify(placeData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, placeData[key]);
            formData.append(key, placeData[key]);
          }
        }
      });

      // Add images metadata
      if (placeData.imagesMetadata) {
        console.log('Adding images metadata:', placeData.imagesMetadata);
        formData.append('imagesMetadata', JSON.stringify(placeData.imagesMetadata));
      }

      // Add videos metadata
      if (placeData.videosMetadata) {
        console.log('Adding videos metadata:', placeData.videosMetadata);
        formData.append('videosMetadata', JSON.stringify(placeData.videosMetadata));
      }

      // Add files
      if (placeData.files && placeData.files.length > 0) {
        console.log('Adding files to FormData:', placeData.files.length, 'files');
        placeData.files.forEach((file, index) => {
          console.log(`Adding file ${index + 1}:`, file.name, file.type, file.size);
          formData.append('files', file);
        });
      }

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending request to /api/places...');
      const res = await axios.post('/api/places', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response received:', res.data);

      dispatch({
        type: 'ADD_PLACE',
        payload: res.data.data.place
      });
      toast.success('Place created successfully!');
      console.log('=== FRONTEND PLACE CREATION SUCCESS ===');
      return { success: true, place: res.data.data.place };
    } catch (error) {
      console.error('=== FRONTEND PLACE CREATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      const message = error.response?.data?.message || 'Error creating place';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND PLACE CREATION ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Update place (Admin only)
  const updatePlace = async (id, placeData) => {
    console.log('=== FRONTEND PLACE UPDATE START ===');
    console.log('Place ID:', id);
    console.log('Original place data:', placeData);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData for update...');
      
      // Add text fields
      Object.keys(placeData).forEach(key => {
        if (key !== 'files' && key !== 'imagesMetadata' && key !== 'videosMetadata') {
          if (typeof placeData[key] === 'object' && placeData[key] !== null) {
            const jsonString = JSON.stringify(placeData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, placeData[key]);
            formData.append(key, placeData[key]);
          }
        }
      });

      // Add metadata
      if (placeData.imagesMetadata) {
        formData.append('imagesMetadata', JSON.stringify(placeData.imagesMetadata));
      }
      if (placeData.videosMetadata) {
        formData.append('videosMetadata', JSON.stringify(placeData.videosMetadata));
      }

      // Add new files
      if (placeData.files && placeData.files.length > 0) {
        console.log('Adding new files for update:', placeData.files.length, 'files');
        placeData.files.forEach((file, index) => {
          if (file instanceof File) {
            console.log(`Adding new file ${index + 1}:`, file.name, file.type, file.size);
            formData.append('files', file);
          }
        });
      }

      console.log('FormData entries for update:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending update request to /api/places/' + id);
      const res = await axios.put(`/api/places/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Update response received:', res.data);

      dispatch({
        type: 'UPDATE_PLACE',
        payload: res.data.data.place
      });
      toast.success('Place updated successfully!');
      console.log('=== FRONTEND PLACE UPDATE SUCCESS ===');
      return { success: true, place: res.data.data.place };
    } catch (error) {
      console.error('=== FRONTEND PLACE UPDATE ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      
      const message = error.response?.data?.message || 'Error updating place';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND PLACE UPDATE ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Delete place (Admin only)
  const deletePlace = async (id) => {
    console.log('=== FRONTEND PLACE DELETION START ===');
    console.log('Place ID:', id);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Sending delete request to /api/places/' + id);
      const res = await axios.delete(`/api/places/${id}`);
      console.log('Delete response received:', res.data);

      dispatch({
        type: 'DELETE_PLACE',
        payload: id
      });
      toast.success('Place deleted successfully!');
      console.log('=== FRONTEND PLACE DELETION SUCCESS ===');
      return { success: true };
    } catch (error) {
      console.error('=== FRONTEND PLACE DELETION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      
      const message = error.response?.data?.message || 'Error deleting place';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND PLACE DELETION ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Get categories
  const getCategories = async () => {
    console.log('=== FRONTEND GET CATEGORIES START ===');
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/places/categories/list');
      console.log('Categories response:', res.data);

      dispatch({
        type: 'SET_CATEGORIES',
        payload: res.data.data.categories
      });
      console.log('=== FRONTEND GET CATEGORIES SUCCESS ===');
      return { success: true, categories: res.data.data.categories };
    } catch (error) {
      console.error('=== FRONTEND GET CATEGORIES ERROR ===');
      console.error('Error object:', error);
      
      const message = error.response?.data?.message || 'Error fetching categories';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      console.log('=== FRONTEND GET CATEGORIES ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const value = {
    places: state.places,
    currentPlace: state.currentPlace,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    categories: state.categories,
    getPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace,
    getCategories,
    clearError,
    setFilters,
    clearFilters
  };

  return (
    <PlaceContext.Provider value={value}>
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlace = () => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlace must be used within a PlaceProvider');
  }
  return context;
};

export default PlaceContext; 