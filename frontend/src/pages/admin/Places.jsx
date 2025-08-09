import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlace } from '../../contexts/PlaceContext';
import GoogleMapsPicker from '../../components/GoogleMapsPicker';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const Places = () => {
  const { 
    places, 
    loading, 
    error, 
    pagination, 
    categories,
    getPlaces, 
    deletePlace, 
    getCategories,
    clearError 
  } = usePlace();

  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadPlaces();
    loadCategories();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const loadPlaces = () => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedStatus) filters.status = selectedStatus;
    getPlaces(filters, currentPage);
  };

  const loadCategories = () => {
    getCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      const result = await deletePlace(id);
      if (result.success) {
        loadPlaces();
      }
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingPlace(null);
    setShowModal(true);
  };

  const getCategoryColor = (category) => {
    const colors = {
      attraction: 'bg-blue-100 text-blue-800',
      restaurant: 'bg-orange-100 text-orange-800',
      hotel: 'bg-purple-100 text-purple-800',
      museum: 'bg-indigo-100 text-indigo-800',
      park: 'bg-green-100 text-green-800',
      beach: 'bg-cyan-100 text-cyan-800',
      mountain: 'bg-gray-100 text-gray-800',
      landmark: 'bg-yellow-100 text-yellow-800',
      religious: 'bg-pink-100 text-pink-800',
      shopping: 'bg-red-100 text-red-800',
      entertainment: 'bg-teal-100 text-teal-800',
      nature: 'bg-emerald-100 text-emerald-800',
      historical: 'bg-amber-100 text-amber-800',
      cultural: 'bg-violet-100 text-violet-800',
      adventure: 'bg-lime-100 text-lime-800',
      other: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearError}
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Places</h1>
        <p className="text-gray-600">Manage places for your travel packages</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Place
          </button>
        </div>
      </div>

      {/* Places Grid or Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No places found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new place.</p>
          <div className="mt-6">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Place
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {places.map((place) => (
              <div key={place._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Place Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                  {place.primaryImage ? (
                    <img
                      src={place.primaryImage.url}
                      alt={place.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {place.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Media Count */}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {place.imageCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                        <PhotoIcon className="h-3 w-3 mr-1" />
                        {place.imageCount}
                      </span>
                    )}
                    {place.videoCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                        <VideoCameraIcon className="h-3 w-3 mr-1" />
                        {place.videoCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Place Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{place.name}</h3>
                    <div className="flex gap-1">
                      <Link
                        to={`/admin/places/${place._id}`}
                        className="text-green-600 hover:text-green-900"
                        title="View place details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(place)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit place"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete place"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {place.shortDescription || place.description}
                  </p>

                  {/* Location */}
                  {place.location && (place.location.city || place.location.country) && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {[place.location.city, place.location.country].filter(Boolean).join(', ')}
                    </div>
                  )}

                  {/* Category and Status */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}>
                      {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(place.status)}`}>
                      {place.status.charAt(0).toUpperCase() + place.status.slice(1)}
                    </span>
                  </div>

                  {/* Tags */}
                  {place.tags && place.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {place.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {tag}
                        </span>
                      ))}
                      {place.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{place.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Place Modal */}
      {showModal && (
        <PlaceModal
          place={editingPlace}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadPlaces();
          }}
        />
      )}
    </div>
  );
};

// Place Modal Component
const PlaceModal = ({ place, categories, onClose, onSuccess }) => {
  const { createPlace, updatePlace, loading } = usePlace();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: 'attraction',
    location: {
      googlePlaceId: '',
      formattedAddress: '',
      coordinates: { latitude: '', longitude: '' },
      country: '',
      region: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      website: ''
    },
    tags: [],
    status: 'active',
    featured: false
  });
  const [files, setFiles] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name || '',
        description: place.description || '',
        shortDescription: place.shortDescription || '',
        category: place.category || 'attraction',
        location: place.location || {
          googlePlaceId: '',
          formattedAddress: '',
          coordinates: { latitude: '', longitude: '' },
          country: '',
          region: '',
          city: '',
          postalCode: '',
          phoneNumber: '',
          website: ''
        },
        tags: place.tags || [],
        status: place.status || 'active',
        featured: place.featured || false
      });
    }
  }, [place]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== PLACE FORM SUBMISSION START ===');
    console.log('Form data:', formData);
    console.log('Files:', files);
    console.log('Is editing place:', !!place);
    console.log('User authentication state from context should be checked...');
    
    // Client-side validation
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
      errors.push('Place name must be at least 2 characters long');
    }
    
    if (!formData.description || formData.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
      console.log('❌ Client-side validation errors:', errors);
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }
    
    console.log('✅ Client-side validation passed');
    
    const placeData = {
      ...formData,
      files: files
    };

    console.log('📤 Final place data to send:', placeData);
    console.log('📤 Location data specifically:', placeData.location);
    console.log('📤 Files attached:', placeData.files?.length || 0);

    const result = place 
      ? await updatePlace(place._id, placeData)
      : await createPlace(placeData);

    console.log('📥 Operation result:', result);

    if (result.success) {
      console.log('✅ Operation successful, calling onSuccess');
      onSuccess();
    } else {
      console.log('❌ Operation failed:', result.error);
      alert(`Failed to ${place ? 'update' : 'create'} place: ${result.error}`);
    }
    console.log('=== PLACE FORM SUBMISSION END ===');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {place ? 'Edit Place' : 'Add New Place'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              
              {/* Google Maps Picker */}
              <GoogleMapsPicker
                selectedLocation={formData.location}
                onLocationSelect={(locationData) => {
                  console.log('=== LOCATION SELECTED IN MODAL ===');
                  console.log('Location data received:', locationData);
                  setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      ...locationData,
                      googlePlaceId: locationData.placeId || prev.location.googlePlaceId
                    }
                  }));
                }}
              />

              {/* Manual Location Fields (for additional details) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.location.country || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, country: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Will be auto-filled from map selection"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.location.city || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Will be auto-filled from map selection"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.location.formattedAddress || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, formattedAddress: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Will be auto-filled from map selection"
                />
              </div>
              
              {/* Additional Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.location.phoneNumber || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, phoneNumber: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.location.website || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, website: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Files */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images & Videos
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select images and videos (up to 50MB each)
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status and Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                  Featured Place
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (place ? 'Update Place' : 'Create Place')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Places; 