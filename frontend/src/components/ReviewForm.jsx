import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { useReview } from '../contexts/ReviewContext';
import StarRating from './StarRating';

const ReviewForm = ({ packageId, onSuccess, onCancel, editReview = null }) => {
  const { user: authUser } = useAuth();
  const { clerkUser } = useClerkAuthContext();
  const { createReview, updateReview, loading, error, clearError } = useReview();
  
  // Use Clerk user if available, otherwise fall back to auth user
  const user = clerkUser || authUser;
  
  const [formData, setFormData] = useState({
    rating: editReview?.rating || 0,
    title: editReview?.title || '',
    comment: editReview?.comment || '',
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(editReview?.images || []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, { url: e.target.result, isNew: true }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('ReviewForm: Form submitted');
    console.log('ReviewForm: User:', user);
    console.log('ReviewForm: Form data:', formData);
    console.log('ReviewForm: Image files:', imageFiles);
    
    if (!formData.rating) {
      alert('Please select a rating');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a review title');
      return;
    }

    if (!formData.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    try {
      const reviewData = {
        ...formData,
        images: imageFiles
      };

      console.log('ReviewForm: Sending review data:', reviewData);

      if (editReview) {
        await updateReview(editReview._id, reviewData);
      } else {
        await createReview({ ...reviewData, packageId });
      }

      onSuccess();
    } catch (error) {
      console.error('ReviewForm: Error submitting review:', error);
    }
  };

  const handleCancel = () => {
    clearError();
    onCancel();
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Please log in to write a review.
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          Debug: User state is null. Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">
        {editReview ? 'Edit Review' : 'Write a Review'}
      </h3>
      
      {/* Debug information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          Debug: Logged in as {user.name} ({user.email}) - Role: {user.role}
        </p>
        <p className="text-sm text-blue-700">
          Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/debug-auth`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              const data = await response.json();
              console.log('Auth test response:', data);
              alert('Auth test: ' + JSON.stringify(data, null, 2));
            } catch (error) {
              console.error('Auth test error:', error);
              alert('Auth test error: ' + error.message);
            }
          }}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Test Authentication
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const formData = new FormData();
              formData.append('packageId', packageId);
              formData.append('rating', '5');
              formData.append('title', 'Test Review from Frontend');
              formData.append('comment', 'This is a test review from the frontend debug button.');
              
              const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
              });
              const data = await response.json();
              console.log('Review creation test response:', data);
              alert('Review creation test: ' + JSON.stringify(data, null, 2));
            } catch (error) {
              console.error('Review creation test error:', error);
              alert('Review creation test error: ' + error.message);
            }
          }}
          className="mt-2 ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          Test Review Creation
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            size="lg"
          />
          {formData.rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You rated this {formData.rating} out of 5 stars
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Summarize your experience"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your detailed experience..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={imageFiles.length >= 5}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum 5 images, 5MB each
          </p>

          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {imagePreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : (editReview ? 'Update Review' : 'Submit Review')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 