const express = require('express');
const { body, validationResult, query } = require('express-validator');
const TourGuide = require('../models/TourGuide');
const { protect, authorize } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Tour Guide routes are working',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/tour-guides
// @desc    Get all tour guides with filters and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  query('availability').optional().isIn(['available', 'busy', 'unavailable']),
  query('language').optional().isString(),
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
      level,
      availability,
      language,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (level) filter.level = level;
    if (availability) filter.availability = availability;

    // Language filter
    if (language) {
      filter.languages = { $in: [new RegExp(language, 'i')] };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tourGuides = await TourGuide.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await TourGuide.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        tourGuides,
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
    console.error('Get tour guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tour guides'
    });
  }
});

// @route   GET /api/tour-guides/:id
// @desc    Get single tour guide
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name');

    if (!tourGuide) {
      return res.status(404).json({
        success: false,
        message: 'Tour guide not found'
      });
    }

    res.json({
      success: true,
      data: { tourGuide }
    });
  } catch (error) {
    console.error('Get tour guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tour guide'
    });
  }
});

// @route   POST /api/tour-guides
// @desc    Create new tour guide (Admin only)
// @access  Private/Admin
// Middleware to preprocess JSON strings in FormData
const preprocessFormData = (req, res, next) => {
  try {
    // Parse languages if it's a string
    if (req.body.languages && typeof req.body.languages === 'string') {
      console.log('Preprocessing languages string:', req.body.languages);
      try {
        req.body.languages = JSON.parse(req.body.languages);
        console.log('Preprocessed languages:', req.body.languages);
      } catch (parseError) {
        console.error('Error preprocessing languages:', parseError);
        req.body.languages = [];
      }
    }
    
    // Parse specializations if it's a string
    if (req.body.specializations && typeof req.body.specializations === 'string') {
      console.log('Preprocessing specializations string:', req.body.specializations);
      try {
        req.body.specializations = JSON.parse(req.body.specializations);
        console.log('Preprocessed specializations:', req.body.specializations);
      } catch (parseError) {
        console.error('Error preprocessing specializations:', parseError);
        req.body.specializations = [];
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in preprocessFormData middleware:', error);
    next();
  }
};

router.post('/', protect, authorize('admin'), upload.single('avatar'), preprocessFormData, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 18, max: 80 })
    .withMessage('Age must be between 18 and 80'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('languages')
    .isArray({ min: 1 })
    .withMessage('At least one language is required'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid level')
], async (req, res) => {
  try {
    console.log('=== TOUR GUIDE CREATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file ? req.file.originalname : 'No file');
    console.log('User ID:', req.user.id);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    console.log('Validation passed, processing avatar...');

    // Upload avatar to Cloudinary if provided
    let avatarData = null;
    if (req.file) {
      console.log('Uploading avatar to Cloudinary...');
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary credentials not configured. Skipping avatar upload.');
      } else {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'tour-guides',
                transformation: [
                  { width: 400, height: 400, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error);
                } else {
                  console.log('Avatar uploaded successfully:', result.public_id);
                  resolve(result);
                }
              }
            );
            stream.end(req.file.buffer);
          });
          
          avatarData = {
            public_id: result.public_id,
            url: result.secure_url
          };
        } catch (uploadError) {
          console.error('Failed to upload avatar:', uploadError);
          throw uploadError;
        }
      }
    } else {
      console.log('No avatar to upload');
    }

    console.log('Building tour guide data...');
    const tourGuideData = {
      ...req.body,
      createdBy: req.user.id,
      avatar: avatarData
    };

    // Parse languages array if it's a string
    if (req.body.languages && typeof req.body.languages === 'string') {
      console.log('Parsing languages string:', req.body.languages);
      try {
        tourGuideData.languages = JSON.parse(req.body.languages);
        console.log('Parsed languages:', tourGuideData.languages);
      } catch (parseError) {
        console.error('Error parsing languages:', parseError);
        tourGuideData.languages = [];
      }
    }

    // Parse specializations array if it's a string
    if (req.body.specializations && typeof req.body.specializations === 'string') {
      console.log('Parsing specializations string:', req.body.specializations);
      try {
        tourGuideData.specializations = JSON.parse(req.body.specializations);
        console.log('Parsed specializations:', tourGuideData.specializations);
      } catch (parseError) {
        console.error('Error parsing specializations:', parseError);
        tourGuideData.specializations = [];
      }
    }

    console.log('Final tour guide data:', JSON.stringify(tourGuideData, null, 2));

    console.log('Creating tour guide in database...');
    const newTourGuide = await TourGuide.create(tourGuideData);
    console.log('Tour guide created successfully:', newTourGuide._id);

    res.status(201).json({
      success: true,
      message: 'Tour guide created successfully',
      data: { tourGuide: newTourGuide }
    });
    console.log('=== TOUR GUIDE CREATION END ===');
  } catch (error) {
    console.error('=== TOUR GUIDE CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.error('=== END ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating tour guide'
    });
  }
});

// @route   PUT /api/tour-guides/:id
// @desc    Update tour guide (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.single('avatar'), preprocessFormData, async (req, res) => {
  try {
    console.log('=== TOUR GUIDE UPDATE START ===');
    console.log('Tour Guide ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file ? req.file.originalname : 'No file');
    console.log('User ID:', req.user.id);

    const tourGuide = await TourGuide.findById(req.params.id);

    if (!tourGuide) {
      console.log('Tour guide not found');
      return res.status(404).json({
        success: false,
        message: 'Tour guide not found'
      });
    }

    console.log('Tour guide found, processing update...');

    // Handle avatar upload if new avatar is provided
    if (req.file) {
      console.log('Processing new avatar...');
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary credentials not configured. Skipping avatar upload.');
        return res.status(500).json({
          success: false,
          message: 'Avatar upload service not configured'
        });
      }
      
      // Delete old avatar from Cloudinary if exists
      if (tourGuide.avatar && tourGuide.avatar.public_id) {
        console.log('Deleting old avatar from Cloudinary...');
        try {
          await cloudinary.uploader.destroy(tourGuide.avatar.public_id);
          console.log('Deleted old avatar:', tourGuide.avatar.public_id);
        } catch (deleteError) {
          console.error('Error deleting old avatar:', deleteError);
        }
      }

      // Upload new avatar
      console.log('Uploading new avatar...');
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'tour-guides',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('New avatar uploaded successfully:', result.public_id);
                resolve(result);
              }
            }
          );
          stream.end(req.file.buffer);
        });
        
        req.body.avatar = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Failed to upload new avatar:', uploadError);
        throw uploadError;
      }
    } else {
      console.log('No new avatar to upload');
    }

    // Parse arrays if they're strings
    if (req.body.languages && typeof req.body.languages === 'string') {
      console.log('Parsing languages string:', req.body.languages);
      try {
        req.body.languages = JSON.parse(req.body.languages);
        console.log('Parsed languages:', req.body.languages);
      } catch (parseError) {
        console.error('Error parsing languages:', parseError);
        req.body.languages = [];
      }
    }

    if (req.body.specializations && typeof req.body.specializations === 'string') {
      console.log('Parsing specializations string:', req.body.specializations);
      try {
        req.body.specializations = JSON.parse(req.body.specializations);
        console.log('Parsed specializations:', req.body.specializations);
      } catch (parseError) {
        console.error('Error parsing specializations:', parseError);
        req.body.specializations = [];
      }
    }

    console.log('Final update data:', JSON.stringify(req.body, null, 2));

    // Update tour guide
    console.log('Updating tour guide in database...');
    const updatedTourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Tour guide updated successfully:', updatedTourGuide._id);

    res.json({
      success: true,
      message: 'Tour guide updated successfully',
      data: { tourGuide: updatedTourGuide }
    });
    console.log('=== TOUR GUIDE UPDATE END ===');
  } catch (error) {
    console.error('=== TOUR GUIDE UPDATE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.error('=== END UPDATE ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating tour guide'
    });
  }
});

// @route   DELETE /api/tour-guides/:id
// @desc    Delete tour guide (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('=== TOUR GUIDE DELETE START ===');
    console.log('Tour Guide ID:', req.params.id);

    const tourGuide = await TourGuide.findById(req.params.id);

    if (!tourGuide) {
      console.log('Tour guide not found');
      return res.status(404).json({
        success: false,
        message: 'Tour guide not found'
      });
    }

    // Delete avatar from Cloudinary if exists
    if (tourGuide.avatar && tourGuide.avatar.public_id) {
      console.log('Deleting avatar from Cloudinary...');
      try {
        await cloudinary.uploader.destroy(tourGuide.avatar.public_id);
        console.log('Deleted avatar:', tourGuide.avatar.public_id);
      } catch (deleteError) {
        console.error('Error deleting avatar:', deleteError);
      }
    }

    // Delete tour guide
    await TourGuide.findByIdAndDelete(req.params.id);
    console.log('Tour guide deleted successfully');

    res.json({
      success: true,
      message: 'Tour guide deleted successfully'
    });
    console.log('=== TOUR GUIDE DELETE END ===');
  } catch (error) {
    console.error('=== TOUR GUIDE DELETE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.error('=== END DELETE ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tour guide'
    });
  }
});

module.exports = router; 