const mongoose = require('mongoose');

const customInquirySchema = new mongoose.Schema({
  // User information (optional for public inquiries)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  // Contact information
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },

  // Trip details
  tripDetails: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    travellers: {
      type: Number,
      required: [true, 'Number of travellers is required'],
      min: [1, 'At least 1 traveller required'],
      max: [50, 'Maximum 50 travellers allowed']
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: [1, 'At least 1 day required']
    },
    totalNights: {
      type: Number,
      required: [true, 'Total nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },

  // Itinerary
  itinerary: [{
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true
    },
    day: {
      type: Number,
      required: true,
      min: [1, 'Day must be at least 1'],
      max: [365, 'Day cannot exceed 365']
    },
    timeOfDay: {
      type: String,
      enum: ['day', 'night'],
      required: true
    },
    nights: {
      type: Number,
      required: true,
      min: [0, 'Nights cannot be negative'],
      max: [30, 'Maximum 30 nights per place']
    },
    order: {
      type: Number,
      required: true
    }
  }],

  // Preferences
  preferences: {
    hotelTier: {
      id: String,
      name: String,
      stars: Number,
      pricePerNight: Number
    },
    // New structure
    selectedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    selectedTourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourGuide'
    },
    selectedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    // Legacy structure for backward compatibility
    vehicle: {
      id: String,
      name: String,
      pricePerDay: Number
    },
    tourGuide: {
      id: String,
      name: String,
      pricePerDay: Number
    },
    driver: {
      id: String,
      name: String,
      pricePerDay: Number
    }
  },

  // Cost breakdown
  costBreakdown: {
    hotelCost: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Hotel cost cannot be negative']
    },
    transportCost: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Transport cost cannot be negative']
    },
    guideCost: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Guide cost cannot be negative']
    },
    driverCost: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Driver cost cannot be negative']
    },
    taxes: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    totalCost: {
      type: Number,
      required: true,
      min: [0, 'Total cost cannot be negative']
    }
  },

  // Additional requirements
  additionalRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional requirements cannot exceed 1000 characters']
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },

  // Admin notes
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters']
  },

  // Quote details (filled by admin)
  quote: {
    finalPrice: {
      type: Number,
      min: [0, 'Final price cannot be negative']
    },
    validUntil: {
      type: Date
    },
    terms: {
      type: String,
      trim: true
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  quotedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
customInquirySchema.index({ user: 1 });
customInquirySchema.index({ status: 1 });
customInquirySchema.index({ createdAt: -1 });
customInquirySchema.index({ 'contactInfo.email': 1 });

// Pre-save middleware to update updatedAt
customInquirySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for public profile (excluding sensitive data)
customInquirySchema.methods.getPublicProfile = function() {
  const inquiry = this.toObject();
  return inquiry;
};

// Static method to get inquiries by status
customInquirySchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('user', 'name email').populate('itinerary.place', 'name location');
};

// Instance method to update status
customInquirySchema.methods.updateStatus = function(newStatus, adminNotes = '') {
  this.status = newStatus;
  this.adminNotes = adminNotes;
  
  if (newStatus === 'reviewed') {
    this.reviewedAt = new Date();
  } else if (newStatus === 'quoted') {
    this.quotedAt = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('CustomInquiry', customInquirySchema); 