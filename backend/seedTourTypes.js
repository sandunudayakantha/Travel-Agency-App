const mongoose = require('mongoose');
const TourType = require('./models/TourType');
require('dotenv').config();

// Sample tour types data
const tourTypesData = [
  {
    name: 'Adventure Tours',
    description: 'Thrilling outdoor activities and extreme sports for adrenaline seekers.',
    image: {
      public_id: 'tour-types/default-adventure',
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      caption: 'Adventure Tours'
    },
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Cultural Tours',
    description: 'Immerse yourself in local traditions, history, and cultural experiences.',
    image: {
      public_id: 'tour-types/default-cultural',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      caption: 'Cultural Tours'
    },
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Beach Tours',
    description: 'Relax and unwind on pristine beaches with crystal clear waters.',
    image: {
      public_id: 'tour-types/default-beach',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
      caption: 'Beach Tours'
    },
    featured: true,
    sortOrder: 3
  },
  {
    name: 'City Tours',
    description: 'Explore vibrant cities with guided tours of landmarks and attractions.',
    image: {
      public_id: 'tour-types/default-city',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      caption: 'City Tours'
    },
    featured: false,
    sortOrder: 4
  },
  {
    name: 'Nature Tours',
    description: 'Discover the beauty of natural landscapes and wildlife.',
    image: {
      public_id: 'tour-types/default-nature',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      caption: 'Nature Tours'
    },
    featured: false,
    sortOrder: 5
  },
  {
    name: 'Luxury Tours',
    description: 'Premium travel experiences with high-end accommodations and services.',
    image: {
      public_id: 'tour-types/default-luxury',
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
      caption: 'Luxury Tours'
    },
    featured: false,
    sortOrder: 6
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedTourTypes();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function seedTourTypes() {
  try {
    // Clear existing tour types
    await TourType.deleteMany({});
    console.log('Cleared existing tour types');

    // Create a default admin user ID (you may need to adjust this)
    const defaultAdminId = new mongoose.Types.ObjectId();

    // Insert tour types
    const tourTypesWithAdmin = tourTypesData.map(tourType => ({
      ...tourType,
      createdBy: defaultAdminId
    }));

    const result = await TourType.insertMany(tourTypesWithAdmin);
    console.log(`Successfully seeded ${result.length} tour types:`);
    
    result.forEach(tourType => {
      console.log(`- ${tourType.name}`);
    });

    console.log('Tour types seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tour types:', error);
    process.exit(1);
  }
} 