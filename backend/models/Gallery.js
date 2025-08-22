const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Type is required']
  },
  // For images
  image: {
    url: {
      type: String,
      required: false
    },
    publicId: {
      type: String,
      required: false
    }
  },
  // For videos
  video: {
    youtubeUrl: {
      type: String,
      required: function() { return this.type === 'video'; }
    },
    videoId: {
      type: String,
      required: function() { return this.type === 'video'; }
    },
    thumbnail: {
      type: String
    }
  },
  category: {
    type: String,
    enum: ['destinations', 'activities', 'events', 'hotels', 'transport', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
gallerySchema.index({ type: 1, category: 1, featured: 1 });
gallerySchema.index({ createdAt: -1 });

// Extract YouTube video ID from URL
gallerySchema.methods.extractYouTubeId = function(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Generate YouTube thumbnail URL
gallerySchema.methods.getYouTubeThumbnail = function(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Pre-save middleware to extract YouTube video ID and thumbnail
gallerySchema.pre('save', function(next) {
  if (this.type === 'video' && this.video && this.video.youtubeUrl) {
    const videoId = this.extractYouTubeId(this.video.youtubeUrl);
    if (videoId) {
      this.video.videoId = videoId;
      this.video.thumbnail = this.getYouTubeThumbnail(videoId);
    }
  }
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);
