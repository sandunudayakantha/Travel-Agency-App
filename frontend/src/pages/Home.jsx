import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import PlaceMap from '../components/PlaceMap';
import StarRating from '../components/StarRating';
import FeaturedReviews from '../components/FeaturedReviews';
import { 
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Typing effect component
const TypewriterText = ({ words, speed = 100, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      // Deleting effect
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
      }, speed / 2);
      
      return () => clearTimeout(timeout);
    } else {
      // Typing effect
      if (currentText === currentWord) {
        // Word is complete, wait then start deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
        
        return () => clearTimeout(timeout);
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Home = () => {
  const { featuredPackages = [], getFeaturedPackages, loading, error } = usePackage();
  const { places, getPlaces, loading: placesLoading } = usePlace();
  const { settings } = useSiteSettings();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Refs
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Only fetch if we don't have featured packages and we're not loading
    if (featuredPackages.length === 0 && !loading && getFeaturedPackages) {
      getFeaturedPackages();
    }
  }, []); // Empty dependency array - only run once on mount

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 1) {
        performSearch(searchTerm);
      } else if (searchTerm.trim().length === 0) {
        setSearchResults([]);
        setShowSearchResults(false);
        setIsSearching(false);
      }
    }, 200); // 200ms debounce delay for faster response

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Keep focus on search input after search results update
  useEffect(() => {
    if (searchInputRef.current && searchTerm.trim().length >= 1) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    }
  }, [searchResults, showSearchResults]);

  // Additional focus restoration for any focus loss
  useEffect(() => {
    const handleFocusLoss = () => {
      if (searchInputRef.current && searchTerm.trim().length >= 1 && !searchInputRef.current.matches(':focus')) {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 50);
      }
    };

    // Check for focus loss periodically
    const interval = setInterval(handleFocusLoss, 100);

    return () => clearInterval(interval);
  }, [searchTerm]);

  // Separate function for performing search
  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const result = await getPlaces({ search: term }, 1);
      
      if (result.success) {
        setSearchResults(result.data.places);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchTerm.trim().length >= 1) {
      setShowSearchResults(true);
    }
  };

  // Keep focus when clicking on results
  const handleResultClick = (place) => {
    handlePlaceSelect(place);
    // Don't lose focus - keep the search input focused
    if (searchInputRef.current) {
      searchInputRef.current.focus();
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

  // Contact action handlers
  const handleWhatsAppClick = () => {
    const phone = settings?.contactInfo?.phone?.replace(/\D/g, '') || '15551234567';
    const message = encodeURIComponent('Hello! I would like to inquire about your travel packages.');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = settings?.contactInfo?.email || 'info@travelagency.com';
    const subject = encodeURIComponent('Travel Package Inquiry');
    const body = encodeURIComponent('Hello! I would like to inquire about your travel packages.');
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handlePhoneClick = () => {
    const phone = settings?.contactInfo?.phone || '+1 (555) 123-4567';
    const telUrl = `tel:${phone}`;
    window.open(telUrl);
  };

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
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative h-screen overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Sigiriya Lion Rock Fortress, Sri Lanka" 
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
                {/* Enhanced Parallax Background Elements */}
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full -translate-x-48 -translate-y-48"
          style={{
            transform: `translate(-192px, -192px) translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
          }}
        ></div>
        <div 
          className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-blue-300/20 rounded-full translate-x-32"
          style={{
            transform: `translate(128px, 0px) translateY(${scrollY * -0.08}px) rotate(${scrollY * -0.02}deg)`,
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full translate-x-32 translate-y-32"
          style={{
            transform: `translate(128px, 128px) translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center px-4 max-w-4xl">
          <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
                <span className="text-blue-400 uppercase tracking-wide">Best in the World</span>
              </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Discover Your Next<br />
                <TypewriterText 
                  words={["Adventure", "Journey", "Experience", "Destination", "Escape"]}
                  speed={150}
                  delay={2500}
                />
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
            >
              Experience the world's most amazing destinations with our curated travel packages. 
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                {/* Glass morphism search container */}
                <div className="relative">
                  {/* Backdrop blur and glass effect */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
                  
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
                  
                  {/* Main search content */}
                  <div className="relative p-1 rounded-3xl">
                    <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search for place names..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onFocus={handleSearchFocus}
                          onKeyDown={handleKeyDown}
                          className="w-full pl-14 pr-4 py-4 bg-transparent text-white placeholder-white/70 focus:outline-none text-lg border-0 rounded-2xl"
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '500'
                          }}
                        />
                      </div>

                    </div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>
                </div>
                
                <p className="text-white/90 text-sm mt-4 text-center font-medium backdrop-blur-sm">
                  Start typing place names for real-time results - try "Galle", "Sigiriya", "Temple"...
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white rounded-2xl hover:from-blue-600/90 hover:to-purple-700/90 transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20 overflow-hidden group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 font-bold">Start Your Adventure</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl overflow-hidden group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 font-bold">View Destinations</span>
              </motion.button>
            </motion.div>
        </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-sm uppercase tracking-wide">Scroll to explore</span>
            <ArrowRightIcon className="h-6 w-6 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Test Search Bar - Simple and Visible */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Real-Time Place Search</h3>
          
          {/* Search Bar - Hidden when results are shown */}
          {!showSearchResults && (
            <div className="bg-white p-4 rounded-lg shadow-lg search-container">
              <div className="flex items-center gap-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type place names to search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleKeyDown}
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
                  disabled={isSearching}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                

              </div>
            </div>
          )}
          
          {/* Compact Search Bar - Shown when results are displayed */}
          {showSearchResults && (
            <div className="bg-white p-3 rounded-lg shadow-lg mb-4 search-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search again..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 text-sm"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setSearchTerm('');
                    // Keep focus on search input
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }}
                  className="ml-3 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
            
          {/* Search Results Display */}
          {searchTerm.trim().length >= 1 && (
            <div className="mt-4 relative z-10 search-results-container" tabIndex="-1">
              {/* Clear Results Button */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isSearching ? 'Searching...' : `Search Results (${searchResults.length} found)`}
                </h3>
                <button
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setSearchTerm('');
                    // Keep focus on search input
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
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
                        onClick={() => handleResultClick(place)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
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
              ) : !isSearching && searchTerm.trim() ? (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-center">No places found matching your search.</p>
                </div>
              ) : searchTerm.trim().length === 0 ? (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-center">Start typing to search for places...</p>
                </div>
              ) : null}
              
              {isSearching && (
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

      {/* Sigiriya Showcase Section with Parallax */}


      {/* Enhanced Popular Destinations Section with Parallax */}
 

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

      {/* Featured Reviews Section */}
      <FeaturedReviews />

      {/* Enhanced Contact Section with Parallax */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Parallax Background Elements */}
        <div 
          className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40"
          style={{
            transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.02}deg)`,
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50"
          style={{
            transform: `translateY(${scrollY * -0.06}px) rotate(${scrollY * -0.012}deg)`,
          }}
        ></div>
        <div 
          className="absolute top-1/3 left-0 w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30"
          style={{
            transform: `translateX(-96px) translateY(${scrollY * 0.05}px)`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to start your adventure? Contact us today and let our travel experts help you plan the perfect trip.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Contact Actions */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-soft text-white"
            >
              <h3 className="text-2xl font-semibold mb-6">Quick Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex flex-col items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-4 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={handleEmailClick}
                  className="flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-lg transition-colors duration-200"
                >
                  <EnvelopeIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  onClick={handlePhoneClick}
                  className="flex flex-col items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-4 rounded-lg transition-colors duration-200"
                >
                  <PhoneIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Call</span>
                </button>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-soft border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Email</h4>
              </div>
              <p className="text-gray-600 text-sm">{settings?.contactInfo?.email || 'info@travelagency.com'}</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-soft border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <PhoneIcon className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-gray-900">Phone</h4>
              </div>
              <p className="text-gray-600 text-sm">{settings?.contactInfo?.phone || '+1 (555) 123-4567'}</p>
            </motion.div>
          </div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Contact Us
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section with Parallax */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Parallax Background Elements */}
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48"
          style={{
            transform: `translate(-192px, -192px) translateY(${scrollY * 0.12}px) rotate(${scrollY * 0.04}deg)`,
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40"
          style={{
            transform: `translate(160px, 160px) translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/8 rounded-full -translate-x-32 -translate-y-32"
          style={{
            transform: `translate(-128px, -128px) translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.02}deg)`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with us. 
              Your next adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Link
                to="/register"
                  className="btn-secondary text-lg px-8 py-4 inline-block"
              >
                Get Started Today
              </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Link
                to="/contact"
                  className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600 inline-block"
              >
                Contact Us
              </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 