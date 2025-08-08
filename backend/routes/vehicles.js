const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Vehicle = require('../models/Vehicle');
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

// Debug Cloudinary configuration
console.log('=== CLOUDINARY CONFIGURATION DEBUG ===');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set (length: ' + process.env.CLOUDINARY_API_KEY.length + ')' : 'NOT SET');
console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set (length: ' + process.env.CLOUDINARY_API_SECRET.length + ')' : 'NOT SET');
console.log('=== END CLOUDINARY DEBUG ===');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Test endpoint to check if the route is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Vehicle routes are working',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check if a vehicle exists
router.get('/test/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json({
        success: true,
        message: 'Vehicle found',
        vehicle: {
          id: vehicle._id,
          name: vehicle.name,
          model: vehicle.model
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'Error checking vehicle',
      error: error.message
    });
  }
});

// @route   GET /api/vehicles
// @desc    Get all vehicles with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('type').optional().isIn(['sedan', 'suv', 'van', 'bus', 'minibus', 'luxury', 'economy', 'sports', 'electric', 'hybrid']),
  query('availability').optional().isIn(['available', 'unavailable', 'maintenance', 'booked']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minPassengers').optional().isInt({ min: 1 }),
  query('maxPassengers').optional().isInt({ min: 1 }),
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
      type,
      availability,
      minPrice,
      maxPrice,
      minPassengers,
      maxPassengers,
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (availability) filter.availability = availability;

    // Price filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Passenger capacity filter
    if (minPassengers || maxPassengers) {
      filter.passengerCapacity = {};
      if (minPassengers) filter.passengerCapacity.$gte = parseInt(minPassengers);
      if (maxPassengers) filter.passengerCapacity.$lte = parseInt(maxPassengers);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const vehicles = await Vehicle.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        vehicles,
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
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vehicles'
    });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get single vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name avatar');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: { vehicle }
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vehicle'
    });
  }
});

// @route   POST /api/vehicles
// @desc    Create new vehicle (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.array('images', 10), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Vehicle name must be between 2 and 100 characters'),
  body('model')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle model must be between 1 and 50 characters'),
  body('type')
    .isIn(['sedan', 'suv', 'van', 'bus', 'minibus', 'luxury', 'economy', 'sports', 'electric', 'hybrid'])
    .withMessage('Invalid vehicle type'),
  body('passengerCapacity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Passenger capacity must be between 1 and 100'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    console.log('=== VEHICLE CREATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Files:', req.files ? req.files.length : 'No files');
    console.log('User ID:', req.user.id);
    
    // Parse nested objects if they're strings before validation
    let parsedBody = { ...req.body };
    
    console.log('=== PARSING DEBUG ===');
    console.log('Original price type:', typeof req.body.price);
    console.log('Original price value:', req.body.price);
    console.log('Original location type:', typeof req.body.location);
    console.log('Original location value:', req.body.location);
    
    if (req.body.price && typeof req.body.price === 'string') {
      try {
        parsedBody.price = JSON.parse(req.body.price);
        console.log('Parsed price:', parsedBody.price);
      } catch (parseError) {
        console.error('Error parsing price:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid price format'
        });
      }
    } else if (req.body.price && typeof req.body.price === 'object') {
      console.log('Price is already an object:', req.body.price);
      parsedBody.price = req.body.price;
    }
    
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        parsedBody.location = JSON.parse(req.body.location);
        console.log('Parsed location:', parsedBody.location);
      } catch (parseError) {
        console.error('Error parsing location:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid location format'
        });
      }
    } else if (req.body.location && typeof req.body.location === 'object') {
      console.log('Location is already an object:', req.body.location);
      parsedBody.location = req.body.location;
    }
    
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        parsedBody.specifications = JSON.parse(req.body.specifications);
        console.log('Parsed specifications:', parsedBody.specifications);
      } catch (parseError) {
        console.error('Error parsing specifications:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid specifications format'
        });
      }
    } else if (req.body.specifications && typeof req.body.specifications === 'object') {
      console.log('Specifications is already an object:', req.body.specifications);
      parsedBody.specifications = req.body.specifications;
    }
    
    console.log('=== END PARSING DEBUG ===');
    
    // Update req.body with parsed data for validation
    req.body = parsedBody;
    
    // Check for validation errors
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    
    // Additional validation for parsed objects
    console.log('Checking price validation. Price object:', req.body.price);
    console.log('Price amount:', req.body.price?.amount);
    console.log('Price amount type:', typeof req.body.price?.amount);
    
    if (req.body.price && (!req.body.price.amount || req.body.price.amount <= 0)) {
      errors.errors.push({
        type: 'field',
        value: req.body.price.amount,
        msg: 'Price must be a positive number',
        path: 'price.amount',
        location: 'body'
      });
    }
    
    // Check location fields for empty strings
    if (!req.body.location.city || req.body.location.city.trim() === '') {
      errors.errors.push({
        type: 'field',
        value: req.body.location.city,
        msg: 'City is required',
        path: 'location.city',
        location: 'body'
      });
    }
    
    if (!req.body.location.country || req.body.location.country.trim() === '') {
      errors.errors.push({
        type: 'field',
        value: req.body.location.country,
        msg: 'Country is required',
        path: 'location.country',
        location: 'body'
      });
    }
    
    if (!errors.isEmpty()) {
      console.log('Validation failed, returning errors');
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    console.log('Validation passed, processing images...');

    // Upload images to Cloudinary
    const imagePromises = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} images...`);
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary credentials not configured. Skipping image upload.');
        // For now, we'll skip image upload if Cloudinary is not configured
        // In production, you might want to store images locally or use a different service
      } else {
        for (const file of req.files) {
          console.log('Uploading file:', file.originalname);
          try {
            const result = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'vehicles',
                  transformation: [
                    { width: 800, height: 600, crop: 'fill' },
                    { quality: 'auto' }
                  ]
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                  } else {
                    console.log('Image uploaded successfully:', result.public_id);
                    resolve(result);
                  }
                }
              );
              stream.end(file.buffer);
            });
            
            imagePromises.push({
              public_id: result.public_id,
              url: result.secure_url
            });
          } catch (uploadError) {
            console.error('Failed to upload image:', uploadError);
            throw uploadError;
          }
        }
      }
    } else {
      console.log('No images to upload');
    }

    console.log('Building vehicle data...');
    const vehicleData = {
      ...req.body,
      createdBy: req.user.id,
      images: imagePromises
    };

    console.log('Vehicle data before parsing:', JSON.stringify(vehicleData, null, 2));

    // Parse features array if it's a string
    if (req.body.features && typeof req.body.features === 'string') {
      console.log('Parsing features string:', req.body.features);
      try {
        vehicleData.features = JSON.parse(req.body.features);
        console.log('Parsed features:', vehicleData.features);
      } catch (parseError) {
        console.error('Error parsing features:', parseError);
        vehicleData.features = [];
      }
    }

    console.log('Final vehicle data:', JSON.stringify(vehicleData, null, 2));

    console.log('Creating vehicle in database...');
    const newVehicle = await Vehicle.create(vehicleData);
    console.log('Vehicle created successfully:', newVehicle._id);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: { vehicle: newVehicle }
    });
    console.log('=== VEHICLE CREATION END ===');
  } catch (error) {
    console.error('=== VEHICLE CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.error('=== END ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating vehicle'
    });
  }
});

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), async (req, res) => {
  try {
    console.log('=== VEHICLE UPDATE START ===');
    console.log('Vehicle ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Files:', req.files ? req.files.length : 'No files');
    console.log('User ID:', req.user.id);
    
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      console.log('Vehicle not found');
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    console.log('Vehicle found, parsing request data...');

    // Parse nested objects if they're strings before processing
    let parsedBody = { ...req.body };
    
    console.log('=== UPDATE PARSING DEBUG ===');
    console.log('Original price type:', typeof req.body.price);
    console.log('Original price value:', req.body.price);
    console.log('Original location type:', typeof req.body.location);
    console.log('Original location value:', req.body.location);
    
    if (req.body.price && typeof req.body.price === 'string') {
      try {
        parsedBody.price = JSON.parse(req.body.price);
        console.log('Parsed price:', parsedBody.price);
      } catch (parseError) {
        console.error('Error parsing price:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid price format'
        });
      }
    } else if (req.body.price && typeof req.body.price === 'object') {
      console.log('Price is already an object:', req.body.price);
      parsedBody.price = req.body.price;
    }
    
    if (req.body.location && typeof req.body.location === 'string') {
      try {
        parsedBody.location = JSON.parse(req.body.location);
        console.log('Parsed location:', parsedBody.location);
      } catch (parseError) {
        console.error('Error parsing location:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid location format'
        });
      }
    } else if (req.body.location && typeof req.body.location === 'object') {
      console.log('Location is already an object:', req.body.location);
      parsedBody.location = req.body.location;
    }
    
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        parsedBody.specifications = JSON.parse(req.body.specifications);
        console.log('Parsed specifications:', parsedBody.specifications);
      } catch (parseError) {
        console.error('Error parsing specifications:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid specifications format'
        });
      }
    } else if (req.body.specifications && typeof req.body.specifications === 'object') {
      console.log('Specifications is already an object:', req.body.specifications);
      parsedBody.specifications = req.body.specifications;
    }
    
    console.log('=== END UPDATE PARSING DEBUG ===');
    
    // Update req.body with parsed data
    req.body = parsedBody;

    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} new images...`);
      
      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary credentials not configured. Skipping image upload.');
        return res.status(500).json({
          success: false,
          message: 'Image upload service not configured'
        });
      }
      
      // Delete old images from Cloudinary
      console.log('Deleting old images from Cloudinary...');
      for (const image of vehicle.images) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
          console.log('Deleted old image:', image.public_id);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }

      // Upload new images
      const imagePromises = [];
      for (const file of req.files) {
        console.log('Uploading new file:', file.originalname);
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'vehicles',
                transformation: [
                  { width: 800, height: 600, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error);
                } else {
                  console.log('New image uploaded successfully:', result.public_id);
                  resolve(result);
                }
              }
            );
            stream.end(file.buffer);
          });
          
          imagePromises.push({
            public_id: result.public_id,
            url: result.secure_url
          });
        } catch (uploadError) {
          console.error('Failed to upload new image:', uploadError);
          throw uploadError;
        }
      }
      req.body.images = imagePromises;
    } else {
      console.log('No new images to upload');
    }

    // Parse features array if it's a string
    if (req.body.features && typeof req.body.features === 'string') {
      console.log('Parsing features string:', req.body.features);
      try {
        req.body.features = JSON.parse(req.body.features);
        console.log('Parsed features:', req.body.features);
      } catch (parseError) {
        console.error('Error parsing features:', parseError);
        req.body.features = [];
      }
    }

    console.log('Final update data:', JSON.stringify(req.body, null, 2));

    // Update vehicle
    console.log('Updating vehicle in database...');
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Vehicle updated successfully:', updatedVehicle._id);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: { vehicle: updatedVehicle }
    });
    console.log('=== VEHICLE UPDATE END ===');
  } catch (error) {
    console.error('=== VEHICLE UPDATE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.error('=== END UPDATE ERROR ===');
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating vehicle'
    });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Delete images from Cloudinary
    for (const image of vehicle.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting vehicle'
    });
  }
});

// @route   GET /api/vehicles/types
// @desc    Get all available vehicle types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const types = await Vehicle.distinct('type');
    
    res.json({
      success: true,
      data: { types }
    });
  } catch (error) {
    console.error('Get vehicle types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vehicle types'
    });
  }
});

module.exports = router; 