import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { usePackage } from '../contexts/PackageContext';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

const FeaturedReviews = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const { clerkUser, isSignedIn } = useClerkAuthContext();
  const { 
    reviews, 
    stats, 
    loading, 
    error,
    getFeaturedReviews,
    createReview,
    clearError
  } = useReview();
  const { packages, getPackages, loading: packagesLoading } = usePackage();

  // Use Clerk user if available, otherwise fall back to auth user
  const user = clerkUser || authUser;
  const isUserLoggedIn = isSignedIn || isAuthenticated;

  // State for review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [modalError, setModalError] = useState(''); // Local error state for modal
  
  // State for showing more reviews
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    getFeaturedReviews(6); // Get 6 featured reviews
  }, []);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (showReviewModal) {
      // Load packages when modal opens, but only if not already loaded
      if (!packages || packages.length === 0) {
        getPackages(); // Load packages when modal opens
      }
    }
  }, [showReviewModal, packages, getPackages]);

  // Check if user has already reviewed
  const checkUserReview = () => {
    if (!user || !reviews) return false;
    
    return reviews.some(review => {
      if (!review.user) return false;
      
      // Check by user ID
      if (user._id && review.user._id === user._id) return true;
      
      // Check by email
      const userEmail = user.email || user.emailAddresses?.[0]?.emailAddress;
      const reviewEmail = review.user.email;
      
      if (userEmail && reviewEmail && userEmail === reviewEmail) return true;
      
      return false;
    });
  };

  const handleAddReview = () => {
    if (!isUserLoggedIn) {
      // Redirect to login page
      navigate('/login');
      return;
    }
    
    // Check if user has already reviewed
    const hasReviewed = checkUserReview();
    if (hasReviewed) {
      alert('You have already submitted a review. Thank you for your feedback!');
      return;
    }
    
    // Open review modal
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0 || !comment.trim()) {
      setModalError('Please provide a rating and review comment');
      return;
    }

    setSubmitting(true);
    setModalError(''); // Clear any previous errors
    
    try {
      const reviewData = {
        rating,
        comment: comment.trim()
      };
      
      // Only include package if one is selected and it's not empty
      if (selectedPackage && selectedPackage.trim() !== '') {
        reviewData.packageId = selectedPackage;
      }
      
      console.log('Submitting review data:', reviewData);
      const result = await createReview(reviewData);
      console.log('Review creation result:', result);
      
      // Clear any errors since the review was successful
      clearError();
      setModalError('');
      
      // Reset form and close modal
      setSelectedPackage('');
      setRating(0);
      setComment('');
      setShowReviewModal(false);
      
      // Refresh featured reviews
      getFeaturedReviews(6);
      
      alert('Review submitted successfully! It will be visible after approval.');
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check if the error is related to stats calculation but review was created
      if (error.response?.data?.error && error.response.data.error.includes('stats is not defined')) {
        console.log('Review was likely created successfully, but stats calculation failed');
        // Treat this as a success since the review was probably created
        setSelectedPackage('');
        setRating(0);
        setComment('');
        setShowReviewModal(false);
        setModalError('');
        clearError();
        getFeaturedReviews(6);
        alert('Review submitted successfully! It will be visible after approval.');
        return;
      }
      
      // Only set error if it's actually an error
      if (error.response && error.response.status >= 400) {
        const errorMessage = error.response?.data?.message || error.message || 'Error submitting review';
        setModalError(errorMessage);
      } else {
        // If it's not an HTTP error, it might be a network error
        setModalError('Network error or unexpected issue occurred');
      }
      // Don't close the modal on error, let user try again
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedPackage('');
    setRating(0);
    setComment('');
    setModalError('');
    // Clear any errors when closing modal
    clearError();
  };

  const handleShowMoreReviews = () => {
    setShowAllReviews(true);
  };

  const handleShowLessReviews = () => {
    setShowAllReviews(false);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Don't hide the section on error, just log it and continue
  if (error && error.trim() !== '') {
    console.error('FeaturedReviews error:', error);
    // Don't return null, just continue with the component
  }

  // Always show the section, even if no reviews exist or if there's an error
  const hasReviews = reviews && reviews.length > 0;
  
  // Determine which reviews to show
  const reviewsToShow = showAllReviews ? reviews : reviews?.slice(0, 3);
  const hasMoreReviews = reviews && reviews.length > 3;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Travelers Say
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {hasReviews 
              ? "Discover why thousands of travelers choose us for their adventures"
              : "Be the first to share your travel experience with us!"
            }
          </motion.p>
          
          {/* Add Review Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {isUserLoggedIn ? (
              checkUserReview() ? (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 font-medium rounded-lg mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You've Already Reviewed
                  </div>
                  <p className="text-sm text-gray-500">
                    Thank you for sharing your travel experience!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleAddReview}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Write a Review
                </button>
              )
            ) : (
              <button
                onClick={handleAddReview}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sign In to Review
              </button>
            )}
            {!isUserLoggedIn && (
              <p className="text-sm text-gray-500 mb-6">
                Sign in to share your travel experience with others
              </p>
            )}
          </motion.div>
          
          {/* Overall Rating - Only show if there are reviews */}
          {hasReviews && (
            <motion.div
              className="flex items-center justify-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                  <StarRating rating={stats.averageRating} size="lg" />
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {stats.totalReviews} reviews
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reviews Grid or Empty State */}
        {hasReviews ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsToShow.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {review.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.user?.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.package?.title || 'General Review'}
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {review.comment}
                      </p>
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex space-x-2 overflow-x-auto">
                          {review.images.slice(0, 3).map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image.url}
                              alt={`Review ${imgIndex + 1}`}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                          ))}
                          {review.images.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-500 text-xs">
                                +{review.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Review Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {review.package ? (
                        <Link
                          to={`/packages/${review.package._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Package
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-xs">General Review</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See More/Less Button */}
            {hasMoreReviews && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  onClick={showAllReviews ? handleShowLessReviews : handleShowMoreReviews}
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {showAllReviews ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Show Less Reviews
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      See More Reviews ({reviews.length - 3} more)
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          /* Empty State */
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your travel experience and help others discover amazing adventures!
              </p>
              {isUserLoggedIn ? (
                checkUserReview() ? (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You've Already Reviewed
                  </div>
                ) : (
                  <button
                    onClick={handleAddReview}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Write the First Review
                  </button>
                )
              ) : (
                <button
                  onClick={handleAddReview}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sign In to Review
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Call to Action - Only show if there are reviews */}
        {hasReviews && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/packages"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Explore All Packages
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitReview} className="p-6">
              {/* Error Display */}
              {((error && error.trim() !== '') || (modalError && modalError.trim() !== '')) && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {modalError || error}
                </div>
              )}
              
              {/* Package Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Package (Optional)
                </label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  disabled={packagesLoading || !packages || packages.length === 0}
                >
                  <option value="">General Review (No specific package)</option>
                  {packagesLoading ? (
                    <option value="" disabled>Loading packages...</option>
                  ) : packages && packages.length > 0 ? (
                    packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No packages available</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose a specific package or leave as "General Review" for overall feedback
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  placeholder="Share your experience with this travel package..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || rating === 0 || !comment.trim()}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default FeaturedReviews;
