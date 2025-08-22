import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = false;
axios.defaults.baseURL = 'http://localhost:5005';

// Add request interceptor for auth headers
axios.interceptors.request.use(
  (config) => {
    // Add auth header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Remove auth header
      delete axios.defaults.headers.common['Authorization'];

      // Don't auto-redirect, let components handle it
      console.log('Token expired or invalid, user needs to login again');
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.log('Access forbidden - insufficient permissions');
    }

    // Handle network errors
    if (!error.response) {
      console.log('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

export default axios; 