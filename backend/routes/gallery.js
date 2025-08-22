const express = require('express');
const { body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const Gallery = require('../models/Gallery');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all gallery items (public)
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, featured, page = 1, limit = 12, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get gallery items
    const galleryItems = await Gallery.find(filter)
      .populate('createdBy', 'name')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Gallery.countDocuments(filter);

    res.json({
      success: true,
      data: {
        galleryItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: skip + galleryItems.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Gallery GET error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery items'
    });
  }
});

// @desc    Get gallery categories (public)
// @route   GET /api/gallery/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Gallery categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// @desc    Get single gallery item (public)
// @route   GET /api/gallery/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery GET by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery item'
    });
  }
});

// @desc    Create gallery item (admin only)
// @route   POST /api/gallery
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('type')
    .isIn(['image', 'video'])
    .withMessage('Type must be either image or video'),
  body('category')
    .optional()
    .isIn(['destinations', 'activities', 'events', 'hotels', 'transport', 'general'])
    .withMessage('Invalid category'),
  body('youtubeUrl')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
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

    const { title, description, type, category, youtubeUrl, tags, featured, order } = req.body;

    // Validate type-specific requirements
    if (type === 'image' && !req.file) {
      // For image type without file, create a placeholder or skip image processing
      console.log('Image type selected but no file uploaded - creating item without image');
    }

    if (type === 'video' && !youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required for video type'
      });
    }

    // Handle tags properly
    let parsedTags = [];
    if (tags) {
      try {
        if (typeof tags === 'string') {
          parsedTags = JSON.parse(tags);
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch (e) {
        console.log('Error parsing tags:', e);
        parsedTags = [];
      }
    }

    let galleryData = {
      title,
      description,
      type,
      category: category || 'general',
      tags: parsedTags,
      featured: featured === 'true',
      order: order ? parseInt(order) : 0,
      createdBy: req.user.id
    };

    if (type === 'image' && req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gallery',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto' }
        ]
      });

      galleryData.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    } else if (type === 'image' && !req.file) {
      // Create image item without actual image file (placeholder)
      galleryData.image = {
        url: 'https://via.placeholder.com/1200x800?text=No+Image+Uploaded',
        publicId: 'placeholder'
      };
    } else if (type === 'video') {
      // Extract YouTube video ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = youtubeUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (!videoId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL'
        });
      }

      galleryData.video = {
        youtubeUrl,
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    }

    const galleryItem = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery POST error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery item'
    });
  }
});

// @desc    Update gallery item (admin only)
// @route   PUT /api/gallery/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.single('image'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['destinations', 'activities', 'events', 'hotels', 'transport', 'general'])
    .withMessage('Invalid category'),
  body('youtubeUrl')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
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

    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const { title, description, category, youtubeUrl, tags, featured, order } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = JSON.parse(tags);
    if (featured !== undefined) updateData.featured = featured === 'true';
    if (order !== undefined) updateData.order = parseInt(order);

    // Handle image update
    if (galleryItem.type === 'image' && req.file) {
      // Delete old image from Cloudinary
      if (galleryItem.image && galleryItem.image.publicId) {
        await cloudinary.uploader.destroy(galleryItem.image.publicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gallery',
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto' }
        ]
      });

      updateData.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Handle video update
    if (galleryItem.type === 'video' && youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = youtubeUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (!videoId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL'
        });
      }

      updateData.video = {
        youtubeUrl,
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    }

    const updatedGalleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    res.json({
      success: true,
      data: updatedGalleryItem
    });
  } catch (error) {
    console.error('Gallery PUT error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item'
    });
  }
});

// @desc    Delete gallery item (admin only)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Delete image from Cloudinary if it exists
    if (galleryItem.type === 'image' && galleryItem.image && galleryItem.image.publicId) {
      await cloudinary.uploader.destroy(galleryItem.image.publicId);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item'
    });
  }
});

module.exports = router;
