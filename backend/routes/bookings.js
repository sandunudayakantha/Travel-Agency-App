const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, [
  body('package')
    .optional()
    .isMongoId()
    .withMessage('Invalid package ID'),
  body('bookingType')
    .isIn(['package', 'custom'])
    .withMessage('Booking type must be either package or custom'),
  body('travelers')
    .isArray({ min: 1 })
    .withMessage('At least one traveler is required'),
  body('travelers.*.name')
    .trim()
    .notEmpty()
    .withMessage('Traveler name is required'),
  body('travelDates.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('travelDates.endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('groupSize.adults')
    .isInt({ min: 1 })
    .withMessage('At least one adult is required'),
  body('groupSize.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count cannot be negative'),
  body('groupSize.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Infants count cannot be negative'),
  body('payment.method')
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'])
    .withMessage('Invalid payment method')
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
      package: packageId,
      bookingType,
      customPackage,
      travelers,
      travelDates,
      groupSize,
      accommodation,
      transportation,
      additionalServices,
      specialRequests,
      payment
    } = req.body;

    // Validate travel dates
    const startDate = new Date(travelDates.startDate);
    const endDate = new Date(travelDates.endDate);
    const today = new Date();

    if (startDate <= today) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be in the future'
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Calculate pricing
    let basePrice = 0;
    let currency = 'USD';

    if (bookingType === 'package' && packageId) {
      const package = await Package.findById(packageId);
      if (!package) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      basePrice = package.price.amount * groupSize.adults;
      currency = package.price.currency;

      // Add child pricing (usually 50% of adult price)
      if (groupSize.children > 0) {
        basePrice += (package.price.amount * 0.5 * groupSize.children);
      }
    } else if (bookingType === 'custom') {
      // For custom packages, use the budget range
      basePrice = customPackage.budget.min || 1000;
      currency = customPackage.budget.currency || 'USD';
    }

    // Calculate additional services cost
    const additionalServicesCost = additionalServices?.reduce((sum, service) => sum + (service.price || 0), 0) || 0;

    // Calculate taxes and fees (simplified calculation)
    const taxes = basePrice * 0.1; // 10% tax
    const fees = basePrice * 0.05; // 5% service fee

    const total = basePrice + additionalServicesCost + taxes + fees;

    // Create booking
    const bookingData = {
      user: req.user.id,
      package: packageId,
      customPackage,
      bookingType,
      travelers,
      travelDates,
      groupSize,
      pricing: {
        basePrice,
        discount: 0,
        taxes,
        fees,
        total,
        currency
      },
      accommodation,
      transportation,
      additionalServices,
      specialRequests,
      payment: {
        ...payment,
        amount: total,
        currency
      }
    };

    const booking = await Booking.create(bookingData);

    // Populate package info
    await booking.populate('package');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'])
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

    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const bookings = await Booking.find(filter)
      .populate('package', 'title destination images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Booking.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

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
      message: 'Server error while fetching bookings'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'])
    .withMessage('Invalid status')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking
    booking.status = req.body.status;
    
    // If cancelling, set cancellation details
    if (req.body.status === 'cancelled') {
      booking.cancellation = {
        requestedAt: new Date(),
        reason: req.body.reason || 'Cancelled by admin',
        refundAmount: booking.calculateRefund(),
        refundStatus: 'pending'
      };
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking'
    });
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel booking (User or Admin)
// @access  Private
router.post('/:id/cancel', protect, [
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    // Cancel booking
    booking.status = 'cancelled';
    booking.cancellation = {
      requestedAt: new Date(),
      reason: req.body.reason || 'Cancelled by user',
      refundAmount: booking.calculateRefund(),
      refundStatus: 'pending'
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { 
        booking,
        refundAmount: booking.cancellation.refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// @route   POST /api/bookings/:id/review
// @desc    Add review to completed booking
// @access  Private
router.post('/:id/review', protect, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if already reviewed
    if (booking.review) {
      return res.status(400).json({
        success: false,
        message: 'Booking has already been reviewed'
      });
    }

    // Add review
    booking.review = {
      rating: req.body.rating,
      comment: req.body.comment,
      date: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Add booking review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/bookings/stats/overview
// @desc    Get booking statistics (Admin only)
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['paid', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics'
    });
  }
});

module.exports = router; 