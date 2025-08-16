import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  ArrowRightIcon, 
  MapPinIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { usePackage } from '../contexts/PackageContext';
import { usePlace } from '../contexts/PlaceContext';
import PlaceMap from '../components/PlaceMap';

const Home = () => {
  const { featuredPackages = [], getFeaturedPackages, loading, error } = usePackage();
  const { places, getPlaces, loading: placesLoading } = usePlace();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have featured packages and we're not loading
    if (featuredPackages.length === 0 && !loading && getFeaturedPackages) {
      console.log('Fetching featured packages...');
      getFeaturedPackages();
    }
  }, []); // Empty dependency array - only run once on mount

  // Handle search
  const handleSearch = async () => {
    console.log('Search triggered with term:', searchTerm);
    
    if (!searchTerm.trim()) {
      console.log('Search term is empty, clearing results');
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      console.log('Calling getPlaces with search term:', searchTerm);
      const result = await getPlaces({ search: searchTerm }, 1);
      console.log('Search result:', result);
      if (result.success) {
        setSearchResults(result.data.places);
        setShowSearchResults(true);
        console.log('Search results set:', result.data.places.length, 'places found');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setShowMap(true);
    setShowSearchResults(false);
  };

  // Close search results
  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Debug log to see what we have
  console.log('Home component - featuredPackages:', featuredPackages.length, 'loading:', loading);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description: "Explore hundreds of destinations across the world"
    },
    {
      icon: "🎯",
      title: "Custom Packages",
      description: "Create your perfect trip with personalized itineraries"
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      description: "Hand-picked experiences and accommodations"
    },
    {
      icon: "🛡️",
      title: "Safe Travel",
      description: "24/7 support and comprehensive travel insurance"
    }
  ];

  const stats = [
    { number: "500+", label: "Destinations" },
    { number: "10K+", label: "Happy Travelers" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
        {/* Mountain Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Mountain Landscape" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated Mist Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
          
          {/* Mist Layer 1 */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-mist"></div>
            <div className="absolute top-1/2 right-0 w-full h-24 bg-gradient-to-l from-transparent via-white/15 to-transparent animate-mist-reverse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-3/4 left-0 w-full h-28 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-mist" style={{animationDelay: '4s'}}></div>
          </div>
          
          {/* Mist Layer 2 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-1/2 h-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-mist-reverse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-2/3 right-1/4 w-1/2 h-16 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-mist" style={{animationDelay: '3s'}}></div>
          </div>
          
          {/* Floating Mist Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-20"></div>
       
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <motion.div 
            className="text-center"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block text-secondary-300">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Experience the world's most amazing destinations with our curated travel packages. 
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                {/* Simple, highly visible search bar */}
                <div className="bg-white p-2 rounded-lg shadow-2xl">
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search for places, destinations, attractions..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        className="w-full pl-12 pr-4 py-3 bg-white text-black placeholder-gray-600 focus:outline-none text-lg border-0"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontSize: '18px',
                          fontWeight: '500'
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={placesLoading}
                      className="ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-md transition-colors flex items-center gap-2"
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {placesLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Search Instructions */}
                <p className="text-white text-sm mt-3 text-center font-medium">
                  Search for attractions, restaurants, hotels, museums, parks, beaches, and more...
                </p>
                

              </div>
            </div>
          </motion.div>
        </div>

        {/* Video Background Option */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
            <PlayIcon className="h-8 w-8 text-white" />
          </button>
        </div>
      </section>

      {/* Test Search Bar - Simple and Visible */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Search Places</h3>
          
          {/* Search Bar - Hidden when results are shown */}
          {!showSearchResults && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type to search places..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-lg"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: '2px solid #d1d5db',
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1',
                    zIndex: '1'
                  }}
                />
                <button
                  onClick={handleSearch}
                  disabled={placesLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                >
                  {placesLoading ? 'Searching...' : 'Search'}
                </button>
                
                {/* Test button to show sample results */}
                <button
                  onClick={() => {
                    console.log('Test button clicked');
                    const testResults = [
                      {
                        _id: '1',
                        name: 'Test Place 1',
                        category: 'attraction',
                        location: { city: 'Colombo', country: 'Sri Lanka' },
                        primaryImage: { url: 'https://via.placeholder.com/150' },
                        videos: []
                      },
                      {
                        _id: '2',
                        name: 'Test Place 2',
                        category: 'restaurant',
                        location: { city: 'Kandy', country: 'Sri Lanka' },
                        primaryImage: null,
                        videos: [{ url: 'test-video.mp4' }]
                      }
                    ];
                    setSearchResults(testResults);
                    setShowSearchResults(true);
                    console.log('Test results set:', testResults);
                  }}
                  className="px-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
                >
                  Test Results
                </button>
              </div>
            </div>
          )}
          
          {/* Compact Search Bar - Shown when results are displayed */}
          {showSearchResults && (
            <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Search again..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={placesLoading}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm"
                  >
                    {placesLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setSearchTerm('');
                  }}
                  className="ml-3 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
            
          {/* Search Results Display */}
          {showSearchResults && (
            <div className="mt-4 relative z-10">
              {/* Clear Results Button */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results ({searchResults.length} found)
                </h3>
                <button
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setSearchTerm('');
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Clear Results
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((place) => (
                      <div
                        key={place._id}
                        onClick={() => handlePlaceSelect(place)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            {place.primaryImage ? (
                              <img
                                src={place.primaryImage.url}
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                <PhotoIcon className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {place.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {place.location?.formattedAddress || place.location?.city || 'Location not specified'}
                            </p>
                            <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
                              <span className="capitalize">{place.category}</span>
                              {place.primaryImage && (
                                <span className="flex items-center">
                                  <PhotoIcon className="h-3 w-3 mr-1" />
                                  Photo
                                </span>
                              )}
                              {place.videos && place.videos.length > 0 && (
                                <span className="flex items-center">
                                  <VideoCameraIcon className="h-3 w-3 mr-1" />
                                  Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : !placesLoading && searchTerm.trim() ? (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-center">No places found matching your search.</p>
                </div>
              ) : null}
              
              {placesLoading && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-blue-800">Searching for places...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Place Details Modal */}
      {selectedPlace && showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlace.name}</h2>
                  <p className="text-gray-600">{selectedPlace.location?.formattedAddress}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPlace(null);
                    setShowMap(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Images and Videos Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos & Videos</h3>
                
                {/* Primary Image */}
                {selectedPlace.primaryImage && (
                  <div className="mb-4">
                    <img
                      src={selectedPlace.primaryImage.url}
                      alt={selectedPlace.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Image Gallery */}
                {selectedPlace.images && selectedPlace.images.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">More Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedPlace.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption || selectedPlace.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {selectedPlace.videos && selectedPlace.videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Videos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPlace.videos.slice(0, 2).map((video, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <video
                            src={video.url}
                            controls
                            className="w-full h-full object-cover"
                            poster={video.thumbnail?.url}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPlace.description}</p>
              </div>

              {/* Map Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="h-64 bg-gray-200 rounded-lg">
                  {selectedPlace.location?.coordinates ? (
                    <PlaceMap place={selectedPlace} height="256px" />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Location coordinates not available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600 capitalize">{selectedPlace.category}</span>
                </div>
                {selectedPlace.location?.country && (
                  <div>
                    <span className="font-medium text-gray-900">Country:</span>
                    <span className="ml-2 text-gray-600">{selectedPlace.location.country}</span>
                  </div>
                )}
                {selectedPlace.location?.city && (
                  <div>
                    <span className="font-medium text-gray-900">City:</span>
                    <span className="ml-2 text-gray-600">{selectedPlace.location.city}</span>
                  </div>
                )}
                {selectedPlace.tags && selectedPlace.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-900">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPlace.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Popular Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular travel packages that travelers love to book
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading featured packages...</p>
            </div>
          ) : featuredPackages && Array.isArray(featuredPackages) && featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-large transition-all duration-300 bg-white"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image?.url || "https://via.placeholder.com/400x300"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {pkg.featured && (
                      <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                      ${pkg.price}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                      {pkg.tourType?.name || 'Tour'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          4.5
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.itinerary?.[0]?.places?.[0]?.name || 'Multiple destinations'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.days} days, {pkg.nights} nights</span>
                    </div>
                    
                    {/* Guide and Driver Information */}
                    <div className="mb-4 space-y-2">
                      {pkg.guide && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                            Guide
                          </span>
                          <span className="text-sm">{pkg.guide.name}</span>
                        </div>
                      )}
                      {pkg.driver && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                            Driver
                          </span>
                          <span className="text-sm">{pkg.driver.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary-600">
                        ${pkg.price}
                        <span className="text-sm text-gray-500 font-normal"> per person</span>
                      </div>
                      <Link
                        to={`/packages/${pkg._id}`}
                        className="btn-primary px-6 py-2 text-sm group-hover:bg-primary-700 transition-colors"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Packages
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button
                onClick={() => getFeaturedPackages()}
                className="btn-primary inline-flex items-center"
              >
                Try Again
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Packages Available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our latest travel packages!
              </p>
              <Link
                to="/packages"
                className="btn-primary inline-flex items-center"
              >
                Browse All Packages
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/packages"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center hover:bg-primary-600 hover:text-white transition-colors"
            >
              View All Packages
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Experience Cards Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Different Ways to Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From solo adventures to family getaways, find the perfect travel style for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Solo Adventures",
                description: "Explore the world on your own terms with our solo travel packages",
                icon: "🧳",
                color: "from-blue-500 to-blue-600",
                features: ["Flexible itineraries", "Solo-friendly accommodations", "Group activities available"]
              },
              {
                title: "Family Vacations",
                description: "Create lasting memories with family-friendly destinations and activities",
                icon: "👨‍👩‍👧‍👦",
                color: "from-green-500 to-green-600",
                features: ["Kid-friendly activities", "Family accommodations", "Educational experiences"]
              },
              {
                title: "Couples Retreats",
                description: "Romantic getaways designed for two with intimate experiences",
                icon: "💕",
                color: "from-pink-500 to-pink-600",
                features: ["Private experiences", "Romantic settings", "Couple activities"]
              },
              {
                title: "Group Tours",
                description: "Travel with like-minded people and make new friends along the way",
                icon: "👥",
                color: "from-purple-500 to-purple-600",
                features: ["Guided tours", "Group discounts", "Social activities"]
              }
            ].map((experience, index) => (
              <motion.div
                key={experience.title}
                className="group relative bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${experience.color}`}></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">{experience.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {experience.description}
                  </p>
                  <ul className="space-y-2">
                    {experience.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/packages"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline"
                    >
                      Explore Packages
                      <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Wanderlust?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making your travel dreams come true with exceptional service and unforgettable experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked destinations that will inspire your next adventure
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading featured packages...</p>
            </div>
          ) : featuredPackages && Array.isArray(featuredPackages) && featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  className="card overflow-hidden group hover:shadow-large transition-all duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image?.url || "https://via.placeholder.com/400x300"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {pkg.featured && (
                      <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                      ${pkg.price}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                      {pkg.tourType?.name || 'Tour'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          4.5
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.itinerary?.[0]?.places?.[0]?.name || 'Multiple destinations'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.days} days, {pkg.nights} nights</span>
                    </div>
                    
                    {/* Guide and Driver Information */}
                    <div className="mb-4 space-y-2">
                      {pkg.guide && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                            Guide
                          </span>
                          <span className="text-sm">{pkg.guide.name}</span>
                        </div>
                      )}
                      {pkg.driver && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                            Driver
                          </span>
                          <span className="text-sm">{pkg.driver.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    
                    <Link
                      to={`/packages/${pkg._id}`}
                      className="btn-primary w-full text-center group-hover:bg-primary-700 transition-colors"
                    >
                      Explore
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Featured Packages
              </h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button
                onClick={() => getFeaturedPackages()}
                className="btn-primary inline-flex items-center"
              >
                Try Again
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Featured Packages Available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our latest featured travel packages!
              </p>
              <Link
                to="/packages"
                className="btn-primary inline-flex items-center"
              >
                Browse All Packages
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/packages"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center hover:bg-primary-600 hover:text-white transition-colors"
            >
              View All Packages
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with us. 
              Your next adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4"
              >
                Get Started Today
              </Link>
              <Link
                to="/contact"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 