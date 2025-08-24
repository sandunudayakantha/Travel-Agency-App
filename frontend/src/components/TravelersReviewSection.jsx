import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Badge } from './ui/badge.jsx';
import { Separator } from './ui/separator.jsx';
import { Star, Camera, MapPin, Calendar, ThumbsUp, MessageSquare, User, LogIn } from 'lucide-react';
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

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    location: '',
    packageId: ''
  });

  useEffect(() => {
    getFeaturedReviews(6);
  }, [getFeaturedReviews]);

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
        </div>

        {/* Reviews Grid */}
        {hasReviews ? (
          <div className="space-y-8">
            {reviews.map((review, index) => (
              <Card key={review._id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
                        <AvatarFallback>
                          {review.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Verified Traveler
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{review.package?.title || 'General Review'}</span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {renderStars(review.rating, "h-5 w-5")}
                      <div className="text-sm text-gray-500 mt-1">
                        {review.rating}/5 stars
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {review.title && (
                    <h3 className="text-lg font-semibold mb-3">{review.title}</h3>
                  )}
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {review.comment}
                  </p>
                  
                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful (0)</span>
                    </button>
                    
                    {review.package && (
                      <Link 
                        to={`/packages/${review.package._id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View Package
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your travel experience and help others discover amazing adventures!
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {hasReviews && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/packages">
                Explore All Packages
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelersReviewSection;
