import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useReview } from '../../contexts/ReviewContext';
import StarRating from '../../components/StarRating';

const Reviews = () => {
  const { 
    reviews, 
    loading, 
    error, 
    getAllReviews,
    deleteReview,
    toggleApproval 
  } = useReview();
  
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    console.log('Admin Reviews: Fetching reviews with params:', { currentPage, selectedStatus });
    getAllReviews(currentPage, 10, '-createdAt', selectedStatus);
  }, [currentPage, selectedStatus]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleToggleApproval = async (reviewId) => {
    try {
      await toggleApproval(reviewId);
      // Refresh the reviews list
      getAllReviews(currentPage, 10, '-createdAt', selectedStatus);
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isApproved) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isApproved 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isApproved ? 'Approved' : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => getAllReviews(currentPage, 10, '-createdAt', selectedStatus)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
          <p className="text-gray-600">Manage and moderate customer reviews</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={review.user?.avatar?.url || 'https://via.placeholder.com/32'}
                          alt={review.user?.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.package?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(review.isApproved)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewReview(review)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleApproval(review._id)}
                          className={`${
                            review.isApproved 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {review.isApproved ? (
                            <XMarkIcon className="h-4 w-4" />
                          ) : (
                            <CheckIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews found</p>
              <p className="text-sm text-gray-400 mt-2">Debug: reviews array length is {reviews.length}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {reviews.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedReview.user?.avatar?.url || 'https://via.placeholder.com/48'}
                    alt={selectedReview.user?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedReview.user?.name}</h4>
                    <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
                  </div>
                </div>

                {/* Package Info */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-1">Package</h5>
                  <p className="text-sm text-gray-600">{selectedReview.package?.title}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <StarRating rating={selectedReview.rating} readonly size="lg" />
                  <span className="text-lg text-gray-600">{selectedReview.rating}/5</span>
                </div>

                {/* Title */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Title</h5>
                  <p className="text-gray-700">{selectedReview.title}</p>
                </div>

                {/* Comment */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Comment</h5>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>

                {/* Images */}
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Images</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedReview.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="text-sm text-gray-500">
                  <p>Created: {formatDate(selectedReview.createdAt)}</p>
                  <p>Status: {selectedReview.isApproved ? 'Approved' : 'Pending'}</p>
                  <p>Helpful votes: {selectedReview.helpful?.filter(h => h.helpful).length || 0}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews; 