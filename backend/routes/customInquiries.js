const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const CustomInquiry = require('../models/CustomInquiry');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/custom-inquiries
// @desc    Create a new custom package inquiry
// @access  Public
router.post('/', [
  body('contactInfo.name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('contactInfo.email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('tripDetails.startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('tripDetails.travellers')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of travellers must be between 1 and 50'),
  body('tripDetails.totalDays')
    .isInt({ min: 1 })
    .withMessage('Total days must be at least 1'),
  body('tripDetails.totalNights')
    .isInt({ min: 0 })
    .withMessage('Total nights cannot be negative'),
  body('itinerary')
    .isArray({ min: 1 })
    .withMessage('At least one destination is required'),
  body('itinerary.*.place')
    .notEmpty()
    .withMessage('Place is required for each itinerary item'),
  body('itinerary.*.nights')
    .isInt({ min: 0, max: 30 })
    .withMessage('Nights must be between 0 and 30'),
  body('costBreakdown.totalCost')
    .isFloat({ min: 0 })
    .withMessage('Total cost must be a positive number')
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

    // Additional validation for contact info
    if (!req.body.contactInfo || !req.body.contactInfo.name || !req.body.contactInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Contact information (name and email) is required'
      });
    }

    // Validate start date is in the future
    if (req.body.tripDetails && req.body.tripDetails.startDate) {
      const startDate = new Date(req.body.tripDetails.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      
      if (startDate <= today) {
        return res.status(400).json({
          success: false,
          message: 'Trip start date must be in the future'
        });
      }
    }

    // Create the custom inquiry
    const inquiryData = {
      ...req.body
    };
    
    // Debug logging
    console.log('Creating custom inquiry with data:', {
      contactInfo: inquiryData.contactInfo,
      tripDetails: inquiryData.tripDetails,
      preferences: inquiryData.preferences,
      selectedVehicle: inquiryData.preferences?.selectedVehicle,
      selectedTourGuide: inquiryData.preferences?.selectedTourGuide,
      selectedDriver: inquiryData.preferences?.selectedDriver,
      itineraryLength: inquiryData.itinerary?.length,
      costBreakdown: inquiryData.costBreakdown
    });
    
    // If user is authenticated, associate with user account
    if (req.user) {
      inquiryData.user = req.user.id;
    }

    // Add order to itinerary items
    if (inquiryData.itinerary && inquiryData.itinerary.length > 0) {
      inquiryData.itinerary = inquiryData.itinerary.map((item, index) => ({
        ...item,
        order: index + 1
      }));
    }

    // Validate and clean ObjectId references in preferences
    if (inquiryData.preferences) {
      // Ensure selectedVehicle is a valid ObjectId or null
      if (inquiryData.preferences.selectedVehicle && !mongoose.Types.ObjectId.isValid(inquiryData.preferences.selectedVehicle)) {
        console.log('Invalid selectedVehicle ObjectId:', inquiryData.preferences.selectedVehicle);
        inquiryData.preferences.selectedVehicle = null;
      }
      
      // Ensure selectedTourGuide is a valid ObjectId or null
      if (inquiryData.preferences.selectedTourGuide && !mongoose.Types.ObjectId.isValid(inquiryData.preferences.selectedTourGuide)) {
        console.log('Invalid selectedTourGuide ObjectId:', inquiryData.preferences.selectedTourGuide);
        inquiryData.preferences.selectedTourGuide = null;
      }
      
      // Ensure selectedDriver is a valid ObjectId or null
      if (inquiryData.preferences.selectedDriver && !mongoose.Types.ObjectId.isValid(inquiryData.preferences.selectedDriver)) {
        console.log('Invalid selectedDriver ObjectId:', inquiryData.preferences.selectedDriver);
        inquiryData.preferences.selectedDriver = null;
      }
    }

    const customInquiry = new CustomInquiry(inquiryData);
    console.log('Custom inquiry object before save:', {
      preferences: customInquiry.preferences,
      selectedVehicle: customInquiry.preferences?.selectedVehicle,
      selectedTourGuide: customInquiry.preferences?.selectedTourGuide,
      selectedDriver: customInquiry.preferences?.selectedDriver
    });
    await customInquiry.save();

    // Populate references for response
    if (customInquiry.user) {
      await customInquiry.populate('user', 'name email');
    }
    await customInquiry.populate('itinerary.place', 'name location');
    
    // Manually populate the nested references
    if (customInquiry.preferences?.selectedVehicle) {
      const Vehicle = require('../models/Vehicle');
      const vehicle = await Vehicle.findById(customInquiry.preferences.selectedVehicle).select('name type capacity');
      if (vehicle) {
        customInquiry.preferences.selectedVehicle = {
          _id: vehicle._id,
          name: vehicle.name,
          type: vehicle.type,
          capacity: vehicle.capacity
        };
      }
    }
    if (customInquiry.preferences?.selectedTourGuide) {
      const TourGuide = require('../models/TourGuide');
      const tourGuide = await TourGuide.findById(customInquiry.preferences.selectedTourGuide).select('name languages rating');
      if (tourGuide) {
        customInquiry.preferences.selectedTourGuide = {
          _id: tourGuide._id.toString(),
          name: tourGuide.name,
          languages: tourGuide.languages,
          rating: tourGuide.rating
        };
      }
    }
    if (customInquiry.preferences?.selectedDriver) {
      const Driver = require('../models/Driver');
      const driver = await Driver.findById(customInquiry.preferences.selectedDriver).select('name licenseType rating');
      if (driver) {
        customInquiry.preferences.selectedDriver = {
          _id: driver._id.toString(),
          name: driver.name,
          licenseType: driver.licenseType,
          rating: driver.rating
        };
      }
    }

    res.status(201).json({
      success: true,
      message: 'Custom package inquiry submitted successfully',
      data: {
        inquiry: customInquiry
      }
    });
  } catch (error) {
    console.error('Error creating custom inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating custom inquiry'
    });
  }
});

// @route   GET /api/custom-inquiries
// @desc    Get all custom inquiries (admin) or user's inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // If user is not admin, only show their inquiries
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    } else {
      // For admin, show all inquiries including those without users
      // No additional filter needed
    }

    const inquiries = await CustomInquiry.find(query)
      .populate('user', 'name email')
      .populate('itinerary.place', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Manually populate the nested references
    for (let i = 0; i < inquiries.length; i++) {
      const inquiry = inquiries[i];
      console.log('Processing inquiry:', inquiry._id);
      
      // Convert to plain object to ensure modifications work
      const inquiryObj = inquiry.toObject();
      
      if (inquiryObj.preferences?.selectedVehicle) {
        console.log('Found selectedVehicle ID:', inquiryObj.preferences.selectedVehicle);
        const Vehicle = require('../models/Vehicle');
        const vehicle = await Vehicle.findById(inquiryObj.preferences.selectedVehicle).select('name type capacity');
        console.log('Found vehicle:', vehicle);
        if (vehicle) {
          inquiryObj.preferences.selectedVehicle = {
            _id: vehicle._id.toString(),
            name: vehicle.name,
            type: vehicle.type,
            capacity: vehicle.capacity
          };
        }
      }
      
      if (inquiryObj.preferences?.selectedTourGuide) {
        console.log('Found selectedTourGuide ID:', inquiryObj.preferences.selectedTourGuide);
        const TourGuide = require('../models/TourGuide');
        const tourGuide = await TourGuide.findById(inquiryObj.preferences.selectedTourGuide).select('name languages rating');
        console.log('Found tourGuide:', tourGuide);
        if (tourGuide) {
          // Convert to plain object to ensure proper serialization
          inquiryObj.preferences.selectedTourGuide = {
            _id: tourGuide._id.toString(),
            name: tourGuide.name,
            languages: tourGuide.languages,
            rating: tourGuide.rating
          };
          console.log('Assigned tourGuide object:', inquiryObj.preferences.selectedTourGuide);
        }
      }
      
      if (inquiryObj.preferences?.selectedDriver) {
        console.log('Found selectedDriver ID:', inquiryObj.preferences.selectedDriver);
        const Driver = require('../models/Driver');
        const driver = await Driver.findById(inquiryObj.preferences.selectedDriver).select('name licenseType rating');
        console.log('Found driver:', driver);
        if (driver) {
          // Convert to plain object to ensure proper serialization
          inquiryObj.preferences.selectedDriver = {
            _id: driver._id.toString(),
            name: driver.name,
            licenseType: driver.licenseType,
            rating: driver.rating
          };
          console.log('Assigned driver object:', inquiryObj.preferences.selectedDriver);
        }
      }
      
      // Replace the original inquiry with the modified plain object
      inquiries[i] = inquiryObj;
    }

    const total = await CustomInquiry.countDocuments(query);

    // Debug logging for first inquiry
    if (inquiries.length > 0) {
      console.log('First inquiry preferences:', {
        selectedVehicle: inquiries[0].preferences?.selectedVehicle,
        selectedTourGuide: inquiries[0].preferences?.selectedTourGuide,
        selectedDriver: inquiries[0].preferences?.selectedDriver,
        vehicle: inquiries[0].preferences?.vehicle,
        tourGuide: inquiries[0].preferences?.tourGuide,
        driver: inquiries[0].preferences?.driver
      });
    }

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching custom inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching custom inquiries'
    });
  }
});

// @route   GET /api/custom-inquiries/:id
// @desc    Get single custom inquiry
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const inquiry = await CustomInquiry.findById(req.params.id)
      .populate('user', 'name email')
      .populate('itinerary.place', 'name location');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }

    // Manually populate the nested references
    if (inquiry.preferences?.selectedVehicle) {
      const Vehicle = require('../models/Vehicle');
      const vehicle = await Vehicle.findById(inquiry.preferences.selectedVehicle).select('name type capacity');
      if (vehicle) {
        inquiry.preferences.selectedVehicle = {
          _id: vehicle._id,
          name: vehicle.name,
          type: vehicle.type,
          capacity: vehicle.capacity
        };
      }
    }
    if (inquiry.preferences?.selectedTourGuide) {
      const TourGuide = require('../models/TourGuide');
      const tourGuide = await TourGuide.findById(inquiry.preferences.selectedTourGuide).select('name languages rating');
      if (tourGuide) {
        inquiry.preferences.selectedTourGuide = {
          _id: tourGuide._id.toString(),
          name: tourGuide.name,
          languages: tourGuide.languages,
          rating: tourGuide.rating
        };
      }
    }
    if (inquiry.preferences?.selectedDriver) {
      const Driver = require('../models/Driver');
      const driver = await Driver.findById(inquiry.preferences.selectedDriver).select('name licenseType rating');
      if (driver) {
        inquiry.preferences.selectedDriver = {
          _id: driver._id.toString(),
          name: driver.name,
          licenseType: driver.licenseType,
          rating: driver.rating
        };
      }
    }

    // Check if user can access this inquiry
    if (req.user.role !== 'admin' && inquiry.user && inquiry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    res.json({
      success: true,
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Error fetching custom inquiry:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching custom inquiry'
    });
  }
});

// @route   PUT /api/custom-inquiries/:id/status
// @desc    Update custom inquiry status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Admin notes cannot exceed 2000 characters')
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

    const inquiry = await CustomInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }

    // Update status
    await inquiry.updateStatus(req.body.status, req.body.adminNotes || '');

    // Populate references for response
    await inquiry.populate('user', 'name email');
    await inquiry.populate('itinerary.place', 'name location');

    res.json({
      success: true,
      message: 'Custom inquiry status updated successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Error updating custom inquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating custom inquiry status'
    });
  }
});

// @route   PUT /api/custom-inquiries/:id/quote
// @desc    Add quote to custom inquiry (admin only)
// @access  Private/Admin
router.put('/:id/quote', protect, authorize('admin'), [
  body('finalPrice')
    .isFloat({ min: 0 })
    .withMessage('Final price must be a positive number'),
  body('validUntil')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('terms')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Terms cannot exceed 1000 characters')
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

    const inquiry = await CustomInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }

    // Update quote details
    inquiry.quote = {
      finalPrice: req.body.finalPrice,
      validUntil: req.body.validUntil ? new Date(req.body.validUntil) : undefined,
      terms: req.body.terms
    };

    // Update status to quoted
    inquiry.status = 'quoted';
    inquiry.quotedAt = new Date();

    await inquiry.save();

    // Populate references for response
    await inquiry.populate('user', 'name email');
    await inquiry.populate('itinerary.place', 'name location');

    res.json({
      success: true,
      message: 'Quote added successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Error adding quote to custom inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding quote'
    });
  }
});

// @route   DELETE /api/custom-inquiries/:id
// @desc    Delete custom inquiry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const inquiry = await CustomInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }

    // Check if user can delete this inquiry
    if (req.user.role !== 'admin' && inquiry.user && inquiry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this inquiry'
      });
    }

    await CustomInquiry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Custom inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom inquiry:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Custom inquiry not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting custom inquiry'
    });
  }
});

module.exports = router; 