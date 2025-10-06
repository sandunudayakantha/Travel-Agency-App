const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      default: '+1 (555) 123-4567'
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'info@seekinglanka.com'
    },
    address: {
      type: String,
      trim: true,
      default: '123 Travel Street, Tourism City, TC 12345'
    },
    workingHours: {
      type: String,
      trim: true,
      default: 'Monday - Friday: 9:00 AM - 6:00 PM'
    }
  },

  // Social Media Links
  socialMedia: {
    facebook: {
      type: String,
      trim: true,
      default: 'https://facebook.com/seekinglanka'
    },
    twitter: {
      type: String,
      trim: true,
      default: 'https://twitter.com/seekinglanka'
    },
    instagram: {
      type: String,
      trim: true,
      default: 'https://instagram.com/seekinglanka'
    },
    linkedin: {
      type: String,
      trim: true,
      default: 'https://linkedin.com/company/seekinglanka'
    },
    youtube: {
      type: String,
      trim: true,
      default: 'https://youtube.com/seekinglanka'
    }
  },

  // Company Information
  companyInfo: {
    name: {
      type: String,
      trim: true,
      default: 'SeekingLanka'
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Your Journey Begins Here'
    },
    description: {
      type: String,
      trim: true,
      default: 'We provide exceptional travel experiences with personalized service and unforgettable adventures.'
    },
    website: {
      type: String,
      trim: true,
      default: 'https://seekinglanka.com'
    }
  },

  // SEO Settings
  seo: {
    title: {
      type: String,
      trim: true,
      default: 'SeekingLanka - Your Sri Lankan Journey Begins Here'
    },
    description: {
      type: String,
      trim: true,
      default: 'Discover amazing travel destinations and book your next adventure with our expert travel services.'
    },
    keywords: {
      type: String,
      trim: true,
      default: 'travel, tourism, vacation, booking, adventure, destinations'
    }
  },

  // Footer Information
  footer: {
    copyright: {
      type: String,
      trim: true,
      default: '© 2024 SeekingLanka. All rights reserved.'
    },
    additionalLinks: [{
      title: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      }
    }]
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update settings
siteSettingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
