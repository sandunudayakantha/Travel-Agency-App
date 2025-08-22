const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Package = require('../models/Package');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + error.message
    });
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

// Debug endpoint to check reviews in database
router.get('/debug', async (req, res) => {
  try {
    const reviews = await Review.find({}).select('_id title user package').populate('user', 'name').populate('package', 'title');
    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// Debug endpoint to check authentication
router.get('/debug-auth', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @desc    Get featured reviews for home page
// @route   GET /api/reviews/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Get approved reviews with highest ratings and most recent
    const featuredReviews = await Review.find({ isApproved: true })
      .populate('user', 'name avatar')
      .populate('package', 'title image')
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit));

    // Get overall stats
    const totalReviews = await Review.countDocuments({ isApproved: true });
    const averageRating = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const stats = {
      totalReviews,
      averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0
    };

    res.json({
      success: true,
      data: {
        reviews: featuredReviews,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured reviews',
      error: error.message
    });
  }
});

// Test endpoint for creating reviews (for debugging)
router.post('/test-create', protect, async (req, res) => {
  try {
    console.log('Test create review - User:', req.user);
    console.log('Test create review - Body:', req.body);
    
    res.json({
      success: true,
      message: 'Test endpoint working',
      user: req.user,
      body: req.body
    });
  } catch (error) {
    console.error('Test create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Test endpoint error',
      error: error.message
    });
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all reviews for a package
// @route   GET /api/reviews/package/:packageId
// @access  Public
router.get('/package/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      populate: [
        {
          path: 'user',
          select: 'name avatar'
        }
      ]
    };

    const reviews = await Review.paginate(
      { package: packageId, isApproved: true },
      options
    );

    // Get average rating and stats
    const stats = await Review.getAverageRating(packageId);

    res.json({
      success: true,
      data: reviews,
      stats
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @desc    Get all reviews (admin only)
// @route   GET /api/reviews
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', status } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.isApproved = status === 'approved';
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      populate: [
        {
          path: 'user',
          select: 'name email'
        },
        {
          path: 'package',
          select: 'title'
        }
      ]
    };

    const reviews = await Review.paginate(filter, options);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('package', 'title');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, upload.array('images', 5), handleUploadError, async (req, res) => {
  try {
    console.log('Creating review - User:', req.user);
    console.log('Creating review - Body:', req.body);
    console.log('Creating review - Files:', req.files);
    
    const { packageId, rating, title, comment } = req.body;
    console.log('Creating review - packageId:', packageId);
    console.log('Creating review - packageId type:', typeof packageId);
    console.log('Creating review - packageId length:', packageId ? packageId.length : 'null');

    // Check if package exists (only if packageId is provided and valid)
    let package = null;
    if (packageId && packageId !== 'undefined' && packageId.trim() !== '') {
      package = await Package.findById(packageId);
      if (!package) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      // Check if user already reviewed this package
      const existingReview = await Review.findOne({
        user: req.user.id,
        package: packageId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this package'
        });
      }
    }

    // Upload images to Cloudinary if provided
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'reviews',
          width: 1000,
          crop: 'scale'
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({
        public_id: result.public_id,
        url: result.secure_url
      }));
    }

    const reviewData = {
      user: req.user.id,
      rating: parseInt(rating),
      comment,
      images
    };

    // Only include package and title if provided and valid
    if (packageId && packageId !== 'undefined' && packageId.trim() !== '') {
      reviewData.package = packageId;
    }
    if (title && title !== 'undefined' && title.trim() !== '') {
      reviewData.title = title;
    }

    let review;
    try {
      review = await Review.create(reviewData);
    } catch (error) {
      console.error('Error creating review:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this package'
        });
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }
      
      throw error; // Re-throw other errors
    }

    await review.populate('user', 'name avatar');
    if (packageId && packageId !== 'undefined' && packageId.trim() !== '') {
      await review.populate('package', 'title');
    }

    // Update package average rating (only if package is provided)
    let stats = {
      averageRating: 0,
      numReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    if (packageId && packageId !== 'undefined' && packageId.trim() !== '') {
      try {
        const calculatedStats = await Review.getAverageRating(packageId);
        if (calculatedStats) {
          stats = calculatedStats;
          await Package.findByIdAndUpdate(packageId, {
            averageRating: stats.averageRating,
            numReviews: stats.numReviews
          });
        }
      } catch (statsError) {
        console.error('Error calculating stats:', statsError);
        // Don't fail the review creation if stats calculation fails
        // Keep the default stats that were already set
      }
    }

    const responseData = {
      success: true,
      data: review,
      stats: stats
    };
    
    console.log('Backend: Sending successful response:', JSON.stringify(responseData, null, 2));
    console.log('Backend: Review ID:', review._id);
    console.log('Backend: Review user:', review.user);
    console.log('Backend: Review package:', review.package);
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating review:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Upload new images to Cloudinary if provided
    let images = review.images;
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (review.images.length > 0) {
        const deletePromises = review.images.map(image => {
          return cloudinary.uploader.destroy(image.public_id);
        });
        await Promise.all(deletePromises);
      }

      // Upload new images
      const uploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'reviews',
          width: 1000,
          crop: 'scale'
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({
        public_id: result.public_id,
        url: result.secure_url
      }));
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating: parseInt(rating),
        title,
        comment,
        images
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name avatar')
     .populate('package', 'title');

    // Update package average rating
    const stats = await Review.getAverageRating(review.package);
    await Package.findByIdAndUpdate(review.package, {
      averageRating: stats.averageRating,
      numReviews: stats.numReviews
    });

    res.json({
      success: true,
      data: updatedReview,
      stats
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('Attempting to delete review with ID:', req.params.id);
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    // Delete images from Cloudinary
    if (review.images.length > 0) {
      const deletePromises = review.images.map(image => {
        return cloudinary.uploader.destroy(image.public_id);
      });
      await Promise.all(deletePromises);
    }

    // Store package ID before deletion
    const packageId = review.package;
    
    await Review.findByIdAndDelete(req.params.id);

    // Update package average rating
    const stats = await Review.getAverageRating(packageId);
    await Package.findByIdAndUpdate(packageId, {
      averageRating: stats.averageRating,
      numReviews: stats.numReviews
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
      stats
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
});

// @desc    Toggle review approval (admin only)
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    // Update package average rating
    const stats = await Review.getAverageRating(review.package);
    await Package.findByIdAndUpdate(review.package, {
      averageRating: stats.averageRating,
      numReviews: stats.numReviews
    });

    res.json({
      success: true,
      data: review,
      stats
    });
  } catch (error) {
    console.error('Error toggling review approval:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling review approval',
      error: error.message
    });
  }
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const { helpful = true } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review
    const existingMark = review.helpful.find(
      mark => mark.user.toString() === req.user.id
    );

    if (existingMark) {
      // Update existing mark
      existingMark.helpful = helpful;
    } else {
      // Add new mark
      review.helpful.push({
        user: req.user.id,
        helpful
      });
    }

    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful',
      error: error.message
    });
  }
});

module.exports = router; 