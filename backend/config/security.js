// Security configuration
const securityConfig = {
  // JWT Configuration
  jwt: {
    expiresIn: '30d',
    algorithm: 'HS256'
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // General API limit
    authMax: 5, // Authentication attempts
    adminMax: 100, // Admin requests
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    }
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true
  },
  
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
      mediaSrc: ["'self'", "https:"],
    }
  },
  
  // Cookie Configuration
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  
  // Request Limits
  requestLimits: {
    json: '10mb',
    urlencoded: '10mb'
  },
  
  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
  
  // Validation Rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    },
    email: {
      allowSubdomains: true,
      allowIPDomain: false
    }
  },
  
  // Logging Configuration
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    sensitiveFields: ['password', 'token', 'secret', 'key', 'authorization'],
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
  }
};

module.exports = securityConfig;
