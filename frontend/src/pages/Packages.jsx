import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  StarIcon, 
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { usePackage } from '../contexts/PackageContext';
import { useTourType } from '../contexts/TourTypeContext';
import StarRating from '../components/StarRating';

const Packages = () => {
  const { packages, loading, error, getPackages, pagination } = usePackage();
  const { tourTypes, getTourTypes, loading: tourTypesLoading } = useTourType();
  const [selectedTourType, setSelectedTourType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch tour types and initial packages on component mount
    getTourTypes({ status: 'active' });
    getPackages({}, 1);
  }, [getTourTypes, getPackages]);

  useEffect(() => {
    // Fetch packages based on selected tour type (skip initial load)
    if (currentPage > 1 || selectedTourType) {
      const filters = {};
      if (selectedTourType) {
        filters.tourType = selectedTourType;
      }
      getPackages(filters, currentPage);
    }
  }, [selectedTourType, currentPage, getPackages]);

  const handleTourTypeClick = (tourTypeId) => {
    setSelectedTourType(tourTypeId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleClearFilter = () => {
    setSelectedTourType(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const selectedTourTypeData = tourTypes.find(type => type._id === selectedTourType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Packages
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing destinations and adventures
          </p>
        </div>

        {/* Tour Type Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Browse by Category
          </h2>
          
          {tourTypesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* All Packages Option */}
              <motion.button
                onClick={handleClearFilter}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  !selectedTourType
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="font-medium">All Packages</div>
                </div>
              </motion.button>

              {/* Tour Type Categories */}
              {tourTypes.map((tourType, index) => (
                <motion.button
                  key={tourType._id}
                  onClick={() => handleTourTypeClick(tourType._id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedTourType === tourType._id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {tourType.image?.url ? (
                        <img 
                          src={tourType.image.url} 
                          alt={tourType.name}
                          className="w-8 h-8 mx-auto rounded-full object-cover"
                        />
                      ) : (
                        '🏔️'
                      )}
                    </div>
                    <div className="font-medium text-sm">{tourType.name}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category Info */}
        {selectedTourType && selectedTourTypeData && (
          <motion.div 
            className="mb-8 p-4 bg-primary-50 rounded-lg border border-primary-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary-800">
                  {selectedTourTypeData.name}
                </h3>
                {selectedTourTypeData.description && (
                  <p className="text-primary-600 mt-1">
                    {selectedTourTypeData.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleClearFilter}
                className="text-primary-600 hover:text-primary-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Packages Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
                onClick={() => getPackages({}, 1)}
                className="btn-primary inline-flex items-center"
              >
                Try Again
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          ) : packages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    className="bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Package Image */}
                    <div className="relative h-48 overflow-hidden">
                      {pkg.image?.url ? (
                        <img
                          src={pkg.image.url}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                          <span className="text-white text-4xl">🏔️</span>
                        </div>
                      )}
                      {pkg.featured && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {formatPrice(pkg.price)}
                      </div>
                    </div>

                    {/* Package Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                          {pkg.tourType?.name || 'Adventure'}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {pkg.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <StarRating rating={pkg.averageRating || 0} readonly size="sm" />
                        <span className="text-sm text-gray-600 ml-2">
                          {pkg.averageRating ? pkg.averageRating.toFixed(1) : '0.0'} 
                          {pkg.numReviews > 0 && ` (${pkg.numReviews} review${pkg.numReviews !== 1 ? 's' : ''})`}
                        </span>
                      </div>

                      {/* Package Details */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {pkg.days} days, {pkg.nights} nights
                        </div>
                        {pkg.itinerary?.[0]?.places?.[0] && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {pkg.itinerary[0].places[0].name}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/packages/${pkg._id}`}
                        className="btn-primary w-full text-center group-hover:bg-primary-700 transition-colors"
                      >
                        Explore Package
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === page
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedTourType ? 'No Packages Found' : 'No Packages Available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedTourType 
                  ? `No packages found for this category. Try selecting a different category or browse all packages.`
                  : 'Check back soon for our latest travel packages!'
                }
              </p>
              {selectedTourType && (
                <button
                  onClick={handleClearFilter}
                  className="btn-primary inline-flex items-center"
                >
                  View All Packages
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages; 