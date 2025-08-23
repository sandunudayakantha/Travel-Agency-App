import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Mountain, Leaf, Waves, Camera, Heart, Sparkles } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Sigiriya Rock Fortress",
    description: "Ancient royal citadel built on a massive rock formation, offering breathtaking views and rich history.",
    location: "Central Province",
    image: "https://images.unsplash.com/photo-1704797390901-e1d20bd46647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTU2NzEwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Mountain,
    color: "from-orange-500 to-red-600",
    highlights: ["Ancient Architecture", "Panoramic Views", "Cultural Heritage"]
  },
  {
    id: 2,
    name: "Nuwara Eliya Tea Country",
    description: "Rolling green hills covered with tea plantations, cool climate, and colonial architecture.",
    location: "Central Highlands",
    image: "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRlYSUyMHBsYW50YXRpb258ZW58MXx8fHwxNzU1NjcxMDI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    highlights: ["Tea Plantations", "Cool Climate", "Colonial Charm"]
  },
  {
    id: 3,
    name: "Unawatuna Beach",
    description: "Golden sandy beaches with crystal clear waters, perfect for relaxation and water activities.",
    location: "Southern Coast",
    image: "https://images.unsplash.com/photo-1671595611645-e842ffceea81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwdW5hd2F0dW5hfGVufDF8fHx8MTc1NTY3MTAyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Waves,
    color: "from-blue-500 to-cyan-600",
    highlights: ["Golden Beaches", "Crystal Waters", "Water Sports"]
  },
  {
    id: 4,
    name: "Temple of the Sacred Tooth",
    description: "Sacred Buddhist temple in Kandy housing the relic of the tooth of Buddha.",
    location: "Kandy",
    image: "https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYW5keSUyMHRlbXBsZSUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc1NTY3MTAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Heart,
    color: "from-purple-500 to-pink-600",
    highlights: ["Sacred Relic", "Buddhist Heritage", "Royal History"]
  },
  {
    id: 5,
    name: "Adam's Peak",
    description: "Sacred mountain pilgrimage site with stunning sunrise views and spiritual significance.",
    location: "Ratnapura District",
    image: "https://images.unsplash.com/photo-1673413909626-bc1db1cf0c11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGFtcyUyMHBlYWslMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTU2NzEwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Camera,
    color: "from-indigo-500 to-purple-600",
    highlights: ["Sacred Pilgrimage", "Sunrise Views", "Spiritual Journey"]
  }
];

// Enhanced Footprint components for left and right feet
const LeftFootprint = ({ className, style }: { className?: string, style?: any }) => (
  <svg 
    className={className}
    style={style}
    width="28" 
    height="36" 
    viewBox="0 0 28 36" 
    fill="currentColor"
  >
    {/* Left foot shape */}
    <ellipse cx="14" cy="10" rx="9" ry="7" opacity="0.8" />
    <ellipse cx="10" cy="20" rx="3.5" ry="3" opacity="0.7" />
    <ellipse cx="14" cy="22" rx="3" ry="2.5" opacity="0.7" />
    <ellipse cx="18" cy="20" rx="3.5" ry="3" opacity="0.7" />
    <ellipse cx="8" cy="26" rx="2.5" ry="2" opacity="0.5" />
    <ellipse cx="20" cy="26" rx="2.5" ry="2" opacity="0.5" />
  </svg>
);

const RightFootprint = ({ className, style }: { className?: string, style?: any }) => (
  <svg 
    className={className}
    style={style}
    width="28" 
    height="36" 
    viewBox="0 0 28 36" 
    fill="currentColor"
  >
    {/* Right foot shape - mirrored */}
    <ellipse cx="14" cy="10" rx="9" ry="7" opacity="0.8" />
    <ellipse cx="18" cy="20" rx="3.5" ry="3" opacity="0.7" />
    <ellipse cx="14" cy="22" rx="3" ry="2.5" opacity="0.7" />
    <ellipse cx="10" cy="20" rx="3.5" ry="3" opacity="0.7" />
    <ellipse cx="20" cy="26" rx="2.5" ry="2" opacity="0.5" />
    <ellipse cx="8" cy="26" rx="2.5" ry="2" opacity="0.5" />
  </svg>
);

export function SriLankanJourneySection() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced footprint progress calculation
  const footprintProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);

  // Generate walking footprints
  const generateFootprints = () => {
    const footprints = [];
    const totalSteps = 12;
    const currentProgress = Math.min(footprintProgress.get(), 95);
    const visibleSteps = Math.floor((currentProgress / 100) * totalSteps);

    for (let i = 0; i < visibleSteps; i++) {
      const isLeft = i % 2 === 0;
      const stepProgress = (i / totalSteps) * 90; // Max 90% to stay in bounds
      const delay = i * 0.2;

      footprints.push(
        <motion.div
          key={i}
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: `${stepProgress}%`,
            transform: `translate(${isLeft ? -25 : 25}px, -50%) rotate(${isLeft ? -5 : 5}deg)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.7 - (i * 0.05), 
            scale: 1 - (i * 0.03),
          }}
          transition={{ 
            delay: delay,
            duration: 0.5,
            type: "spring",
            stiffness: 100 
          }}
        >
          {isLeft ? (
            <LeftFootprint className="text-orange-600 drop-shadow-sm" />
          ) : (
            <RightFootprint className="text-orange-700 drop-shadow-sm" />
          )}
        </motion.div>
      );
    }

    return footprints;
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      {/* Enhanced Parallax Background Elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full -translate-x-48 -translate-y-48"
        style={{
          transform: `translate(-192px, -192px) translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
        }}
      ></div>
      <div 
        className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full translate-x-32"
        style={{
          transform: `translate(128px, 0px) translateY(${scrollY * -0.08}px) rotate(${scrollY * -0.02}deg)`,
        }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full translate-x-32 translate-y-32"
        style={{
          transform: `translate(128px, 128px) translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Animated Elements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 relative"
        >
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <MapPin className="h-8 w-8 text-orange-600" />
            </motion.div>
            <span className="text-orange-600 uppercase tracking-wide font-semibold">Journey Through Paradise</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </motion.div>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Discover
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Sri Lanka</span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Follow the footprints of ancient kings and modern adventurers through the pearl of the Indian Ocean. 
            Each destination tells a story of culture, nature, and spiritual awakening.
          </motion.p>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-30"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-8 -left-8 w-8 h-8 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full opacity-40"
            animate={{ 
              y: [0, 15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>

        {/* Journey Path with Enhanced Destinations */}
        <div className="relative">
          {/* Animated Journey Path */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-300 via-green-300 via-blue-300 via-purple-300 to-indigo-300 transform -translate-x-1/2 rounded-full"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: 0.5 }}
            viewport={{ once: true }}
            style={{ originY: 0 }}
          />
          
          {/* Walking Footprints Animation */}
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2">
            {generateFootprints()}
          </div>

          {/* Enhanced Destinations */}
          <div className="space-y-32">
            {destinations.map((destination, index) => {
              const isEven = index % 2 === 0;
              const Icon = destination.icon;
              
              return (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, x: isEven ? -100 : 100, y: 50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative ${
                    isEven ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  {/* Enhanced Content */}
                  <div className={`${isEven ? 'lg:pr-16' : 'lg:pl-16 lg:col-start-2'} relative`}>
                    <motion.div
                      className="relative"
                      style={{
                        transform: `translateY(${scrollY * (isEven ? 0.05 : -0.05)}px)`,
                      }}
                    >
                      {/* Location Badge */}
                      <motion.div 
                        className={`inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r ${destination.color} text-white rounded-full mb-6 shadow-lg`}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>
                        <span className="font-semibold">{destination.location}</span>
                      </motion.div>
                      
                      {/* Title */}
                      <motion.h3 
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        {destination.name}
                      </motion.h3>
                      
                      {/* Description */}
                      <motion.p 
                        className="text-lg text-gray-600 leading-relaxed mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {destination.description}
                      </motion.p>

                      {/* Highlights */}
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {destination.highlights.map((highlight, i) => (
                          <motion.span
                            key={i}
                            className="px-3 py-1 bg-white/70 text-gray-700 rounded-full text-sm border border-gray-200 backdrop-blur-sm"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.7 + (i * 0.1) }}
                            whileHover={{ 
                              scale: 1.1,
                              backgroundColor: "rgba(255,255,255,0.9)"
                            }}
                            viewport={{ once: true }}
                          >
                            {highlight}
                          </motion.span>
                        ))}
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div 
                        className="flex items-center space-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                      >
                        <motion.button
                          whileHover={{ 
                            scale: 1.05, 
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            y: -2
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-8 py-4 bg-gradient-to-r ${destination.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                        >
                          <span className="relative z-10">Explore Now</span>
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                        >
                          Learn More
                        </motion.button>
                      </motion.div>

                      {/* Enhanced Floating Elements */}
                      <motion.div 
                        className={`absolute -top-8 ${isEven ? '-right-8' : '-left-8'} w-16 h-16 bg-gradient-to-br ${destination.color} rounded-full opacity-20`}
                        style={{
                          transform: `translateY(${scrollY * (isEven ? 0.08 : -0.08)}px) rotate(${scrollY * 0.1}deg)`,
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Enhanced Image Section */}
                  <div className={`${isEven ? '' : 'lg:col-start-1'} relative`}>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      style={{
                        transform: `translateY(${scrollY * (isEven ? -0.03 : 0.03)}px)`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                        <ImageWithFallback
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-96 lg:h-[500px] object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        
                        {/* Enhanced Floating Info Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 15px 30px rgba(0,0,0,0.2)"
                          }}
                          viewport={{ once: true }}
                          className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{destination.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{destination.location}</span>
                              </p>
                            </div>
                            <motion.div 
                              className={`w-14 h-14 bg-gradient-to-br ${destination.color} rounded-full flex items-center justify-center shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Icon className="h-7 w-7 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Parallax Background Elements */}
                      <motion.div 
                        className={`absolute -top-4 ${isEven ? '-left-4' : '-right-4'} w-8 h-8 bg-gradient-to-br ${destination.color} rounded-full opacity-60`}
                        style={{
                          transform: `translateY(${scrollY * 0.12}px)`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      />
                      <motion.div 
                        className={`absolute -bottom-4 ${isEven ? '-right-4' : '-left-4'} w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-40`}
                        style={{
                          transform: `translateY(${scrollY * -0.08}px)`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.3
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-32 relative"
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Sri Lankan Adventure?
          </motion.h3>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Let us create a personalized journey through these incredible destinations. 
            Every step tells a story, every view creates a memory.
          </motion.p>
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              y: -3
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="px-12 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full shadow-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Plan Your Journey</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MapPin className="h-5 w-5" />
              </motion.div>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
          />
        </motion.div>
      </div>
    </section>
  );
}