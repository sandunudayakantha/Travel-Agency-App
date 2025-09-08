import React, { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const Bookings = () => {
  const { 
    bookings, 
    loading, 
    error, 
    pagination, 
    getBookings, 
    getBooking 
  } = useBooking();
  
  const { clerkUser: user, loading: authLoading } = useClerkAuthContext();
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      startLoading("Loading your bookings...", 1500);
      getBookings();
    }
  }, [user, authLoading, startLoading, getBookings]);

  // Handle loading states
  useEffect(() => {
    if (loading && !pageLoading) {
      startLoading("Fetching booking details...", 1000);
    } else if (!loading && pageLoading) {
      stopLoading();
    }
  }, [loading, pageLoading, startLoading, stopLoading]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      reviewed: { color: 'bg-blue-100 text-blue-800', label: 'Reviewed' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = async (bookingId) => {
    const result = await getBooking(bookingId);
    if (result.success) {
      setSelectedBooking(result.booking);
      setShowDetails(true);
    }
  };

  if (authLoading) {
    return (
      <TravelLoading 
        message="Authenticating user..."
        progress={100}
        size="medium"
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            View Your Bookings
          </h3>
          <p className="text-gray-600 mb-6">
            Log in to view and manage your travel bookings.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Log In
            </a>
            <a
              href="/packages"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Browse Packages
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading && bookings.length === 0) {
    return (
      <TravelLoading 
        message="Loading your bookings..."
        progress={100}
        size="medium"
      />
    );
  }

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="medium"
        />
      )}
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and track your travel bookings
          </p>
        </div>

        {/* Bookings Grid */}
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Package Name */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {booking.packageName}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Start Date: {formatDate(booking.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Booked on: {formatDate(booking.createdAt)}</span>
                    </div>

                    {booking.reviewedAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Reviewed on: {formatDate(booking.reviewedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewDetails(booking._id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring our packages and book your next adventure!
            </p>
            <a
              href="/packages"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Browse Packages
            </a>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => getBookings({}, pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => getBookings({}, pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Package Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedBooking.packageName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedBooking.startDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedBooking.userEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{selectedBooking.phoneNumber}</p>
                    </div>
                    {selectedBooking.reviewedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed On</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedBooking.reviewedAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Extra Notes */}
                  {selectedBooking.extraNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Notes</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedBooking.extraNotes}
                      </p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {selectedBooking.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                      <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                        {selectedBooking.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Status Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Booking Status Information</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Pending:</strong> Your booking is being reviewed by our team</p>
                      <p><strong>Reviewed:</strong> Your booking has been reviewed and is being processed</p>
                      <p><strong>Confirmed:</strong> Your booking is confirmed and ready for travel</p>
                      <p><strong>Cancelled:</strong> Your booking has been cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Bookings; 