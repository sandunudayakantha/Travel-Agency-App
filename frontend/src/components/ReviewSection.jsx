import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { useReview } from '../contexts/ReviewContext';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

const ReviewSection = ({ packageId }) => {
  const { user: authUser } = useAuth();
  const { clerkUser, isSignedIn } = useClerkAuthContext();
  const { 
    reviews, 
    stats, 
    pagination, 
    loading, 
    error,
    getPackageReviews, 
    deleteReview 
  } = useReview();
  
  // Use Clerk user if available, otherwise fall back to auth user
  const user = clerkUser || authUser;
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (packageId) {
      getPackageReviews(packageId, currentPage);
    }
  }, [packageId, currentPage]);

  const handleWriteReview = () => {
    if (!user) {
      alert('Please log in to write a review');
      return;
    }
    setShowReviewForm(true);
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        // Refresh reviews
        getPackageReviews(packageId, currentPage);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    // Refresh reviews
    getPackageReviews(packageId, 1);
    setCurrentPage(1);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRatingPercentage = (rating) => {
    if (!stats || stats.numReviews === 0 || !stats.ratingDistribution) return 0;
    return Math.round((stats.ratingDistribution[rating] || 0) / stats.numReviews * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Review Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={handleWriteReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading review statistics...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </div>
              <StarRating rating={Math.round(stats?.averageRating || 0)} readonly size="lg" />
              <p className="text-gray-600 mt-2">
                Based on {stats?.numReviews || 0} review{(stats?.numReviews || 0) !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {stats?.ratingDistribution?.[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6">
          <ReviewForm
            packageId={packageId}
            onSuccess={handleReviewSuccess}
            onCancel={handleCancelReview}
            editReview={editingReview}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to review this package!</p>
          </div>
        )}

        {reviews
          .filter(review => review && review.user) // Filter out reviews without user data
          .map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReviewSection; 