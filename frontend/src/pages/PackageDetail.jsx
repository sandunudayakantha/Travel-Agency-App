import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackage } from '../contexts/PackageContext';
import { 
  MapPinIcon, 
  CalendarIcon, 
  StarIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  UserIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { getGoogleMapsApiKey } from '../config/maps';

const PackageDetail = () => {
  const { id } = useParams();
  const { getPackage, currentPackage, loading, error } = usePackage();
  const [activeDay, setActiveDay] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);

  useEffect(() => {
    if (id && getPackage) {
      getPackage(id);
    }
  }, [id]); // Remove getPackage from dependencies to prevent infinite loop

  // Update highlighted places when active day changes
  useEffect(() => {
    if (currentPackage?.itinerary?.[activeDay]?.places) {
      setHighlightedPlaces(currentPackage.itinerary[activeDay].places.map(place => place._id));
    }
  }, [activeDay, currentPackage]);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const toggleVideoMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const toggleVideoFullscreen = () => {
    setIsVideoFullscreen(!isVideoFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }



  if (error || !currentPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Package Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            {error || 'The package you are looking for does not exist.'}
          </p>

          <Link
            to="/"
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const pkg = currentPackage;

  // Prepare map data
  const firstPlace = pkg.itinerary?.[0]?.places?.[0];
  const mapCenter = firstPlace?.location?.coordinates 
    ? { lat: firstPlace.location.coordinates.latitude, lng: firstPlace.location.coordinates.longitude }
    : { lat: 6.9271, lng: 79.8612 }; // Default to Colombo, Sri Lanka
  
  const allPlaces = pkg.itinerary?.flatMap(day => day.places).filter(place => place?.location?.coordinates) || [];
  
  // Debug map data
  console.log('Map Debug:', {
    firstPlace,
    mapCenter,
    allPlaces: allPlaces.map(place => ({
      name: place.name,
      lat: place.location.coordinates.latitude,
      lng: place.location.coordinates.longitude,
      latValid: typeof place.location.coordinates.latitude === 'number',
      lngValid: typeof place.location.coordinates.longitude === 'number'
    })),
    totalPlaces: allPlaces.length,
    pkg: pkg,
    itinerary: pkg.itinerary
  });
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Packages
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={pkg.image?.url || "https://via.placeholder.com/1200x400"}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              {pkg.featured && (
                <div className="absolute top-6 left-6 bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Featured Package
                </div>
              )}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-bold text-gray-900">
                ${pkg.price}
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {pkg.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>

              {/* Package Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{pkg.days} days, {pkg.nights} nights</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <GlobeAltIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{pkg.tourType?.name}</div>
                    <div className="text-sm text-gray-500">Tour Type</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{pkg.guide?.name}</div>
                    <div className="text-sm text-gray-500">Tour Guide</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <TruckIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {pkg.driver?.name || 'Professional Driver'}
                    </div>
                    <div className="text-sm text-gray-500">Driver</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.5 (128 reviews)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Itinerary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
            
            <div className="space-y-4">
              {pkg.itinerary?.map((day, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    activeDay === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setActiveDay(index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Day {day.day}: {day.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {day.places?.length || 0} places
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {day.description}
                  </p>
                  
                  {day.places && day.places.length > 0 && (
                    <div className="space-y-2">
                      {day.places.map((place, placeIndex) => (
                        <div key={placeIndex} className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2 text-primary-600" />
                          {place.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Map</h2>
            
            {/* Route Summary */}
            {allPlaces.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Route Summary</h3>
                
                {/* Map Legend */}
                <div className="mb-3 p-3 bg-white rounded border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Map Legend:</h4>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                      <span>Starting Point</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
                      <span>Destinations</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mr-1"></div>
                      <span>Current Day</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600 mr-1" style={{height: '2px'}}></div>
                      <span>Route Path</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allPlaces.map((place, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        index === 0 ? 'bg-green-500' : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{place.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-blue-700">
                  Total stops: {allPlaces.length} • Route shows the order of visits
                </div>
              </div>
            )}
            
            {allPlaces.length > 0 ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ height: '400px' }}>
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10" id="map-loading">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={allPlaces.length > 1 ? 8 : 12}
                options={mapOptions}
                onLoad={(map) => {
                  console.log('Map loaded successfully');
                  console.log('Google Maps API available:', !!window.google?.maps);
                  console.log('Google Maps API key:', getGoogleMapsApiKey());
                  console.log('Map center:', mapCenter);
                  console.log('All places:', allPlaces);
                  console.log('Map container style:', mapContainerStyle);
                  console.log('Map instance:', map);
                  console.log('Map zoom level:', map.getZoom());
                  console.log('Map bounds:', map.getBounds());
                  
                  // Test Google Maps API functionality
                  if (window.google?.maps) {
                    console.log('Google Maps API is loaded and available');
                    console.log('Available Google Maps objects:', Object.keys(window.google.maps));
                    
                    // Test if Marker constructor is available
                    if (window.google.maps.Marker) {
                      console.log('✅ Marker constructor is available');
                    } else {
                      console.error('❌ Marker constructor is NOT available');
                    }
                    
                    // Test if Map constructor is available
                    if (window.google.maps.Map) {
                      console.log('✅ Map constructor is available');
                    } else {
                      console.error('❌ Map constructor is NOT available');
                    }
                  } else {
                    console.error('Google Maps API is NOT loaded!');
                  }
                  
                  // Hide loading indicator
                  const loadingElement = document.getElementById('map-loading');
                  if (loadingElement) {
                    loadingElement.style.display = 'none';
                  }
                  
                  // Create markers programmatically and attach to map
                  allPlaces.forEach((place, index) => {
                    const marker = new window.google.maps.Marker({
                      position: {
                        lat: place.location.coordinates.latitude,
                        lng: place.location.coordinates.longitude
                      },
                      map: map, // This is the key - attach to map
                      title: `${index + 1}. ${place.name}`,
                      label: {
                        text: `${index + 1}`,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      },
                      icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: index === 0 ? '#10B981' : '#3B82F6',
                        fillOpacity: 0.9,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2
                      }
                    });
                    
                    console.log(`Created marker ${index + 1} for ${place.name} and attached to map`);
                    
                    // Add click listener
                    marker.addListener('click', () => {
                      console.log(`Marker clicked: ${place.name}`);
                      setSelectedPlace({ ...place, index });
                    });
                  });
                  
                  // Create polyline to connect places
                  if (allPlaces.length > 1) {
                    const path = allPlaces.map(place => ({
                      lat: place.location.coordinates.latitude,
                      lng: place.location.coordinates.longitude
                    }));
                    
                    const polyline = new window.google.maps.Polyline({
                      path: path,
                      geodesic: true,
                      strokeColor: '#3B82F6',
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                      map: map
                    });
                    
                    console.log('Created polyline connecting all places');
                  }
                  
                  // Fit bounds to show all places
                  if (allPlaces.length > 1) {
                    const bounds = new window.google.maps.LatLngBounds();
                    allPlaces.forEach(place => {
                      const lat = place.location.coordinates.latitude;
                      const lng = place.location.coordinates.longitude;
                      console.log(`Adding place ${place.name} at ${lat}, ${lng}`);
                      bounds.extend({ lat, lng });
                    });
                    map.fitBounds(bounds);
                    // Add some padding
                    map.setZoom(Math.min(map.getZoom(), 12));
                  } else if (allPlaces.length === 1) {
                    const place = allPlaces[0];
                    map.setCenter({
                      lat: place.location.coordinates.latitude,
                      lng: place.location.coordinates.longitude
                    });
                    map.setZoom(12);
                  }
                }}
                onError={(error) => console.error('Map failed to load:', error)}
              >
                {/* Markers are now created programmatically in onLoad */}
                
                {/* Polyline is now created programmatically in onLoad */}
                
                {/* Info Window for selected place */}
                {selectedPlace && (
                  <InfoWindow
                    position={{
                      lat: selectedPlace.location.coordinates.latitude,
                      lng: selectedPlace.location.coordinates.longitude
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div className="p-3 max-w-xs">
                      <div className="flex items-center mb-2">
                        <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                          selectedPlace.index === 0 ? 'bg-green-500' : 'bg-blue-600'
                        }`}>
                          {selectedPlace.index + 1}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedPlace.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {selectedPlace.location.formattedAddress}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>🏁 {selectedPlace.index === 0 ? 'Starting Point' : `Stop #${selectedPlace.index + 1}`}</div>
                        <div>🌍 {selectedPlace.location.country}</div>
                        {selectedPlace.location.region && (
                          <div>🏛️ {selectedPlace.location.region}</div>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No places available for this package</p>
              </div>
            )}
            
            {/* Fallback Map Display */}
            {allPlaces.length === 0 && (
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Places Added</h3>
                  <p className="text-gray-600 mb-4">
                    This package doesn't have any places added to its itinerary yet.
                  </p>
                  <div className="text-sm text-gray-500">
                    Places will appear here once they are added to the package itinerary.
                  </div>
                </div>
              </div>
            )}
            
            {/* Alternative: Static Map Display */}
            {allPlaces.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border">
                <h4 className="text-lg font-semibold text-green-900 mb-3">Alternative Map View:</h4>
                <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-slate-100" style={{ aspectRatio: '16 / 10' }}>
                  {/* Background map image */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sri_Lanka_districts_map.png/800px-Sri_Lanka_districts_map.png"
                    alt="Sri Lanka map"
                    className="absolute inset-0 h-full w-full object-contain bg-gradient-to-b from-sky-50 to-slate-100"
                  />
                  
                  {/* SVG overlay for places */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    {allPlaces.map((place, index) => {
                      // Simple positioning based on index (you can improve this)
                      const x = 20 + (index * 20);
                      const y = 30 + (index * 15);
                      
                      return (
                        <g key={index}>
                          <circle cx={x} cy={y} r={2} fill="#3B82F6" stroke="#FFFFFF" strokeWidth={1} />
                          <text x={x + 3} y={y} fontSize={3} fill="#1F2937" stroke="#FFFFFF" strokeWidth={0.5}>
                            {index + 1}. {place.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="text-xs text-green-700 mt-2">Static map showing {allPlaces.length} places</p>
              </div>
            )}
            
            {/* Simple Place List Display */}
            {allPlaces.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Places in This Package:</h4>
                
                {/* Test Button */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <button 
                    onClick={() => {
                      console.log('Testing marker creation...');
                      if (window.google?.maps?.Marker) {
                        console.log('✅ Can create markers programmatically');
                        // Try to create a test marker attached to the map
                        const mapElement = document.querySelector('[data-testid="google-map"]') || document.querySelector('.google-map') || document.querySelector('[role="application"]');
                        if (mapElement && mapElement.__googleMap) {
                          const testMarker = new window.google.maps.Marker({
                            position: mapCenter,
                            title: 'Test Programmatic Marker',
                            map: mapElement.__googleMap
                          });
                          console.log('Test marker created and attached to map:', testMarker);
                        } else {
                          console.log('Map element not found, creating standalone marker');
                          const testMarker = new window.google.maps.Marker({
                            position: mapCenter,
                            title: 'Test Programmatic Marker'
                          });
                          console.log('Test marker created (not attached):', testMarker);
                        }
                      } else {
                        console.error('❌ Cannot create markers - Marker constructor not available');
                      }
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Test Marker Creation
                  </button>
                  <p className="text-xs text-yellow-700 mt-1">Click to test if markers can be created programmatically</p>
                </div>
                
                <div className="space-y-2">
                  {allPlaces.map((place, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded border">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{place.name}</h5>
                        <p className="text-sm text-gray-600">
                          📍 {place.location.formattedAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          Coordinates: {place.location.coordinates.latitude.toFixed(6)}, {place.location.coordinates.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Video Section */}
        {pkg.itinerary?.[activeDay]?.video?.url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Day {pkg.itinerary[activeDay].day} Video Experience
            </h2>
            
            <div className="relative">
              <video
                src={pkg.itinerary[activeDay].video.url}
                className="w-full rounded-lg"
                controls
                muted={isVideoMuted}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onError={(e) => console.error('Video error:', e)}
                ref={(el) => {
                  if (el) {
                    el.muted = isVideoMuted;
                  }
                }}
              />
              
              {/* Custom Video Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={toggleVideoMute}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isVideoMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </button>
                
                <button
                  onClick={toggleVideoFullscreen}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Experience the highlights of Day {pkg.itinerary[activeDay].day}: {pkg.itinerary[activeDay].title}
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn-primary px-8 py-3 text-lg font-semibold">
            Book This Package
          </button>
          <button className="btn-secondary px-8 py-3 text-lg font-semibold">
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetail; 