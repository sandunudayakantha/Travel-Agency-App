import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePlace } from '../../contexts/PlaceContext';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  TagIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlayIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPlace, loading, error, getPlaceById, deletePlace, clearError } = usePlace();
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState([]);

  useEffect(() => {
    if (id) {
      loadPlace();
    }
  }, [id]);

  useEffect(() => {
    if (currentPlace) {
      // Combine images and videos for gallery
      const combinedMedia = [
        ...(currentPlace.images || []).map(img => ({ ...img, type: 'image' })),
        ...(currentPlace.videos || []).map(vid => ({ ...vid, type: 'video' }))
      ];
      setAllMedia(combinedMedia);
    }
  }, [currentPlace]);

  const loadPlace = async () => {
    console.log('=== LOADING PLACE DETAIL ===');
    console.log('Place ID:', id);
    await getPlaceById(id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this place? This action cannot be undone.')) {
      const result = await deletePlace(id);
      if (result.success) {
        navigate('/admin/places');
      }
    }
  };

  const openMediaModal = (media, index) => {
    setSelectedMedia(media);
    setMediaType(media.type);
    setCurrentMediaIndex(index);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setMediaType(null);
    setCurrentMediaIndex(0);
  };

  const navigateMedia = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentMediaIndex + 1) % allMedia.length
      : (currentMediaIndex - 1 + allMedia.length) % allMedia.length;
    
    setCurrentMediaIndex(newIndex);
    setSelectedMedia(allMedia[newIndex]);
    setMediaType(allMedia[newIndex].type);
  };

  const getCategoryColor = (category) => {
    const colors = {
      attraction: 'bg-blue-100 text-blue-800 border-blue-200',
      restaurant: 'bg-orange-100 text-orange-800 border-orange-200',
      hotel: 'bg-purple-100 text-purple-800 border-purple-200',
      museum: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      park: 'bg-green-100 text-green-800 border-green-200',
      beach: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      mountain: 'bg-gray-100 text-gray-800 border-gray-200',
      landmark: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      religious: 'bg-pink-100 text-pink-800 border-pink-200',
      shopping: 'bg-red-100 text-red-800 border-red-200',
      entertainment: 'bg-teal-100 text-teal-800 border-teal-200',
      nature: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      historical: 'bg-amber-100 text-amber-800 border-amber-200',
      cultural: 'bg-violet-100 text-violet-800 border-violet-200',
      adventure: 'bg-lime-100 text-lime-800 border-lime-200',
      other: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRating = (rating) => {
    if (!rating) return 'Not rated';
    return `${rating}/5`;
  };

  const formatPriceLevel = (priceLevel) => {
    if (priceLevel === null || priceLevel === undefined) return 'Unknown';
    return '$'.repeat(priceLevel + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error Loading Place</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={clearError}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/admin/places"
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Back to Places
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Place not found</h3>
          <p className="mt-1 text-sm text-gray-500">The place you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              to="/admin/places"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
              Back to Places
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/admin/places"
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPlace.name}</h1>
                <p className="text-sm text-gray-500">Place Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/admin/places/${currentPlace._id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {currentPlace.primaryImage && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={currentPlace.primaryImage.url}
                    alt={currentPlace.name}
                    className="w-full h-64 sm:h-80 object-cover cursor-pointer"
                    onClick={() => openMediaModal(currentPlace.primaryImage, 0)}
                  />
                </div>
                {currentPlace.primaryImage.caption && (
                  <div className="p-4">
                    <p className="text-sm text-gray-600">{currentPlace.primaryImage.caption}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{currentPlace.description}</p>
                {currentPlace.shortDescription && currentPlace.shortDescription !== currentPlace.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Short Description</h4>
                    <p className="text-blue-800 text-sm">{currentPlace.shortDescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Media Gallery */}
            {allMedia.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Media Gallery ({allMedia.length} items)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allMedia.map((media, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openMediaModal(media, index)}
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.caption || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {media.thumbnail ? (
                            <img
                              src={media.thumbnail.url}
                              alt={media.title || `Video ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <VideoCameraIcon className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <PlayIcon className="h-8 w-8 text-white" />
                          </div>
                          {media.duration && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                              {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                            </div>
                          )}
                        </div>
                      )}
                      {media.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Primary
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            {currentPlace.location && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Location Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {currentPlace.location.formattedAddress && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <p className="text-gray-900">{currentPlace.location.formattedAddress}</p>
                      </div>
                    )}
                    {(currentPlace.location.city || currentPlace.location.country) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <p className="text-gray-900">
                          {[currentPlace.location.city, currentPlace.location.region, currentPlace.location.country]
                            .filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                    {currentPlace.location.postalCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <p className="text-gray-900">{currentPlace.location.postalCode}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {currentPlace.location.coordinates && (currentPlace.location.coordinates.latitude || currentPlace.location.coordinates.longitude) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                        <p className="text-gray-900 font-mono text-sm">
                          {currentPlace.location.coordinates.latitude}, {currentPlace.location.coordinates.longitude}
                        </p>
                      </div>
                    )}
                    {currentPlace.location.phoneNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <a href={`tel:${currentPlace.location.phoneNumber}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {currentPlace.location.phoneNumber}
                        </a>
                      </div>
                    )}
                    {currentPlace.location.website && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <a 
                          href={currentPlace.location.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <GlobeAltIcon className="h-4 w-4 mr-1" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                {currentPlace.location.openingHours && currentPlace.location.openingHours.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                      Opening Hours
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentPlace.location.openingHours.map((hours, index) => (
                        <div key={index} className="flex justify-between py-1">
                          <span className="font-medium text-gray-700">{hours.day}</span>
                          <span className="text-gray-900">{hours.open} - {hours.close}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Places Info */}
                {(currentPlace.location.rating || currentPlace.location.priceLevel !== null) && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Google Places Data</h3>
                    <div className="flex flex-wrap gap-4">
                      {currentPlace.location.rating && (
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="text-gray-900 font-medium">{formatRating(currentPlace.location.rating)}</span>
                        </div>
                      )}
                      {currentPlace.location.priceLevel !== null && currentPlace.location.priceLevel !== undefined && (
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-1">Price Level:</span>
                          <span className="text-gray-900 font-medium">{formatPriceLevel(currentPlace.location.priceLevel)}</span>
                        </div>
                      )}
                    </div>
                    {currentPlace.location.placeTypes && currentPlace.location.placeTypes.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-700 text-sm">Place Types: </span>
                        <span className="text-gray-900 text-sm">{currentPlace.location.placeTypes.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(currentPlace.category)}`}>
                    {currentPlace.category.charAt(0).toUpperCase() + currentPlace.category.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentPlace.status)}`}>
                    {currentPlace.status.charAt(0).toUpperCase() + currentPlace.status.slice(1)}
                  </span>
                </div>
                {currentPlace.featured && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Featured</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Yes
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Images</span>
                  <span className="font-medium text-gray-900">{currentPlace.imageCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Videos</span>
                  <span className="font-medium text-gray-900">{currentPlace.videoCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {currentPlace.tags && currentPlace.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPlace.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Created: {new Date(currentPlace.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Updated: {new Date(currentPlace.updatedAt).toLocaleDateString()}</span>
                </div>
                {currentPlace.createdBy && (
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Created by: {currentPlace.createdBy.name || currentPlace.createdBy.email || 'Admin'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeMediaModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {allMedia.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeftIcon className="h-10 w-10" />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRightIcon className="h-10 w-10" />
                </button>
              </>
            )}

            <div className="max-w-7xl max-h-full flex items-center justify-center">
              {mediaType === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.caption || 'Place image'}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="max-w-full max-h-full"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {(selectedMedia.caption || selectedMedia.title) && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                  {selectedMedia.caption || selectedMedia.title}
                </p>
              </div>
            )}

            {allMedia.length > 1 && (
              <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm">
                {currentMediaIndex + 1} / {allMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetail; 