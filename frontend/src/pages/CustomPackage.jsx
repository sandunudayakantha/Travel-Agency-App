import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { usePlace } from '../contexts/PlaceContext';
import { useCustomInquiry } from '../contexts/CustomInquiryContext';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { useVehicle } from '../contexts/VehicleContext';
import { useTourGuide } from '../contexts/TourGuideContext';
import { useDriver } from '../contexts/DriverContext';
import InteractiveTripMap from '../components/InteractiveTripMap';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CustomPackage = () => {
  const { places, getPlaces, loading: placesLoading } = usePlace();
  const { createInquiry, loading: inquiryLoading } = useCustomInquiry();
  const { user } = useAuth();
  const { clerkUser } = useClerkAuthContext();
  const { vehicles: availableVehicles, getVehicles, loading: vehiclesLoading } = useVehicle();
  const { tourGuides: availableTourGuides, getTourGuides, loading: tourGuidesLoading } = useTourGuide();
  const { drivers: availableDrivers, getDrivers, loading: driversLoading } = useDriver();
  const navigate = useNavigate();

  const hotels = [
    { id: '3s', name: 'Comfort (3★)', stars: 3, pricePerNight: 45 },
    { id: '4s', name: 'Premium (4★)', stars: 4, pricePerNight: 85 },
    { id: '5s', name: 'Luxury (5★)', stars: 5, pricePerNight: 160 },
    { id: 'vil', name: 'Boutique/Villa', stars: 5, pricePerNight: 220 },
  ];

  const vehicles = [
    { id: 'car', name: 'Car (1-3 pax)', pricePerDay: 55 },
    { id: 'van', name: 'Van (4-8 pax)', pricePerDay: 80 },
    { id: 'mini', name: 'Mini Coach (9-15 pax)', pricePerDay: 130 },
    { id: 'suv', name: 'SUV (comfort)', pricePerDay: 95 },
  ];

  const guides = [
    { id: 'none', name: 'No Guide', pricePerDay: 0 },
    { id: 'loc', name: 'Local English-speaking Guide', pricePerDay: 35 },
    { id: 'lic', name: 'Licensed National Guide', pricePerDay: 60 },
    { id: 'multi', name: 'Multilingual Guide', pricePerDay: 75 },
  ];

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [nightsByDestination, setNightsByDestination] = useState({});
  const [itineraryItems, setItineraryItems] = useState([]);
  const [newItemDay, setNewItemDay] = useState('');
  const [availableDays, setAvailableDays] = useState([1]); // Start with Day 1
  const [hotelTier, setHotelTier] = useState(hotels[1]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTourGuide, setSelectedTourGuide] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [travellers, setTravellers] = useState(2);
  const [startDate, setStartDate] = useState('');

  // Contact information
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });

  // Update contact info when user changes (check both regular auth and Clerk auth)
  useEffect(() => {
    const currentUser = user || clerkUser;
    if (currentUser) {
      setContactInfo(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [user, clerkUser]);
  
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch featured places on component mount
    if (places.length === 0) {
      getPlaces({ featured: true });
    }
  }, [places.length]);

  useEffect(() => {
    // Fetch vehicles, tour guides, and drivers on component mount
    if (availableVehicles.length === 0) {
      getVehicles();
    }
    if (availableTourGuides.length === 0) {
      getTourGuides();
    }
    if (availableDrivers.length === 0) {
      getDrivers();
    }
  }, [availableVehicles.length, availableTourGuides.length, availableDrivers.length]);

  // Dynamic coordinates from places data
  const mapCoords = useMemo(() => {
    const coords = {};
    
    // Add coordinates from all places (both featured and search results)
    const allPlaces = [...places, ...searchResults];
    
    allPlaces.forEach(place => {
      if (place.location?.coordinates?.latitude && place.location?.coordinates?.longitude) {
        coords[place.name] = {
          lat: place.location.coordinates.latitude,
          lng: place.location.coordinates.longitude
        };
      } else {
        // Add default coordinates for places without coordinates (spread around Sri Lanka)
        const defaultCoords = [
          { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
          { lat: 6.9271, lng: 79.8612 }, // Colombo
          { lat: 6.0535, lng: 80.2210 }, // Galle
          { lat: 5.9483, lng: 80.5353 }, // Matara
          { lat: 7.2906, lng: 80.6337 }, // Kandy
          { lat: 8.5388, lng: 81.1333 }, // Trincomalee
          { lat: 9.3803, lng: 80.3770 }, // Jaffna
          { lat: 6.7050, lng: 79.9073 }, // Negombo
        ];
        
        // Use a simple hash of the place name to get consistent coordinates
        const hash = place.name.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        const index = Math.abs(hash) % defaultCoords.length;
        
        coords[place.name] = defaultCoords[index];
      }
    });
    
    // Add fallback coordinates for places without coordinates
    const fallbackCoords = {
      'kaduwela': { lat: 6.9271, lng: 79.8612 },
      'matara': { lat: 5.9483, lng: 80.5353 },
      'galle': { lat: 6.0535, lng: 80.2210 },
      'Ubud Monkey Forest': { lat: -8.5193, lng: 115.2633 },
      'Tanah Lot Temple': { lat: -8.6211, lng: 115.0868 },
      'Matterhorn Peak': { lat: 45.9767, lng: 7.6583 },
      'Zermatt Village': { lat: 46.0207, lng: 7.7491 },
      'Shibuya Crossing': { lat: 35.6595, lng: 139.7004 },
      'Senso-ji Temple': { lat: 35.7148, lng: 139.7967 },
    };
    
    // Merge fallback coordinates with dynamic coordinates
    const finalCoords = { ...fallbackCoords, ...coords };
    return finalCoords;
  }, [places, searchResults]);

  const totalNights = useMemo(() =>
    itineraryItems.reduce((sum, item) => sum + (item.nights || 0), 0)
  , [itineraryItems]);

  const hotelCost = useMemo(() => totalNights * hotelTier.pricePerNight * travellers, [totalNights, hotelTier, travellers]);
  const transportCost = useMemo(() => Math.max(1, totalNights) * (selectedVehicle?.pricePerDay || 0), [totalNights, selectedVehicle]);
  const guideCost = useMemo(() => Math.max(1, totalNights) * (selectedTourGuide?.pricePerDay || 0), [totalNights, selectedTourGuide]);
  const driverCost = useMemo(() => Math.max(1, totalNights) * (selectedDriver?.pricePerDay || 0), [totalNights, selectedDriver]);
  const taxes = useMemo(() => 0.1 * (hotelCost + transportCost + guideCost + driverCost), [hotelCost, transportCost, guideCost, driverCost]);
  const totalCost = useMemo(() => hotelCost + transportCost + guideCost + driverCost + taxes, [hotelCost, transportCost, guideCost, driverCost, taxes]);

  const toggleDestination = (place) => {
    setSelectedDestinations((prev) =>
      prev.find((d) => d._id === place._id)
        ? prev.filter((d) => d._id !== place._id)
        : [...prev, place]
    );
    setNightsByDestination((prev) => ({ ...prev, [place._id]: prev[place._id] || 1 }));
  };

  const setNights = (placeId, value) => {
    const v = Math.max(0, Math.min(10, Number(value) || 0));
    setNightsByDestination((prev) => ({ ...prev, [placeId]: v }));
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await getPlaces({ search: searchTerm }, 1);
      if (result.success) {
        setSearchResults(result.data.places);
        setShowSearchResults(true);
      }
    } catch (error) {
      // Handle search error silently
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close search results
  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  // Get places to display (featured by default, search results when searching)
  const displayPlaces = showSearchResults ? searchResults : places;

  const addItineraryItem = (place, day, timeOfDay) => {
    // Check if this place is already in the itinerary on any day
    const isPlaceAlreadySelected = itineraryItems.some(item => item.place._id === place._id);
    
    if (isPlaceAlreadySelected) {
      alert(`"${place.name}" is already included in your itinerary. You cannot select the same place on multiple days.`);
      return;
    }
    
    const newItem = {
      id: Date.now() + Math.random(),
      place: place,
      day: day,
      timeOfDay: timeOfDay, // 'day' or 'night'
      nights: 0 // Default to 0 nights
    };
    setItineraryItems(prev => [...prev, newItem]);
  };

  const addNewDay = () => {
    const maxDay = Math.max(...availableDays);
    const newDay = maxDay + 1;
    setAvailableDays(prev => [...prev, newDay]);
    setNewItemDay(newDay); // Automatically select the new day
  };

  const removeDay = (dayToRemove) => {
    // Only allow removal if no items are planned for that day
    const dayItems = itineraryItems.filter(item => item.day === dayToRemove);
    if (dayItems.length > 0) {
      alert(`Cannot remove Day ${dayToRemove} because it has ${dayItems.length} planned item(s). Please remove the items first.`);
      return;
    }
    
    setAvailableDays(prev => prev.filter(day => day !== dayToRemove));
    
    // If the removed day was selected, select the previous day
    if (newItemDay === dayToRemove) {
      const remainingDays = availableDays.filter(day => day !== dayToRemove);
      if (remainingDays.length > 0) {
        setNewItemDay(Math.max(...remainingDays));
      } else {
        setNewItemDay('');
      }
    }
  };

  const removeItineraryItem = (itemId) => {
    setItineraryItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItineraryItem = (itemId, field, value) => {
    setItineraryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  // Helper function to check if a place is already in the itinerary
  const isPlaceInItinerary = (placeId) => {
    return itineraryItems.some(item => item.place._id === placeId);
  };





  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitInquiry = async () => {

    if (itineraryItems.length === 0) {
      alert('Please add at least one destination to your itinerary');
      return;
    }

    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert('Please fill in your name, email, and phone number');
      return;
    }

    const inquiryData = {
      contactInfo,
      tripDetails: {
        startDate: new Date(startDate).toISOString(),
      travellers,
        totalDays: totalNights + 1,
        totalNights
      },
      itinerary: itineraryItems.map((item, index) => ({
        place: item.place._id,
        nights: item.nights || 0,
        day: item.day,
        timeOfDay: item.timeOfDay,
        order: index + 1
      })),
      preferences: {
      hotelTier,
        vehicle: selectedVehicle,
        tourGuide: selectedTourGuide,
        driver: selectedDriver
      },
      costBreakdown: {
        hotelCost,
        transportCost,
        guideCost,
        driverCost,
        taxes,
        totalCost
      },
      additionalRequirements
    };

    const result = await createInquiry(inquiryData);
    if (result.success) {
      // Show success message and redirect based on user status
      const currentUser = user || clerkUser;
      if (currentUser) {
        navigate('/bookings');
      } else {
        // For non-logged in users, show success message and redirect to home
        alert('Your custom package inquiry has been submitted successfully! We will contact you soon.');
        navigate('/');
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Custom Trip</h1>
          <p className="text-gray-600 text-lg">Choose destinations, hotels, vehicles and guides to craft your own experience.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Destination selection and itinerary planning */}
          <div className="lg:col-span-2 space-y-8">
            {/* Destination Selection */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Destinations</h2>
              <p className="text-sm text-gray-600 mb-4">
                {showSearchResults ? 'Search results' : 'Featured destinations'} - Browse and select destinations for your custom trip.
              </p>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for places, destinations, attractions..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                  {searchTerm && (
                    <button
                      onClick={closeSearchResults}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {isSearching && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    Searching...
                  </div>
                )}
                {showSearchResults && searchResults.length === 0 && !isSearching && (
                  <div className="mt-2 text-sm text-gray-500">
                    No places found for "{searchTerm}". Try a different search term.
                  </div>
                )}
              </div>
              
              {placesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : displayPlaces.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    {showSearchResults 
                      ? 'No search results found.' 
                      : 'No featured destinations available.'
                    }
                  </p>
                  <p className="text-sm">
                    {showSearchResults 
                      ? 'Try a different search term or browse featured destinations.' 
                      : 'Please check back later or search for specific destinations.'
                    }
                  </p>
                </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayPlaces.map((place) => {
                    const active = selectedDestinations.find((x) => x._id === place._id);
                  return (
                      <div key={place._id} className={`group relative overflow-hidden rounded-xl border ${active ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'} bg-white shadow-sm hover:shadow-md transition-all duration-300`}> 
                        <div className="relative">
                          <img 
                            src={place.images?.[0]?.url || place.image?.url || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=60'} 
                            alt={place.name} 
                            className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          {active && (
                            <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                          {isPlaceInItinerary(place._id) && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                              In Itinerary
                            </div>
                          )}
                        </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-gray-900 font-medium text-sm">{place.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{place.location?.formattedAddress || place.location?.city || 'Sri Lanka'}</div>
                          </div>
                          <button
                            type="button"
                              onClick={() => toggleDestination(place)}
                              disabled={isPlaceInItinerary(place._id)}
                              className={`ml-3 px-3 py-1 text-sm rounded-md transition-colors ${
                                active 
                                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                                  : isPlaceInItinerary(place._id)
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                    : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                              }`}
                          >
                            {active ? 'Remove' : isPlaceInItinerary(place._id) ? 'In Itinerary' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </section>

            {/* Itinerary Planning */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Your Itinerary</h2>
              <p className="text-sm text-gray-600 mb-4">Define your trip day by day with multiple places and timing.</p>
              
              {/* Day Selection */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Select Day to Plan</h3>
                  <button
                    onClick={addNewDay}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <span>+</span>
                    Add Day
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map(day => {
                    const dayItems = itineraryItems.filter(item => item.day === day);
                    const isSelected = newItemDay === day;
                    const canRemove = dayItems.length === 0 && availableDays.length > 1;
                    
                    return (
                      <div key={day} className="relative group">
                        <button
                          onClick={() => setNewItemDay(day)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-primary-600 text-white' 
                              : dayItems.length > 0 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Day {day} {dayItems.length > 0 && `(${dayItems.length})`}
                        </button>
                        
                        {/* Remove button (only show on hover and if can remove) */}
                        {canRemove && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDay(day);
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                            title={`Remove Day ${day}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {availableDays.length === 1 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Click "Add Day" to add more days to your trip
                  </p>
                )}
              </div>

              {/* Add Places to Selected Day */}
              {newItemDay && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add Places to Day {newItemDay}</h3>
                  <p className="text-sm text-gray-600 mb-4">Select multiple places and choose day/night for each:</p>
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Each place can only be visited once during your trip. Places already in your itinerary on other days cannot be added again.
                    </p>
                  </div>
                  
                  {/* Show places already in itinerary */}
                  {itineraryItems.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Places already in your itinerary:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(itineraryItems.map(item => item.place._id))).map(placeId => {
                          const place = itineraryItems.find(item => item.place._id === placeId)?.place;
                          return (
                            <span key={placeId} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                              {place?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedDestinations.map((place) => {
                      const existingItem = itineraryItems.find(item => 
                        item.day === newItemDay && item.place._id === place._id
                      );
                      
                      return (
                        <div key={place._id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm">{place.name}</h4>
                            <div className="flex gap-1">
                              {existingItem && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Added
                                </span>
                              )}
                              {isPlaceInItinerary(place._id) && !existingItem && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  In Other Day
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!existingItem ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Time of Day:</label>
                                <select 
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                                  value={place.timeOfDay || ''}
                                  onChange={(e) => {
                                    // Update the place object with timeOfDay
                                    const updatedPlace = { ...place, timeOfDay: e.target.value };
                                    setSelectedDestinations(prev => 
                                      prev.map(p => p._id === place._id ? updatedPlace : p)
                                    );
                                  }}
                                >
                                  <option value="">Select time</option>
                                  <option value="day">🌞 Day Time</option>
                                  <option value="night">🌙 Night</option>
                                </select>
                              </div>
                              
                              <button
                                onClick={() => {
                                  if (place.timeOfDay) {
                                    addItineraryItem(place, newItemDay, place.timeOfDay);
                                    // Clear the timeOfDay after adding
                                    const clearedPlace = { ...place, timeOfDay: '' };
                                    setSelectedDestinations(prev => 
                                      prev.map(p => p._id === place._id ? clearedPlace : p)
                                    );
                                  }
                                }}
                                disabled={!place.timeOfDay || isPlaceInItinerary(place._id)}
                                className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                                  !place.timeOfDay || isPlaceInItinerary(place._id)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                              >
                                {isPlaceInItinerary(place._id) ? 'Already in Itinerary' : `Add to Day ${newItemDay}`}
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <p>Time: {existingItem.timeOfDay === 'day' ? '🌞 Day' : '🌙 Night'}</p>
                              <button
                                onClick={() => removeItineraryItem(existingItem.id)}
                                className="mt-2 w-full px-2 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-200 hover:bg-red-100 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
              {selectedDestinations.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No destinations selected yet.</p>
                      <p className="text-sm">Select destinations above to add them to your itinerary.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Trip Overview */}
              {itineraryItems.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900 mb-3">Trip Overview</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map(day => {
                      const dayItems = itineraryItems.filter(item => item.day === day);
                      return (
                        <div key={day} className={`px-3 py-1 rounded-full text-sm font-medium ${
                          dayItems.length > 0 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          Day {day} {dayItems.length > 0 ? `(${dayItems.length})` : '(empty)'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current Itinerary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Itinerary</h3>
                {itineraryItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No itinerary items added yet.</p>
                    <p className="text-sm">Select destinations and add them to your itinerary above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Set(itineraryItems.map(item => item.day))).sort((a, b) => a - b).map(day => {
                      const dayItems = itineraryItems.filter(item => item.day === day).sort((a, b) => 
                        (a.timeOfDay === 'day' ? 0 : 1) - (b.timeOfDay === 'day' ? 0 : 1)
                      );
                      return (
                        <div key={day} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900">Day {day}</h4>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {dayItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.timeOfDay === 'day' ? '🌞 Day Time' : '🌙 Night'}
                                  </div>
                                  <div className="text-sm text-gray-600">{item.place.name}</div>
                                </div>
                                <button
                                  onClick={() => removeItineraryItem(item.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>



            {/* Preferences */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Hotel Tier */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hotel Tier</h3>
                <div className="space-y-2">
                  {hotels.map((h) => (
                    <label key={h.id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${hotelTier.id === h.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{h.name}</div>
                        <div className="text-xs text-gray-500">${h.pricePerNight}/night per person</div>
                      </div>
                      <input type="radio" name="hotel" checked={hotelTier.id === h.id} onChange={() => setHotelTier(h)} />
                    </label>
                  ))}
                </div>
              </div>

                {/* Vehicle Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vehicle</h3>
                  {vehiclesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading vehicles...</p>
                    </div>
                  ) : availableVehicles.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No vehicles available</p>
                    </div>
                  ) : (
                <div className="space-y-2">
                      {availableVehicles.map((v) => (
                        <label key={v._id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${selectedVehicle?._id === v._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{v.name}</div>
                        <div className="text-xs text-gray-500">${v.pricePerDay}/day per group</div>
                            <div className="text-xs text-gray-400">{v.type} • {v.capacity} passengers</div>
                      </div>
                          <input type="radio" name="vehicle" checked={selectedVehicle?._id === v._id} onChange={() => setSelectedVehicle(v)} />
                    </label>
                  ))}
                    </div>
                  )}
                </div>

                {/* Tour Guide Selection */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tour Guide</h3>
                  {tourGuidesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading guides...</p>
                    </div>
                  ) : availableTourGuides.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No guides available</p>
              </div>
                  ) : (
                <div className="space-y-2">
                      {availableTourGuides.map((g) => (
                        <label key={g._id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${selectedTourGuide?._id === g._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                      <div>
                        <div className="font-medium text-gray-900">{g.name}</div>
                        <div className="text-xs text-gray-500">${g.pricePerDay}/day per group</div>
                            <div className="text-xs text-gray-400">{g.languages?.join(', ')} • {g.rating}★</div>
                          </div>
                          <input type="radio" name="guide" checked={selectedTourGuide?._id === g._id} onChange={() => setSelectedTourGuide(g)} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Driver Selection */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Driver</h3>
                  {driversLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading drivers...</p>
                    </div>
                  ) : availableDrivers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No drivers available</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableDrivers.map((d) => (
                        <label key={d._id} className={`flex items-center justify-between rounded-md border p-3 cursor-pointer ${selectedDriver?._id === d._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                          <div>
                            <div className="font-medium text-gray-900">{d.name}</div>
                            <div className="text-xs text-gray-500">${d.pricePerDay}/day per group</div>
                            <div className="text-xs text-gray-400">{d.licenseType} • {d.rating}★</div>
                      </div>
                          <input type="radio" name="driver" checked={selectedDriver?._id === d._id} onChange={() => setSelectedDriver(d)} />
                    </label>
                  ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              {(user || clerkUser) && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Your contact information has been auto-filled from your account
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder={(user || clerkUser) ? "Auto-filled from your account" : "Enter your full name"}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder={(user || clerkUser) ? "Auto-filled from your account" : "Enter your email address"}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    value={contactInfo.country}
                    onChange={(e) => handleContactChange('country', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>
            </section>

            {/* Additional Requirements */}
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Requirements</h2>
              <textarea
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Any special requirements, dietary restrictions, accessibility needs, or other preferences..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                rows={4}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {additionalRequirements.length}/1000 characters
              </div>
            </section>
          </div>

          {/* Right: Interactive Map */}
          <aside className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Map</h2>
              <p className="text-sm text-gray-600 mb-4">See your selected destinations and itinerary on the real map</p>
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ height: '400px' }}>
                <InteractiveTripMap
                  selectedDestinations={selectedDestinations}
                  itineraryItems={itineraryItems}
                  mapCoords={mapCoords}
                  height="100%"
                />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {selectedDestinations.length === 0 ? (
                  "Select destinations to see them on the interactive map"
                ) : itineraryItems.length === 0 ? (
                  `${selectedDestinations.length} destination(s) selected - click markers for details`
                ) : (
                  `${itineraryItems.length} item(s) in itinerary - red line shows your route`
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom: Trip Details, Pricing & Submit */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Details */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start date *</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Number of Travellers</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={20} 
                      value={travellers} 
                      onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)||1))} 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200" 
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Selected Destinations</div>
                  {selectedDestinations.length === 0 ? (
                    <div className="text-sm text-gray-500">No destinations selected yet.</div>
                  ) : (
                    <ul className="text-sm text-gray-800 space-y-1">
                      {selectedDestinations.map((place) => (
                        <li key={place._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{place.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Selected Services</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-800">Vehicle</span>
                      <span className="text-sm text-gray-600">
                        {selectedVehicle ? selectedVehicle.name : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-800">Tour Guide</span>
                      <span className="text-sm text-gray-600">
                        {selectedTourGuide ? selectedTourGuide.name : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-800">Driver</span>
                      <span className="text-sm text-gray-600">
                        {selectedDriver ? selectedDriver.name : 'Not selected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex justify-between items-center">
                  <span>Hotel ({totalNights} nights × ${hotelTier.pricePerNight} × {travellers} pax)</span>
                  <span className="font-medium">${hotelCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Vehicle ({Math.max(1, totalNights)} day(s))</span>
                  <span className="font-medium">${transportCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Tour Guide ({Math.max(1, totalNights)} day(s))</span>
                  <span className="font-medium">${guideCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Driver ({Math.max(1, totalNights)} day(s))</span>
                  <span className="font-medium">${driverCost.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center text-gray-500">
                  <span>Taxes (10%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </li>
                <li className="flex justify-between items-center font-semibold text-gray-900 border-t pt-3 text-lg">
                  <span>Total</span>
                  <span>${totalCost.toFixed(2)}</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">This is an estimate. Our team will review your request and provide a final quote.</p>
            </section>
          </div>

          {/* Submit Section */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Submit Inquiry</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Ready to submit your custom trip request?</p>
                  <p className="mt-2">Our team will review your itinerary and provide a detailed quote within 24 hours.</p>
                </div>
                
                <button
                  onClick={handleSubmitInquiry}
                  disabled={itineraryItems.length === 0 || !startDate || !contactInfo.name || !contactInfo.email || !contactInfo.phone || inquiryLoading}
                  className="w-full py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {inquiryLoading ? 'Submitting...' : 'Submit Custom Trip Inquiry'}
                </button>
                
                <div className="text-xs text-gray-500">
                  <p>✓ Free consultation</p>
                  <p>✓ No booking fees</p>
                  <p>✓ Flexible payment options</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPackage; 