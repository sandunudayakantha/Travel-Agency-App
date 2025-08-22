import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useCustomInquiry } from '../../contexts/CustomInquiryContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';
import axios from 'axios';

const CustomInquiries = () => {
  const { 
    inquiries, 
    loading, 
    error, 
    getInquiries, 
    updateInquiryStatus, 
    addQuoteToInquiry, 
    deleteInquiry 
  } = useCustomInquiry();
  
  const { clerkUser, isSignedIn, loading: authLoading } = useClerkAuthContext();
  
  // Check if user is admin
  const isAdmin = () => {
    return clerkUser?.role === 'admin';
  };
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    finalPrice: '',
    validUntil: '',
    terms: ''
  });

  useEffect(() => {
    // Only fetch inquiries if user is authenticated, is admin, and auth is not loading
    if (!authLoading && isSignedIn && isAdmin()) {
      const filters = {};
      if (selectedStatus) {
        filters.status = selectedStatus;
      }
      
      getInquiries(filters, currentPage);
    }
  }, [selectedStatus, currentPage, isSignedIn, authLoading]); // Removed getInquiries and isAdmin from dependencies



  const handleStatusChange = async (inquiryId, newStatus, adminNotes = '') => {
    const result = await updateInquiryStatus(inquiryId, newStatus, adminNotes);
    if (result.success) {
      // Refresh the list
      const filters = {};
      if (selectedStatus) {
        filters.status = selectedStatus;
      }
      getInquiries(filters, currentPage);
    }
  };

  const handleAddQuote = async () => {
    if (!selectedInquiry) return;
    
    const result = await addQuoteToInquiry(selectedInquiry._id, quoteData);
    if (result.success) {
      setShowQuoteModal(false);
      setQuoteData({ finalPrice: '', validUntil: '', terms: '' });
      setSelectedInquiry(null);
      
      // Refresh the list
      const filters = {};
      if (selectedStatus) {
        filters.status = selectedStatus;
      }
      getInquiries(filters, currentPage);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      const result = await deleteInquiry(inquiryId);
      if (result.success) {
        // Refresh the list
        const filters = {};
        if (selectedStatus) {
          filters.status = selectedStatus;
        }
        getInquiries(filters, currentPage);
      }
    }
  };

  const openQuoteModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setQuoteData({
      finalPrice: inquiry.costBreakdown?.totalCost?.toFixed(2) || '0.00',
      validUntil: '',
      terms: ''
    });
    setShowQuoteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };



  // Check if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h3>
            <p className="text-gray-500">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check admin role
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Package Inquiries</h1>
          <p className="text-gray-600">Manage and respond to custom package requests from customers</p>
          

        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  const filters = {};
                  if (selectedStatus) {
                    filters.status = selectedStatus;
                  }
                  getInquiries(filters, currentPage);
                }}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh Data
              </button>

            </div>

          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Inquiries</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => getInquiries({}, 1)}
              className="btn-primary inline-flex items-center"
            >
              Try Again
            </button>
          </div>
        ) : (inquiries && inquiries.length > 0) ? (
          <div className="space-y-6">
            {inquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inquiry.contactInfo?.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {inquiry.contactInfo?.email}</p>
                      {inquiry.contactInfo?.phone && (
                        <p><strong>Phone:</strong> {inquiry.contactInfo.phone}</p>
                      )}
                      <p><strong>Start Date:</strong> {formatDate(inquiry.tripDetails?.startDate)}</p>
                      <p><strong>Travellers:</strong> {inquiry.tripDetails?.travellers}</p>
                      <p><strong>Duration:</strong> {inquiry.tripDetails?.totalDays} days, {inquiry.tripDetails?.totalNights} nights</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPrice(inquiry.costBreakdown?.totalCost || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Itinerary:</h4>
                  <div className="space-y-2">
                    {inquiry.itinerary && inquiry.itinerary.length > 0 ? (
                      inquiry.itinerary
                        .sort((a, b) => a.day - b.day || (a.timeOfDay === 'day' ? 0 : 1) - (b.timeOfDay === 'day' ? 0 : 1))
                        .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-medium text-gray-600">
                              Day {item.day} - {item.timeOfDay === 'day' ? '🌞 Day Time' : '🌙 Night'}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {item.place?.name || 'Unknown Place'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({item.nights} nights)
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No itinerary specified</p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Preferences:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Hotel:</span> {inquiry.preferences?.hotelTier?.name || 'Not specified'}
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicle:</span> {inquiry.preferences?.selectedVehicle?.name || inquiry.preferences?.vehicle?.name || 'Not selected'}
                    </div>
                    <div>
                      <span className="text-gray-600">Tour Guide:</span> {inquiry.preferences?.selectedTourGuide?.name || inquiry.preferences?.tourGuide?.name || 'Not selected'}
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span> {inquiry.preferences?.selectedDriver?.name || inquiry.preferences?.driver?.name || 'Not selected'}
                    </div>
                  </div>
                  

                </div>

                {/* Additional Requirements */}
                {inquiry.additionalRequirements && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Requirements:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {inquiry.additionalRequirements}
                    </p>
                  </div>
                )}



                {/* Quote Information */}
                {inquiry.quote && inquiry.quote.finalPrice && (
                  <div className="mb-4 p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-900 mb-2">Quote Provided:</h4>
                    <div className="text-sm text-green-800">
                      <p><strong>Final Price:</strong> {formatPrice(inquiry.quote.finalPrice)}</p>
                      {inquiry.quote.validUntil && (
                        <p><strong>Valid Until:</strong> {formatDate(inquiry.quote.validUntil)}</p>
                      )}
                      {inquiry.quote.terms && (
                        <p><strong>Terms:</strong> {inquiry.quote.terms}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {inquiry.adminNotes && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">Admin Notes:</h4>
                    <p className="text-sm text-blue-800">{inquiry.adminNotes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {inquiry.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(inquiry._id, 'reviewed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => openQuoteModal(inquiry)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                        >
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Add Quote
                        </button>
                      </>
                    )}
                    {inquiry.status === 'reviewed' && (
                      <button
                        onClick={() => openQuoteModal(inquiry)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        Add Quote
                      </button>
                    )}
                    {inquiry.status === 'quoted' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(inquiry._id, 'accepted')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Mark Accepted
                        </button>
                        <button
                          onClick={() => handleStatusChange(inquiry._id, 'rejected')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteInquiry(inquiry._id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Custom Inquiries Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus ? `No inquiries with status "${selectedStatus}" found.` : 'No custom package inquiries have been submitted yet.'}
            </p>
            <div className="text-sm text-gray-500">
              <p>To test this feature:</p>
              <p>1. Go to the Custom Package page</p>
              <p>2. Create a custom package inquiry</p>
              <p>3. Come back here to see it in the admin panel</p>
            </div>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {showQuoteModal && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Quote</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quoteData.finalPrice}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, finalPrice: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={quoteData.validUntil}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={quoteData.terms}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, terms: e.target.value }))}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteData({ finalPrice: '', validUntil: '', terms: '' });
                    setSelectedInquiry(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuote}
                  disabled={!quoteData.finalPrice}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomInquiries; 