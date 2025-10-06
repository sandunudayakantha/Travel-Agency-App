import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured, getGoogleMapsMapId } from '../config/maps';
import { PlayIcon, PhotoIcon } from '@heroicons/react/24/outline';

// Google Map Component
const GoogleMap = ({ center, zoom, onMapLoad, children }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...GOOGLE_MAPS_CONFIG.mapOptions,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: 'greedy',
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

// Advanced Map Marker Component
const Marker = ({ position, map, title, icon, label, onClick }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!marker && map && position) {
      // Check if Advanced Markers are available
      if (window.google.maps.marker) {
        // Create custom marker element with label
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
        circle.setAttribute('fill', icon?.fillColor || '#3B82F6');
        circle.setAttribute('stroke', icon?.strokeColor || '#FFFFFF');
        circle.setAttribute('stroke-width', '2');
        
        // Create text for label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '12');
        text.setAttribute('y', '16');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label?.text || '';
        
        svg.appendChild(circle);
        svg.appendChild(text);
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
      } else {
        // Fallback to regular Marker if Advanced Markers are not available
        const newMarker = new window.google.maps.Marker({
          position,
          map,
          title,
          icon,
          label,
          clickable: !!onClick
        });
        
        setMarker(newMarker);
        
        if (onClick) {
          newMarker.addListener('click', onClick);
        }
      }
    }
    
    return () => {
      if (marker) {
        if (marker.map !== undefined) {
          marker.map = null; // Advanced Marker
        } else {
          marker.setMap(null); // Regular Marker
        }
      }
    };
  }, [marker, map, position, title, icon, label, onClick]);

  useEffect(() => {
    if (marker && position) {
      if (marker.position !== undefined) {
        marker.position = position; // Advanced Marker
      } else {
        marker.setPosition(position); // Regular Marker
      }
    }
  }, [marker, position]);

  return null;
};

// Polyline Component for route
const Polyline = ({ path, map, options }) => {
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (!polyline && map && path && path.length > 1) {
      const newPolyline = new window.google.maps.Polyline({
        path,
        map,
        ...options
      });
      setPolyline(newPolyline);
    }
    
    return () => {
      if (polyline) {
        polyline.setMap(null);
      }
    };
  }, [polyline, map, path, options]);

  useEffect(() => {
    if (polyline && path) {
      polyline.setPath(path);
    }
  }, [polyline, path]);

  return null;
};

// Preview Content Component
const PreviewContent = ({ place, type, day, timeOfDay }) => {
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
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-lg truncate">
              {place.name}
            </h4>
            <p className="text-sm text-gray-200 mt-1">
              {place.location?.formattedAddress || place.location?.city || 'Sri Lanka'}
            </p>
            {type === 'itinerary' && (
              <div className="mt-2 text-sm text-orange-300">
                <p>Day {day} - {timeOfDay === 'day' ? '🌞 Day Time' : '🌙 Night'}</p>
              </div>
            )}

            <p className="text-xs text-gray-300 mt-2">
              {type === 'selected' ? 'Selected Destination' : 'Itinerary Item'}
            </p>
          </div>
          <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${
            type === 'selected' ? 'bg-blue-500' : 'bg-red-500'
          }`}></div>
        </div>
      </div>

      {/* Content Tabs */}
      {(hasImages || hasVideos) && (
        <div className="flex border-b border-white/20">
          {hasImages && (
            <button
              onClick={() => setShowVideos(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                !showVideos 
                  ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-500/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <PhotoIcon className="w-5 h-5 inline mr-2" />
              Images ({place.images.length})
            </button>
          )}
          {hasVideos && (
            <button
              onClick={() => setShowVideos(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                showVideos 
                  ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-500/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <PlayIcon className="w-5 h-5 inline mr-2" />
              Videos ({place.videos.length})
            </button>
          )}
        </div>
      )}

      {/* Image Preview */}
      {hasImages && !showVideos && (
        <div className="relative">
          <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-b-2xl overflow-hidden border border-white/20">
            <img
              src={place.images[currentImageIndex]?.url || primaryImage?.url}
              alt={place.images[currentImageIndex]?.caption || place.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
              }}
            />
          </div>
          
          {/* Image Navigation */}
          {place.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image Caption */}
          {place.images[currentImageIndex]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md text-white text-sm p-3 border-t border-white/20">
              {place.images[currentImageIndex].caption}
            </div>
          )}
          
          {/* Image Counter */}
          {place.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-white/30">
              {currentImageIndex + 1} / {place.images.length}
            </div>
          )}
        </div>
      )}

      {/* Video Preview */}
      {hasVideos && showVideos && (
        <div className="relative">
          <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-b-2xl overflow-hidden border border-white/20">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Video Title */}
          {place.videos[currentVideoIndex]?.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md text-white text-sm p-3 border-t border-white/20">
              {place.videos[currentVideoIndex].title}
            </div>
          )}
          
          {/* Video Counter */}
          {place.videos.length > 1 && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-white/30">
              {currentVideoIndex + 1} / {place.videos.length}
            </div>
          )}
        </div>
      )}

      {/* No Media Fallback */}
      {!hasImages && !hasVideos && (
        <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-b-2xl flex items-center justify-center border border-white/20">
          <div className="text-center text-gray-300">
            <PhotoIcon className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">No images or videos available</p>
          </div>
        </div>
      )}

      {/* Description */}
      {place.shortDescription && (
        <div className="p-4 border-t border-white/20">
          <p className="text-sm text-gray-200 line-clamp-3">{place.shortDescription}</p>
        </div>
      )}
    </div>
  );
};

// Main Interactive Trip Map Component
const InteractiveTripMap = ({ 
  selectedDestinations = [], 
  itineraryItems = [],
  mapCoords = {},
  height = '400px'
}) => {
  const [map, setMap] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Calculate center based on selected destinations
  const calculateCenter = useCallback(() => {
    if (selectedDestinations.length === 0) {
      return GOOGLE_MAPS_CONFIG.defaultCenter;
    }

    const validCoords = selectedDestinations
      .map(place => mapCoords[place.name])
      .filter(Boolean);

    if (validCoords.length === 0) {
      return GOOGLE_MAPS_CONFIG.defaultCenter;
    }

    const avgLat = validCoords.reduce((sum, coord) => sum + coord.lat, 0) / validCoords.length;
    const avgLng = validCoords.reduce((sum, coord) => sum + coord.lng, 0) / validCoords.length;

    return { lat: avgLat, lng: avgLng };
  }, [selectedDestinations, mapCoords]);

  // Calculate bounds for all markers
  const calculateBounds = useCallback(() => {
    const allCoords = [
      ...selectedDestinations.map(place => mapCoords[place.name]).filter(Boolean),
      ...itineraryItems.map(item => mapCoords[item.place.name]).filter(Boolean)
    ];

    if (allCoords.length === 0) return null;

    const bounds = new window.google.maps.LatLngBounds();
    allCoords.forEach(coord => {
      bounds.extend({ lat: coord.lat, lng: coord.lng });
    });

    return bounds;
  }, [selectedDestinations, itineraryItems, mapCoords]);

  // Fit map to bounds when destinations change
  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds);
      // Add some padding
      const listener = map.addListener('bounds_changed', () => {
        const currentBounds = map.getBounds();
        if (currentBounds) {
          const ne = currentBounds.getNorthEast();
          const sw = currentBounds.getSouthWest();
          const latDiff = ne.lat() - sw.lat();
          const lngDiff = ne.lng() - sw.lng();
          
          if (latDiff < 0.1 || lngDiff < 0.1) {
            map.setZoom(Math.min(map.getZoom(), 12));
          }
        }
      });
      
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [map, bounds]);

  // Update bounds when data changes
  useEffect(() => {
    if (map) {
      const newBounds = calculateBounds();
      if (newBounds) {
        setBounds(newBounds);
      }
    }
  }, [map, calculateBounds]);

  // Handle marker click events
  const handleMarkerClick = useCallback((event, place, type = 'selected') => {
    setHoverInfo({
      place,
      type: type,
      day: type === 'itinerary' ? place.day : null,
      timeOfDay: type === 'itinerary' ? place.timeOfDay : null
    });
  }, []);

  // Check if Google Maps is properly configured
  if (!isGoogleMapsConfigured()) {
    return (
      <div className="border border-red-300 bg-red-50 rounded-lg p-4" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-600 mb-2">🗺️</div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Google Maps Not Configured</h3>
            <p className="text-sm text-red-700">
              Please configure Google Maps API key to view the interactive map.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const render = (status) => {
    if (status === 'LOADING') {
      return (
        <div className="flex items-center justify-center bg-gray-50 rounded-lg border" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      );
    }

    if (status === 'FAILURE') {
      return (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4" style={{ height }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-600 mb-2">❌</div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Map</h3>
              <p className="text-sm text-red-700">
                Please check your API key configuration.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative" style={{ height }}>
        {/* Map Status Info */}
        <div className="absolute top-3 left-3 z-10 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 shadow-2xl border border-white/20 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-white">Selected: {selectedDestinations.length}</span>
            {itineraryItems.length > 0 && (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-white">Itinerary: {itineraryItems.length}</span>
              </>
            )}
          </div>
          {itineraryItems.length > 0 && (
            <div className="mt-2 text-xs text-gray-200">
              Day order: {itineraryItems
                .sort((a, b) => a.day - b.day || (a.timeOfDay === 'day' ? 0 : 1) - (b.timeOfDay === 'day' ? 0 : 1))
                .map(item => `Day${item.day}.${item.place.name}`).join(' → ')}
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute top-3 right-3 z-10 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 shadow-2xl border border-white/20 text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Selected Places</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-white">Itinerary Places (numbered by day)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">?</span>
              </div>
              <span className="text-white">Estimated Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500"></div>
              <span className="text-white">Selection Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500"></div>
              <span className="text-white">Itinerary Route</span>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <GoogleMap
          center={calculateCenter()}
          zoom={GOOGLE_MAPS_CONFIG.defaultZoom}
          onMapLoad={setMap}
        >
          {/* Selected Destinations Markers */}
          {selectedDestinations.map((place, idx) => {
            const coord = mapCoords[place.name];
            if (!coord) {
              return null;
            }
            
            // Check if this place has real coordinates or default ones
            const hasRealCoordinates = place.location?.coordinates?.latitude && place.location?.coordinates?.longitude;
            const markerColor = hasRealCoordinates ? '#3B82F6' : '#F59E0B'; // Blue for real, Orange for default
            
            return (
              <Marker
                key={`selected-${place._id}`}
                position={{ lat: coord.lat, lng: coord.lng }}
                map={map}
                title={`${place.name}${!hasRealCoordinates ? ' (Estimated Location)' : ''}`}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="8" fill="${markerColor}" stroke="white" stroke-width="2"/>
                      ${!hasRealCoordinates ? '<text x="10" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">?</text>' : ''}
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(20, 20),
                  anchor: new window.google.maps.Point(10, 10)
                }}
                onClick={(event) => handleMarkerClick(event, place, 'selected')}
              />
            );
          })}

          {/* Itinerary Items Markers */}
          {itineraryItems
            .sort((a, b) => a.day - b.day || (a.timeOfDay === 'day' ? 0 : 1) - (b.timeOfDay === 'day' ? 0 : 1))
            .map((item, idx) => {
            const coord = mapCoords[item.place.name];
            if (!coord) {
              return null;
            }
            
            // Check if this place has real coordinates or default ones
            const hasRealCoordinates = item.place.location?.coordinates?.latitude && item.place.location?.coordinates?.longitude;
            const markerColor = hasRealCoordinates ? '#EF4444' : '#F59E0B'; // Red for real, Orange for default
            const dayNumber = item.day; // Day number for the marker
            
            return (
              <Marker
                key={`itinerary-${item.id}`}
                position={{ lat: coord.lat, lng: coord.lng }}
                map={map}
                title={`Day ${dayNumber} - ${item.place.name}${!hasRealCoordinates ? ' (Estimated Location)' : ''}`}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="${markerColor}" stroke="white" stroke-width="2"/>
                      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${dayNumber}</text>
                      ${!hasRealCoordinates ? '<text x="12" y="20" text-anchor="middle" fill="white" font-size="6" font-weight="bold">?</text>' : ''}
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(24, 24),
                  anchor: new window.google.maps.Point(12, 12)
                }}
                onClick={(event) => handleMarkerClick(event, { ...item.place, day: item.day, timeOfDay: item.timeOfDay }, 'itinerary')}
              />
            );
          })}

          {/* Selected Destinations Route (by selection order) */}
          {selectedDestinations.length >= 2 && (
            <Polyline
              path={selectedDestinations.map(place => {
                const coord = mapCoords[place.name];
                return coord ? { lat: coord.lat, lng: coord.lng } : null;
              }).filter(Boolean)}
              map={map}
              options={{
                strokeColor: '#3B82F6',
                strokeOpacity: 0.6,
                strokeWeight: 2,
                geodesic: true
              }}
            />
          )}

          {/* Itinerary Route - Individual Segments */}
          {itineraryItems.length >= 2 && (() => {
            const sortedItems = itineraryItems
              .sort((a, b) => a.day - b.day || (a.timeOfDay === 'day' ? 0 : 1) - (b.timeOfDay === 'day' ? 0 : 1));
            
            // Create individual polylines for each segment
            const polylines = [];
            for (let i = 0; i < sortedItems.length - 1; i++) {
              const currentItem = sortedItems[i];
              const nextItem = sortedItems[i + 1];
              
              const currentCoord = mapCoords[currentItem.place.name];
              const nextCoord = mapCoords[nextItem.place.name];
              
              if (currentCoord && nextCoord) {
                polylines.push(
                  <Polyline
                    key={`itinerary-segment-${i}`}
                    path={[
                      { lat: currentCoord.lat, lng: currentCoord.lng },
                      { lat: nextCoord.lat, lng: nextCoord.lng }
                    ]}
                    map={map}
                    options={{
                      strokeColor: '#EF4444',
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                      geodesic: true
                    }}
                  />
                );
              }
            }
            
            return polylines;
          })()}


        </GoogleMap>

        {/* Enhanced Hover Preview */}
        {hoverInfo && (
          <div 
            className="absolute z-20 animate-fade-in"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <div className="relative">
              <button
                onClick={() => setHoverInfo(null)}
                className="absolute -top-3 -right-3 z-30 bg-red-500/80 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-300 border border-white/30 shadow-lg"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PreviewContent 
                place={hoverInfo.place}
                type={hoverInfo.type}
                day={hoverInfo.day}
                timeOfDay={hoverInfo.timeOfDay}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        {selectedDestinations.length === 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 shadow-2xl border border-white/20">
            <p className="text-sm text-white text-center">
              Select destinations to see them on the interactive map
            </p>
          </div>
        )}
        
        {/* Click Instructions */}
        {selectedDestinations.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 shadow-2xl border border-white/20">
            <p className="text-sm text-white text-center">
              Click on markers to view place details with images and videos
            </p>
          </div>
        )}
      </div>
    );
  };

  // Check if Google Maps is available
  if (!window.google || !window.google.maps) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return render();
};

export default InteractiveTripMap; 