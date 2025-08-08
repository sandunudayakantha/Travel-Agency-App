import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VehicleContext = createContext();

const initialState = {
  vehicles: [],
  currentVehicle: null,
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
    type: '',
    availability: '',
    minPrice: '',
    maxPrice: '',
    minPassengers: '',
    maxPassengers: '',
    search: ''
  }
};

const vehicleReducer = (state, action) => {
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
    case 'SET_VEHICLES':
      return {
        ...state,
        vehicles: action.payload.vehicles,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    case 'SET_CURRENT_VEHICLE':
      return {
        ...state,
        currentVehicle: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_VEHICLE':
      return {
        ...state,
        vehicles: [action.payload, ...state.vehicles],
        loading: false,
        error: null
      };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle._id === action.payload._id ? action.payload : vehicle
        ),
        currentVehicle: state.currentVehicle?._id === action.payload._id ? action.payload : state.currentVehicle,
        loading: false,
        error: null
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle._id !== action.payload),
        currentVehicle: state.currentVehicle?._id === action.payload ? null : state.currentVehicle,
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

export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  // Get all vehicles with filters
  const getVehicles = async (filters = {}, page = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...filters
      });

      const res = await axios.get(`/api/vehicles?${params}`);
      dispatch({
        type: 'SET_VEHICLES',
        payload: res.data.data
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading vehicles';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Get single vehicle
  const getVehicle = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(`/api/vehicles/${id}`);
      dispatch({
        type: 'SET_CURRENT_VEHICLE',
        payload: res.data.data.vehicle
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error loading vehicle';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  // Create vehicle (Admin only)
  const createVehicle = async (vehicleData) => {
    console.log('=== FRONTEND VEHICLE CREATION START ===');
    console.log('Original vehicle data:', vehicleData);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData...');
      
      // Add text fields
      Object.keys(vehicleData).forEach(key => {
        if (key !== 'images') {
          if (typeof vehicleData[key] === 'object') {
            const jsonString = JSON.stringify(vehicleData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, vehicleData[key]);
            formData.append(key, vehicleData[key]);
          }
        }
      });

      // Add images
      if (vehicleData.images) {
        console.log(`Adding ${vehicleData.images.length} images to FormData`);
        vehicleData.images.forEach((image, index) => {
          console.log(`Image ${index}:`, image.name, image.type, image.size);
          formData.append('images', image);
        });
      }

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending request to /api/vehicles...');
      const res = await axios.post('/api/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response received:', res.data);

      dispatch({
        type: 'ADD_VEHICLE',
        payload: res.data.data.vehicle
      });
      toast.success('Vehicle created successfully!');
      console.log('=== FRONTEND VEHICLE CREATION SUCCESS ===');
      return { success: true, vehicle: res.data.data.vehicle };
    } catch (error) {
      console.error('=== FRONTEND VEHICLE CREATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const message = error.response?.data?.message || 'Error creating vehicle';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND VEHICLE CREATION ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Update vehicle (Admin only)
  const updateVehicle = async (id, vehicleData) => {
    console.log('=== FRONTEND VEHICLE UPDATE START ===');
    console.log('Vehicle ID:', id);
    console.log('Original vehicle data:', vehicleData);
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      
      console.log('Building FormData for update...');
      
      // Add text fields
      Object.keys(vehicleData).forEach(key => {
        if (key !== 'images') {
          if (typeof vehicleData[key] === 'object') {
            const jsonString = JSON.stringify(vehicleData[key]);
            console.log(`Adding ${key} as JSON:`, jsonString);
            formData.append(key, jsonString);
          } else {
            console.log(`Adding ${key} as string:`, vehicleData[key]);
            formData.append(key, vehicleData[key]);
          }
        }
      });

      // Add images
      if (vehicleData.images) {
        console.log(`Adding ${vehicleData.images.length} images to FormData for update`);
        vehicleData.images.forEach((image, index) => {
          console.log(`Image ${index}:`, image.name, image.type, image.size);
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      console.log('FormData entries for update:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Sending PUT request to /api/vehicles/' + id);
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token length:', token ? token.length : 0);
      
      const res = await axios.put(`/api/vehicles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Update response received:', res.data);

      dispatch({
        type: 'UPDATE_VEHICLE',
        payload: res.data.data.vehicle
      });
      toast.success('Vehicle updated successfully!');
      console.log('=== FRONTEND VEHICLE UPDATE SUCCESS ===');
      return { success: true, vehicle: res.data.data.vehicle };
    } catch (error) {
      console.error('=== FRONTEND VEHICLE UPDATE ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      const message = error.response?.data?.message || 'Error updating vehicle';
      console.error('Final error message:', message);
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      console.log('=== FRONTEND VEHICLE UPDATE ERROR END ===');
      return { success: false, error: message };
    }
  };

  // Delete vehicle (Admin only)
  const deleteVehicle = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await axios.delete(`/api/vehicles/${id}`);
      dispatch({ type: 'DELETE_VEHICLE', payload: id });
      toast.success('Vehicle deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting vehicle';
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
    vehicles: state.vehicles,
    currentVehicle: state.currentVehicle,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}; 