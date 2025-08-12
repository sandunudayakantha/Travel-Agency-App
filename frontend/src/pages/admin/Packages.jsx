import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePackage } from '../../contexts/PackageContext';
import { usePlace } from '../../contexts/PlaceContext';
import { useVehicle } from '../../contexts/VehicleContext';
import { useTourGuide } from '../../contexts/TourGuideContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const AdminPackages = () => {
  const { 
    packages = [], 
    tourTypes = [],
    loading = false, 
    createPackage, 
    updatePackage, 
    deletePackage,
    createTourType,
    updateTourType,
    deleteTourType,
    loadPackages,
    loadTourTypes
  } = usePackage();

  const { places = [], getPlaces } = usePlace();
  
  // Ensure places is always an array and filter out invalid entries
  const validPlaces = Array.isArray(places) ? places.filter(place => 
    place && place._id && place.name && typeof place.name === 'string'
  ) : [];
  const { vehicles = [], getVehicles } = useVehicle();
  const { tourGuides = [], getTourGuides } = useTourGuide();

  console.log('AdminPackages - packages:', packages);
  console.log('AdminPackages - tourTypes:', tourTypes);
  console.log('AdminPackages - places:', places);
  console.log('AdminPackages - validPlaces:', validPlaces);
  console.log('AdminPackages - vehicles:', vehicles);
  console.log('AdminPackages - tourGuides:', tourGuides);
  console.log('AdminPackages - loading:', loading);
  
  // Load data when component mounts
  useEffect(() => {
    console.log('AdminPackages useEffect - loading data...');
    setIsLoadingData(true);
    
    const loadAllData = async () => {
      try {
        await Promise.all([
          loadPackages(),
          loadTourTypes(),
          getPlaces(),
          getVehicles(),
          getTourGuides()
        ]);
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadAllData();
  }, []); // Empty dependency array
  
  // Remove this useEffect since we're handling loading state in the first useEffect
  
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showTourTypeModal, setShowTourTypeModal] = useState(false);
  const [editingTourType, setEditingTourType] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleAddPackage = () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create packages');
      return;
    }
    
    setEditingPackage(null);
    setShowPackageModal(true);
  };

  const handleEditPackage = (packageItem) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to edit packages');
      return;
    }
    
    setEditingPackage(packageItem);
    setShowPackageModal(true);
  };

  const handleDeletePackage = async (id) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete packages');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this package?')) {
      await deletePackage(id);
    }
  };

  const handleAddTourType = () => {
    console.log('handleAddTourType called');
    console.log('createTourType function:', createTourType);
    console.log('updateTourType function:', updateTourType);
    console.log('deleteTourType function:', deleteTourType);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to create tour types');
      return;
    }
    
    setEditingTourType(null);
    setShowTourTypeModal(true);
    console.log('Tour type modal should be open now');
  };

  const handleEditTourType = (tourType) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to edit tour types');
      return;
    }
    
    setEditingTourType(tourType);
    setShowTourTypeModal(true);
  };

  const handleDeleteTourType = async (id) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete tour types');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this tour type?')) {
      await deleteTourType(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Packages
          </h1>
          <p className="text-xl text-gray-600">
            Create and manage travel packages
          </p>
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Context Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Component Loading: {isLoadingData ? 'Yes' : 'No'}</p>
            <p>Packages: {packages?.length || 0}</p>
            <p>Tour Types: {tourTypes?.length || 0}</p>
            <p>Places: {places?.length || 0}</p>
            <p>Vehicles: {vehicles?.length || 0}</p>
            <p>Tour Guides: {tourGuides?.length || 0}</p>
            <div className="mt-2 space-x-2">
              <button 
                onClick={() => {
                  console.log('Manual reload triggered');
                  setIsLoadingData(true);
                  loadPackages();
                  loadTourTypes();
                  getPlaces();
                  getVehicles();
                  getTourGuides();
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Reload Data
              </button>
            </div>
          </div>
        </div>
        
        {/* Tour Types Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TagIcon className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Tour Types</h2>
              </div>
              <button
                onClick={(e) => {
                  console.log('Add Tour Type button clicked');
                  e.preventDefault();
                  handleAddTourType();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Tour Type
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading || tourTypes === undefined ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : tourTypes.length === 0 ? (
              <div className="text-center py-8">
                <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tour types</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new tour type.</p>
                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      console.log('Add Tour Type button clicked (empty state)');
                      e.preventDefault();
                      handleAddTourType();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Tour Type
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourTypes.map((tourType) => (
                  <div
                    key={tourType._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Image */}
                    {tourType.image && (
                      <div className="h-48 bg-gray-200">
                        <img
                          src={tourType.image.url || tourType.image}
                          alt={tourType.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {tourType.name || 'Untitled Tour Type'}
                        </h3>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditTourType(tourType)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit tour type"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTourType(tourType._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete tour type"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Description */}
                      {tourType.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {tourType.description}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Created {new Date(tourType.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Packages Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Travel Packages</h2>
              </div>
              <button
                onClick={handleAddPackage}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Package
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Debug Info */}
            <div className="mb-4 p-3 bg-yellow-100 rounded text-sm">
              <p><strong>Debug:</strong> Loading: {loading ? 'Yes' : 'No'}, IsLoadingData: {isLoadingData ? 'Yes' : 'No'}</p>
              <p>Packages: {packages ? packages.length : 'undefined'}</p>
              <p>Tour Types: {tourTypes ? tourTypes.length : 'undefined'}</p>
              <p>Places: {places ? places.length : 'undefined'}</p>
              <p>Vehicles: {vehicles ? vehicles.length : 'undefined'}</p>
              <p>Tour Guides: {tourGuides ? tourGuides.length : 'undefined'}</p>
            </div>
            
            {loading || isLoadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-2 text-gray-600">Loading packages...</p>
              </div>
            ) : !packages || packages.length === 0 ? (
              <div className="text-center py-8">
                <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No packages</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new package.</p>
                <div className="mt-6">
                  <button
                    onClick={handleAddPackage}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Package
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((packageItem) => (
                  <div
                    key={packageItem._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {packageItem.title || 'Untitled Package'}
                        </h3>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditPackage(packageItem)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit package"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(packageItem._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete package"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Description */}
                      {packageItem.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {packageItem.description || 'No description available'}
                        </p>
                      )}
                      
                      {/* Package Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {packageItem.days || 0} days, {packageItem.nights || 0} nights
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>${typeof packageItem.price === 'object' ? (packageItem.price.amount || 0) : (packageItem.price || 0)}</span>
                        </div>
                        {packageItem.featured && (
                          <div className="flex items-center text-sm text-yellow-600">
                            <StarIcon className="h-4 w-4 mr-2" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tour Type */}
                      {packageItem.tourType && (
                        <div className="text-xs text-gray-500 mb-2">
                          Tour Type: {packageItem.tourType.name || 'Unknown'}
                        </div>
                      )}
                      
                      {/* Itinerary Summary */}
                      {packageItem.itinerary && packageItem.itinerary.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {packageItem.itinerary.length} day{packageItem.itinerary.length > 1 ? 's' : ''} planned
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(packageItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Package Modal */}
        {showPackageModal && (
          <PackageModal
            package={editingPackage}
            tourTypes={tourTypes || []}
            places={validPlaces}
            vehicles={vehicles || []}
            tourGuides={tourGuides || []}
            onClose={() => setShowPackageModal(false)}
            onSuccess={() => {
              setShowPackageModal(false);
              setEditingPackage(null);
            }}
            createPackage={createPackage}
            updatePackage={updatePackage}
          />
        )}

        {/* Tour Type Modal */}
        {showTourTypeModal && (
          <TourTypeModal
            tourType={editingTourType}
            onClose={() => {
              console.log('Closing tour type modal');
              setShowTourTypeModal(false);
            }}
            onSuccess={() => {
              console.log('Tour type modal success');
              setShowTourTypeModal(false);
              setEditingTourType(null);
            }}
            createTourType={createTourType}
            updateTourType={updateTourType}
          />
        )}
        
        {/* Debug info for modal state */}
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
          showTourTypeModal: {showTourTypeModal ? 'true' : 'false'}
        </div>
      </div>
    </div>
  );
};

// Package Modal Component
const PackageModal = ({ package: packageItem, tourTypes, places, vehicles, tourGuides, onClose, onSuccess, createPackage, updatePackage }) => {
  const [formData, setFormData] = useState({
    title: packageItem ? packageItem.title : '',
    description: packageItem ? packageItem.description : '',
    tourType: packageItem ? packageItem.tourType?._id : '',
    days: packageItem ? packageItem.days : 1,
    nights: packageItem ? packageItem.nights : 0,
    vehicle: packageItem ? packageItem.vehicle?._id : '',
    guide: packageItem ? packageItem.guide?._id : '',
    price: packageItem ? packageItem.price : 0,
    featured: packageItem ? packageItem.featured : false,
    itinerary: packageItem ? packageItem.itinerary || [] : []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create a ref to store the addDay function
  const addDayRef = useRef();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll('[id^="places-dropdown-"]');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !event.target.closest('button[onclick*="places-dropdown"]')) {
          dropdown.classList.add('hidden');
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addDay = useCallback(() => {
    console.log('addDay function called');
    
    setFormData(prevData => {
      const newDay = {
        day: prevData.itinerary.length + 1,
        title: '',
        description: '',
        places: [],
        video: null
      };
      
      console.log('Adding new day:', newDay);
      console.log('Current itinerary length:', prevData.itinerary.length);
      
      return {
        ...prevData,
        itinerary: [...prevData.itinerary, newDay]
      };
    });
  }, []);

  // Store the addDay function in the ref
  addDayRef.current = addDay;



  const removeDay = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Update day numbers
    const updatedItinerary = newItinerary.map((day, i) => ({
      ...day,
      day: i + 1
    }));
    setFormData({ ...formData, itinerary: updatedItinerary });
  };

  const handleVideoUpload = (dayIndex, file) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex] = { 
      ...newItinerary[dayIndex], 
      videoFile: file 
    };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a package title');
      return;
    }

    if (!formData.tourType) {
      alert('Please select a tour type');
      return;
    }

    if (!formData.vehicle) {
      alert('Please select a vehicle');
      return;
    }

    if (!formData.guide) {
      alert('Please select a guide');
      return;
    }

    if (formData.itinerary.length === 0) {
      alert('Please add at least one day to the itinerary');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting package form...');
      let result;
      
      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('tourType', formData.tourType);
      submitData.append('days', formData.days);
      submitData.append('nights', formData.nights);
      submitData.append('vehicle', formData.vehicle);
      submitData.append('guide', formData.guide);
      submitData.append('price', formData.price);
      submitData.append('featured', formData.featured);
      
      // Debug: Log the form data being sent
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        tourType: formData.tourType,
        days: formData.days,
        nights: formData.nights,
        vehicle: formData.vehicle,
        guide: formData.guide,
        price: formData.price,
        featured: formData.featured,
        itineraryLength: formData.itinerary.length
      });
      
      // Add itinerary without video files
      const itineraryWithoutFiles = formData.itinerary.map(day => ({
        day: day.day,
        title: day.title,
        description: day.description,
        places: day.places
      }));
      submitData.append('itinerary', JSON.stringify(itineraryWithoutFiles));
      
      // Add video files
      formData.itinerary.forEach((day, index) => {
        if (day.videoFile) {
          submitData.append(`dayVideo_${index}`, day.videoFile);
        }
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      if (packageItem) {
        result = await updatePackage(packageItem._id, submitData);
      } else {
        result = await createPackage(submitData);
      }

      console.log('Package submission result:', result);
      if (result.success) {
        onSuccess();
      } else {
        console.error('Package submission failed:', result.error);
      }
    } catch (error) {
      console.error('Error submitting package:', error);
      alert('An error occurred while submitting the package. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {packageItem ? 'Edit Package' : 'Add New Package'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                required
                placeholder="Enter package title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Type *
              </label>
              <select
                required
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Tour Type</option>
                {tourTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nights *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.nights}
                onChange={(e) => setFormData({ ...formData, nights: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle *
              </label>
              <select
                required
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name} - {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guide *
              </label>
              <select
                required
                value={formData.guide}
                onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Guide</option>
                {tourGuides.map((guide) => (
                  <option key={guide._id} value={guide._id}>
                    {guide.name} - {guide.languages?.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Package
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter package description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              maxLength={2000}
            />
          </div>

          {/* Itinerary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Itinerary</h4>
            </div>
            
            {/* Debug info for itinerary */}
            <div className="mb-4 p-2 bg-yellow-100 rounded text-xs">
              <p><strong>Debug:</strong> Itinerary length: {formData.itinerary.length}</p>
              <p>Itinerary: {JSON.stringify(formData.itinerary, null, 2)}</p>
              <button 
                type="button" 
                onClick={() => {
                  console.log('Debug area Add Day button clicked');
                  addDay();
                }}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs mt-2"
              >
                Add Day (Debug)
              </button>
            </div>

            {formData.itinerary.map((day, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Day {day.day}</h5>
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isSubmitting}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter day title"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Places (Select multiple)
                    </label>
                    <div className="relative">
                      {/* Custom Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const dropdownId = `places-dropdown-${index}`;
                          const dropdown = document.getElementById(dropdownId);
                          if (dropdown) {
                            dropdown.classList.toggle('hidden');
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 disabled:opacity-50 flex items-center justify-between"
                        disabled={isSubmitting}
                      >
                        <span className="text-gray-700">
                          {day.places && day.places.length > 0 
                            ? `${day.places.length} place(s) selected`
                            : 'Click to select places...'
                          }
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown List */}
                      <div
                        id={`places-dropdown-${index}`}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto hidden"
                      >
                        {places && places.length > 0 ? (
                          <div className="py-1">
                            {places.map((place) => {
                              const isSelected = day.places && day.places.includes(place._id);
                              return (
                                <label
                                  key={place._id}
                                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const currentPlaces = day.places || [];
                                      let updatedPlaces;
                                      if (e.target.checked) {
                                        updatedPlaces = [...currentPlaces, place._id];
                                      } else {
                                        updatedPlaces = currentPlaces.filter(id => id !== place._id);
                                      }
                                      handleItineraryChange(index, 'places', updatedPlaces);
                                    }}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {place.name || 'Unnamed Place'} - {typeof place.location === 'object' ? place.location.city || place.location.formattedAddress || 'Unknown Location' : place.location || 'Unknown Location'}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No places available
                          </div>
                        )}
                      </div>

                      {/* Selected Places Tags */}
                      {day.places && day.places.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Selected places:</p>
                          <div className="flex flex-wrap gap-1">
                            {day.places.map((placeId) => {
                              const place = places.find(p => p._id === placeId);
                              return place ? (
                                <span key={placeId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {place.name || 'Unnamed Place'}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedPlaces = day.places.filter(id => id !== placeId);
                                      handleItineraryChange(index, 'places', updatedPlaces);
                                    }}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter day description"
                    value={day.description}
                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(index, e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  {day.video && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current video: {day.video.url}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Day button after all days */}
            <div className="flex justify-center mt-6 mb-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Add Day button clicked');
                  addDay();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {formData.itinerary.length === 0 ? 'Add First Day' : 'Add Next Day'}
              </button>
            </div>
            

          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {packageItem ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                packageItem ? 'Update Package' : 'Create Package'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tour Type Modal Component
const TourTypeModal = ({ tourType, onClose, onSuccess, createTourType, updateTourType }) => {
  const [formData, setFormData] = useState({
    name: tourType ? tourType.name : '',
    description: tourType ? tourType.description : '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(
    tourType && tourType.image ? (tourType.image.url || tourType.image) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a tour type name');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting tour type form...');
      let result;
      if (tourType) {
        result = await updateTourType(tourType._id, formData);
      } else {
        result = await createTourType(formData);
      }

      console.log('Tour type submission result:', result);
      if (result.success) {
        onSuccess();
      } else {
        console.error('Tour type submission failed:', result.error);
      }
    } catch (error) {
      console.error('Error submitting tour type:', error);
      alert('An error occurred while submitting the tour type. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {tourType ? 'Edit Tour Type' : 'Add New Tour Type'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour Type Name *
            </label>
            <input
              type="text"
              required
              placeholder="Enter tour type name (e.g., Adventure Tours)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a descriptive name for the tour type (2-100 characters)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter a description for this tour type..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-500">
              Brief description of this tour type (max 500 characters)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload an image for this tour type (Max 5MB, JPG/PNG/GIF)
            </p>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Tour type preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {tourType ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                tourType ? 'Update Tour Type' : 'Create Tour Type'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPackages; 