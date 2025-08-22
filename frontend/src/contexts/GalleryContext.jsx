import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GalleryContext = createContext();

const initialState = {
  galleryItems: [],
  currentItem: null,
  categories: [],
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
    type: '',
    featured: '',
    search: ''
  }
};

const galleryReducer = (state, action) => {
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
    case 'SET_GALLERY_ITEMS':
      return {
        ...state,
        galleryItems: action.payload.galleryItems,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_ITEM':
      return {
        ...state,
        currentItem: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_GALLERY_ITEM':
      return {
        ...state,
        galleryItems: [action.payload, ...state.galleryItems],
        loading: false,
        error: null
      };
    case 'UPDATE_GALLERY_ITEM':
      return {
        ...state,
        galleryItems: state.galleryItems.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        currentItem: state.currentItem?._id === action.payload._id ? action.payload : state.currentItem,
        loading: false,
        error: null
      };
    case 'DELETE_GALLERY_ITEM':
      return {
        ...state,
        galleryItems: state.galleryItems.filter(item => item._id !== action.payload),
        currentItem: state.currentItem?._id === action.payload ? null : state.currentItem,
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

export const GalleryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  // Get all gallery items with filters
  const getGalleryItems = async (filters = {}, page = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', state.pagination.itemsPerPage);
      
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.featured) params.append('featured', filters.featured);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`/api/gallery?${params}`);
      
      dispatch({
        type: 'SET_GALLERY_ITEMS',
        payload: response.data.data
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching gallery items';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get single gallery item
  const getGalleryItem = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get(`/api/gallery/${id}`);
      
      dispatch({
        type: 'SET_CURRENT_ITEM',
        payload: response.data.data
      });
      
      return { success: true, item: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching gallery item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Create gallery item (admin only)
  const createGalleryItem = async (galleryData) => {
    try {
      console.log('=== GALLERY CREATE DEBUG ===');
      console.log('Input galleryData:', galleryData);
      
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const formData = new FormData();
      
      // Add text fields
      Object.keys(galleryData).forEach(key => {
        if (key !== 'image') {
          if (typeof galleryData[key] === 'object') {
            formData.append(key, JSON.stringify(galleryData[key]));
          } else {
            formData.append(key, galleryData[key]);
          }
        }
      });

      // Add image if it exists
      if (galleryData.image) {
        formData.append('image', galleryData.image);
      }

      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Making POST request to /api/gallery...');
      const response = await axios.post('/api/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: 'ADD_GALLERY_ITEM',
        payload: response.data.data
      });
      
      toast.success('Gallery item created successfully!');
      return { success: true, item: response.data.data };
    } catch (error) {
      console.log('=== GALLERY CREATE ERROR ===');
      console.log('Error object:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error response status:', error.response?.status);
      
      const message = error.response?.data?.message || 'Error creating gallery item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update gallery item (admin only)
  const updateGalleryItem = async (id, galleryData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const formData = new FormData();
      
      // Add text fields
      Object.keys(galleryData).forEach(key => {
        if (key !== 'image') {
          if (typeof galleryData[key] === 'object') {
            formData.append(key, JSON.stringify(galleryData[key]));
          } else {
            formData.append(key, galleryData[key]);
          }
        }
      });

      // Add image if it exists
      if (galleryData.image) {
        formData.append('image', galleryData.image);
      }

      const response = await axios.put(`/api/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch({
        type: 'UPDATE_GALLERY_ITEM',
        payload: response.data.data
      });
      
      toast.success('Gallery item updated successfully!');
      return { success: true, item: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating gallery item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete gallery item (admin only)
  const deleteGalleryItem = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.delete(`/api/gallery/${id}`);
      
      dispatch({ type: 'DELETE_GALLERY_ITEM', payload: id });
      toast.success('Gallery item deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting gallery item';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get categories
  const getCategories = async () => {
    try {
      const response = await axios.get('/api/gallery/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: response.data.data });
      return { success: true, categories: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching categories';
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

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, []);

  const value = {
    galleryItems: state.galleryItems,
    currentItem: state.currentItem,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    getGalleryItems,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getCategories,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
