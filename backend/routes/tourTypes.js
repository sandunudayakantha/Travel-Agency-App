const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const TourType = require('../models/TourType');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @route   GET /api/tour-types
// @desc    Get all tour types
// @access  Public
router.get('/', async (req, res) => {
  console.log('GET /api/tour-types - Fetching all tour types');
  try {
    const { status, featured, sort } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';
    
    // Build sort
    let sortOption = { sortOrder: 1, createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    
    const tourTypes = await TourType.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    console.log(`Found ${tourTypes.length} tour types`);
    
    res.json({
      success: true,
      count: tourTypes.length,
      tourTypes
    });
  } catch (error) {
    console.error('Error fetching tour types:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tour types'
    });
  }
});

// @route   GET /api/tour-types/:id
// @desc    Get single tour type by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tourType = await TourType.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!tourType) {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }
    
    res.json({
      success: true,
      tourType
    });
  } catch (error) {
    console.error('Error fetching tour type:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tour type'
    });
  }
});

// @route   POST /api/tour-types
// @desc    Create a new tour type
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), [
  body('name')
    .notEmpty()
    .withMessage('Tour type name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tour type name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
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

    const { name, description, featured, sortOrder } = req.body;
    let imageData = null;

    // Handle image upload
    if (req.file) {
      console.log('Uploading tour type image to Cloudinary...');
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'tour-types',
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'jpg'
        });

        imageData = {
          public_id: result.public_id,
          url: result.secure_url,
          caption: req.body.imageCaption || ''
        };

        console.log('Tour type image uploaded successfully:', result.public_id);
      } catch (uploadError) {
        console.error('Failed to upload tour type image:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Check if tour type already exists
    const existingTourType = await TourType.findOne({ name: name.trim() });
    if (existingTourType) {
      return res.status(400).json({
        success: false,
        message: 'Tour type with this name already exists'
      });
    }

    // Create new tour type
    const newTourType = new TourType({
      name: name.trim(),
      description: description ? description.trim() : '',
      image: imageData || null,
      featured: featured === 'true',
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      createdBy: req.user.id
    });

    await newTourType.save();
    console.log('Tour type saved successfully:', newTourType._id);

    // Populate user info
    await newTourType.populate('createdBy', 'name email');

    console.log('Tour type created and populated:', newTourType.name);
    res.status(201).json({
      success: true,
      tourType: newTourType,
      message: 'Tour type created successfully'
    });
  } catch (error) {
    console.error('Error creating tour type:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Server error while creating tour type',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/tour-types/:id
// @desc    Update a tour type
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.single('image'), [
  body('name')
    .notEmpty()
    .withMessage('Tour type name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tour type name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
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

    const { name, description, featured, sortOrder } = req.body;
    let imageData = null;

    // Handle image upload
    if (req.file) {
      console.log('Uploading updated tour type image to Cloudinary...');
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'tour-types',
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'jpg'
        });

        imageData = {
          public_id: result.public_id,
          url: result.secure_url,
          caption: req.body.imageCaption || ''
        };

        console.log('Tour type image updated successfully:', result.public_id);
      } catch (uploadError) {
        console.error('Failed to upload tour type image:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Find tour type
    const tourType = await TourType.findById(req.params.id);
    if (!tourType) {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }

    // Check if another tour type with this name exists
    const existingTourType = await TourType.findOne({ 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingTourType) {
      return res.status(400).json({
        success: false,
        message: 'Tour type with this name already exists'
      });
    }

    // Delete old image if new image is uploaded
    if (imageData && tourType.image && tourType.image.public_id) {
      try {
        console.log('Deleting old tour type image from Cloudinary...');
        await cloudinary.uploader.destroy(tourType.image.public_id);
        console.log('Old image deleted from Cloudinary:', tourType.image.public_id);
      } catch (deleteError) {
        console.error('Failed to delete old image:', deleteError);
      }
    }

    // Update tour type
    tourType.name = name.trim();
    tourType.description = description !== undefined ? (description ? description.trim() : '') : tourType.description;
    if (imageData !== null) tourType.image = imageData;
    tourType.featured = featured !== undefined ? (featured === 'true') : tourType.featured;
    tourType.sortOrder = sortOrder !== undefined ? parseInt(sortOrder) : tourType.sortOrder;
    tourType.updatedBy = req.user.id;

    await tourType.save();

    // Populate user info
    await tourType.populate('createdBy', 'name email');
    await tourType.populate('updatedBy', 'name email');

    res.json({
      success: true,
      tourType,
      message: 'Tour type updated successfully'
    });
  } catch (error) {
    console.error('Error updating tour type:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating tour type'
    });
  }
});

// @route   DELETE /api/tour-types/:id
// @desc    Delete a tour type
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Find tour type
    const tourType = await TourType.findById(req.params.id);
    if (!tourType) {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }

    // Delete image from Cloudinary
    if (tourType.image && tourType.image.public_id) {
      try {
        console.log('Deleting tour type image from Cloudinary...');
        await cloudinary.uploader.destroy(tourType.image.public_id);
        console.log('Image deleted from Cloudinary:', tourType.image.public_id);
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
    }

    // Remove tour type
    await TourType.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      tourType: {
        id: tourType._id,
        name: tourType.name
      },
      message: 'Tour type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour type:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Tour type not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tour type'
    });
  }
});

module.exports = router; 