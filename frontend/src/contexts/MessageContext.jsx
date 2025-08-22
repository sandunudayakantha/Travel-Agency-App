import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
    urgent: 0,
    highPriority: 0,
    recent: 0
  });

  // Submit a new contact message (public)
  const submitMessage = async (messageData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/messages', messageData);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get all messages (admin only)
  const getMessages = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await axios.get(`/api/messages?${params}`);
      
      if (response.data.success) {
        setMessages(response.data.data.messages);
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch messages';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get single message (admin only)
  const getMessage = async (messageId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/messages/${messageId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch message');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch message';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Update message status (admin only)
  const updateMessageStatus = async (messageId, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/messages/${messageId}/status`, { status });
      
      if (response.data.success) {
        // Update the message in the local state
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId 
              ? { ...msg, status: status }
              : msg
          )
        );
        
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to update message status');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update message status';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Update message priority (admin only)
  const updateMessagePriority = async (messageId, priority) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/messages/${messageId}/priority`, { priority });
      
      if (response.data.success) {
        // Update the message in the local state
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId 
              ? { ...msg, priority: priority }
              : msg
          )
        );
        
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to update message priority');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update message priority';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Reply to a message (admin only)
  const replyToMessage = async (messageId, replyMessage) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/messages/${messageId}/reply`, { replyMessage });
      
      if (response.data.success) {
        // Update the message in the local state
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId 
              ? { 
                  ...msg, 
                  replyMessage: replyMessage,
                  repliedAt: new Date().toISOString(),
                  status: 'replied'
                }
              : msg
          )
        );
        
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to send reply');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reply';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Update admin notes (admin only)
  const updateAdminNotes = async (messageId, adminNotes) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/messages/${messageId}/notes`, { adminNotes });
      
      if (response.data.success) {
        // Update the message in the local state
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId 
              ? { ...msg, adminNotes: adminNotes }
              : msg
          )
        );
        
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to update admin notes');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update admin notes';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete a message (admin only)
  const deleteMessage = async (messageId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`/api/messages/${messageId}`);
      
      if (response.data.success) {
        // Remove the message from the local state
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg._id !== messageId)
        );
        
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete message');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete message';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Get message statistics (admin only)
  const getMessageStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/messages/stats/overview');
      
      if (response.data.success) {
        setStats(response.data.data);
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch message statistics');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch message statistics';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    messages,
    loading,
    error,
    stats,
    submitMessage,
    getMessages,
    getMessage,
    updateMessageStatus,
    updateMessagePriority,
    replyToMessage,
    updateAdminNotes,
    deleteMessage,
    getMessageStats,
    clearError
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
