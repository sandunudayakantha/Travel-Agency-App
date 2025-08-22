const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, in case message is from non-registered user
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replyMessage: {
    type: String,
    trim: true,
    maxlength: [2000, 'Reply message cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

// Index for search functionality
messageSchema.index({ 
  name: 'text', 
  email: 'text',
  subject: 'text',
  message: 'text'
});

// Index for status and priority queries
messageSchema.index({ status: 1, priority: 1, createdAt: -1 });

// Pre-save middleware to add console logs for debugging
messageSchema.pre('save', function(next) {
  console.log('Saving message:', {
    name: this.name,
    email: this.email,
    subject: this.subject,
    status: this.status,
    priority: this.priority,
    hasUser: !!this.user
  });
  next();
});

// Error handling middleware
messageSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving message:', error.message);
    console.error('Validation errors:', error.errors);
  } else {
    console.log('Message saved successfully:', doc._id);
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
