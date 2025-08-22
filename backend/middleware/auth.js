const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  console.log('Protect middleware - checking authentication');
  console.log('Headers:', req.headers.authorization ? 'Authorization header present' : 'No authorization header');
  console.log('Cookies:', req.cookies ? 'Cookies present' : 'No cookies');

  // Check if token exists in cookies (HTTP-only cookie)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  }
  // Fallback to headers for API clients
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in authorization header');
  }

  // Check if token exists
  if (!token) {
    console.log('No token found - authentication failed');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    console.log('Verifying JWT token...');
    // Verify token
    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET not configured - authentication failed');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user ID:', decoded.id);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User authenticated:', {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    });

    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorization check:', {
      userRole: req.user.role,
      requiredRoles: roles,
      userId: req.user._id,
      userEmail: req.user.email
    });
    
    if (!roles.includes(req.user.role)) {
      console.log('Access denied: User role not authorized');
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    console.log('Access granted: User role authorized');
    next();
  };
};

// Admin middleware - require admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Optional authentication - doesn't require token but adds user if available
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we don't want to block the request
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
}; 