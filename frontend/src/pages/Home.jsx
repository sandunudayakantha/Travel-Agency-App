import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePackage } from '../contexts/PackageContext';
import { 
  MapPinIcon, 
  CalendarIcon, 
  StarIcon,
  ArrowRightIcon,
  PlayIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const { featuredPackages, getFeaturedPackages, loading } = usePackage();

  useEffect(() => {
    getFeaturedPackages();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description: "Explore hundreds of destinations across the world"
    },
    {
      icon: "🎯",
      title: "Custom Packages",
      description: "Create your perfect trip with personalized itineraries"
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      description: "Hand-picked experiences and accommodations"
    },
    {
      icon: "🛡️",
      title: "Safe Travel",
      description: "24/7 support and comprehensive travel insurance"
    }
  ];

  const stats = [
    { number: "500+", label: "Destinations" },
    { number: "10K+", label: "Happy Travelers" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            className="text-center"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block text-secondary-300">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Experience the world's most amazing destinations with our curated travel packages. 
              From luxury getaways to adventure expeditions, we've got your perfect journey covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/packages"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Explore Packages
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/custom-package"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Create Custom Trip
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Video Background Option */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
            <PlayIcon className="h-8 w-8 text-white" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Wanderlust?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making your travel dreams come true with exceptional service and unforgettable experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our most sought-after destinations and find your perfect getaway
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Adventure Tours",
                description: "Thrilling experiences for adrenaline seekers",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                count: "15+ Tours",
                link: "/packages?category=adventure"
              },
              {
                title: "Beach Getaways",
                description: "Relaxing beach destinations worldwide",
                image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
                count: "20+ Destinations",
                link: "/packages?category=beach"
              },
              {
                title: "Cultural Experiences",
                description: "Immerse yourself in local traditions",
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
                count: "12+ Experiences",
                link: "/packages?category=cultural"
              },
              {
                title: "City Breaks",
                description: "Urban adventures in vibrant cities",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
                count: "18+ Cities",
                link: "/packages?category=city"
              },
              {
                title: "Nature Retreats",
                description: "Connect with nature in pristine environments",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                count: "10+ Retreats",
                link: "/packages?category=nature"
              },
              {
                title: "Luxury Escapes",
                description: "Premium experiences for discerning travelers",
                image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
                count: "8+ Escapes",
                link: "/packages?category=luxury"
              }
            ].map((destination, index) => (
              <motion.div
                key={destination.title}
                className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-large transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {destination.title}
                    </h3>
                    <p className="text-white/90 text-sm mb-2">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm font-medium">
                        {destination.count}
                      </span>
                      <Link
                        to={destination.link}
                        className="text-white hover:text-secondary-300 transition-colors text-sm font-medium"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked destinations that will inspire your next adventure
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  className="card overflow-hidden group hover:shadow-large transition-all duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.images[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {pkg.featured && (
                      <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                      ${pkg.price.amount}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                      {pkg.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {pkg.ratings?.average?.toFixed(1) || '4.5'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.destination}, {pkg.country}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pkg.duration.days} days, {pkg.duration.nights} nights</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pkg.shortDescription}
                    </p>
                    
                    <Link
                      to={`/packages/${pkg._id}`}
                      className="btn-primary w-full text-center group-hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Featured Packages Available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our latest featured travel packages!
              </p>
              <Link
                to="/packages"
                className="btn-primary inline-flex items-center"
              >
                Browse All Packages
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/packages"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center hover:bg-primary-600 hover:text-white transition-colors"
            >
              View All Packages
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with us. 
              Your next adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4"
              >
                Get Started Today
              </Link>
              <Link
                to="/contact"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 