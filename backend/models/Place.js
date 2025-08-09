const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    maxlength: [100, 'Place name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Place description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Video title cannot exceed 200 characters']
    },
    duration: {
      type: Number, // Duration in seconds
      min: 0
    },
    thumbnail: {
      public_id: String,
      url: String
    }
  }],
  location: {
    // Google Places API details
    googlePlaceId: {
      type: String,
      trim: true
    },
    formattedAddress: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    // Administrative divisions
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name cannot exceed 100 characters']
    },
    region: {
      type: String,
      trim: true,
      maxlength: [100, 'Region name cannot exceed 100 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters']
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Postal code cannot exceed 20 characters']
    },
    // Additional Google Places data
    placeTypes: [{
      type: String,
      trim: true
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    priceLevel: {
      type: Number,
      min: 0,
      max: 4
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    openingHours: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      open: String,
      close: String
    }]
  },
  category: {
    type: String,
    enum: [
      'attraction', 'restaurant', 'hotel', 'museum', 'park', 'beach', 
      'mountain', 'landmark', 'religious', 'shopping', 'entertainment',
      'nature', 'historical', 'cultural', 'adventure', 'other'
    ],
    default: 'attraction'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
PlaceSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
PlaceSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ status: 1 });
PlaceSchema.index({ featured: 1 });
PlaceSchema.index({ tags: 1 });

// Virtual for primary image
PlaceSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || (this.images.length > 0 ? this.images[0] : null);
});

// Virtual for image count
PlaceSchema.virtual('imageCount').get(function() {
  return this.images.length;
});

// Virtual for video count
PlaceSchema.virtual('videoCount').get(function() {
  return this.videos.length;
});

// Method to get public profile (excluding sensitive data)
PlaceSchema.methods.getPublicProfile = function() {
  const place = this.toObject();
  return place;
};

// Pre-save middleware to ensure only one primary image
PlaceSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image, set others to false
      let foundFirst = false;
      this.images.forEach(img => {
        if (img.isPrimary && !foundFirst) {
          foundFirst = true;
        } else if (img.isPrimary) {
          img.isPrimary = false;
        }
      });
    } else if (primaryImages.length === 0 && this.images.length > 0) {
      // If no primary image, make the first one primary
      this.images[0].isPrimary = true;
    }
  }
  next();
});

module.exports = mongoose.model('Place', PlaceSchema); 