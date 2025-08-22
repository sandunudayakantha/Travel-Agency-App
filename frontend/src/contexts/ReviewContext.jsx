import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from '../config/axios';

const ReviewContext = createContext();

const initialState = {
  reviews: [],
  currentReview: null,
  loading: false,
  error: null,
  stats: {
    averageRating: 0,
    numReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalDocs: 0
  }
};

const reviewReducer = (state, action) => {
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
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload.docs || action.payload,
        pagination: {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          totalPages: action.payload.totalPages || 0,
          totalDocs: action.payload.totalDocs || 0
        },
        loading: false
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        loading: false
      };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review._id === action.payload._id ? action.payload : review
        ),
        loading: false
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review._id !== action.payload),
        loading: false
      };
    case 'SET_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: action.payload
      };
    case 'CLEAR_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: null
      };
    default:
      return state;
  }
};

export const ReviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Get featured reviews for home page
  const getFeaturedReviews = useCallback(async (limit = 6) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get('/api/reviews/featured', {
        params: { limit }
      });

      dispatch({ type: 'SET_REVIEWS', payload: response.data.data.reviews });
      dispatch({ type: 'SET_STATS', payload: response.data.data.stats });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching featured reviews'
      });
    }
  }, [dispatch]);

  // Get reviews for a package
  const getPackageReviews = useCallback(async (packageId, page = 1, limit = 10, sort = '-createdAt') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get(`/api/reviews/package/${packageId}`, {
        params: { page, limit, sort }
      });

      dispatch({ type: 'SET_REVIEWS', payload: response.data.data });
      dispatch({ type: 'SET_STATS', payload: response.data.stats });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching reviews'
      });
    }
  }, [dispatch]);

  // Get all reviews (admin only)
  const getAllReviews = useCallback(async (page = 1, limit = 10, sort = '-createdAt', status = 'all') => {
    try {
      console.log('ReviewContext: getAllReviews called with params:', { page, limit, sort, status });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get('/api/reviews', {
        params: { page, limit, sort, status }
      });

      console.log('ReviewContext: getAllReviews response:', response.data);
      dispatch({ type: 'SET_REVIEWS', payload: response.data.data });
    } catch (error) {
      console.error('ReviewContext: getAllReviews error:', error.response?.data || error.message);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching reviews'
      });
    }
  }, [dispatch]);

  // Get single review
  const getReview = useCallback(async (reviewId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.get(`/api/reviews/${reviewId}`);
      dispatch({ type: 'SET_CURRENT_REVIEW', payload: response.data.data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching review'
      });
    }
  }, [dispatch]);

  // Create review
  const createReview = useCallback(async (reviewData) => {
    try {
      console.log('ReviewContext: Creating review with data:', reviewData);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const formData = new FormData();
      
      // Only append packageId if it exists and is not empty
      if (reviewData.packageId && reviewData.packageId.trim() !== '') {
        formData.append('packageId', reviewData.packageId);
      }
      
      formData.append('rating', reviewData.rating);
      
      // Only append title if it exists
      if (reviewData.title && reviewData.title.trim() !== '') {
        formData.append('title', reviewData.title);
      }
      
      formData.append('comment', reviewData.comment);

      if (reviewData.images) {
        reviewData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      console.log('ReviewContext: Sending request to /api/reviews');
      console.log('ReviewContext: FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      const response = await axios.post('/api/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('ReviewContext: Review created successfully:', response.data);
      console.log('ReviewContext: Response status:', response.status);
      console.log('ReviewContext: Response success:', response.data.success);
      
      if (response.data.success) {
        // Clear any existing errors since the operation was successful
        dispatch({ type: 'CLEAR_ERROR' });
        dispatch({ type: 'ADD_REVIEW', payload: response.data.data });
        if (response.data.stats) {
          dispatch({ type: 'SET_STATS', payload: response.data.stats });
        }
        return response.data;
      } else {
        // If the response indicates failure, throw an error
        throw new Error(response.data.message || 'Review creation failed');
      }
    } catch (error) {
      console.error('ReviewContext: Error creating review:', error);
      console.error('ReviewContext: Error response:', error.response?.data);
      console.error('ReviewContext: Error status:', error.response?.status);
      
      // Only treat as error if it's actually an HTTP error
      if (error.response && error.response.status >= 400) {
        const errorMessage = error.response?.data?.message || 'Error creating review';
        dispatch({
          type: 'SET_ERROR',
          payload: errorMessage
        });
        throw error;
      } else {
        // If it's not an HTTP error, it might be a network error or other issue
        console.error('ReviewContext: Non-HTTP error:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Network error or unexpected issue occurred'
        });
        throw error;
      }
    }
  }, [dispatch]);

  // Update review
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const formData = new FormData();
      formData.append('rating', reviewData.rating);
      formData.append('title', reviewData.title);
      formData.append('comment', reviewData.comment);

      if (reviewData.images) {
        reviewData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await axios.put(`/api/reviews/${reviewId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({ type: 'UPDATE_REVIEW', payload: response.data.data });
      dispatch({ type: 'SET_STATS', payload: response.data.stats });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error updating review'
      });
      throw error;
    }
  }, [dispatch]);

  // Delete review
  const deleteReview = useCallback(async (reviewId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await axios.delete(`/api/reviews/${reviewId}`);
      dispatch({ type: 'DELETE_REVIEW', payload: reviewId });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error deleting review'
      });
      throw error;
    }
  }, [dispatch]);

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId, helpful = true) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.post(`/api/reviews/${reviewId}/helpful`, { helpful });
      dispatch({ type: 'UPDATE_REVIEW', payload: response.data.data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error marking review as helpful'
      });
    }
  }, [dispatch]);

  // Toggle review approval (admin only)
  const toggleApproval = useCallback(async (reviewId) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axios.patch(`/api/reviews/${reviewId}/approve`);
      dispatch({ type: 'UPDATE_REVIEW', payload: response.data.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error toggling review approval'
      });
      throw error;
    }
  }, [dispatch]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  // Clear current review
  const clearCurrentReview = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_REVIEW' });
  }, [dispatch]);

  const value = {
    ...state,
    getFeaturedReviews,
    getPackageReviews,
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    toggleApproval,
    clearError,
    clearCurrentReview
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
}; 