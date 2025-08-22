const rateLimit = require('express-rate-limit');

// Prevent parameter pollution
const preventParameterPollution = (req, res, next) => {
  // Check for duplicate parameters in query string
  const queryParams = Object.keys(req.query);
  const uniqueParams = [...new Set(queryParams)];
  
  if (queryParams.length !== uniqueParams.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request parameters'
    });
  }
  
  next();
};

// Validate request headers
const validateHeaders = (req, res, next) => {
  // Check for suspicious headers
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-forwarded-proto'];
  const hasSuspiciousHeaders = suspiciousHeaders.some(header => 
    req.headers[header] && req.headers[header].includes('script')
  );
  
  if (hasSuspiciousHeaders) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request headers'
    });
  }
  
  next();
};

// Sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    // Remove any script tags from string values
    const sanitizeValue = (value) => {
      if (typeof value === 'string') {
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      return value;
    };
    
    const sanitizeObject = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else {
          obj[key] = sanitizeValue(obj[key]);
        }
      }
    };
    
    sanitizeObject(req.body);
  }
  
  next();
};

// Rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  preventParameterPollution,
  validateHeaders,
  sanitizeBody,
  authLimiter,
  adminLimiter
};
