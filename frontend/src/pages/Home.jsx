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
       <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
         {/* Mountain Background */}
         <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
             alt="Mountain Landscape" 
             className="w-full h-full object-cover"
           />
         </div>
         
         {/* Animated Mist Layers */}
         <div className="absolute inset-0">
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
           
           {/* Mist Layer 1 */}
           <div className="absolute inset-0 opacity-30">
             <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-mist"></div>
             <div className="absolute top-1/2 right-0 w-full h-24 bg-gradient-to-l from-transparent via-white/15 to-transparent animate-mist-reverse" style={{animationDelay: '2s'}}></div>
             <div className="absolute top-3/4 left-0 w-full h-28 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-mist" style={{animationDelay: '4s'}}></div>
           </div>
           
           {/* Mist Layer 2 */}
           <div className="absolute inset-0 opacity-20">
             <div className="absolute top-1/3 left-1/4 w-1/2 h-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-mist-reverse" style={{animationDelay: '1s'}}></div>
             <div className="absolute top-2/3 right-1/4 w-1/2 h-16 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-mist" style={{animationDelay: '3s'}}></div>
           </div>
           
           {/* Floating Mist Particles */}
           <div className="absolute inset-0 overflow-hidden">
             {[...Array(8)].map((_, i) => (
               <div
                 key={i}
                 className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 3}s`,
                   animationDuration: `${3 + Math.random() * 2}s`
                 }}
               ></div>
             ))}
           </div>
         </div>
         
         <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
             
            </p>
            
          </motion.div>
        </div>

        {/* Video Background Option */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-300">
            <PlayIcon className="h-8 w-8 text-white" />
          </button>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Popular Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular travel packages that travelers love to book
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-large transition-all duration-300 bg-white"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.images[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary-600">
                        ${pkg.price.amount}
                        <span className="text-sm text-gray-500 font-normal"> per person</span>
                      </div>
                      <Link
                        to={`/packages/${pkg._id}`}
                        className="btn-primary px-6 py-2 text-sm group-hover:bg-primary-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Packages Available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our latest travel packages!
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

      {/* Travel Experience Cards Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Different Ways to Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From solo adventures to family getaways, find the perfect travel style for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Solo Adventures",
                description: "Explore the world on your own terms with our solo travel packages",
                icon: "🧳",
                color: "from-blue-500 to-blue-600",
                features: ["Flexible itineraries", "Solo-friendly accommodations", "Group activities available"]
              },
              {
                title: "Family Vacations",
                description: "Create lasting memories with family-friendly destinations and activities",
                icon: "👨‍👩‍👧‍👦",
                color: "from-green-500 to-green-600",
                features: ["Kid-friendly activities", "Family accommodations", "Educational experiences"]
              },
              {
                title: "Couples Retreats",
                description: "Romantic getaways designed for two with intimate experiences",
                icon: "💕",
                color: "from-pink-500 to-pink-600",
                features: ["Private experiences", "Romantic settings", "Couple activities"]
              },
              {
                title: "Group Tours",
                description: "Travel with like-minded people and make new friends along the way",
                icon: "👥",
                color: "from-purple-500 to-purple-600",
                features: ["Guided tours", "Group discounts", "Social activities"]
              }
            ].map((experience, index) => (
              <motion.div
                key={experience.title}
                className="group relative bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${experience.color}`}></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">{experience.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {experience.description}
                  </p>
                  <ul className="space-y-2">
                    {experience.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      to="/packages"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline"
                    >
                      Explore Packages
                      <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
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