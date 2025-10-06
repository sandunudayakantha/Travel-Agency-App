const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
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

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie (optional; kept for compatibility)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie (optional; kept for compatibility)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info (debug endpoint)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    console.log('Current user info:', {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name
    });
    
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user info'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.getPublicProfile(),
        token: newToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
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

    const { name, phone, address, preferences } = req.body;

    // Find user and update
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
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

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
});

// @route   POST /api/auth/make-admin
// @desc    Make current user admin (debug endpoint)
// @access  Private
router.post('/make-admin', protect, async (req, res) => {
  try {
    console.log('Making user admin:', req.user.email);
    
    req.user.role = 'admin';
    await req.user.save();
    
    console.log('User role updated to admin');
    
    res.json({
      success: true,
      message: 'User role updated to admin',
      user: req.user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   POST /api/auth/clerk-sync
// @desc    Sync Clerk user with our database
// @access  Public
router.post('/clerk-sync', async (req, res) => {
  try {
    console.log('Clerk sync request body:', req.body);
    
    // Add CORS headers for Clerk requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    const { 
      clerkId, 
      email, 
      name, 
      avatar, 
      isVerified = false,
      socialProvider = null 
    } = req.body;

    if (!clerkId || !email) {
      console.log('Missing required fields:', { clerkId, email });
      return res.status(400).json({
        success: false,
        message: 'Clerk ID and email are required'
      });
    }

    // Check if user already exists in our database
    let user = await User.findOne({ email });
    console.log('Existing user found:', user ? 'yes' : 'no');

    if (user) {
      // Update existing user with Clerk information
      console.log('Updating existing user');
      user.clerkId = clerkId;
      user.name = name || user.name;
      user.isVerified = isVerified;
      user.lastLogin = new Date();
      // Preserve existing role (don't override admin role)
      
      // Handle avatar properly - it should be an object or null
      if (avatar) {
        user.avatar = {
          public_id: null, // We don't have Cloudinary public_id for Clerk avatars
          url: avatar
        };
      } else if (avatar === null) {
        user.avatar = {
          public_id: null,
          url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
        };
      }
      
      if (socialProvider) {
        user.socialProvider = socialProvider;
      } else {
        user.socialProvider = undefined; // Remove the field if null
      }

      await user.save();
      console.log('User updated successfully');
    } else {
      // Create new user from Clerk data
      console.log('Creating new user from Clerk data');
      
      // Check if this email should be an admin (you can add more admin emails here)
      const adminEmails = ['admin@wanderlust.com', 'admin@example.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      
      const userData = {
        clerkId,
        name: name || 'User',
        email,
        isVerified,
        password: 'clerk-user-' + Math.random().toString(36).substring(2), // Dummy password for Clerk users
        role: isAdmin ? 'admin' : 'user'
      };
      
      // Handle avatar properly
      if (avatar) {
        userData.avatar = {
          public_id: null,
          url: avatar
        };
      } else {
        userData.avatar = {
          public_id: null,
          url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
        };
      }
      
      // Only add socialProvider if it's not null
      if (socialProvider) {
        userData.socialProvider = socialProvider;
      }
      console.log('User data to create:', userData);
      
      user = await User.create(userData);
      console.log('User created successfully:', user._id);
    }

    // Generate JWT token for our app
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'User synced successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Clerk sync error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check for specific validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or Clerk ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during user sync',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    console.log('Logout: Clearing cookie for user:', req.user.email);
    
    // Try multiple approaches to clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    // Set cookie to expire in the past
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
      maxAge: 0
    });

    console.log('Logout: Cookie cleared successfully');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   POST /api/auth/logout/public
// @desc    Public logout (no authentication required)
// @access  Public
router.post('/logout/public', async (req, res) => {
  try {
    console.log('Public logout: Clearing any existing cookies');
    
    // Try multiple approaches to clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    // Set cookie to expire in the past
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
      maxAge: 0
    });

    console.log('Public logout: Cookie cleared successfully');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Public logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   POST /api/auth/logout/force
// @desc    Force logout - clears all possible cookie variations
// @access  Public
router.post('/logout/force', async (req, res) => {
  try {
    console.log('Force logout: Clearing all possible cookie variations');
    
    // Clear with all possible combinations
    const cookieOptions = [
      { httpOnly: true, secure: false, sameSite: 'strict', path: '/', domain: 'localhost' },
      { httpOnly: true, secure: false, sameSite: 'strict', path: '/' },
      { httpOnly: true, secure: false, sameSite: 'lax', path: '/', domain: 'localhost' },
      { httpOnly: true, secure: false, sameSite: 'lax', path: '/' },
      { httpOnly: false, secure: false, sameSite: 'strict', path: '/', domain: 'localhost' },
      { httpOnly: false, secure: false, sameSite: 'strict', path: '/' }
    ];
    
    // Clear with each option
    cookieOptions.forEach(options => {
      res.clearCookie('token', options);
      res.cookie('token', '', { ...options, expires: new Date(0), maxAge: 0 });
    });
    
    // Also try setting to empty string with past expiration
    res.cookie('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      domain: 'localhost',
      expires: new Date(0),
      maxAge: 0
    });

    console.log('Force logout: All cookie variations cleared');
    res.json({
      success: true,
      message: 'Force logout completed'
    });
  } catch (error) {
    console.error('Force logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during force logout'
    });
  }
});

module.exports = router; 