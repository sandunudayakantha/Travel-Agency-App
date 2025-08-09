const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Place = require('../models/Place');
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

// Configure multer for file uploads (images and videos)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Middleware to preprocess JSON strings in FormData
const preprocessFormData = (req, res, next) => {
  try {
    // Parse images metadata if it's a string
    if (req.body.imagesMetadata && typeof req.body.imagesMetadata === 'string') {
      console.log('Preprocessing images metadata:', req.body.imagesMetadata);
      try {
        req.body.imagesMetadata = JSON.parse(req.body.imagesMetadata);
      } catch (parseError) {
        console.error('Error preprocessing images metadata:', parseError);
        req.body.imagesMetadata = [];
      }
    }
    
    // Parse videos metadata if it's a string
    if (req.body.videosMetadata && typeof req.body.videosMetadata === 'string') {
      console.log('Preprocessing videos metadata:', req.body.videosMetadata);
      try {
        req.body.videosMetadata = JSON.parse(req.body.videosMetadata);
      } catch (parseError) {
        console.error('Error preprocessing videos metadata:', parseError);
        req.body.videosMetadata = [];
      }
    }
    
    // Parse location if it's a string
    if (req.body.location && typeof req.body.location === 'string') {
      console.log('Preprocessing location:', req.body.location);
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (parseError) {
        console.error('Error preprocessing location:', parseError);
        req.body.location = {};
      }
    }
    
    // Parse tags if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      console.log('Preprocessing tags:', req.body.tags);
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (parseError) {
        console.error('Error preprocessing tags:', parseError);
        req.body.tags = [];
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in preprocessFormData middleware:', error);
    next();
  }
};

// @route   GET /api/places/test
// @desc    Test endpoint for places routes
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Places routes are working',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/places/categories/list
// @desc    Get list of all available categories
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = [
    'attraction', 'restaurant', 'hotel', 'museum', 'park', 'beach', 
    'mountain', 'landmark', 'religious', 'shopping', 'entertainment',
    'nature', 'historical', 'cultural', 'adventure', 'other'
  ];

  res.json({
    success: true,
    data: {
      categories: categories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    }
  });
});

// @route   GET /api/places
// @desc    Get all places with filters and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('status').optional().isIn(['active', 'inactive', 'draft']),
  query('featured').optional().isBoolean(),
  query('search').optional().isString(),
  query('country').optional().isString(),
  query('city').optional().isString()
], async (req, res) => {
  try {
    console.log('=== GET PLACES START ===');
    console.log('Query params:', req.query);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
    if (req.query.country) filter['location.country'] = new RegExp(req.query.country, 'i');
    if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i');

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    console.log('Applied filters:', filter);

    // Get places with pagination
    const places = await Place.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalPlaces = await Place.countDocuments(filter);
    const totalPages = Math.ceil(totalPlaces / limit);

    console.log(`Found ${places.length} places, total: ${totalPlaces}`);

    res.json({
      success: true,
      data: {
        places: places.map(place => place.getPublicProfile()),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalPlaces,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    console.log('=== GET PLACES END ===');
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching places'
    });
  }
});

// @route   GET /api/places/:id
// @desc    Get single place by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log('=== GET SINGLE PLACE START ===');
    console.log('Place ID:', req.params.id);

    const place = await Place.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    console.log('Place found:', place.name);

    res.json({
      success: true,
      data: {
        place: place.getPublicProfile()
      }
    });
    console.log('=== GET SINGLE PLACE END ===');
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching place'
    });
  }
});

// @route   POST /api/places
// @desc    Create new place (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.array('files', 20), preprocessFormData, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Place name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['attraction', 'restaurant', 'hotel', 'museum', 'park', 'beach', 'mountain', 'landmark', 'religious', 'shopping', 'entertainment', 'nature', 'historical', 'cultural', 'adventure', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    console.log('=== PLACE CREATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Files count:', req.files ? req.files.length : 0);
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

    console.log('Validation passed, processing media files...');

    // Process uploaded files (images and videos)
    const processedImages = [];
    const processedVideos = [];

    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'files...');
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`Processing file ${i + 1}:`, file.originalname, file.mimetype);

        try {
          if (file.mimetype.startsWith('image/')) {
            // Upload image to Cloudinary
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'places/images',
                  transformation: [
                    { width: 1200, height: 800, crop: 'fill' },
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary image upload error:', error);
                    reject(error);
                  } else {
                    console.log('Image uploaded successfully:', result.public_id);
                    resolve(result);
                  }
                }
              );
              stream.end(file.buffer);
            });
            
            // Get metadata for this image
            const imageMetadata = req.body.imagesMetadata && req.body.imagesMetadata[processedImages.length] 
              ? req.body.imagesMetadata[processedImages.length] 
              : {};
            
            processedImages.push({
              public_id: result.public_id,
              url: result.secure_url,
              caption: imageMetadata.caption || '',
              isPrimary: imageMetadata.isPrimary || processedImages.length === 0
            });
          } else if (file.mimetype.startsWith('video/')) {
            // Upload video to Cloudinary
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'places/videos',
                  resource_type: 'video',
                  transformation: [
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary video upload error:', error);
                    reject(error);
                  } else {
                    console.log('Video uploaded successfully:', result.public_id);
                    resolve(result);
                  }
                }
              );
              stream.end(file.buffer);
            });
            
            // Get metadata for this video
            const videoMetadata = req.body.videosMetadata && req.body.videosMetadata[processedVideos.length] 
              ? req.body.videosMetadata[processedVideos.length] 
              : {};
            
            processedVideos.push({
              public_id: result.public_id,
              url: result.secure_url,
              title: videoMetadata.title || '',
              duration: result.duration || 0,
              thumbnail: {
                public_id: result.public_id + '_thumbnail',
                url: result.secure_url.replace(/\.[^/.]+$/, '.jpg')
              }
            });
          }
        } catch (uploadError) {
          console.error(`Failed to upload file ${file.originalname}:`, uploadError);
          // Continue with other files instead of failing completely
        }
      }
    }

    console.log('Building place data...');
    const placeData = {
      name: req.body.name,
      description: req.body.description,
      shortDescription: req.body.shortDescription || '',
      images: processedImages,
      videos: processedVideos,
      location: req.body.location || {},
      category: req.body.category || 'attraction',
      tags: req.body.tags || [],
      status: req.body.status || 'active',
      featured: req.body.featured === 'true' || req.body.featured === true,
      createdBy: req.user.id
    };

    console.log('Final place data:', JSON.stringify(placeData, null, 2));

    console.log('Creating place in database...');
    const place = await Place.create(placeData);

    console.log('Place created successfully:', place._id);

    res.status(201).json({
      success: true,
      message: 'Place created successfully',
      data: {
        place: place.getPublicProfile()
      }
    });
    console.log('=== PLACE CREATION END ===');
  } catch (error) {
    console.error('=== PLACE CREATION ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error creating place'
    });
    console.log('=== PLACE CREATION ERROR END ===');
  }
});

// @route   PUT /api/places/:id
// @desc    Update place (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.array('files', 20), preprocessFormData, async (req, res) => {
  try {
    console.log('=== PLACE UPDATE START ===');
    console.log('Place ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Files count:', req.files ? req.files.length : 0);
    console.log('User ID:', req.user.id);

    // Find the place
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    console.log('Place found, processing updates...');

    // Process new uploaded files if any
    const newImages = [...(place.images || [])];
    const newVideos = [...(place.videos || [])];

    if (req.files && req.files.length > 0) {
      console.log('Processing new media files...');
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`Processing new file ${i + 1}:`, file.originalname, file.mimetype);

        try {
          if (file.mimetype.startsWith('image/')) {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'places/images',
                  transformation: [
                    { width: 1200, height: 800, crop: 'fill' },
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
            
            const imageMetadata = req.body.imagesMetadata && req.body.imagesMetadata[newImages.length] 
              ? req.body.imagesMetadata[newImages.length] 
              : {};
            
            newImages.push({
              public_id: result.public_id,
              url: result.secure_url,
              caption: imageMetadata.caption || '',
              isPrimary: imageMetadata.isPrimary || false
            });
          } else if (file.mimetype.startsWith('video/')) {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'places/videos',
                  resource_type: 'video'
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            });
            
            const videoMetadata = req.body.videosMetadata && req.body.videosMetadata[newVideos.length] 
              ? req.body.videosMetadata[newVideos.length] 
              : {};
            
            newVideos.push({
              public_id: result.public_id,
              url: result.secure_url,
              title: videoMetadata.title || '',
              duration: result.duration || 0,
              thumbnail: {
                public_id: result.public_id + '_thumbnail',
                url: result.secure_url.replace(/\.[^/.]+$/, '.jpg')
              }
            });
          }
        } catch (uploadError) {
          console.error(`Failed to upload new file ${file.originalname}:`, uploadError);
        }
      }
    }

    // Update place data
    const updateData = {
      updatedBy: req.user.id
    };

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.shortDescription !== undefined) updateData.shortDescription = req.body.shortDescription;
    if (req.body.location) updateData.location = req.body.location;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.tags) updateData.tags = req.body.tags;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.featured !== undefined) updateData.featured = req.body.featured === 'true' || req.body.featured === true;
    
    updateData.images = newImages;
    updateData.videos = newVideos;

    console.log('Updating place in database...');
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('updatedBy', 'name email');

    console.log('Place updated successfully:', updatedPlace._id);

    res.json({
      success: true,
      message: 'Place updated successfully',
      data: {
        place: updatedPlace.getPublicProfile()
      }
    });
    console.log('=== PLACE UPDATE END ===');
  } catch (error) {
    console.error('Place update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating place'
    });
  }
});

// @route   DELETE /api/places/:id
// @desc    Delete place (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('=== PLACE DELETION START ===');
    console.log('Place ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    console.log('Place found, deleting media files from Cloudinary...');

    // Delete images from Cloudinary
    if (place.images && place.images.length > 0) {
      for (const image of place.images) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
          console.log('Image deleted from Cloudinary:', image.public_id);
        } catch (deleteError) {
          console.error('Error deleting image from Cloudinary:', deleteError);
        }
      }
    }

    // Delete videos from Cloudinary
    if (place.videos && place.videos.length > 0) {
      for (const video of place.videos) {
        try {
          await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
          console.log('Video deleted from Cloudinary:', video.public_id);
        } catch (deleteError) {
          console.error('Error deleting video from Cloudinary:', deleteError);
        }
      }
    }

    console.log('Deleting place from database...');
    await Place.findByIdAndDelete(req.params.id);

    console.log('Place deleted successfully');

    res.json({
      success: true,
      message: 'Place deleted successfully'
    });
    console.log('=== PLACE DELETION END ===');
  } catch (error) {
    console.error('Place deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting place'
    });
  }
});

module.exports = router; 