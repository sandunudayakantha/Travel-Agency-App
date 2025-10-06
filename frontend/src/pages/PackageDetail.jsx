import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackage } from '../contexts/PackageContext';
import { usePlace } from '../contexts/PlaceContext';
import { 
  MapPinIcon, 
  CalendarIcon, 
  StarIcon,
  ArrowLeftIcon,
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
import { getGoogleMapsApiKey, GOOGLE_MAPS_CONFIG, getGoogleMapsMapId } from '../config/maps';
import ReviewSection from '../components/ReviewSection';
import BookingForm from '../components/BookingForm';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';
import Navigation from '../components/layout/Navigation';

const PackageDetail = () => {
  const { id } = useParams();
  const { getPackage, currentPackage, loading, error } = usePackage();
  const { getPlaceById } = usePlace();
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  const [activeDay, setActiveDay] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [fullPlacesData, setFullPlacesData] = useState({});

  // Preview Content Component for PackageDetail Map
  const PreviewContent = ({ place, index }) => {
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
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-sm">
        {/* Header with place info */}
        <div className="p-3 border-b border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                index === 0 ? 'bg-green-500' : 'bg-blue-600'
              }`}>
                {index + 1}
              </div>
              <h3 className="font-semibold text-white text-sm">
                {place.name}
              </h3>
            </div>
            <span className="text-xs text-gray-300 capitalize">
              {place.category}
            </span>
          </div>
          <p className="text-xs text-gray-200">
            {place.location?.formattedAddress || place.location?.city || 'Location not specified'}
          </p>
        </div>

        {/* Content Tabs */}
        {(hasImages || hasVideos) && (
          <div className="flex border-b border-white/20">
            {hasImages && (
              <button
                onClick={() => setShowVideos(false)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  !showVideos 
                    ? 'text-orange-200 border-b-2 border-orange-400 bg-orange-500/20' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Images ({place.images.length})
              </button>
            )}
            {hasVideos && (
              <button
                onClick={() => setShowVideos(true)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  showVideos 
                    ? 'text-orange-200 border-b-2 border-orange-400 bg-orange-500/20' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                </svg>
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
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">No images or videos available</p>
            </div>
          </div>
        )}

        {/* Description */}
        {place.description && (
          <div className="p-3 border-t border-white/20">
            <p className="text-xs text-gray-200 line-clamp-2">{place.description}</p>
          </div>
        )}

        {/* Short Description */}
        {place.shortDescription && (
          <div className="p-3 border-t border-white/20">
            <p className="text-xs text-gray-300">{place.shortDescription}</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="p-3 border-t border-white/20">
          <div className="text-xs text-gray-200 space-y-1">
            {place.location?.country && (
              <p>Country: {place.location.country}</p>
            )}
            {place.location?.region && (
              <p>Region: {place.location.region}</p>
            )}
            {place.location?.city && (
              <p>City: {place.location.city}</p>
            )}
            {place.tags && place.tags.length > 0 && (
              <p>Tags: {place.tags.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (id && getPackage) {
      startLoading("Loading package details...", 2000);
      getPackage(id);
    }
  }, [id, startLoading]); // Remove getPackage from dependencies to prevent infinite loop

  // Handle loading states
  useEffect(() => {
    if (loading && !pageLoading) {
      startLoading("Fetching package information...", 1500);
    } else if (!loading && pageLoading) {
      stopLoading();
    }
  }, [loading, pageLoading, startLoading, stopLoading]);

  // Fetch full place data for each place in the itinerary
  useEffect(() => {
    const fetchFullPlaceData = async () => {
      if (!currentPackage?.itinerary) return;
      
      const allPlaceIds = currentPackage.itinerary
        .flatMap(day => day.places)
        .map(place => place._id)
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
      
      const newFullPlacesData = {};
      
      for (const placeId of allPlaceIds) {
        try {
          const result = await getPlaceById(placeId);
          if (result.success) {
            newFullPlacesData[placeId] = result.place;
          }
        } catch (error) {
          // Handle error silently
        }
      }
      
      setFullPlacesData(newFullPlacesData);
    };

    fetchFullPlaceData();
  }, [currentPackage, getPlaceById]);

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
      <TravelLoading 
        message="Loading package details..."
        progress={100}
        size="large"
      />
    );
  }



  if (error || !currentPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">!</div>
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
  
  // Use full place data if available, otherwise use the basic place data
  const allPlacesWithFullData = allPlaces.map(place => {
    const fullPlaceData = fullPlacesData[place._id];
    return fullPlaceData || place;
  });

  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const mapOptions = {
    mapId: getGoogleMapsMapId(),
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy'
  };

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmlsYW5rYSUyMHRyYXZlbCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTYwMzQ4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Sri Lankan landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-orange-900/40"></div>
        </div>

        {/* Navigation */}
        <div className="relative z-50">
          <Navigation />
        </div>

        {/* Header */}
        <div className="relative z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/packages"
              className="inline-flex items-center text-white hover:text-orange-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Packages
            </Link>
          </div>
        </div>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="relative h-96">
              <img
                src={pkg.image?.url || "https://via.placeholder.com/1200x400"}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              {pkg.featured && (
                <div className="absolute top-6 left-6 bg-orange-500/20 backdrop-blur-sm text-orange-200 border border-orange-300/30 px-4 py-2 rounded-full text-sm font-medium">
                  Featured Package
                </div>
              )}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-lg font-bold text-white">
                ${pkg.price}
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {pkg.title}
                  </h1>
                  <p className="text-xl text-gray-200 mb-4">
                    {pkg.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-400">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-300">per person</div>
                </div>
              </div>

              {/* Package Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <CalendarIcon className="h-6 w-6 text-orange-400 mr-3" />
                  <div>
                    <div className="font-semibold text-white">{pkg.days} days, {pkg.nights} nights</div>
                    <div className="text-sm text-gray-300">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <GlobeAltIcon className="h-6 w-6 text-orange-400 mr-3" />
                  <div>
                    <div className="font-semibold text-white">{pkg.tourType?.name}</div>
                    <div className="text-sm text-gray-300">Tour Type</div>
                  </div>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <UserIcon className="h-6 w-6 text-orange-400 mr-3" />
                  <div>
                    <div className="font-semibold text-white">{pkg.guide?.name}</div>
                    <div className="text-sm text-gray-300">Tour Guide</div>
                  </div>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <TruckIcon className="h-6 w-6 text-orange-400 mr-3" />
                  <div>
                    <div className="font-semibold text-white">
                      {pkg.driver?.name || 'Professional Driver'}
                    </div>
                    <div className="text-sm text-gray-300">Driver</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-white">4.5 (128 reviews)</span>
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
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Itinerary</h2>
            
            <div className="space-y-4">
              {pkg.itinerary?.map((day, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    activeDay === index
                      ? 'border-orange-400 bg-orange-500/20'
                      : 'border-white/20 bg-white/5 hover:border-orange-300/50 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveDay(index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Day {day.day}: {day.title}
                    </h3>
                    <div className="text-sm text-gray-300">
                      {day.places?.length || 0} places
                    </div>
                  </div>
                  
                  <p className="text-gray-200 mb-3">
                    {day.description}
                  </p>
                  
                  {day.places && day.places.length > 0 && (
                    <div className="space-y-2">
                      {day.places.map((place, placeIndex) => (
                        <div key={placeIndex} className="flex items-center text-sm text-gray-300">
                          <MapPinIcon className="h-4 w-4 mr-2 text-orange-400" />
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
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6"
          >
                        <h2 className="text-2xl font-bold text-white mb-6">Route Map</h2>
            
            {/* Route Summary */}
            {allPlacesWithFullData.length > 0 && (
              <div className="mb-4 p-4 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-200 mb-2">Route Summary</h3>
                
                {/* Map Legend */}
                <div className="mb-3 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-2">Map Legend:</h4>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-gray-200">Starting Point</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
                      <span className="text-gray-200">Destinations</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mr-1"></div>
                      <span className="text-gray-200">Current Day</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600 mr-1" style={{height: '2px'}}></div>
                      <span className="text-gray-200">Route Path</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allPlacesWithFullData.map((place, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        index === 0 ? 'bg-green-500' : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-gray-200">{place.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-orange-200">
                  Total stops: {allPlacesWithFullData.length} • Route shows the order of visits
                </div>
              </div>
            )}
            
            {allPlacesWithFullData.length > 0 ? (
              <>
                <div className="relative rounded-xl overflow-hidden border border-white/20" style={{ height: '400px' }}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-10" id="map-loading">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mb-2"></div>
                      <p className="text-sm text-white">Loading map...</p>
                    </div>
                  </div>
                  <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={allPlacesWithFullData.length > 1 ? 8 : 12}
                  options={mapOptions}
                  onLoad={(map) => {
                    // Hide loading indicator
                    const loadingElement = document.getElementById('map-loading');
                    if (loadingElement) {
                      loadingElement.style.display = 'none';
                    }
                    
                    // Create markers programmatically and attach to map
                    allPlacesWithFullData.forEach((place, index) => {
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
                      circle.setAttribute('fill', index === 0 ? '#10B981' : '#3B82F6');
                      circle.setAttribute('stroke', '#FFFFFF');
                      circle.setAttribute('stroke-width', '2');
                      
                      // Create text for label
                      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                      text.setAttribute('x', '12');
                      text.setAttribute('y', '16');
                      text.setAttribute('text-anchor', 'middle');
                      text.setAttribute('fill', 'white');
                      text.setAttribute('font-size', '12');
                      text.setAttribute('font-weight', 'bold');
                      text.textContent = `${index + 1}`;
                      
                      svg.appendChild(circle);
                      svg.appendChild(text);
                      markerElement.appendChild(svg);
                      
                      // Create AdvancedMarkerElement
                      const marker = new window.google.maps.marker.AdvancedMarkerElement({
                        position: {
                          lat: place.location.coordinates.latitude,
                          lng: place.location.coordinates.longitude
                        },
                        map: map,
                        title: `${index + 1}. ${place.name}`,
                        content: markerElement
                      });
                      
                      // Add click listener
                      marker.addListener('click', () => {
                        setSelectedPlace({ ...place, index });
                      });
                    });
                    
                    // Create polyline to connect places
                    if (allPlacesWithFullData.length > 1) {
                      const path = allPlacesWithFullData.map(place => ({
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
                    }
                    
                    // Fit bounds to show all places
                    if (allPlacesWithFullData.length > 1) {
                      const bounds = new window.google.maps.LatLngBounds();
                      allPlacesWithFullData.forEach(place => {
                        const lat = place.location.coordinates.latitude;
                        const lng = place.location.coordinates.longitude;
                        bounds.extend({ lat, lng });
                      });
                      map.fitBounds(bounds);
                      // Add some padding
                      map.setZoom(Math.min(map.getZoom(), 12));
                    } else if (allPlacesWithFullData.length === 1) {
                      const place = allPlacesWithFullData[0];
                      map.setCenter({
                        lat: place.location.coordinates.latitude,
                        lng: place.location.coordinates.longitude
                      });
                      map.setZoom(12);
                    }
                  }}
                  onError={(error) => {
                    // Handle map loading error silently
                  }}
                >
                  {/* Markers are now created programmatically in onLoad */}
                  
                  {/* Polyline is now created programmatically in onLoad */}
                  
                  {/* Rich Preview for selected place */}
                  {selectedPlace && (
                    <div 
                      className="absolute z-20 animate-fade-in"
                      style={{
                        left: '50%',
                        top: '20px',
                        transform: 'translateX(-50%)',
                        maxWidth: '400px',
                        width: '90vw'
                      }}
                    >
                      <div className="relative">
                        <button
                          onClick={() => setSelectedPlace(null)}
                          className="absolute -top-2 -right-2 z-30 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Close"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <PreviewContent 
                          place={selectedPlace}
                          index={selectedPlace.index}
                        />
                      </div>
                    </div>
                  )}
                </GoogleMap>
                </div>
                
                <div className="mt-3 p-3 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl">
                  <p className="text-sm text-orange-200 text-center">
                    Click on any marker to view place details, images, and videos
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-300">
                <p>No places available for this package</p>
              </div>
            )}
            
            {/* Fallback Map Display */}
            {allPlacesWithFullData.length === 0 && (
              <div className="mt-4 p-6 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl">
                <div className="text-center">
                  <GlobeAltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Places Added</h3>
                  <p className="text-gray-200 mb-4">
                    This package doesn't have any places added to its itinerary yet.
                  </p>
                  <div className="text-sm text-gray-300">
                    Places will appear here once they are added to the package itinerary.
                  </div>
                </div>
              </div>
            )}
            
            
            {/* Simple Place List Display */}
            {allPlacesWithFullData.length > 0 && (
              <div className="mt-4 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-200 mb-3">Places in This Package:</h4>
                
                {/* Test Button */}

                
                <div className="space-y-2">
                  {allPlacesWithFullData.map((place, index) => (
                    <div key={index} className="flex items-center p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{place.name}</h5>
                        <p className="text-sm text-gray-200">
                          {place.location.formattedAddress}
                        </p>
                        <p className="text-xs text-gray-300">
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
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
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
                onError={(e) => {
                  // Handle video error silently
                }}
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
              <p className="text-gray-200">
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
          <button 
            onClick={() => setShowBookingForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            Book This Package
          </button>
          <Link 
            to="/contact" 
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center rounded-xl transition-all duration-300"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            packageName={pkg.title}
            onClose={() => setShowBookingForm(false)}
            onSuccess={(booking) => {
              setShowBookingForm(false);
            }}
          />
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl py-12"
        >
          <div className="container mx-auto px-4">
            <ReviewSection packageId={id} />
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default PackageDetail; 