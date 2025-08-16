// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key
  // You can get one from: https://console.cloud.google.com/apis/credentials
  apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY || import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyAyNyTAAEJXByoK9jOYt4dXcqVNgVzjZFo",
  
  // Default map settings
  defaultCenter: {
    lat: 6.9271,  // Colombo, Sri Lanka
    lng: 79.8612
  },
  
  defaultZoom: 10,
  
  // Required libraries for the Google Maps API
  libraries: ['places', 'geometry', 'marker'],
  
  // Map styles and options
  mapOptions: {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    clickableIcons: true,
    gestureHandling: 'greedy'
  }
};

// Helper function to check if API key is configured
export const isGoogleMapsConfigured = () => {
  return GOOGLE_MAPS_CONFIG.apiKey && 
         GOOGLE_MAPS_CONFIG.apiKey !== "AIzaSyAyNyTAAEJXByoK9jOYt4dXcqVNgVzjZFo" &&
         GOOGLE_MAPS_CONFIG.apiKey.length > 10;
};

// Helper function to get API key with validation
export const getGoogleMapsApiKey = () => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key is not properly configured. Please set VITE_REACT_APP_GOOGLE_MAPS_API_KEY or REACT_APP_GOOGLE_MAPS_API_KEY environment variable or update the apiKey in src/config/maps.js');
    return null;
  }
  return GOOGLE_MAPS_CONFIG.apiKey;
};

export default GOOGLE_MAPS_CONFIG; 