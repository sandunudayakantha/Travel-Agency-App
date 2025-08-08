const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
    maxlength: [100, 'Vehicle name cannot exceed 100 characters']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
    maxlength: [50, 'Vehicle model cannot exceed 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['sedan', 'suv', 'van', 'bus', 'minibus', 'luxury', 'economy', 'sports', 'electric', 'hybrid'],
    default: 'sedan'
  },
  passengerCapacity: {
    type: Number,
    required: [true, 'Passenger capacity is required'],
    min: [1, 'Passenger capacity must be at least 1'],
    max: [100, 'Passenger capacity cannot exceed 100']
  },
  description: {
    type: String,
    required: [true, 'Vehicle description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      default: 'USD'
    },
    perDay: {
      type: Boolean,
      default: true
    }
  },
  availability: {
    type: String,
    enum: ['available', 'unavailable', 'maintenance', 'booked'],
    default: 'available'
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    address: String
  },
  specifications: {
    year: {
      type: Number,
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    mileage: {
      type: Number,
      min: [0, 'Mileage cannot be negative']
    },
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'hydrogen'],
      default: 'gasoline'
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'cvt'],
      default: 'automatic'
    },
    engineSize: String,
    color: String
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Update average rating when reviews are added/updated
vehicleSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

// Get public profile (without sensitive data)
vehicleSchema.methods.getPublicProfile = function() {
  const vehicleObject = this.toObject();
  delete vehicleObject.createdBy;
  return vehicleObject;
};

module.exports = mongoose.model('Vehicle', vehicleSchema); 