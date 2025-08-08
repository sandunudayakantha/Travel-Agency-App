const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  category: {
    type: String,
    enum: ['adventure', 'beach', 'cultural', 'city', 'nature', 'luxury', 'budget', 'family'],
    required: [true, 'Category is required']
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  groupSize: {
    min: {
      type: Number,
      default: 1,
      min: [1, 'Minimum group size must be at least 1']
    },
    max: {
      type: Number,
      default: 20,
      min: [1, 'Maximum group size must be at least 1']
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'expert'],
    default: 'moderate'
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    perPerson: {
      type: Boolean,
      default: true
    },
    includesTaxes: {
      type: Boolean,
      default: true
    }
  },
  discount: {
    percentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100']
    },
    validUntil: Date
  },
  images: [{
    public_id: String,
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    public_id: String,
    url: String,
    caption: String,
    duration: Number // in seconds
  }],
  highlights: [{
    type: String,
    maxlength: [100, 'Highlight cannot exceed 100 characters']
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    activities: [String],
    accommodation: String,
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    }
  }],
  included: [String], // What's included in the package
  excluded: [String], // What's not included
  requirements: [String], // Requirements for travelers
  accommodation: {
    type: {
      type: String,
      enum: ['hotel', 'hostel', 'resort', 'camping', 'homestay', 'luxury'],
      default: 'hotel'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    description: String
  },
  transportation: {
    type: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'boat', 'mixed'],
      default: 'mixed'
    },
    description: String
  },
  guide: {
    included: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['local', 'professional', 'specialist'],
      default: 'local'
    },
    languages: [String]
  },
  seasonality: {
    bestTime: {
      start: {
        type: String,
        enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      },
      end: {
        type: String,
        enum: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      }
    },
    weather: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
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
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'sold-out'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
packageSchema.index({ 
  title: 'text', 
  description: 'text', 
  destination: 'text', 
  country: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for discounted price
packageSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount.percentage && this.discount.validUntil > new Date()) {
    return this.price.amount * (1 - this.discount.percentage / 100);
  }
  return this.price.amount;
});

// Method to update average rating
packageSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Package', packageSchema); 