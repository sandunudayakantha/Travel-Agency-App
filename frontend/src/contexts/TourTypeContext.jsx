import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TourTypeContext = createContext();

const initialState = {
  tourTypes: [],
  currentTourType: null,
  loading: false,
  error: null
};

const tourTypeReducer = (state, action) => {
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
    case 'SET_TOUR_TYPES':
      return {
        ...state,
        tourTypes: action.payload,
        loading: false
      };
    case 'SET_CURRENT_TOUR_TYPE':
      return {
        ...state,
        currentTourType: action.payload,
        loading: false
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
    default:
      return state;
  }
};

export const TourTypeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tourTypeReducer, initialState);

  // Get all tour types
  const getTourTypes = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`/api/tour-types?${params}`);
      dispatch({
        type: 'SET_TOUR_TYPES',
        payload: res.data.tourTypes
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading tour types';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  }, []);

  // Get single tour type
  const getTourType = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/tour-types/${id}`);
      dispatch({
        type: 'SET_CURRENT_TOUR_TYPE',
        payload: res.data.tourType
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading tour type';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create tour type (Admin only)
  const createTourType = async (tourTypeData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create tour types');
        return { success: false, error: 'Authentication required' };
      }

      const res = await axios.post('/api/tour-types', tourTypeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
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

  // Update tour type (Admin only)
  const updateTourType = async (id, tourTypeData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update tour types');
        return { success: false, error: 'Authentication required' };
      }

      const res = await axios.put(`/api/tour-types/${id}`, tourTypeData, {
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
      const message = error.response?.data?.message || 'Error updating tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete tour type (Admin only)
  const deleteTourType = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
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
      const message = error.response?.data?.message || 'Error deleting tour type';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    getTourTypes,
    getTourType,
    createTourType,
    updateTourType,
    deleteTourType,
    clearError
  };

  return (
    <TourTypeContext.Provider value={value}>
      {children}
    </TourTypeContext.Provider>
  );
};

export const useTourType = () => {
  const context = useContext(TourTypeContext);
  if (!context) {
    throw new Error('useTourType must be used within a TourTypeProvider');
  }
  return context;
}; 