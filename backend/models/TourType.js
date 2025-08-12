const mongoose = require('mongoose');

const tourTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour type name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Tour type name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    public_id: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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
  timestamps: true
});

// Indexes for better query performance
tourTypeSchema.index({ name: 1 });
tourTypeSchema.index({ status: 1 });
tourTypeSchema.index({ featured: 1 });
tourTypeSchema.index({ sortOrder: 1 });

// Virtual for public profile (excluding sensitive data)
tourTypeSchema.methods.getPublicProfile = function() {
  const tourType = this.toObject();
  return tourType;
};

module.exports = mongoose.model('TourType', tourTypeSchema); 