import React, { createContext, useContext, useReducer, useCallback } from 'react';
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
  const getPlaces = useCallback(async (filters = {}, page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: state.pagination.itemsPerPage.toString(),
        ...filters
      });

      const res = await axios.get(`/api/places?${params}`);

      dispatch({
        type: 'SET_PLACES',
        payload: {
          places: res.data.data.places,
          pagination: res.data.data.pagination
        }
      });
      return { success: true, data: res.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching places';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, [state.pagination.itemsPerPage]);

  // Get single place by ID
  const getPlaceById = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/places/${id}`);

      dispatch({
        type: 'SET_CURRENT_PLACE',
        payload: res.data.data.place
      });
      return { success: true, place: res.data.data.place };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching place';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Create place (Admin only)
  const createPlace = useCallback(async (placeData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(placeData).forEach(key => {
        if (key !== 'files' && key !== 'imagesMetadata' && key !== 'videosMetadata') {
          if (typeof placeData[key] === 'object' && placeData[key] !== null) {
            const jsonString = JSON.stringify(placeData[key]);
            formData.append(key, jsonString);
          } else {
            formData.append(key, placeData[key]);
          }
        }
      });

      // Add images metadata
      if (placeData.imagesMetadata) {
        formData.append('imagesMetadata', JSON.stringify(placeData.imagesMetadata));
      }

      // Add videos metadata
      if (placeData.videosMetadata) {
        formData.append('videosMetadata', JSON.stringify(placeData.videosMetadata));
      }

      // Add files
      if (placeData.files && placeData.files.length > 0) {
        placeData.files.forEach((file, index) => {
          formData.append('files', file);
        });
      }

      const res = await axios.post('/api/places', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({
        type: 'ADD_PLACE',
        payload: res.data.data.place
      });
      toast.success('Place created successfully!');
      return { success: true, place: res.data.data.place };
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating place';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Update place (Admin only)
  const updatePlace = useCallback(async (id, placeData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(placeData).forEach(key => {
        if (key !== 'files' && key !== 'imagesMetadata' && key !== 'videosMetadata') {
          if (typeof placeData[key] === 'object' && placeData[key] !== null) {
            const jsonString = JSON.stringify(placeData[key]);
            formData.append(key, jsonString);
          } else {
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
        placeData.files.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('files', file);
          }
        });
      }

      const res = await axios.put(`/api/places/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({
        type: 'UPDATE_PLACE',
        payload: res.data.data.place
      });
      toast.success('Place updated successfully!');
      return { success: true, place: res.data.data.place };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating place';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Delete place (Admin only)
  const deletePlace = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.delete(`/api/places/${id}`);

      dispatch({
        type: 'DELETE_PLACE',
        payload: id
      });
      toast.success('Place deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting place';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  // Get categories
  const getCategories = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/places/categories/list');

      dispatch({
        type: 'SET_CATEGORIES',
        payload: res.data.data.categories
      });
      return { success: true, categories: res.data.data.categories };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching categories';
      
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

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