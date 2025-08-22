import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGallery } from '../../contexts/GalleryContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';
import {
  PlusIcon,
  PhotoIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const AdminGallery = () => {
  const {
    galleryItems,
    categories,
    loading,
    pagination,
    filters,
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    setFilters,
    clearFilters
  } = useGallery();

  const { isAdmin } = useClerkAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    category: 'general',
    youtubeUrl: '',
    tags: [],
    featured: false,
    order: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getGalleryItems(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'image',
      category: 'general',
      youtubeUrl: '',
      tags: [],
      featured: false,
      order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    // Allow image creation without file (will use placeholder)
    // if (formData.type === 'image' && !imageFile && !editingItem) {
    //   alert('Image file is required for image type');
    //   return;
    // }

    if (formData.type === 'video' && !formData.youtubeUrl.trim()) {
      alert('YouTube URL is required for video type');
      return;
    }

    setSubmitting(true);
    try {
      console.log('=== FRONTEND GALLERY SUBMIT DEBUG ===');
      console.log('formData:', formData);
      console.log('imageFile:', imageFile);
      
      const galleryData = {
        ...formData
      };
      
      // Only include tags if it's not empty
      if (formData.tags && Array.isArray(formData.tags) && formData.tags.length > 0) {
        galleryData.tags = formData.tags;
      } else {
        delete galleryData.tags;
      }
      
      // Only include youtubeUrl if type is video and it's not empty
      if (formData.type === 'video' && formData.youtubeUrl && formData.youtubeUrl.trim()) {
        galleryData.youtubeUrl = formData.youtubeUrl.trim();
      } else {
        delete galleryData.youtubeUrl;
      }

      if (imageFile) {
        galleryData.image = imageFile;
      }
      
      console.log('galleryData being sent:', galleryData);

      if (editingItem) {
        await updateGalleryItem(editingItem._id, galleryData);
      } else {
        await createGalleryItem(galleryData);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting gallery item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category,
      youtubeUrl: item.video?.youtubeUrl || '',
      tags: item.tags || [],
      featured: item.featured,
      order: item.order
    });
    if (item.type === 'image' && item.image) {
      setImagePreview(item.image.url);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      await deleteGalleryItem(id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    getGalleryItems(filters, page);
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload images and add YouTube videos to showcase your travel experiences
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Gallery Item
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gallery items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured
                  </label>
                  <select
                    value={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Items</option>
                    <option value="true">Featured Only</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No gallery items found</h3>
            <p className="text-gray-600">Start by adding your first gallery item.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {item.type === 'image' ? (
                      <img
                        src={item.image.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.video.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <PlayIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">
                {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="destinations">Destinations</option>
                    <option value="activities">Activities</option>
                    <option value="events">Events</option>
                    <option value="hotels">Hotels</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                {/* Image Upload */}
                {formData.type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* YouTube URL */}
                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="travel, adventure, nature"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Mark as featured
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
