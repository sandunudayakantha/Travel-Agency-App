import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ChatBubbleLeftRightIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useMessage } from '../../contexts/MessageContext';
import AdminRoute from '../../components/auth/AdminRoute';

const Messages = () => {
  const { 
    messages, 
    loading, 
    error, 
    stats, 
    getMessages, 
    getMessageStats, 
    updateMessageStatus, 
    updateMessagePriority, 
    replyToMessage, 
    updateAdminNotes, 
    deleteMessage,
    clearError 
  } = useMessage();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    getMessages();
    getMessageStats();
  }, []);

  useEffect(() => {
    const filters = {};
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedPriority) filters.priority = selectedPriority;
    if (searchTerm) filters.search = searchTerm;
    
    getMessages(filters, currentPage);
  }, [selectedStatus, selectedPriority, searchTerm, currentPage]);

  const handleStatusChange = async (messageId, newStatus) => {
    const result = await updateMessageStatus(messageId, newStatus);
    if (result.success) {
      // Update selected message if it's the one being modified
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    }
  };

  const handlePriorityChange = async (messageId, newPriority) => {
    const result = await updateMessagePriority(messageId, newPriority);
    if (result.success) {
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage({ ...selectedMessage, priority: newPriority });
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    const result = await replyToMessage(selectedMessage._id, replyText);
    if (result.success) {
      setShowReplyModal(false);
      setReplyText('');
      setSelectedMessage({ ...selectedMessage, replyMessage: replyText, status: 'replied' });
    }
  };

  const handleUpdateNotes = async () => {
    const result = await updateAdminNotes(selectedMessage._id, notesText);
    if (result.success) {
      setShowNotesModal(false);
      setSelectedMessage({ ...selectedMessage, adminNotes: notesText });
    }
  };

  const handleDelete = async () => {
    const result = await deleteMessage(selectedMessage._id);
    if (result.success) {
      setShowDeleteModal(false);
      setSelectedMessage(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 border-red-200';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Messages</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => {
            clearError();
            getMessages();
          }}
          className="btn-primary inline-flex items-center"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="mt-2 text-gray-600">Manage contact form messages and customer inquiries</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Messages</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Unread</div>
                  <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Replied</p>
                  <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">All Statuses</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
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
                          {message.subject}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                          {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>From:</strong> {message.name} ({message.email})</p>
                        <p><strong>Phone:</strong> {message.phone}</p>
                        <p><strong>Received:</strong> {formatDate(message.createdAt)}</p>
                        {message.user && (
                          <p><strong>Registered User:</strong> Yes</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  {message.replyMessage && (
                    <div className="mb-4 p-4 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-900 mb-2">Reply:</h4>
                      <p className="text-sm text-green-800 whitespace-pre-wrap">{message.replyMessage}</p>
                      <p className="text-xs text-green-600 mt-2">
                        Replied on {formatDate(message.repliedAt)} by {message.repliedBy?.name || 'Admin'}
                      </p>
                    </div>
                  )}

                  {message.adminNotes && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-900 mb-2">Admin Notes:</h4>
                      <p className="text-sm text-blue-800">{message.adminNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      {message.status === 'unread' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(message._id, 'read')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Mark Read
                          </button>
                        </>
                      )}
                      
                      {message.status !== 'replied' && (
                        <button
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowReplyModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                          Reply
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setNotesText(message.adminNotes || '');
                          setShowNotesModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Notes
                      </button>
                      
                      {message.status !== 'archived' && (
                        <button
                          onClick={() => handleStatusChange(message._id, 'archived')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                          Archive
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowDeleteModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Messages Found</h3>
              <p className="text-gray-500">No messages match your current filters.</p>
            </div>
          )}
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply to Message</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">From: {selectedMessage.name} ({selectedMessage.email})</p>
                <p className="text-sm text-gray-600 mb-2">Subject: {selectedMessage.subject}</p>
                <p className="text-sm text-gray-600">Message: {selectedMessage.message}</p>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add admin notes..."
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setNotesText('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNotes}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Message</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this message from {selectedMessage.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
};

export default Messages;
