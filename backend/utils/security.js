const crypto = require('crypto');

// Generate a secure random secret
const generateSecureSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Validate JWT secret strength
const validateJWTSecret = (secret) => {
  if (!secret) return false;
  if (secret.length < 32) return false;
  if (secret === 'your-super-secret-jwt-key-change-this-in-production') return false;
  return true;
};

// Hash sensitive data (for logging)
const hashSensitiveData = (data) => {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.toString()).digest('hex').substring(0, 8);
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePasswordStrength = (password) => {
  if (!password || password.length < 6) return false;
  return true;
};

// Sanitize user input for logging
const sanitizeForLogging = (input) => {
  if (!input) return '';
  return input.toString()
    .replace(/password/gi, '[REDACTED]')
    .replace(/token/gi, '[REDACTED]')
    .replace(/secret/gi, '[REDACTED]')
    .replace(/key/gi, '[REDACTED]');
};

module.exports = {
  generateSecureSecret,
  validateJWTSecret,
  hashSensitiveData,
  validateEmail,
  validatePasswordStrength,
  sanitizeForLogging
};
