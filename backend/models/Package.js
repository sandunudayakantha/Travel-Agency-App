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
  tourType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourType',
    required: [true, 'Tour type is required']
  },
  days: {
    type: Number,
    required: [true, 'Duration in days is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  nights: {
    type: Number,
    required: [true, 'Duration in nights is required'],
    min: [0, 'Nights cannot be negative']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide',
    required: [true, 'Guide is required']
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Driver is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    public_id: String,
    url: String
  },
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
    places: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true
    }],
    video: {
      public_id: String,
      url: String
    }
  }],
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
  description: 'text'
});

// Pre-save middleware to add console logs for debugging
packageSchema.pre('save', function(next) {
  console.log('Saving package:', {
    title: this.title,
    tourType: this.tourType,
    days: this.days,
    nights: this.nights,
    vehicle: this.vehicle,
    guide: this.guide,
    driver: this.driver,
    price: this.price,
    featured: this.featured,
    itineraryLength: this.itinerary ? this.itinerary.length : 0
  });
  next();
});

// Pre-find middleware to add console logs for debugging
packageSchema.pre('find', function() {
  console.log('Finding packages with query:', this.getQuery());
});

packageSchema.pre('findOne', function() {
  console.log('Finding one package with query:', this.getQuery());
});

// Error handling middleware
packageSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving package:', error.message);
    console.error('Validation errors:', error.errors);
  } else {
    console.log('Package saved successfully:', doc._id);
  }
  next();
});

module.exports = mongoose.model('Package', packageSchema); 