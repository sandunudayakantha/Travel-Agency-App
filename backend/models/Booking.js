const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make user optional for public bookings
  },
  packageName: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  extraNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ userEmail: 1 });
bookingSchema.index({ packageName: 1 });

// Pre-save middleware for validation
bookingSchema.pre('save', function(next) {
  // Only validate start date for new bookings, not updates
  if (this.isNew && this.startDate && this.startDate <= new Date()) {
    return next(new Error('Start date must be in the future'));
  }
  next();
});

// Method to mark as reviewed
bookingSchema.methods.markAsReviewed = function(adminId, notes = '') {
  this.status = 'reviewed';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;
  return this.save();
};

// Method to confirm booking
bookingSchema.methods.confirm = function(adminId, notes = '') {
  this.status = 'confirmed';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;
  return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancel = function(adminId, notes = '') {
  this.status = 'cancelled';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema); 