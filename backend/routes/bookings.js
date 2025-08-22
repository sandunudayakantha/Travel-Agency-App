const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (no authentication required for booking creation)
router.post('/', [
  body('packageName')
    .trim()
    .notEmpty()
    .withMessage('Package name is required'),
  body('userName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('User name must be between 2 and 100 characters'),
  body('userEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('phoneNumber')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('extraNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Extra notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      packageName,
      userName,
      userEmail,
      startDate,
      phoneNumber,
      extraNotes
    } = req.body;

    // Validate start date is in the future
    const startDateObj = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDateObj <= today) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be in the future'
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user?.id || null, // Make user optional
      packageName,
      userName,
      userEmail,
      startDate: startDateObj,
      phoneNumber,
      extraNotes: extraNotes || ''
    });

    await booking.save();

    console.log('=== BOOKING CREATED ===');
    console.log('Booking ID:', booking._id);
    console.log('Package:', packageName);
    console.log('User:', userName);
    console.log('Email:', userEmail);
    console.log('Start Date:', startDateObj);
    console.log('Phone:', phoneNumber);
    console.log('Status:', booking.status);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user's bookings (user)
// @access  Private (authentication required to view bookings)
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'reviewed', 'confirmed', 'cancelled']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;

    // Build filter object
    const filter = {};

    // If user is admin, show all bookings. If user, show only their bookings
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    } else {
      // For admins, also show bookings without users (public bookings)
      filter.$or = [
        { user: { $exists: true, $ne: null } },
        { user: null }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { packageName: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviewedBy', 'name email');

    // Get total count
    const total = await Booking.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking (admin can see all, user can only see their own)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('reviewedBy', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'reviewed', 'confirmed', 'cancelled'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status, adminNotes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking status
    booking.status = status;
    booking.reviewedBy = req.user.id;
    booking.reviewedAt = new Date();
    booking.adminNotes = adminNotes || '';

    await booking.save();

    console.log('=== BOOKING STATUS UPDATED ===');
    console.log('Booking ID:', booking._id);
    console.log('New Status:', status);
    console.log('Reviewed By:', req.user.name);
    console.log('Admin Notes:', adminNotes);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking (admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    console.log('=== BOOKING DELETED ===');
    console.log('Booking ID:', req.params.id);
    console.log('Deleted By:', req.user.name);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
});

module.exports = router; 