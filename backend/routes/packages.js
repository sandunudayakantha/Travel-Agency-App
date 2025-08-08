const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Package = require('../models/Package');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/packages
// @desc    Get all packages with filtering and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['adventure', 'beach', 'cultural', 'city', 'nature', 'luxury', 'budget', 'family']),
  query('destination').optional().isString(),
  query('country').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('duration').optional().isInt({ min: 1 }),
  query('difficulty').optional().isIn(['easy', 'moderate', 'challenging', 'expert']),
  query('featured').optional().isBoolean(),
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
      limit = 12,
      category,
      destination,
      country,
      minPrice,
      maxPrice,
      duration,
      difficulty,
      featured,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (destination) filter.destination = { $regex: destination, $options: 'i' };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;
    if (featured !== undefined) filter.featured = featured === 'true';

    // Price filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Duration filter
    if (duration) {
      filter['duration.days'] = { $gte: parseInt(duration) };
    }

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const packages = await Package.find(filter)
      .populate('createdBy', 'name')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Package.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        packages,
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
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching packages'
    });
  }
});

// @route   GET /api/packages/featured
// @desc    Get featured packages
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const packages = await Package.find({ 
      status: 'active', 
      featured: true 
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: { packages }
    });
  } catch (error) {
    console.error('Get featured packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured packages'
    });
  }
});

// @route   GET /api/packages/:id
// @desc    Get single package by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name avatar');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: { package }
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching package'
    });
  }
});

// @route   POST /api/packages
// @desc    Create new package (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('shortDescription')
    .isLength({ min: 10, max: 200 })
    .withMessage('Short description must be between 10 and 200 characters'),
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('category')
    .isIn(['adventure', 'beach', 'cultural', 'city', 'nature', 'luxury', 'budget', 'family'])
    .withMessage('Invalid category'),
  body('duration.days')
    .isInt({ min: 1 })
    .withMessage('Duration days must be at least 1'),
  body('duration.nights')
    .isInt({ min: 0 })
    .withMessage('Duration nights cannot be negative'),
  body('price.amount')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('price.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency')
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

    const packageData = {
      ...req.body,
      createdBy: req.user.id
    };

    const newPackage = await Package.create(packageData);

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: { package: newPackage }
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating package'
    });
  }
});

// @route   PUT /api/packages/:id
// @desc    Update package (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: { package: updatedPackage }
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating package'
    });
  }
});

// @route   DELETE /api/packages/:id
// @desc    Delete package (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting package'
    });
  }
});

// @route   POST /api/packages/:id/reviews
// @desc    Add review to package
// @access  Private
router.post('/:id/reviews', protect, [
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

    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check if user already reviewed this package
    const existingReview = package.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this package'
      });
    }

    // Add review
    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      date: new Date()
    };

    package.reviews.push(review);
    package.updateAverageRating();
    await package.save();

    // Populate user info for the new review
    await package.populate('reviews.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { package }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   GET /api/packages/categories
// @desc    Get all available categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Package.distinct('category');
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/packages/destinations
// @desc    Get all available destinations
// @access  Public
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Package.distinct('destination');
    const countries = await Package.distinct('country');
    
    res.json({
      success: true,
      data: { destinations, countries }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching destinations'
    });
  }
});

module.exports = router; 