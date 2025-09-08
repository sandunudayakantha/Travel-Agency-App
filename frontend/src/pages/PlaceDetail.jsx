import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlace } from '../contexts/PlaceContext';
import { 
  ArrowLeftIcon,
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
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPlace, loading, error, getPlaceById } = usePlace();
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      startLoading("Loading place details...", 2000);
      loadPlace();
    }
  }, [id, startLoading]);

  // Handle loading states
  useEffect(() => {
    if (loading && !pageLoading) {
      startLoading("Fetching place information...", 1500);
    } else if (!loading && pageLoading) {
      stopLoading();
    }
  }, [loading, pageLoading, startLoading, stopLoading]);

  useEffect(() => {
    if (currentPlace) {
      // Combine images and videos for gallery
      const combinedMedia = [
        ...(currentPlace.images || []).map(img => ({ ...img, type: 'image' })),
        ...(currentPlace.videos || []).map(vid => ({ 
          ...vid, 
          type: 'video'
        }))
      ];
      setAllMedia(combinedMedia);
    }
  }, [currentPlace]);

  const loadPlace = async () => {
    console.log('=== LOADING PUBLIC PLACE DETAIL ===');
    console.log('Place ID:', id);
    await getPlaceById(id);
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
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <TravelLoading 
        message="Loading place details..."
        progress={100}
        size="large"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Place</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentPlace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <MapPinIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Place Not Found</h2>
          <p className="text-gray-600 mb-4">The place you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <div className="text-sm text-gray-500">
              Place Details
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Place Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-96 bg-gray-200">
            {currentPlace.images && currentPlace.images.length > 0 ? (
              <>
                <img
                  src={currentPlace.images[currentImageIndex]?.url}
                  alt={currentPlace.images[currentImageIndex]?.caption || currentPlace.name}
                  className="w-full h-full object-cover"
                />
                {currentPlace.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + currentPlace.images.length) % currentPlace.images.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentPlace.images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {currentPlace.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PhotoIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Place Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentPlace.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{currentPlace.location?.formattedAddress || currentPlace.location?.city || 'Location not specified'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(currentPlace.category)}`}>
                    {currentPlace.category}
                  </span>
                  {currentPlace.rating && (
                    <div className="flex items-center text-yellow-600">
                      <StarIcon className="h-5 w-5 mr-1" />
                      <span className="font-medium">{currentPlace.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {currentPlace.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this place</h3>
                <p className="text-gray-700 leading-relaxed">{currentPlace.description}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPlace.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{currentPlace.phone}</span>
                </div>
              )}
              {currentPlace.website && (
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <a
                    href={currentPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {currentPlace.openingHours && (
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{currentPlace.openingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {allMedia.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery ({allMedia.length} items)</h3>
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

        {/* Location */}
        {currentPlace.location && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Address</span>
              </div>
              <p className="text-gray-700">{currentPlace.location.formattedAddress || 'Address not available'}</p>
              {currentPlace.location.coordinates && (
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">Coordinates:</span> {currentPlace.location.coordinates.lat}, {currentPlace.location.coordinates.lng}
                </div>
              )}
            </div>
          </div>
        )}
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
                  alt={selectedMedia.caption || currentPlace.name}
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
    </>
  );
};

export default PlaceDetail;
