const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Driver = require('../models/Driver');
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
    message: 'Driver routes are working',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/drivers
// @desc    Get all drivers with filters and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  query('availability').optional().isIn(['available', 'busy', 'unavailable']),
  query('licenseType').optional().isIn(['light', 'heavy', 'commercial', 'special']),
  query('vehicleType').optional().isIn(['sedan', 'suv', 'van', 'bus', 'coach', 'motorcycle']),
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
      licenseType,
      vehicleType,
      language,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (level) filter.level = level;
    if (availability) filter.availability = availability;
    if (licenseType) filter.licenseType = licenseType;

    // Vehicle type filter
    if (vehicleType) {
      filter.vehicleTypes = { $in: [vehicleType] };
    }

    // Language filter
    if (language) {
      filter.languages = { $in: [new RegExp(language, 'i')] };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const drivers = await Driver.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Driver.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    console.log(`Found ${drivers.length} drivers, total: ${total}`);

    res.json({
      success: true,
      drivers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers'
    });
  }
});

// @route   GET /api/drivers/:id
// @desc    Get single driver
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    console.log('Driver found:', driver.name);

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver'
    });
  }
});

// @route   POST /api/drivers
// @desc    Create new driver (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('avatar'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .isInt({ min: 18, max: 80 })
    .withMessage('Age must be between 18 and 80'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('licenseNumber')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('License number must be between 5 and 20 characters'),
  body('licenseType')
    .isIn(['light', 'heavy', 'commercial', 'special'])
    .withMessage('Invalid license type'),
  body('licenseExpiry')
    .isISO8601()
    .withMessage('Please enter a valid license expiry date'),
  body('languages')
    .custom((value) => {
      try {
        const languages = Array.isArray(value) ? value : JSON.parse(value);
        if (!Array.isArray(languages) || languages.length === 0) {
          throw new Error('At least one language is required');
        }
        return true;
      } catch (error) {
        throw new Error('Invalid languages format');
      }
    })
    .withMessage('At least one language is required'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid level'),
  body('experience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
  body('toursCompleted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tours completed must be a non-negative integer'),
  body('vehicleTypes')
    .custom((value) => {
      try {
        const vehicleTypes = Array.isArray(value) ? value : JSON.parse(value);
        if (!Array.isArray(vehicleTypes) || vehicleTypes.length === 0) {
          throw new Error('At least one vehicle type is required');
        }
        const validTypes = ['sedan', 'suv', 'van', 'bus', 'coach', 'motorcycle'];
        for (const type of vehicleTypes) {
          if (!validTypes.includes(type)) {
            throw new Error(`Invalid vehicle type: ${type}`);
          }
        }
        return true;
      } catch (error) {
        throw new Error('Invalid vehicle types format');
      }
    })
    .withMessage('At least one vehicle type is required'),
  body('specializations')
    .optional(),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  body('availability')
    .optional()
    .isIn(['available', 'busy', 'unavailable'])
    .withMessage('Invalid availability status')
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

    console.log('=== DRIVER CREATION START ===');
    console.log('Request body:', req.body);
    console.log('Files:', req.file);

    // Handle avatar upload
    let avatar = null;
    if (req.file) {
      console.log('Processing avatar upload...');
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'driver-avatars',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        console.log('Avatar uploaded:', result.secure_url);
        avatar = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Error uploading avatar:', uploadError);
      }
    }

    // Parse arrays from request body
    const languages = Array.isArray(req.body.languages) 
      ? req.body.languages 
      : JSON.parse(req.body.languages || '[]');
    
    const vehicleTypes = Array.isArray(req.body.vehicleTypes) 
      ? req.body.vehicleTypes 
      : JSON.parse(req.body.vehicleTypes || '[]');
    
    const specializations = Array.isArray(req.body.specializations) 
      ? req.body.specializations 
      : JSON.parse(req.body.specializations || '[]');

    // Create driver data
    const driverData = {
      name: req.body.name,
      age: parseInt(req.body.age),
      email: req.body.email.toLowerCase(),
      phone: req.body.phone,
      licenseNumber: req.body.licenseNumber,
      licenseType: req.body.licenseType,
      licenseExpiry: new Date(req.body.licenseExpiry),
      languages,
      level: req.body.level,
      avatar,
      bio: req.body.bio || '',
      experience: parseInt(req.body.experience) || 0,
      toursCompleted: parseInt(req.body.toursCompleted) || 0,
      vehicleTypes,
      specializations,
      availability: req.body.availability || 'available',
      createdBy: req.user.id
    };

    console.log('Driver data to save:', JSON.stringify(driverData, null, 2));

    // Create driver
    const driver = new Driver(driverData);
    await driver.save();

    console.log('Driver created successfully:', driver._id);
    console.log('=== DRIVER CREATION END ===');

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      driver
    });
  } catch (error) {
    console.error('Create driver error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating driver'
    });
  }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.single('avatar'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 18, max: 80 })
    .withMessage('Age must be between 18 and 80'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('licenseNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('License number must be between 5 and 20 characters'),
  body('licenseType')
    .optional()
    .isIn(['light', 'heavy', 'commercial', 'special'])
    .withMessage('Invalid license type'),
  body('licenseExpiry')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid license expiry date'),
  body('languages')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one language is required'),
  body('languages.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Language must be between 2 and 20 characters'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid level'),
  body('experience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer'),
  body('toursCompleted')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tours completed must be a non-negative integer'),
  body('vehicleTypes')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one vehicle type is required'),
  body('vehicleTypes.*')
    .optional()
    .isIn(['sedan', 'suv', 'van', 'bus', 'coach', 'motorcycle'])
    .withMessage('Invalid vehicle type'),
  body('specializations')
    .optional()
    .isArray(),
  body('specializations.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Specialization must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  body('availability')
    .optional()
    .isIn(['available', 'busy', 'unavailable'])
    .withMessage('Invalid availability status'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
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

    console.log('=== DRIVER UPDATE START ===');
    console.log('Driver ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Files:', req.file);

    // Find existing driver
    const existingDriver = await Driver.findById(req.params.id);
    if (!existingDriver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Handle avatar upload
    let avatar = existingDriver.avatar;
    if (req.file) {
      console.log('Processing avatar upload...');
      try {
        // Delete old avatar if exists
        if (existingDriver.avatar?.public_id) {
          await cloudinary.uploader.destroy(existingDriver.avatar.public_id);
          console.log('Old avatar deleted from Cloudinary');
        }

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'driver-avatars',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        console.log('New avatar uploaded:', result.secure_url);
        avatar = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Error uploading avatar:', uploadError);
      }
    }

    // Parse arrays from request body
    const languages = req.body.languages ? 
      (Array.isArray(req.body.languages) ? req.body.languages : JSON.parse(req.body.languages)) 
      : existingDriver.languages;
    
    const vehicleTypes = req.body.vehicleTypes ? 
      (Array.isArray(req.body.vehicleTypes) ? req.body.vehicleTypes : JSON.parse(req.body.vehicleTypes)) 
      : existingDriver.vehicleTypes;
    
    const specializations = req.body.specializations ? 
      (Array.isArray(req.body.specializations) ? req.body.specializations : JSON.parse(req.body.specializations)) 
      : existingDriver.specializations;

    // Update driver data
    const updateData = {
      ...req.body,
      languages,
      vehicleTypes,
      specializations,
      avatar
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Update data:', JSON.stringify(updateData, null, 2));

    // Update driver
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    console.log('Driver updated successfully:', updatedDriver._id);
    console.log('=== DRIVER UPDATE END ===');

    res.json({
      success: true,
      message: 'Driver updated successfully',
      driver: updatedDriver
    });
  } catch (error) {
    console.error('Update driver error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating driver'
    });
  }
});

// @route   DELETE /api/drivers/:id
// @desc    Delete driver (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('=== DRIVER DELETION START ===');
    console.log('Driver ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      console.log('Driver not found');
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    console.log('Driver found, deleting avatar from Cloudinary...');

    // Delete avatar from Cloudinary if exists
    if (driver.avatar?.public_id) {
      try {
        await cloudinary.uploader.destroy(driver.avatar.public_id);
        console.log('Avatar deleted from Cloudinary:', driver.avatar.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting avatar from Cloudinary:', cloudinaryError);
      }
    }

    // Delete driver from database
    await Driver.findByIdAndDelete(req.params.id);
    console.log('Driver deleted from database');
    console.log('=== DRIVER DELETION END ===');

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting driver'
    });
  }
});

module.exports = router; 