const mongoose = require('mongoose');
const User = require('./models/User');
const Package = require('./models/Package');
const TourType = require('./models/TourType');
const Vehicle = require('./models/Vehicle');
const TourGuide = require('./models/TourGuide');
const Place = require('./models/Place');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency');
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Package.deleteMany({});
    await Vehicle.deleteMany({});
    await TourGuide.deleteMany({});
    await Place.deleteMany({});

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

    // Get tour types
    console.log('🏷️ Getting tour types...');
    const tourTypes = await TourType.find();
    console.log(`✅ Found ${tourTypes.length} tour types`);

    // Create vehicles
    console.log('🚗 Creating vehicles...');
    const vehicles = await Vehicle.create([
      {
        name: 'Toyota Hiace',
        model: 'Hiace',
        type: 'van',
        passengerCapacity: 12,
        description: 'Comfortable van for group tours',
        features: ['Air Conditioning', 'WiFi', 'USB Charging'],
        price: {
          amount: 150,
          currency: 'USD',
          perDay: true
        },
        location: {
          city: 'Bali',
          country: 'Indonesia',
          address: 'Denpasar, Bali'
        },
        specifications: {
          year: 2022,
          fuelType: 'gasoline',
          transmission: 'automatic',
          color: 'White'
        },
        createdBy: adminUser._id
      },
      {
        name: 'Mercedes Sprinter',
        model: 'Sprinter',
        type: 'van',
        passengerCapacity: 15,
        description: 'Luxury van for premium tours',
        features: ['Air Conditioning', 'WiFi', 'USB Charging', 'Leather Seats'],
        price: {
          amount: 250,
          currency: 'USD',
          perDay: true
        },
        location: {
          city: 'Tokyo',
          country: 'Japan',
          address: 'Tokyo, Japan'
        },
        specifications: {
          year: 2023,
          fuelType: 'diesel',
          transmission: 'automatic',
          color: 'Black'
        },
        createdBy: adminUser._id
      },
      {
        name: 'Toyota Land Cruiser',
        model: 'Land Cruiser',
        type: 'suv',
        passengerCapacity: 7,
        description: 'Off-road vehicle for adventure tours',
        features: ['4x4', 'Air Conditioning', 'GPS'],
        price: {
          amount: 200,
          currency: 'USD',
          perDay: true
        },
        location: {
          city: 'Zermatt',
          country: 'Switzerland',
          address: 'Zermatt, Switzerland'
        },
        specifications: {
          year: 2021,
          fuelType: 'gasoline',
          transmission: 'automatic',
          color: 'Silver'
        },
        createdBy: adminUser._id
      }
    ]);
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create tour guides
    console.log('👨‍🏫 Creating tour guides...');
    const tourGuides = await TourGuide.create([
      {
        name: 'Sarah Johnson',
        age: 32,
        email: 'sarah@wanderlust.com',
        phone: '+1234567890',
        languages: ['English', 'Spanish'],
        level: 'expert',
        experience: 8,
        specializations: ['Cultural Tours', 'Adventure Tours'],
        bio: 'Experienced guide with 8 years of leading tours across multiple countries.',
        avatar: {
          public_id: 'guides/sarah-johnson',
          url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
        },
        createdBy: adminUser._id
      },
      {
        name: 'Michael Chen',
        age: 35,
        email: 'michael@wanderlust.com',
        phone: '+1234567891',
        languages: ['English', 'Mandarin', 'Japanese'],
        level: 'expert',
        experience: 10,
        specializations: ['City Tours', 'Cultural Tours'],
        bio: 'Multilingual guide specializing in Asian destinations and cultural experiences.',
        avatar: {
          public_id: 'guides/michael-chen',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        },
        createdBy: adminUser._id
      },
      {
        name: 'Emma Rodriguez',
        age: 28,
        email: 'emma@wanderlust.com',
        phone: '+1234567892',
        languages: ['English', 'French', 'Italian'],
        level: 'expert',
        experience: 6,
        specializations: ['Beach Tours', 'Luxury Tours'],
        bio: 'Passionate guide with expertise in European destinations and luxury travel.',
        avatar: {
          public_id: 'guides/emma-rodriguez',
          url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
        },
        createdBy: adminUser._id
      }
    ]);
    console.log(`✅ Created ${tourGuides.length} tour guides`);

    // Create places
    console.log('📍 Creating places...');
    const places = await Place.create([
      {
        name: 'Bali Beach Resort',
        description: 'Beautiful beachfront resort with stunning ocean views',
        shortDescription: 'Luxury beachfront accommodation in Bali',
        images: [{
          public_id: 'places/bali-beach-resort',
          url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
          caption: 'Bali Beach Resort',
          isPrimary: true
        }],
        location: {
          country: 'Indonesia',
          region: 'Bali',
          city: 'Denpasar',
          formattedAddress: 'Denpasar, Bali, Indonesia',
          coordinates: {
            latitude: -8.6500,
            longitude: 115.2167
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Tanah Lot Temple',
        description: 'Ancient Hindu temple perched on a rocky outcrop',
        shortDescription: 'Iconic sea temple in Bali',
        images: [{
          public_id: 'places/tanah-lot-temple',
          url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
          caption: 'Tanah Lot Temple',
          isPrimary: true
        }],
        location: {
          country: 'Indonesia',
          region: 'Bali',
          city: 'Tabanan',
          formattedAddress: 'Tabanan, Bali, Indonesia',
          coordinates: {
            latitude: -8.6211,
            longitude: 115.0869
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Ubud Monkey Forest',
        description: 'Sacred forest sanctuary home to hundreds of monkeys',
        shortDescription: 'Sacred monkey forest in Ubud',
        images: [{
          public_id: 'places/ubud-monkey-forest',
          url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
          caption: 'Ubud Monkey Forest',
          isPrimary: true
        }],
        location: {
          country: 'Indonesia',
          region: 'Bali',
          city: 'Ubud',
          formattedAddress: 'Ubud, Bali, Indonesia',
          coordinates: {
            latitude: -8.5193,
            longitude: 115.2633
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Zermatt Village',
        description: 'Charming car-free village at the foot of the Matterhorn',
        shortDescription: 'Car-free mountain village',
        images: [{
          public_id: 'places/zermatt-village',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          caption: 'Zermatt Village',
          isPrimary: true
        }],
        location: {
          country: 'Switzerland',
          region: 'Valais',
          city: 'Zermatt',
          formattedAddress: 'Zermatt, Switzerland',
          coordinates: {
            latitude: 46.0207,
            longitude: 7.7491
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Matterhorn Peak',
        description: 'Iconic pyramid-shaped peak in the Swiss Alps',
        shortDescription: 'Famous Swiss mountain peak',
        images: [{
          public_id: 'places/matterhorn-peak',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          caption: 'Matterhorn Peak',
          isPrimary: true
        }],
        location: {
          country: 'Switzerland',
          region: 'Valais',
          city: 'Zermatt',
          formattedAddress: 'Matterhorn, Zermatt, Switzerland',
          coordinates: {
            latitude: 45.9767,
            longitude: 7.6583
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Shibuya Crossing',
        description: 'World\'s busiest pedestrian crossing',
        shortDescription: 'Famous Tokyo intersection',
        images: [{
          public_id: 'places/shibuya-crossing',
          url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          caption: 'Shibuya Crossing',
          isPrimary: true
        }],
        location: {
          country: 'Japan',
          region: 'Tokyo',
          city: 'Tokyo',
          formattedAddress: 'Shibuya, Tokyo, Japan',
          coordinates: {
            latitude: 35.6595,
            longitude: 139.7004
          }
        },
        createdBy: adminUser._id
      },
      {
        name: 'Senso-ji Temple',
        description: 'Ancient Buddhist temple in Asakusa',
        shortDescription: 'Historic Buddhist temple',
        images: [{
          public_id: 'places/senso-ji-temple',
          url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800',
          caption: 'Senso-ji Temple',
          isPrimary: true
        }],
        location: {
          country: 'Japan',
          region: 'Tokyo',
          city: 'Tokyo',
          formattedAddress: 'Asakusa, Tokyo, Japan',
          coordinates: {
            latitude: 35.7148,
            longitude: 139.7967
          }
        },
        createdBy: adminUser._id
      }
    ]);
    console.log(`✅ Created ${places.length} places`);

    // Create sample packages
    console.log('📦 Creating sample packages...');
    
    const adventureTourType = tourTypes.find(t => t.name === 'Adventure Tours');
    const culturalTourType = tourTypes.find(t => t.name === 'Cultural Tours');
    const beachTourType = tourTypes.find(t => t.name === 'Beach Tours');
    const cityTourType = tourTypes.find(t => t.name === 'City Tours');

    const samplePackages = [
      {
        title: "Bali Paradise Adventure",
        description: "Experience the magic of Bali with this comprehensive 7-day adventure. From pristine beaches to ancient temples, discover the perfect blend of culture and relaxation.",
        tourType: adventureTourType._id,
        days: 7,
        nights: 6,
        vehicle: vehicles[0]._id, // Toyota Hiace
        guide: tourGuides[0]._id, // Sarah Johnson
        price: 1299,
        featured: true,
        itinerary: [
          {
            day: 1,
            title: "Arrival & Beach Welcome",
            description: "Arrive in Bali and enjoy a welcome dinner at the beach resort",
            places: [places[0]._id] // Bali Beach Resort
          },
          {
            day: 2,
            title: "Temple Discovery",
            description: "Visit the iconic Tanah Lot Temple and learn about Balinese culture",
            places: [places[1]._id] // Tanah Lot Temple
          },
          {
            day: 3,
            title: "Monkey Forest Adventure",
            description: "Explore the sacred Ubud Monkey Forest and interact with local wildlife",
            places: [places[2]._id] // Ubud Monkey Forest
          }
        ],
        createdBy: adminUser._id
      },
      {
        title: "Swiss Alps Hiking Experience",
        description: "Embark on an unforgettable hiking adventure through the stunning Swiss Alps. Experience breathtaking mountain views, charming villages, and world-class hiking trails.",
        tourType: adventureTourType._id,
        days: 10,
        nights: 9,
        vehicle: vehicles[2]._id, // Toyota Land Cruiser
        guide: tourGuides[1]._id, // Michael Chen
        price: 2499,
        featured: true,
        itinerary: [
          {
            day: 1,
            title: "Arrival in Zermatt",
            description: "Arrive in the charming car-free village of Zermatt",
            places: [places[3]._id] // Zermatt Village
          },
          {
            day: 2,
            title: "Matterhorn Views",
            description: "Hike to viewpoints of the iconic Matterhorn peak",
            places: [places[4]._id] // Matterhorn Peak
          }
        ],
        createdBy: adminUser._id
      },
      {
        title: "Tokyo Cultural Immersion",
        description: "Dive deep into Japanese culture with this comprehensive Tokyo experience. From traditional temples to modern technology, discover the perfect blend of old and new Japan.",
        tourType: culturalTourType._id,
        days: 8,
        nights: 7,
        vehicle: vehicles[0]._id, // Toyota Hiace
        guide: tourGuides[2]._id, // Emma Rodriguez
        price: 1899,
        featured: true,
        itinerary: [
          {
            day: 1,
            title: "Modern Tokyo",
            description: "Experience the energy of Shibuya Crossing and modern Tokyo",
            places: [places[5]._id] // Shibuya Crossing
          },
          {
            day: 2,
            title: "Traditional Japan",
            description: "Visit the ancient Senso-ji Temple and experience traditional culture",
            places: [places[6]._id] // Senso-ji Temple
          }
        ],
        createdBy: adminUser._id
      },
      {
        title: "Bali Beach Relaxation",
        description: "Unwind and relax on Bali's most beautiful beaches with this 5-day beach tour.",
        tourType: beachTourType._id,
        days: 5,
        nights: 4,
        vehicle: vehicles[1]._id, // Mercedes Sprinter
        guide: tourGuides[0]._id, // Sarah Johnson
        price: 899,
        featured: false,
        itinerary: [
          {
            day: 1,
            title: "Beach Resort Arrival",
            description: "Check into the beachfront resort and enjoy sunset views",
            places: [places[0]._id] // Bali Beach Resort
          }
        ],
        createdBy: adminUser._id
      },
      {
        title: "Tokyo City Explorer",
        description: "Explore the vibrant city of Tokyo with guided tours of its most famous landmarks.",
        tourType: cityTourType._id,
        days: 6,
        nights: 5,
        vehicle: vehicles[0]._id, // Toyota Hiace
        guide: tourGuides[1]._id, // Michael Chen
        price: 1499,
        featured: false,
        itinerary: [
          {
            day: 1,
            title: "City Introduction",
            description: "Start with the famous Shibuya Crossing and city orientation",
            places: [places[5]._id] // Shibuya Crossing
          },
          {
            day: 2,
            title: "Cultural Heritage",
            description: "Visit the historic Senso-ji Temple",
            places: [places[6]._id] // Senso-ji Temple
          }
        ],
        createdBy: adminUser._id
      }
    ];

    for (const packageData of samplePackages) {
      const newPackage = await Package.create(packageData);
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