import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingContext = createContext();

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    status: '',
    search: ''
  }
};

const bookingReducer = (state, action) => {
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
    case 'SET_BOOKINGS':
      return {
        ...state,
        bookings: action.payload.bookings,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_BOOKING':
      return {
        ...state,
        currentBooking: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        loading: false,
        error: null
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking._id === action.payload._id ? action.payload : booking
        ),
        currentBooking: state.currentBooking?._id === action.payload._id ? action.payload : state.currentBooking,
        loading: false,
        error: null
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.payload),
        currentBooking: state.currentBooking?._id === action.payload ? null : state.currentBooking,
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

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Create new booking (no authentication required)
  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/bookings', bookingData);
      
      dispatch({
        type: 'ADD_BOOKING',
        payload: response.data.booking
      });
      
      toast.success('Booking created successfully! We will contact you soon.');
      return { success: true, booking: response.data.booking };
    } catch (error) {
      let message = 'Error creating booking';
      
      if (error.response?.data?.errors) {
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

  // Get all bookings (admin only)
  const getBookings = async (filters = {}, page = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', state.pagination.itemsPerPage);
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`/api/bookings?${params}`);
      
      dispatch({
        type: 'SET_BOOKINGS',
        payload: response.data.data
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching bookings';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get single booking (admin only)
  const getBooking = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.get(`/api/bookings/${id}`);
      
      dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: response.data.booking
      });
      
      return { success: true, booking: response.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching booking';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update booking status (admin only)
  const updateBookingStatus = async (id, status, adminNotes = '') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.put(`/api/bookings/${id}/status`, {
        status,
        adminNotes
      });
      
      dispatch({
        type: 'UPDATE_BOOKING',
        payload: response.data.booking
      });
      
      toast.success('Booking status updated successfully');
      return { success: true, booking: response.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating booking status';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete booking (admin only)
  const deleteBooking = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await axios.delete(`/api/bookings/${id}`);
      
      dispatch({
        type: 'DELETE_BOOKING',
        payload: id
      });
      
      toast.success('Booking deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting booking';
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
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
    deleteBooking,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}; 