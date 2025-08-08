import React, { createContext, useContext, useReducer } from 'react';
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
    itemsPerPage: 10
  }
};

const bookingReducer = (state, action) => {
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
    case 'SET_BOOKINGS':
      return {
        ...state,
        bookings: action.payload.bookings,
        pagination: action.payload.pagination,
        loading: false
      };
    case 'SET_CURRENT_BOOKING':
      return {
        ...state,
        currentBooking: action.payload,
        loading: false
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings]
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking => 
          booking._id === action.payload._id ? action.payload : booking
        ),
        currentBooking: state.currentBooking?._id === action.payload._id 
          ? action.payload 
          : state.currentBooking
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.payload)
      };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Get user's bookings
  const getBookings = async (filters = {}, page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });

      const res = await axios.get(`/api/bookings?${params}`);
      dispatch({
        type: 'SET_BOOKINGS',
        payload: res.data.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading bookings';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get single booking
  const getBooking = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/bookings/${id}`);
      dispatch({
        type: 'SET_CURRENT_BOOKING',
        payload: res.data.data.booking
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading booking';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      const res = await axios.post('/api/bookings', bookingData);
      dispatch({
        type: 'ADD_BOOKING',
        payload: res.data.data.booking
      });
      toast.success('Booking created successfully!');
      return { success: true, booking: res.data.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating booking';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update booking status (Admin only)
  const updateBookingStatus = async (id, status, reason = '') => {
    try {
      const res = await axios.put(`/api/bookings/${id}`, { status, reason });
      dispatch({
        type: 'UPDATE_BOOKING',
        payload: res.data.data.booking
      });
      toast.success('Booking status updated successfully!');
      return { success: true, booking: res.data.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating booking status';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Cancel booking
  const cancelBooking = async (id, reason = '') => {
    try {
      const res = await axios.post(`/api/bookings/${id}/cancel`, { reason });
      dispatch({
        type: 'UPDATE_BOOKING',
        payload: res.data.data.booking
      });
      toast.success('Booking cancelled successfully!');
      return { success: true, booking: res.data.data.booking };
    } catch (error) {
      const message = error.response?.data?.message || 'Error cancelling booking';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Add review to booking
  const addBookingReview = async (id, reviewData) => {
    try {
      const res = await axios.post(`/api/bookings/${id}/review`, reviewData);
      dispatch({
        type: 'UPDATE_BOOKING',
        payload: res.data.data.booking
      });
      toast.success('Review added successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error adding review';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    bookings: state.bookings,
    currentBooking: state.currentBooking,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    getBookings,
    getBooking,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    addBookingReview,
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