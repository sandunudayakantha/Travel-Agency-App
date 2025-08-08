import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TourGuideContext = createContext();

const initialState = {
  tourGuides: [],
  currentTourGuide: null,
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
    level: '',
    availability: '',
    language: '',
    search: ''
  }
};

const tourGuideReducer = (state, action) => {
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
    case 'SET_TOUR_GUIDES':
      return {
        ...state,
        tourGuides: action.payload.tourGuides,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_TOUR_GUIDE':
      return {
        ...state,
        currentTourGuide: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_TOUR_GUIDE':
      return {
        ...state,
        tourGuides: [action.payload, ...state.tourGuides],
        loading: false,
        error: null
      };
    case 'UPDATE_TOUR_GUIDE':
      return {
        ...state,
        tourGuides: state.tourGuides.map(tourGuide =>
          tourGuide._id === action.payload._id ? action.payload : tourGuide
        ),
        currentTourGuide: state.currentTourGuide?._id === action.payload._id ? action.payload : state.currentTourGuide,
        loading: false,
        error: null
      };
    case 'DELETE_TOUR_GUIDE':
      return {
        ...state,
        tourGuides: state.tourGuides.filter(tourGuide => tourGuide._id !== action.payload),
        currentTourGuide: state.currentTourGuide?._id === action.payload ? null : state.currentTourGuide,
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

export const TourGuideProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tourGuideReducer, initialState);

  // Get all tour guides with filters
  const getTourGuides = async (filters = {}, page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...filters
      });

      const res = await axios.get(`/api/tour-guides?${params}`);
      dispatch({
        type: 'SET_TOUR_GUIDES',
        payload: res.data.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading tour guides';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get single tour guide
  const getTourGuide = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/tour-guides/${id}`);
      dispatch({
        type: 'SET_CURRENT_TOUR_GUIDE',
        payload: res.data.data.tourGuide
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading tour guide';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create tour guide (Admin only)
  const createTourGuide = async (tourGuideData) => {
    console.log('=== FRONTEND TOUR GUIDE CREATION START ===');
    console.log('Original tour guide data:', tourGuideData);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData...');
      
      // Add text fields
      Object.keys(tourGuideData).forEach(key => {
        if (key !== 'avatar') {
          if (typeof tourGuideData[key] === 'object') {
            const jsonString = JSON.stringify(tourGuideData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, tourGuideData[key]);
            formData.append(key, tourGuideData[key]);
          }
        }
      });

      // Add avatar
      if (tourGuideData.avatar) {
        console.log('Adding avatar to FormData:', tourGuideData.avatar.name, tourGuideData.avatar.type, tourGuideData.avatar.size);
        formData.append('avatar', tourGuideData.avatar);
      }

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending request to /api/tour-guides...');
      const res = await axios.post('/api/tour-guides', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response received:', res.data);

      dispatch({
        type: 'ADD_TOUR_GUIDE',
        payload: res.data.data.tourGuide
      });
      toast.success('Tour guide created successfully!');
      console.log('=== FRONTEND TOUR GUIDE CREATION SUCCESS ===');
      return { success: true, tourGuide: res.data.data.tourGuide };
    } catch (error) {
      console.error('=== FRONTEND TOUR GUIDE CREATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const message = error.response?.data?.message || 'Error creating tour guide';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND TOUR GUIDE CREATION ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Update tour guide (Admin only)
  const updateTourGuide = async (id, tourGuideData) => {
    console.log('=== FRONTEND TOUR GUIDE UPDATE START ===');
    console.log('Tour Guide ID:', id);
    console.log('Original tour guide data:', tourGuideData);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData for update...');
      
      // Add text fields
      Object.keys(tourGuideData).forEach(key => {
        if (key !== 'avatar') {
          if (typeof tourGuideData[key] === 'object') {
            const jsonString = JSON.stringify(tourGuideData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, tourGuideData[key]);
            formData.append(key, tourGuideData[key]);
          }
        }
      });

      // Add avatar
      if (tourGuideData.avatar) {
        console.log('Adding avatar to FormData for update:', tourGuideData.avatar.name, tourGuideData.avatar.type, tourGuideData.avatar.size);
        if (tourGuideData.avatar instanceof File) {
          formData.append('avatar', tourGuideData.avatar);
        }
      }

      console.log('FormData entries for update:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending PUT request to /api/tour-guides/' + id);
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token length:', token ? token.length : 0);
      
      const res = await axios.put(`/api/tour-guides/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Update response received:', res.data);

      dispatch({
        type: 'UPDATE_TOUR_GUIDE',
        payload: res.data.data.tourGuide
      });
      toast.success('Tour guide updated successfully!');
      console.log('=== FRONTEND TOUR GUIDE UPDATE SUCCESS ===');
      return { success: true, tourGuide: res.data.data.tourGuide };
    } catch (error) {
      console.error('=== FRONTEND TOUR GUIDE UPDATE ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      const message = error.response?.data?.message || 'Error updating tour guide';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND TOUR GUIDE UPDATE ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Delete tour guide (Admin only)
  const deleteTourGuide = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await axios.delete(`/api/tour-guides/${id}`);
      dispatch({ type: 'DELETE_TOUR_GUIDE', payload: id });
      toast.success('Tour guide deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting tour guide';
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

  return (
    <TourGuideContext.Provider value={{
      ...state,
      getTourGuides,
      getTourGuide,
      createTourGuide,
      updateTourGuide,
      deleteTourGuide,
      setFilters,
      clearFilters,
      clearError
    }}>
      {children}
    </TourGuideContext.Provider>
  );
};

export const useTourGuide = () => {
  const context = useContext(TourGuideContext);
  if (!context) {
    throw new Error('useTourGuide must be used within a TourGuideProvider');
  }
  return context;
}; 