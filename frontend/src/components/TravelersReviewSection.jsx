import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Badge } from './ui/badge.jsx';
import { Separator } from './ui/separator.jsx';
import { Star, Camera, MapPin, Calendar, ThumbsUp, MessageSquare, User, LogIn, X } from 'lucide-react';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { usePackage } from '../contexts/PackageContext';

const TravelersReviewSection = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const { clerkUser, isSignedIn } = useClerkAuthContext();
  const { reviews, stats, loading, error, getFeaturedReviews, createReview, clearError } = useReview();
  const { packages, getPackages, loading: packagesLoading } = usePackage();

  const user = clerkUser || authUser;
  const isUserLoggedIn = isSignedIn || isAuthenticated;

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    location: '',
    packageId: ''
  });

  useEffect(() => {
    getFeaturedReviews(6);
    getPackages();
  }, [getFeaturedReviews, getPackages]);

  const renderStars = (rating, size = "h-4 w-4") => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  const hasReviews = reviews && reviews.length > 0;
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);
  const hasMoreReviews = reviews && reviews.length > 3;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Traveler's Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover what fellow travelers say about their Sri Lankan adventures
          </p>
          
          {/* Review Stats */}
          {hasReviews && (
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(5, "h-5 w-5")}
                </div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stats.totalReviews}</div>
                <div className="text-sm text-gray-500">Total Reviews</div>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">Recommend</div>
              </div>
            </div>
          )}

          {/* See More Button */}
          {hasReviews && hasMoreReviews && !showAllReviews && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setShowAllReviews(true)}
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 px-8 py-3"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                See All {reviews.length} Reviews
              </Button>
            </div>
          )}

          {/* Show Less Button */}
          {hasReviews && hasMoreReviews && showAllReviews && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setShowAllReviews(false)}
                variant="outline"
                size="lg"
                className="border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 px-8 py-3"
              >
                Show Less Reviews
              </Button>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review, index) => (
                              <Card key={review._id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {renderStars(review.rating, "h-4 w-4")}
                        <div className="text-xs text-gray-500 mt-1">
                          {review.rating}/5
                        </div>
                      </div>
                    </div>
                    
                    {review.package && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                        <MapPin className="h-3 w-3" />
                        <span>{review.package.title}</span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {review.title && (
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {review.title}
                      </h3>
                    )}
                    
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-4">
                      {review.comment}
                    </p>
                    
                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>Reply</span>
                        </button>
                      </div>
                      
                      {review.package && (
                        <Link 
                          to={`/packages/${review.package._id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                        >
                          View Package →
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        ) : (
                      /* Empty State */
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Reviews Yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Be the first to share your travel experience and help others discover amazing adventures!
                </p>
                {isUserLoggedIn ? (
                  <Button 
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Write First Review
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Login to Review
                  </Button>
                )}
              </div>
            </div>
        )}

        {/* Action Buttons */}
        {hasReviews && (
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Link to="/packages">
                  <MapPin className="h-5 w-5 mr-2" />
                  Explore All Packages
                </Link>
              </Button>
              
              {isUserLoggedIn && (
                <Button 
                  size="lg" 
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Share Your Experience
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              Join {stats.totalReviews}+ travelers who have shared their experiences
            </p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 0, title: '', comment: '', location: '', packageId: '' });
                    setModalError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{modalError}</p>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setModalError('');

                try {
                  const formData = new FormData();
                  formData.append('rating', newReview.rating);
                  formData.append('title', newReview.title);
                  formData.append('comment', newReview.comment);
                  if (newReview.packageId) {
                    formData.append('packageId', newReview.packageId);
                  }

                  const result = await createReview(formData);
                  if (result.success) {
                    setShowReviewForm(false);
                    setNewReview({ rating: 0, title: '', comment: '', location: '', packageId: '' });
                    // Refresh reviews
                    getFeaturedReviews(6);
                  } else {
                    setModalError(result.error || 'Failed to submit review');
                  }
                } catch (error) {
                  setModalError('An error occurred while submitting your review');
                } finally {
                  setSubmitting(false);
                }
              }}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="text-3xl hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`${
                            star <= newReview.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {newReview.rating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      You rated this {newReview.rating} out of 5 stars
                    </p>
                  )}
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newReview.title.length}/100 characters
                  </p>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your detailed experience..."
                    rows={4}
                    maxLength={1000}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newReview.comment.length}/1000 characters
                  </p>
                </div>

                {/* Package Selection (Optional) */}
                <div className="mb-6">
                  <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 mb-2">
                    Package (Optional)
                  </label>
                  <select
                    id="packageId"
                    value={newReview.packageId}
                    onChange={(e) => setNewReview(prev => ({ ...prev, packageId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a package (optional)</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setNewReview({ rating: 0, title: '', comment: '', location: '', packageId: '' });
                      setModalError('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !newReview.rating || !newReview.comment.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TravelersReviewSection;
