import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../contexts/VehicleContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Vehicles = () => {
  const { 
    vehicles, 
    loading, 
    error, 
    pagination, 
    getVehicles, 
    deleteVehicle, 
    clearError 
  } = useVehicle();

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadVehicles();
  }, [currentPage, searchTerm, selectedType]);

  const loadVehicles = () => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedType) filters.type = selectedType;
    getVehicles(filters, currentPage);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const result = await deleteVehicle(id);
      if (result.success) {
        loadVehicles();
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const vehicleTypes = [
    'sedan', 'suv', 'van', 'bus', 'minibus', 'luxury', 'economy', 'sports', 'electric', 'hybrid'
  ];

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'luxury': return 'bg-purple-100 text-purple-800';
      case 'sports': return 'bg-red-100 text-red-800';
      case 'electric': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Vehicle
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Vehicle Image */}
            <div className="relative h-48 bg-gray-200">
              {vehicle.images && vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[0].url}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No Image</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(vehicle.availability)}`}>
                  {vehicle.availability}
                </span>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{vehicle.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(vehicle.type)}`}>
                  {vehicle.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{vehicle.model}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {vehicle.passengerCapacity} passengers
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ${vehicle.price?.amount}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {vehicle.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 text-sm"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 text-sm"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {vehicles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first vehicle.</p>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Vehicle
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Vehicle Modal */}
      {showModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadVehicles();
          }}
        />
      )}
    </div>
  );
};

// Vehicle Modal Component
const VehicleModal = ({ vehicle, onClose, onSuccess }) => {
  const { createVehicle, updateVehicle, loading } = useVehicle();
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    type: 'sedan',
    passengerCapacity: 1,
    description: '',
    features: [],
    price: { amount: 0, currency: 'USD', perDay: true },
    availability: 'available',
    location: { city: '', country: '', address: '' },
    specifications: {
      year: new Date().getFullYear(),
      mileage: 0,
      fuelType: 'gasoline',
      transmission: 'automatic',
      engineSize: '',
      color: ''
    }
  });
  const [images, setImages] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        model: vehicle.model || '',
        type: vehicle.type || 'sedan',
        passengerCapacity: vehicle.passengerCapacity || 1,
        description: vehicle.description || '',
        features: vehicle.features || [],
        price: vehicle.price || { amount: 0, currency: 'USD', perDay: true },
        availability: vehicle.availability || 'available',
        location: vehicle.location || { city: '', country: '', address: '' },
        specifications: vehicle.specifications || {
          year: new Date().getFullYear(),
          mileage: 0,
          fuelType: 'gasoline',
          transmission: 'automatic',
          engineSize: '',
          color: ''
        }
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', JSON.stringify(formData, null, 2));
    console.log('Images:', images);
    console.log('Is editing vehicle:', !!vehicle);
    console.log('Vehicle ID if editing:', vehicle?._id);
    
    // Client-side validation
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
      errors.push('Vehicle name must be at least 2 characters long');
    }
    
    if (!formData.description || formData.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (!formData.location.city || formData.location.city.trim() === '') {
      errors.push('City is required');
    }
    
    if (!formData.location.country || formData.location.country.trim() === '') {
      errors.push('Country is required');
    }
    
    if (!formData.price.amount || formData.price.amount <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }
    
    const vehicleData = {
      ...formData,
      images: images
    };

    console.log('Final vehicle data to send:', JSON.stringify(vehicleData, null, 2));

    const result = vehicle 
      ? await updateVehicle(vehicle._id, vehicleData)
      : await createVehicle(vehicleData);

    console.log('Operation result:', result);

    if (result.success) {
      console.log('Operation successful, calling onSuccess');
      onSuccess();
    } else {
      console.log('Operation failed:', result.error);
    }
    console.log('=== FORM SUBMISSION END ===');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
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
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  required
                  minLength="2"
                  maxLength="100"
                  placeholder="Enter vehicle name (min 2 characters)"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  minLength="1"
                  maxLength="50"
                  placeholder="Enter vehicle model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                  <option value="minibus">Minibus</option>
                  <option value="luxury">Luxury</option>
                  <option value="economy">Economy</option>
                  <option value="sports">Sports</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Capacity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.passengerCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, passengerCapacity: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                minLength="10"
                maxLength="1000"
                rows="3"
                placeholder="Enter vehicle description (min 10 characters)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Amount *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price.amount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, amount: parseFloat(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.price.currency}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, currency: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter city name"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter country name"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, country: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.specifications.year}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, year: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={formData.specifications.fuelType}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, fuelType: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="hydrogen">Hydrogen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={formData.specifications.transmission}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specifications: { ...prev.specifications, transmission: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload up to 10 images (max 5MB each)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (vehicle ? 'Update Vehicle' : 'Create Vehicle')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Vehicles; 