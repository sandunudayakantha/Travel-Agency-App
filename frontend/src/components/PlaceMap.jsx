import React, { useRef, useEffect, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../config/maps';

// Google Map Component for displaying place location
const GoogleMap = ({ center, zoom, onMapLoad, children }) => {
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

  return (
    <>
      <div 
        ref={ref} 
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg"
      />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

// Marker Component for place location
const Marker = ({ position, map, title }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!marker && map && position) {
      const newMarker = new window.google.maps.Marker({
        position,
        map,
        title,
        draggable: false, // Don't allow dragging for display purposes
      });
      
      setMarker(newMarker);
    }
    
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map, position, title]);

  return null;
};

// Main PlaceMap Component
const PlaceMap = ({ place, height = "256px" }) => {
  const [map, setMap] = useState(null);

  // Check if Google Maps is properly configured
  if (!isGoogleMapsConfigured()) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Google Maps not configured</p>
          <p className="text-sm text-gray-500">Please configure your API key</p>
        </div>
      </div>
    );
  }

  // Check if place has coordinates
  if (!place?.location?.coordinates) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Location coordinates not available</p>
        </div>
      </div>
    );
  }

  const position = {
    lat: Number(place.location.coordinates.latitude),
    lng: Number(place.location.coordinates.longitude)
  };

  const render = (status) => {
    if (status === 'LOADING') {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    }

    if (status === 'FAILURE') {
      return (
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Failed to load map</p>
            <p className="text-sm text-gray-500">Please check your API key</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ height }} className="relative">
        <GoogleMap
          center={position}
          zoom={15}
          onMapLoad={setMap}
        >
          <Marker 
            position={position}
            map={map}
            title={place.name}
          />
        </GoogleMap>
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

export default PlaceMap; 