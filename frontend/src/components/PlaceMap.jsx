import React, { useRef, useEffect, useState } from 'react';
import { MapPinIcon, PlayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured, getGoogleMapsMapId } from '../config/maps';

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
        mapId: getGoogleMapsMapId()
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

// Preview Content Component for PlaceMap
const PreviewContent = ({ place }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);

  const primaryImage = place.images?.find(img => img.isPrimary) || place.images?.[0];
  const hasImages = place.images && place.images.length > 0;
  const hasVideos = place.videos && place.videos.length > 0;

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + place.images.length) % place.images.length);
    }
  };

  const nextVideo = () => {
    if (hasVideos) {
      setCurrentVideoIndex((prev) => (prev + 1) % place.videos.length);
    }
  };

  const prevVideo = () => {
    if (hasVideos) {
      setCurrentVideoIndex((prev) => (prev - 1 + place.videos.length) % place.videos.length);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm">
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{place.name}</h4>
            <p className="text-xs text-gray-600 mt-1">
              {place.location?.formattedAddress || place.location?.city || 'Sri Lanka'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Location</p>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
        </div>
      </div>

      {/* Content Tabs */}
      {(hasImages || hasVideos) && (
        <div className="flex border-b border-gray-100">
          {hasImages && (
            <button
              onClick={() => setShowVideos(false)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                !showVideos 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PhotoIcon className="w-4 h-4 inline mr-1" />
              Images ({place.images.length})
            </button>
          )}
          {hasVideos && (
            <button
              onClick={() => setShowVideos(true)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                showVideos 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlayIcon className="w-4 h-4 inline mr-1" />
              Videos ({place.videos.length})
            </button>
          )}
        </div>
      )}

      {/* Image Preview */}
      {hasImages && !showVideos && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-b-lg overflow-hidden">
            <img
              src={place.images[currentImageIndex]?.url || primaryImage?.url}
              alt={place.images[currentImageIndex]?.caption || place.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x225?text=Image+Not+Available';
              }}
            />
          </div>
          
          {/* Image Navigation */}
          {place.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image Caption */}
          {place.images[currentImageIndex]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
              {place.images[currentImageIndex].caption}
            </div>
          )}
          
          {/* Image Counter */}
          {place.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {place.images.length}
            </div>
          )}
        </div>
      )}

      {/* Video Preview */}
      {hasVideos && showVideos && (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-b-lg overflow-hidden">
            <video
              src={place.videos[currentVideoIndex]?.url}
              poster={place.videos[currentVideoIndex]?.thumbnail?.url}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Video Navigation */}
          {place.videos.length > 1 && (
            <>
              <button
                onClick={prevVideo}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Video Title */}
          {place.videos[currentVideoIndex]?.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
              {place.videos[currentVideoIndex].title}
            </div>
          )}
          
          {/* Video Counter */}
          {place.videos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {currentVideoIndex + 1} / {place.videos.length}
            </div>
          )}
        </div>
      )}

      {/* No Media Fallback */}
      {!hasImages && !hasVideos && (
        <div className="aspect-video bg-gray-100 rounded-b-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">No images or videos available</p>
          </div>
        </div>
      )}

      {/* Description */}
      {place.shortDescription && (
        <div className="p-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{place.shortDescription}</p>
        </div>
      )}
    </div>
  );
};

// Advanced Marker Component for place location
const Marker = ({ position, map, title, onClick }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!marker && map && position && window.google.maps.marker) {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      
      // Create SVG for the marker
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      
      // Create circle for marker
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '12');
      circle.setAttribute('r', '10');
      circle.setAttribute('fill', '#3B82F6');
      circle.setAttribute('stroke', '#FFFFFF');
      circle.setAttribute('stroke-width', '2');
      
      svg.appendChild(circle);
      markerElement.appendChild(svg);
      
      // Create AdvancedMarkerElement
      const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title,
        content: markerElement
      });
      
      setMarker(newMarker);
      
      if (onClick) {
        newMarker.addListener('click', onClick);
      }
    }
    
    return () => {
      if (marker) {
        marker.map = null;
      }
    };
  }, [marker, map, position, title, onClick]);

  return null;
};

// Main PlaceMap Component
const PlaceMap = ({ place, height = "256px" }) => {
  const [map, setMap] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Handle marker click events
  const handleMarkerClick = (event) => {
    if (!map) return;
    setHoverInfo(place);
  };

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
            onClick={handleMarkerClick}
          />
        </GoogleMap>

        {/* Enhanced Hover Preview */}
        {hoverInfo && (
          <div 
            className="absolute z-20 animate-fade-in"
            style={{
              left: '50%',
              top: '20px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="relative">
              <button
                onClick={() => setHoverInfo(null)}
                className="absolute -top-2 -right-2 z-30 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PreviewContent place={hoverInfo} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Check if Google Maps is available
  if (!window.google || !window.google.maps) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return render();
};

export default PlaceMap; 