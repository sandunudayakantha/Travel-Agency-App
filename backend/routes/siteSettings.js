const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SiteSettings = require('../models/SiteSettings');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/site-settings
// @desc    Get site settings (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching site settings'
    });
  }
});

// @route   PUT /api/site-settings
// @desc    Update site settings
// @access  Private/Admin
router.put('/', protect, authorize('admin'), [
  // Contact Info validation
  body('contactInfo.phone')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Phone number must be between 1 and 50 characters'),
  
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('contactInfo.address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be between 1 and 200 characters'),
  
  body('contactInfo.workingHours')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Working hours must be between 1 and 100 characters'),

  // Social Media validation
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Facebook URL'),
  
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Instagram URL'),
  
  body('socialMedia.linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  
  body('socialMedia.youtube')
    .optional()
    .isURL()
    .withMessage('Please provide a valid YouTube URL'),

  // Company Info validation
  body('companyInfo.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters'),
  
  body('companyInfo.tagline')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Tagline must be between 1 and 200 characters'),
  
  body('companyInfo.description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  
  body('companyInfo.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),

  // SEO validation
  body('seo.title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('SEO title must be between 1 and 100 characters'),
  
  body('seo.description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('SEO description must be between 1 and 300 characters'),
  
  body('seo.keywords')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('SEO keywords must be between 1 and 200 characters'),

  // Footer validation
  body('footer.copyright')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Copyright text must be between 1 and 200 characters')
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

    // Update settings
    const updatedSettings = await SiteSettings.updateSettings(req.body);

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating site settings'
    });
  }
});

module.exports = router;
