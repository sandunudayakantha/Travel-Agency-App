import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Clock, TrendingUp, Image, Video } from 'lucide-react';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { usePlace } from '../contexts/PlaceContext';
import { Link } from 'react-router-dom';

const SearchSection = () => {
  const { getPlaces, loading: placesLoading } = usePlace();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const sectionRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Popular searches for quick access
  const popularSearches = [
    'Sigiriya',
    'Galle Fort',
    'Temple of the Tooth',
    'Ella Rock',
    'Mirissa Beach',
    'Anuradhapura',
    'Nuwara Eliya',
    'Yala National Park'
  ];

  // Real-time search with backend integration
  const handleSearch = useCallback(async (query) => {
    if (!query || query.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const result = await getPlaces({ search: query }, 1);
      
      if (result.success) {
        setSearchResults(result.data.places || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [getPlaces]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
      }
    }, 300); // 300ms debounce for better UX

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSelect = (place) => {
    setSearchQuery(place.name);
    setShowResults(false);
    // You can navigate to place detail or trigger other actions here
  };

  const handlePopularSearch = (search) => {
    setSearchQuery(search);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl md:text-4xl font-bold">
              Where would you like to go?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Search for your next adventure. Discover amazing destinations, hidden gems, and unforgettable experiences in Sri Lanka.
            </p>
          </div>

          <div 
            ref={searchContainerRef}
            className={`max-w-4xl mx-auto mb-12 transition-all duration-700 delay-300 relative ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="relative z-[9998]">
              <div className="relative group z-[9998]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="Search destinations, places, or experiences in Sri Lanka..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  className="pl-12 pr-20 py-6 text-lg border-2 border-transparent bg-white shadow-xl hover:shadow-2xl focus:border-blue-500 focus:shadow-2xl transition-all duration-300 rounded-2xl"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 rounded-xl px-6"
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]">
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.slice(0, 8).map((place) => (
                      <button
                        key={place._id}
                        onClick={() => handleSearchSelect(place)}
                        className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {place.primaryImage ? (
                                <img
                                  src={place.primaryImage.url}
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                  <MapPin className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-gray-900 group-hover:text-blue-600 transition-colors font-medium">
                                {place.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {place.location?.formattedAddress || place.location?.city || 'Location not specified'}
                              </div>
                              <div className="flex items-center mt-1 space-x-4 text-xs text-gray-400">
                                <span className="capitalize">{place.category}</span>
                                {place.primaryImage && (
                                  <span className="flex items-center">
                                    <Image className="h-3 w-3 mr-1" />
                                    Photo
                                  </span>
                                )}
                                {place.videos && place.videos.length > 0 && (
                                  <span className="flex items-center">
                                    <Video className="h-3 w-3 mr-1" />
                                    Video
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-orange-500">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-xs">Popular</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {showResults && searchQuery.length > 0 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-[9999]">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No places found for "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try searching for a different location or experience</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-[9999]">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-gray-600">Searching for places...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Popular Searches */}
          <div className={`max-w-4xl mx-auto transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Popular searches</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="px-4 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:shadow-md group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200 inline-block">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className={`max-w-4xl mx-auto mt-16 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">500+ Destinations</h3>
                <p className="text-gray-600 text-sm">Explore amazing places around Sri Lanka</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Real-time Updates</h3>
                <p className="text-gray-600 text-sm">Get the latest travel information instantly</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Smart Search</h3>
                <p className="text-gray-600 text-sm">Find exactly what you're looking for</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
