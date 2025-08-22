const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [80, 'Age cannot exceed 80']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  licenseType: {
    type: String,
    enum: ['light', 'heavy', 'commercial', 'special'],
    required: [true, 'License type is required']
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry date is required']
  },
  languages: [{
    type: String,
    required: true,
    trim: true
  }],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 3,
    required: true
  },
  avatar: {
    public_id: String,
    url: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
    }
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },
  toursCompleted: {
    type: Number,
    min: [0, 'Tours completed cannot be negative'],
    default: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  vehicleTypes: [{
    type: String,
    enum: ['sedan', 'suv', 'van', 'bus', 'coach', 'motorcycle'],
    required: true
  }],
  specializations: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
driverSchema.index({ 
  name: 'text', 
  email: 'text',
  bio: 'text',
  licenseNumber: 'text'
});

// Pre-save middleware to add console logs for debugging
driverSchema.pre('save', function(next) {
  console.log('Saving driver:', {
    name: this.name,
    email: this.email,
    licenseNumber: this.licenseNumber,
    level: this.level,
    experience: this.experience,
    toursCompleted: this.toursCompleted
  });
  next();
});

// Pre-find middleware to add console logs for debugging
driverSchema.pre('find', function() {
  console.log('Finding drivers with query:', this.getQuery());
});

driverSchema.pre('findOne', function() {
  console.log('Finding one driver with query:', this.getQuery());
});

// Error handling middleware
driverSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving driver:', error.message);
    console.error('Validation errors:', error.errors);
  } else {
    console.log('Driver saved successfully:', doc._id);
  }
  next();
});

module.exports = mongoose.model('Driver', driverSchema); 