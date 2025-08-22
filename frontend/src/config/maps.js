// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key
  // You can get one from: https://console.cloud.google.com/apis/credentials
  apiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  
  // Map ID for Advanced Markers (required for Advanced Markers to work)
  // You can create one at: https://console.cloud.google.com/google/maps-apis/credentials
  mapId: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_MAP_ID,
  
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
    mapId: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_MAP_ID,
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

// Helper function to check if Map ID is configured
export const isGoogleMapsMapIdConfigured = () => {
  const mapId = GOOGLE_MAPS_CONFIG.mapId;
  return mapId && mapId !== 'DEMO_MAP_ID' && mapId.length > 10;
};

// Helper function to get API key with validation
export const getGoogleMapsApiKey = () => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key is not properly configured. Please set VITE_REACT_APP_GOOGLE_MAPS_API_KEY or REACT_APP_GOOGLE_MAPS_API_KEY environment variable or update the apiKey in src/config/maps.js');
    return null;
  }
  return GOOGLE_MAPS_CONFIG.apiKey;
};

// Helper function to get Map ID with validation
export const getGoogleMapsMapId = () => {
  if (!isGoogleMapsMapIdConfigured()) {
    console.warn('Google Maps Map ID is not properly configured. Advanced Markers may not work correctly. Please set VITE_REACT_APP_GOOGLE_MAPS_MAP_ID or REACT_APP_GOOGLE_MAPS_MAP_ID environment variable or update the mapId in src/config/maps.js');
    return null;
  }
  return GOOGLE_MAPS_CONFIG.mapId;
};

export default GOOGLE_MAPS_CONFIG; 