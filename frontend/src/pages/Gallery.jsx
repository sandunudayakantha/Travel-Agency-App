import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGallery } from '../contexts/GalleryContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  PlayIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Gallery = () => {
  const {
    galleryItems,
    categories,
    loading,
    pagination,
    filters,
    getGalleryItems,
    setFilters,
    clearFilters
  } = useGallery();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getGalleryItems(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

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

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handlePageChange = (page) => {
    getGalleryItems(filters, page);
  };

  const renderGalleryItem = (item) => (
    <motion.div
      key={item._id}
      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => handleItemClick(item)}
    >
      {/* Image or Video Thumbnail */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {item.type === 'image' ? (
          <img
            src={item.image.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={item.video.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>

      {/* Overlay with info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {item.category}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {item.type}
            </span>
          </div>
        </div>
      </div>

      {/* Type indicator */}
      <div className="absolute top-3 right-3">
        {item.type === 'image' ? (
          <PhotoIcon className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
        ) : (
          <PlayIcon className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore stunning destinations, exciting activities, and memorable moments from our travel experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gallery..."
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
                {/* Category Filter */}
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

                {/* Type Filter */}
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

                {/* Featured Filter */}
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

                {/* Clear Filters */}
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
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-20">
              <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No gallery items found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryItems.map(renderGalleryItem)}
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
      </section>

      {/* Modal for viewing items */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Media */}
              <div className="mb-6">
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.image.url}
                    alt={selectedItem.title}
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedItem.video.videoId}`}
                      title={selectedItem.title}
                      className="w-full h-96 rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {selectedItem.category}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {selectedItem.type}
                  </span>
                  {selectedItem.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <span>
                  {new Date(selectedItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
