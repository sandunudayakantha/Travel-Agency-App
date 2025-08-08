const mongoose = require('mongoose');
const User = require('./models/User');
const Package = require('./models/Package');
require('dotenv').config();

const samplePackages = [
  {
    title: "Bali Paradise Adventure",
    description: "Experience the magic of Bali with this comprehensive 7-day adventure. From pristine beaches to ancient temples, discover the perfect blend of culture and relaxation.",
    shortDescription: "7-day adventure exploring Bali's best beaches and cultural sites",
    destination: "Bali",
    country: "Indonesia",
    category: "adventure",
    duration: { days: 7, nights: 6 },
    groupSize: { min: 2, max: 12 },
    difficulty: "easy",
    price: {
      amount: 1299,
      currency: "USD",
      perPerson: true,
      includesTaxes: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
        caption: "Bali Beach Sunset",
        isPrimary: true
      }
    ],
    highlights: [
      "Visit Tanah Lot Temple",
      "Explore Ubud Monkey Forest",
      "Sunset at Kuta Beach",
      "Traditional Balinese Cooking Class"
    ],
    included: [
      "6 nights accommodation",
      "All meals",
      "Professional guide",
      "Transportation",
      "Entrance fees"
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses"
    ],
    requirements: [
      "Valid passport",
      "Travel insurance recommended"
    ],
    accommodation: {
      type: "resort",
      rating: 4,
      description: "4-star beachfront resort"
    },
    transportation: {
      type: "mixed",
      description: "Air-conditioned vehicles and boat transfers"
    },
    guide: {
      included: true,
      type: "local",
      languages: ["English", "Indonesian"]
    },
    featured: true,
    status: "active"
  },
  {
    title: "Swiss Alps Hiking Experience",
    description: "Embark on an unforgettable hiking adventure through the stunning Swiss Alps. Experience breathtaking mountain views, charming villages, and world-class hiking trails.",
    shortDescription: "10-day hiking adventure in the Swiss Alps",
    destination: "Zermatt",
    country: "Switzerland",
    category: "adventure",
    duration: { days: 10, nights: 9 },
    groupSize: { min: 4, max: 15 },
    difficulty: "moderate",
    price: {
      amount: 2499,
      currency: "USD",
      perPerson: true,
      includesTaxes: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        caption: "Swiss Alps",
        isPrimary: true
      }
    ],
    highlights: [
      "Hike the Matterhorn Trail",
      "Visit Zermatt Village",
      "Alpine Lake Swimming",
      "Mountain Photography Workshop"
    ],
    included: [
      "9 nights mountain lodge accommodation",
      "All meals",
      "Professional hiking guide",
      "Equipment rental",
      "Mountain passes"
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Personal hiking gear"
    ],
    requirements: [
      "Good physical fitness",
      "Hiking experience recommended",
      "Valid passport"
    ],
    accommodation: {
      type: "resort",
      rating: 4,
      description: "Traditional mountain lodge"
    },
    transportation: {
      type: "mixed",
      description: "Cable cars and hiking"
    },
    guide: {
      included: true,
      type: "professional",
      languages: ["English", "German", "French"]
    },
    featured: true,
    status: "active"
  },
  {
    title: "Tokyo Cultural Immersion",
    description: "Dive deep into Japanese culture with this comprehensive Tokyo experience. From traditional temples to modern technology, discover the perfect blend of old and new Japan.",
    shortDescription: "8-day cultural immersion in Tokyo",
    destination: "Tokyo",
    country: "Japan",
    category: "cultural",
    duration: { days: 8, nights: 7 },
    groupSize: { min: 2, max: 10 },
    difficulty: "easy",
    price: {
      amount: 1899,
      currency: "USD",
      perPerson: true,
      includesTaxes: true
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        caption: "Tokyo Streets",
        isPrimary: true
      }
    ],
    highlights: [
      "Visit Senso-ji Temple",
      "Explore Shibuya Crossing",
      "Traditional Tea Ceremony",
      "Sushi Making Class"
    ],
    included: [
      "7 nights hotel accommodation",
      "Daily breakfast",
      "Cultural activities",
      "Local guide",
      "Public transport pass"
    ],
    excluded: [
      "International flights",
      "Lunch and dinner",
      "Personal expenses"
    ],
    requirements: [
      "Valid passport",
      "Comfortable walking shoes"
    ],
    accommodation: {
      type: "hotel",
      rating: 4,
      description: "4-star hotel in central Tokyo"
    },
    transportation: {
      type: "mixed",
      description: "Public transport and walking tours"
    },
    guide: {
      included: true,
      type: "local",
      languages: ["English", "Japanese"]
    },
    featured: true,
    status: "active"
  }
];

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency');
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Package.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@wanderlust.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create regular user
    console.log('👤 Creating regular user...');
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      isVerified: true
    });
    console.log('✅ Regular user created:', regularUser.email);

    // Create sample packages
    console.log('📦 Creating sample packages...');
    for (const packageData of samplePackages) {
      const newPackage = await Package.create({
        ...packageData,
        createdBy: adminUser._id
      });
      console.log(`✅ Package created: ${newPackage.title}`);
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@wanderlust.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase(); 