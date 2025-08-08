const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  // For custom packages
  customPackage: {
    title: String,
    destination: String,
    duration: {
      days: Number,
      nights: Number
    },
    description: String,
    requirements: [String],
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    }
  },
  bookingType: {
    type: String,
    enum: ['package', 'custom'],
    required: true
  },
  travelers: [{
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    dateOfBirth: Date,
    passportNumber: String,
    specialRequirements: String
  }],
  travelDates: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  groupSize: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least one adult is required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants count cannot be negative']
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    fees: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  accommodation: {
    type: {
      type: String,
      enum: ['standard', 'deluxe', 'suite', 'luxury'],
      default: 'standard'
    },
    specialRequests: String
  },
  transportation: {
    type: {
      type: String,
      enum: ['economy', 'business', 'first-class'],
      default: 'economy'
    },
    specialRequests: String
  },
  additionalServices: [{
    name: String,
    description: String,
    price: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paidAt: Date
  },
  cancellation: {
    requestedAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed'],
      default: 'pending'
    }
  },
  specialRequests: String,
  notes: String,
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  insurance: {
    included: {
      type: Boolean,
      default: false
    },
    provider: String,
    policyNumber: String,
    coverage: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  review: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: String,
    date: Date
  }
}, {
  timestamps: true
});

// Virtual for total travelers
bookingSchema.virtual('totalTravelers').get(function() {
  return this.groupSize.adults + this.groupSize.children + this.groupSize.infants;
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.travelDates.startDate && this.travelDates.endDate) {
    const diffTime = Math.abs(this.travelDates.endDate - this.travelDates.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Pre-save middleware to calculate total price
bookingSchema.pre('save', function(next) {
  if (this.isModified('pricing.basePrice') || this.isModified('pricing.discount') || 
      this.isModified('pricing.taxes') || this.isModified('pricing.fees')) {
    
    const additionalServicesTotal = this.additionalServices.reduce((sum, service) => sum + (service.price || 0), 0);
    
    this.pricing.total = this.pricing.basePrice - this.pricing.discount + 
                        this.pricing.taxes + this.pricing.fees + additionalServicesTotal;
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const travelStart = new Date(this.travelDates.startDate);
  const daysUntilTravel = Math.ceil((travelStart - now) / (1000 * 60 * 60 * 24));
  
  return this.status === 'confirmed' || this.status === 'paid' && daysUntilTravel > 7;
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canBeCancelled()) {
    return 0;
  }
  
  const now = new Date();
  const travelStart = new Date(this.travelDates.startDate);
  const daysUntilTravel = Math.ceil((travelStart - now) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 1;
  
  if (daysUntilTravel <= 7) {
    refundPercentage = 0.5; // 50% refund if cancelled within 7 days
  } else if (daysUntilTravel <= 14) {
    refundPercentage = 0.75; // 75% refund if cancelled within 14 days
  }
  
  return this.pricing.total * refundPercentage;
};

module.exports = mongoose.model('Booking', bookingSchema); 