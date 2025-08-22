const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Submit a new contact message (public)
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required and must be less than 200 characters'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message is required and must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const messageData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message
    };

    // If user is authenticated, associate with user account
    if (req.user) {
      messageData.user = req.user.id;
    }

    const message = new Message(messageData);
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: {
          id: message._id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          status: message.status,
          createdAt: message.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @route   GET /api/messages
// @desc    Get all messages (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const messages = await Message.find(query)
      .populate('user', 'name email')
      .populate('repliedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
});

// @route   GET /api/messages/:id
// @desc    Get single message (admin only)
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('user', 'name email')
      .populate('repliedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message'
    });
  }
});

// @route   PUT /api/messages/:id/status
// @desc    Update message status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, [
  body('status').isIn(['unread', 'read', 'replied', 'archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = req.body.status;
    await message.save();

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: {
        message: {
          id: message._id,
          status: message.status
        }
      }
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message status'
    });
  }
});

// @route   PUT /api/messages/:id/priority
// @desc    Update message priority (admin only)
// @access  Private/Admin
router.put('/:id/priority', protect, admin, [
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.priority = req.body.priority;
    await message.save();

    res.json({
      success: true,
      message: 'Message priority updated successfully',
      data: {
        message: {
          id: message._id,
          priority: message.priority
        }
      }
    });
  } catch (error) {
    console.error('Error updating message priority:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating message priority'
    });
  }
});

// @route   PUT /api/messages/:id/reply
// @desc    Reply to a message (admin only)
// @access  Private/Admin
router.put('/:id/reply', protect, admin, [
  body('replyMessage').trim().isLength({ min: 1, max: 2000 }).withMessage('Reply message is required and must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.replyMessage = req.body.replyMessage;
    message.repliedAt = new Date();
    message.repliedBy = req.user.id;
    message.status = 'replied';
    await message.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        message: {
          id: message._id,
          replyMessage: message.replyMessage,
          repliedAt: message.repliedAt,
          status: message.status
        }
      }
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending reply'
    });
  }
});

// @route   PUT /api/messages/:id/notes
// @desc    Update admin notes (admin only)
// @access  Private/Admin
router.put('/:id/notes', protect, admin, [
  body('adminNotes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.adminNotes = req.body.adminNotes || '';
    await message.save();

    res.json({
      success: true,
      message: 'Admin notes updated successfully',
      data: {
        message: {
          id: message._id,
          adminNotes: message.adminNotes
        }
      }
    });
  } catch (error) {
    console.error('Error updating admin notes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating admin notes'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message'
    });
  }
});

// @route   GET /api/messages/stats/overview
// @desc    Get message statistics (admin only)
// @access  Private/Admin
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const readMessages = await Message.countDocuments({ status: 'read' });
    const repliedMessages = await Message.countDocuments({ status: 'replied' });
    const archivedMessages = await Message.countDocuments({ status: 'archived' });
    
    const urgentMessages = await Message.countDocuments({ priority: 'urgent' });
    const highPriorityMessages = await Message.countDocuments({ priority: 'high' });

    // Messages from last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    res.json({
      success: true,
      data: {
        total: totalMessages,
        unread: unreadMessages,
        read: readMessages,
        replied: repliedMessages,
        archived: archivedMessages,
        urgent: urgentMessages,
        highPriority: highPriorityMessages,
        recent: recentMessages
      }
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message statistics'
    });
  }
});

module.exports = router;
