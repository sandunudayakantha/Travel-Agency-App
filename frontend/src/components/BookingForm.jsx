import React, { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';

const BookingForm = ({ packageName, onClose, onSuccess }) => {
  const { createBooking, loading } = useBooking();
  
  const [formData, setFormData] = useState({
    packageName: packageName || '',
    userName: '',
    userEmail: '',
    startDate: '',
    phoneNumber: '',
    extraNotes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow numbers and some special characters
    if (name === 'phoneNumber') {
      // Allow only numbers, spaces, dashes, parentheses, and plus sign
      const phoneRegex = /^[\d\s\-\(\)\+]*$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if invalid character
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'Name must be at least 2 characters';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.startDate = 'Start date must be in the future';
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.extraNotes && formData.extraNotes.length > 1000) {
      newErrors.extraNotes = 'Notes cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await createBooking(formData);
    
    if (result.success) {
      // Reset form
      setFormData({
        packageName: packageName || '',
        userName: '',
        userEmail: '',
        startDate: '',
        phoneNumber: '',
        extraNotes: ''
      });
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result.booking);
      }
      
      // Close modal
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book This Package</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Name
              </label>
              <input
                type="text"
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>

            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
              )}
            </div>

            {/* User Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.userEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.userEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9\s\-\(\)\+]*"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number (e.g., +1 234 567 8900)"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Extra Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="extraNotes"
                value={formData.extraNotes}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.extraNotes ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Any special requirements or requests..."
              />
              {errors.extraNotes && (
                <p className="text-red-500 text-sm mt-1">{errors.extraNotes}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.extraNotes.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating Booking...' : 'Book This Package'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              By booking this package, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
