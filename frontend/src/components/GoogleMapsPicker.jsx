import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Wrapper } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../config/maps';

// Google Map Component
const GoogleMap = ({ center, zoom, onMapClick, onMapLoad, children }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...GOOGLE_MAPS_CONFIG.mapOptions,
      });
      setMap(newMap);
      if (onMapLoad) onMapLoad(newMap);
    }
  }, [ref, map, center, zoom, onMapLoad]);

  useEffect(() => {
    if (map && onMapClick) {
      const listener = map.addListener('click', onMapClick);
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [map, onMapClick]);

  return (
    <>
      <div 
        ref={ref} 
        style={{ width: '100%', height: '400px' }}
        className="rounded-lg border border-gray-300"
      />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

// Google Map Marker Component
const Marker = ({ position, map, title, draggable = true, onDragEnd }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!marker && map && position) {
      const newMarker = new window.google.maps.Marker({
        position,
        map,
        title,
        draggable,
      });
      
      setMarker(newMarker);
      
      if (onDragEnd && draggable) {
        newMarker.addListener('dragend', onDragEnd);
      }
    }
    
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map, position, title, draggable, onDragEnd]);

  useEffect(() => {
    if (marker && position) {
      marker.setPosition(position);
    }
  }, [marker, position]);

  return null;
};

// Places Search Component
const PlacesSearch = ({ map, onPlaceSelect }) => {
  const [searchBox, setSearchBox] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (map && inputRef.current && !searchBox) {
      const searchBoxInstance = new window.google.maps.places.SearchBox(inputRef.current);
      setSearchBox(searchBoxInstance);

      // Bias the SearchBox results towards current map's viewport
      map.addListener('bounds_changed', () => {
        searchBoxInstance.setBounds(map.getBounds());
      });

      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    }
  }, [map, searchBox, onPlaceSelect]);

  return (
    <div className="mb-4">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for places, landmarks, or addresses..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

// Helper function to safely convert to number and format
const safeToFixed = (value, decimals = 6) => {
  const num = Number(value);
  return isNaN(num) ? '0.000000' : num.toFixed(decimals);
};

// Main GoogleMapsPicker Component
const GoogleMapsPicker = ({ 
  selectedLocation, 
  onLocationSelect, 
  onLocationChange,
  defaultCenter = GOOGLE_MAPS_CONFIG.defaultCenter,
  defaultZoom = GOOGLE_MAPS_CONFIG.defaultZoom
}) => {
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(
    selectedLocation?.coordinates 
      ? { 
          lat: Number(selectedLocation.coordinates.latitude) || defaultCenter.lat, 
          lng: Number(selectedLocation.coordinates.longitude) || defaultCenter.lng
        }
      : defaultCenter
  );
  const [isLoading, setIsLoading] = useState(false);

  // Check if Google Maps is properly configured
  if (!isGoogleMapsConfigured()) {
    return (
      <div className="border border-red-300 bg-red-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPinIcon className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Google Maps Not Configured</h3>
            <p className="text-sm text-red-700 mb-3">
              Google Maps API key is not properly configured. Please follow these steps:
            </p>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              <li>Get an API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Enable Maps JavaScript API and Places API</li>
              <li>Add your API key to the .env file as REACT_APP_GOOGLE_MAPS_API_KEY</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const handleMapClick = useCallback(async (event) => {
    const clickedPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    
    setCurrentPosition(clickedPosition);
    setIsLoading(true);

    try {
      // Reverse geocode to get address information
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: clickedPosition }, (results, status) => {
        setIsLoading(false);
        
        if (status === 'OK' && results[0]) {
          const result = results[0];
          const locationData = extractLocationData(result, clickedPosition);
          
          if (onLocationSelect) {
            onLocationSelect(locationData);
          }
          if (onLocationChange) {
            onLocationChange(locationData);
          }
        } else {
          // If geocoding fails, still provide basic location data
          const basicLocationData = {
            coordinates: {
              latitude: clickedPosition.lat,
              longitude: clickedPosition.lng
            },
            formattedAddress: `${clickedPosition.lat.toFixed(6)}, ${clickedPosition.lng.toFixed(6)}`,
            city: '',
            country: ''
          };
          
          if (onLocationSelect) {
            onLocationSelect(basicLocationData);
          }
          if (onLocationChange) {
            onLocationChange(basicLocationData);
          }
        }
      });
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      setIsLoading(false);
    }
  }, [onLocationSelect, onLocationChange]);

  const handlePlaceSelect = useCallback((place) => {
    if (!place.geometry || !place.geometry.location) return;

    const position = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setCurrentPosition(position);

    const locationData = extractLocationData(place, position);
    
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
    if (onLocationChange) {
      onLocationChange(locationData);
    }

    // Pan to the selected place
    if (map) {
      map.panTo(position);
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setZoom(15);
      }
    }
  }, [map, onLocationSelect, onLocationChange]);

  const handleMarkerDragEnd = useCallback(async (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    
    setCurrentPosition(newPosition);
    setIsLoading(true);

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        setIsLoading(false);
        
        if (status === 'OK' && results[0]) {
          const locationData = extractLocationData(results[0], newPosition);
          
          if (onLocationSelect) {
            onLocationSelect(locationData);
          }
          if (onLocationChange) {
            onLocationChange(locationData);
          }
        }
      });
    } catch (error) {
      console.error('Error during marker drag geocoding:', error);
      setIsLoading(false);
    }
  }, [onLocationSelect, onLocationChange]);

  // Extract location data from Google Maps result
  const extractLocationData = (result, position) => {
    const components = result.address_components || [];
    let city = '';
    let country = '';
    let region = '';
    let postalCode = '';

    components.forEach(component => {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        region = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    return {
      coordinates: {
        latitude: position.lat,
        longitude: position.lng
      },
      formattedAddress: result.formatted_address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
      city,
      country,
      region,
      postalCode,
      placeId: result.place_id
    };
  };

  const render = (status) => {
    if (status === 'LOADING') {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    }

    if (status === 'FAILURE') {
      return (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Google Maps</h3>
              <p className="text-sm text-red-700">
                Please check your API key configuration and ensure you have enabled the required APIs.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">Selected Location</p>
                <p className="text-sm text-green-700">
                  {selectedLocation.formattedAddress}
                </p>
                {selectedLocation.coordinates && (
                  <p className="text-xs text-green-600 font-mono">
                    {safeToFixed(selectedLocation.coordinates.latitude)}, {safeToFixed(selectedLocation.coordinates.longitude)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Places Search */}
        <PlacesSearch map={map} onPlaceSelect={handlePlaceSelect} />

        {/* Google Map */}
        <div className="relative">
          {isLoading && (
            <div className="absolute top-2 right-2 z-10 bg-white rounded-lg px-3 py-1 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Updating location...</span>
              </div>
            </div>
          )}
          
          <GoogleMap
            center={currentPosition}
            zoom={defaultZoom}
            onMapClick={handleMapClick}
            onMapLoad={setMap}
          >
            <Marker 
              position={currentPosition}
              map={map}
              title="Selected Location"
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            💡 <strong>How to select a location:</strong>
          </p>
          <ul className="text-xs text-blue-600 mt-1 space-y-1">
            <li>• Search for a place using the search box above</li>
            <li>• Click anywhere on the map to place a marker</li>
            <li>• Drag the marker to fine-tune the exact location</li>
            <li>• Address details will be automatically filled</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Wrapper 
      apiKey={GOOGLE_MAPS_CONFIG.apiKey} 
      libraries={GOOGLE_MAPS_CONFIG.libraries}
      render={render}
    />
  );
};

export default GoogleMapsPicker; 