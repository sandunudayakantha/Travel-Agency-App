import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import StarRating from './StarRating';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { markHelpful } = useReview();
  const [showFullComment, setShowFullComment] = useState(false);
  const [showImages, setShowImages] = useState(false);

  // Add null checks to prevent errors
  if (!review || !review.user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="text-center text-gray-500">
          <p>Review data is incomplete or missing.</p>
        </div>
      </div>
    );
  }

  const isOwnReview = user && review.user._id === user._id;
  const isAdmin = user && user.role === 'admin';

  const handleHelpful = async (helpful) => {
    if (!user) {
      alert('Please log in to mark reviews as helpful');
      return;
    }
    await markHelpful(review._id, helpful);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHelpfulCount = () => {
    return review.helpful ? review.helpful.filter(h => h.helpful).length : 0;
  };

  const hasUserMarkedHelpful = () => {
    if (!user || !review.helpful) return false;
    const userMark = review.helpful.find(h => h.user === user._id);
    return userMark ? userMark.helpful : false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={review.user.avatar?.url || 'https://via.placeholder.com/40'}
            alt={review.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <StarRating rating={review.rating} readonly size="sm" />
          <span className="text-sm text-gray-600">{review.rating}/5</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {review.title}
      </h3>

      {/* Comment */}
      <div className="mb-4">
        <p className="text-gray-700">
          {showFullComment 
            ? (review.comment || '')
            : (review.comment && review.comment.length > 200)
              ? `${review.comment.substring(0, 200)}...` 
              : (review.comment || '')
          }
        </p>
        {review.comment && review.comment.length > 200 && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          >
            {showFullComment ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {review.images.slice(0, showImages ? review.images.length : 3).map((image, index) => (
              <img
                key={index}
                src={image?.url || 'https://via.placeholder.com/150'}
                alt={`Review image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80"
                onClick={() => image?.url && window.open(image.url, '_blank')}
              />
            ))}
          </div>
          {review.images.length > 3 && (
            <button
              onClick={() => setShowImages(!showImages)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              {showImages ? 'Show less' : `Show ${review.images.length - 3} more`}
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Helpful button */}
          <button
            onClick={() => handleHelpful(!hasUserMarkedHelpful())}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
              hasUserMarkedHelpful()
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>Helpful ({getHelpfulCount()})</span>
          </button>
        </div>

        {/* Edit/Delete buttons for own reviews or admin */}
        {(isOwnReview || isAdmin) && (
          <div className="flex items-center space-x-2">
            {isOwnReview && (
              <button
                onClick={() => onEdit(review)}
                className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(review._id)}
              className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded border border-red-300 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Verification badge */}
      {review.isVerified && (
        <div className="mt-2 flex items-center space-x-1">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-green-600">Verified Review</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard; 