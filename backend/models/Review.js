const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: false // Made optional for general reviews
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: false, // Made optional for general reviews
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    public_id: String,
    url: String
  }],
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per package (only when package is provided)
reviewSchema.index({ user: 1, package: 1 }, { unique: true, sparse: true });

// Pre-save middleware to add console logs for debugging
reviewSchema.pre('save', function(next) {
  console.log('Saving review:', {
    user: this.user,
    package: this.package,
    rating: this.rating,
    title: this.title,
    commentLength: this.comment ? this.comment.length : 0
  });
  next();
});

// Pre-find middleware to add console logs for debugging
reviewSchema.pre('find', function() {
  // Removed debug logging to prevent infinite loop
});

reviewSchema.pre('findOne', function() {
  // Removed debug logging to prevent infinite loop
});

// Error handling middleware
reviewSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving review:', error.message);
    console.error('Validation errors:', error.errors);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      console.error('Duplicate key error - user may have already reviewed this package');
      return next(new Error('You have already reviewed this package'));
    }
  } else {
    console.log('Review saved successfully:', doc._id);
  }
  next();
});

// Static method to calculate average rating for a package
reviewSchema.statics.getAverageRating = async function(packageId) {
  // Validate packageId
  if (!packageId || packageId === 'undefined' || packageId.trim() === '') {
    console.log('getAverageRating: Invalid packageId provided:', packageId);
    return {
      averageRating: 0,
      numReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  try {
    const stats = await this.aggregate([
      {
        $match: { package: packageId, isApproved: true }
      },
      {
        $group: {
          _id: '$package',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

  if (stats.length > 0) {
    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    stats[0].ratingDistribution.forEach(rating => {
      ratingDistribution[rating]++;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numReviews: stats[0].numReviews,
      ratingDistribution
    };
  }

  return {
    averageRating: 0,
    numReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
  } catch (error) {
    console.error('getAverageRating: Error calculating stats:', error);
    return {
      averageRating: 0,
      numReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
};

// Note: Rating updates are handled directly in the routes for better reliability

// Note: Rating updates are handled directly in the routes for better reliability

// Add pagination plugin
reviewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Review', reviewSchema); 