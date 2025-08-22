const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { body, validationResult, query } = require('express-validator');
const Package = require('../models/Package');
const Driver = require('../models/Driver');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept image and video files
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  }
});

// @route   GET /api/packages
// @desc    Get all packages with filtering and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('featured').optional().isBoolean(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    console.log('GET /api/packages - Query params:', req.query);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      featured,
      search,
      tourType
    } = req.query;

    // Build filter object
    const filter = {};

    if (featured !== undefined) filter.featured = featured === 'true';

    // Tour type filter
    if (tourType) {
      filter.tourType = tourType;
    }

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('Package filter:', filter);

    // Execute query
    const packages = await Package.find(filter)
      .populate('createdBy', 'name')
      .populate('tourType', 'name description')
      .populate('vehicle', 'name model type')
      .populate('guide', 'name languages level')
      .populate('driver', 'name licenseNumber level')
      .populate('itinerary.places')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`Found ${packages.length} packages`);

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
    console.log('GET /api/packages/featured');
    
    const packages = await Package.find({ featured: true })
    .populate('createdBy', 'name')
    .populate('tourType', 'name description')
    .populate('vehicle', 'name model type')
    .populate('guide', 'name languages level')
    .populate('driver', 'name licenseNumber level')
    .populate('itinerary.places')
    .sort({ createdAt: -1 })
    .limit(6);

    console.log(`Found ${packages.length} featured packages`);

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
    console.log('GET /api/packages/:id - ID:', req.params.id);
    
    console.log('Finding package with ID:', req.params.id);
    
    let package = await Package.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('tourType', 'name description')
      .populate('vehicle', 'name model type')
      .populate('guide', 'name languages level')
      .populate('itinerary.places');
    
    console.log('Package found:', package ? 'yes' : 'no');
    if (package) {
      console.log('Driver field before populate:', package.driver);
      console.log('Driver type:', typeof package.driver);
      
      // Manually populate driver if it's not populated
      if (typeof package.driver === 'string') {
        console.log('Driver is string, attempting manual populate with ID:', package.driver);
        const driver = await Driver.findById(package.driver).select('name licenseNumber level experience');
        if (driver) {
          package.driver = driver;
          console.log('Driver populated manually:', driver);
        } else {
          console.log('Driver not found with ID:', package.driver);
        }
      }
    }

    if (!package) {
      console.log('Package not found');
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    console.log('Package found:', package.title);

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
router.post('/', protect, authorize('admin'), upload.any(), [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('tourType')
    .notEmpty()
    .withMessage('Tour type is required'),
  body('days')
    .isInt({ min: 1 })
    .withMessage('Days must be at least 1'),
  body('nights')
    .isInt({ min: 0 })
    .withMessage('Nights cannot be negative'),
  body('vehicle')
    .notEmpty()
    .withMessage('Vehicle is required'),
  body('guide')
    .notEmpty()
    .withMessage('Guide is required'),
  body('driver')
    .notEmpty()
    .withMessage('Driver is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('itinerary')
    .notEmpty()
    .withMessage('Itinerary is required')
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Itinerary must be a non-empty array');
        }
        return true;
      } catch (error) {
        throw new Error('Invalid itinerary format');
      }
    })
], async (req, res) => {
  try {
    console.log('POST /api/packages - Creating new package');
    console.log('Request body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Parse JSON fields
    const itinerary = JSON.parse(req.body.itinerary || '[]');

    // Handle package image upload
    let packageImage = null;
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      if (imageFile) {
        console.log('Processing package image upload...');
        
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'package-images',
                transformation: [
                  { width: 800, height: 600, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(imageFile.buffer);
          });

          console.log('Package image uploaded:', result.secure_url);
          packageImage = {
            public_id: result.public_id,
            url: result.secure_url
          };
        } catch (uploadError) {
          console.error('Error uploading package image:', uploadError);
        }
      }
    }

    // Handle day video uploads
    const dayVideos = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing video uploads...');
      
      for (const file of req.files) {
        if (file.fieldname.startsWith('dayVideo_')) {
          const dayIndex = parseInt(file.fieldname.split('_')[1]);
          console.log(`Processing video for day ${dayIndex}`);
          
          try {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  resource_type: 'video',
                  folder: 'package-videos',
                  transformation: [
                    { width: 1280, height: 720, crop: 'fill' },
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            });

            console.log(`Video uploaded for day ${dayIndex}:`, result.secure_url);
            dayVideos.push({
              dayIndex,
              video: {
                public_id: result.public_id,
                url: result.secure_url
              }
            });
          } catch (uploadError) {
            console.error('Error uploading day video:', uploadError);
          }
        }
      }
    }

    // Update itinerary with video data
    const updatedItinerary = itinerary.map((day, index) => {
      const videoData = dayVideos.find(v => v.dayIndex === index);
      return {
        ...day,
        video: videoData ? videoData.video : null
      };
    });

    const packageData = {
      title: req.body.title,
      description: req.body.description,
      tourType: req.body.tourType,
      days: parseInt(req.body.days),
      nights: parseInt(req.body.nights),
      vehicle: req.body.vehicle,
      guide: req.body.guide,
      driver: req.body.driver,
      price: parseFloat(req.body.price),
      featured: req.body.featured === 'true',
      image: packageImage,
      itinerary: updatedItinerary,
      createdBy: req.user.id
    };

    console.log('Package data to create:', packageData);

    const newPackage = await Package.create(packageData);

    console.log('Package created successfully:', newPackage._id);

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
router.put('/:id', protect, authorize('admin'), upload.any(), [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('tourType')
    .notEmpty()
    .withMessage('Tour type is required'),
  body('days')
    .isInt({ min: 1 })
    .withMessage('Days must be at least 1'),
  body('nights')
    .isInt({ min: 0 })
    .withMessage('Nights cannot be negative'),
  body('vehicle')
    .notEmpty()
    .withMessage('Vehicle is required'),
  body('guide')
    .notEmpty()
    .withMessage('Guide is required'),
  body('driver')
    .notEmpty()
    .withMessage('Driver is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    console.log('PUT /api/packages/:id - Updating package:', req.params.id);
    console.log('Request body:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const package = await Package.findById(req.params.id);

    if (!package) {
      console.log('Package not found for update');
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Handle package image upload if any
    let packageImage = package.image; // Keep existing image by default
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      if (imageFile) {
        console.log('Processing package image upload for update...');
        
        try {
          // Delete old image if it exists
          if (package.image && package.image.public_id) {
            await cloudinary.uploader.destroy(package.image.public_id);
            console.log('Old package image deleted');
          }
          
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'package-images',
                transformation: [
                  { width: 800, height: 600, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(imageFile.buffer);
          });

          console.log('Package image uploaded for update:', result.secure_url);
          packageImage = {
            public_id: result.public_id,
            url: result.secure_url
          };
        } catch (uploadError) {
          console.error('Error uploading package image for update:', uploadError);
        }
      }
    }

    // Handle video uploads if any
    let updatedItinerary = package.itinerary;
    if (req.files && req.files.length > 0) {
      console.log('Processing video uploads for update...');
      
      for (const file of req.files) {
        if (file.fieldname.startsWith('dayVideo_')) {
          const dayIndex = parseInt(file.fieldname.split('_')[1]);
          console.log(`Processing video for day ${dayIndex}`);
          
          try {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  resource_type: 'video',
                  folder: 'package-videos',
                  transformation: [
                    { width: 1280, height: 720, crop: 'fill' },
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            });

            console.log(`Video uploaded for day ${dayIndex}:`, result.secure_url);
            
            // Update the specific day's video
            if (updatedItinerary[dayIndex]) {
              updatedItinerary[dayIndex].video = {
                public_id: result.public_id,
                url: result.secure_url
              };
            }
          } catch (uploadError) {
            console.error('Error uploading day video:', uploadError);
          }
        }
      }
    }

    // Parse itinerary if provided
    if (req.body.itinerary) {
      const itinerary = JSON.parse(req.body.itinerary);
      updatedItinerary = itinerary.map((day, index) => {
        // Preserve existing video if not being updated
        const existingVideo = package.itinerary[index]?.video;
        return {
          ...day,
          video: day.video || existingVideo
        };
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      tourType: req.body.tourType,
      days: parseInt(req.body.days),
      nights: parseInt(req.body.nights),
      vehicle: req.body.vehicle,
      guide: req.body.guide,
      driver: req.body.driver,
      price: parseFloat(req.body.price),
      featured: req.body.featured === 'true',
      image: packageImage,
      itinerary: updatedItinerary
    };

    console.log('Update data:', updateData);

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('tourType', 'name description')
     .populate('vehicle', 'name model type')
     .populate('guide', 'name languages level')
     .populate('driver', 'name licenseNumber level')
     .populate('itinerary.places');

    console.log('Package updated successfully');

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
    console.log('DELETE /api/packages/:id - Deleting package:', req.params.id);

    const package = await Package.findById(req.params.id);

    if (!package) {
      console.log('Package not found for deletion');
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Delete package image from Cloudinary if it exists
    if (package.image && package.image.public_id) {
      try {
        await cloudinary.uploader.destroy(package.image.public_id);
        console.log('Deleted package image from Cloudinary:', package.image.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting package image from Cloudinary:', cloudinaryError);
      }
    }

    // Delete videos from Cloudinary if they exist
    if (package.itinerary && package.itinerary.length > 0) {
      for (const day of package.itinerary) {
        if (day.video && day.video.public_id) {
          try {
            await cloudinary.uploader.destroy(day.video.public_id, { resource_type: 'video' });
            console.log('Deleted video from Cloudinary:', day.video.public_id);
          } catch (cloudinaryError) {
            console.error('Error deleting video from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    await Package.findByIdAndDelete(req.params.id);

    console.log('Package deleted successfully');

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

module.exports = router; 