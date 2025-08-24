import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { usePackage } from '../contexts/PackageContext';

// ImageWithFallback component
const ImageWithFallback = ({ src, alt, className, style, ...rest }) => {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
};

const FeaturedPackages = () => {
  const { featuredPackages = [], getFeaturedPackages, loading, error } = usePackage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch featured packages on mount
  useEffect(() => {
    if (featuredPackages.length === 0 && !loading && getFeaturedPackages) {
      getFeaturedPackages();
    }
  }, [featuredPackages.length, loading, getFeaturedPackages]);

  if (!mounted) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 pt-20 pb-16">
          <div className="text-center mb-16 px-4">
            <h1 className="text-white mb-6 tracking-wide" style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>
              Discover Paradise
            </h1>
          </div>
        </div>
      </section>
    );
  }

  // Get the first package image for background, or use a default
  const backgroundImage = featuredPackages.length > 0 && featuredPackages[0].image?.url 
    ? featuredPackages[0].image.url 
    : "https://images.unsplash.com/photo-1704797390901-e1d20bd46647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTYwMTYyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with fixed parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />

      {/* Content */}
      <div className="relative z-10 pt-20 pb-16">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-white mb-6 tracking-wide"
            style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Discover Paradise
          </motion.h1>
          <motion.p 
            className="text-white/90 max-w-3xl mx-auto leading-relaxed"
            style={{ fontSize: '1.25rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Embark on extraordinary journeys through Sri Lanka's most breathtaking destinations. 
            From ancient fortresses to pristine beaches, create memories that last a lifetime.
          </motion.p>
        </motion.div>

        {/* Featured Packages Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-4 text-white/80">Loading featured packages...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Error Loading Featured Packages
              </h3>
              <p className="text-white/80 mb-6">
                {error}
              </p>
              <motion.button
                className="bg-white text-slate-900 px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300"
                style={{ fontWeight: '600' }}
                onClick={() => getFeaturedPackages()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : featuredPackages && Array.isArray(featuredPackages) && featuredPackages.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {featuredPackages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  className="group relative overflow-hidden rounded-3xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    <ImageWithFallback 
                      src={pkg.image?.url || "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                      }}
                    />
                    
                    {/* Price Badge */}
                    <div 
                      className="absolute top-4 right-4 rounded-full px-4 py-2"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span className="text-slate-900" style={{ fontWeight: '600' }}>${pkg.price}</span>
                    </div>

                    {/* Rating */}
                    <div 
                      className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-3 py-1"
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white" style={{ fontSize: '0.875rem' }}>4.8</span>
                      <span className="text-white/70" style={{ fontSize: '0.875rem' }}>({Math.floor(Math.random() * 200) + 50})</span>
                    </div>

                    {/* Featured Badge */}
                    {pkg.featured && (
                      <div 
                        className="absolute top-4 left-4 rounded-full px-3 py-1"
                        style={{
                          background: 'rgba(59, 130, 246, 0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <span className="text-white text-sm font-medium">Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-white">
                    <h3 
                      className="mb-2 group-hover:text-white/90 transition-colors"
                      style={{ fontSize: '1.25rem', fontWeight: '600' }}
                    >
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span style={{ fontSize: '0.875rem' }}>
                        {pkg.itinerary?.[0]?.places?.[0]?.name || 'Multiple destinations'}
                      </span>
                    </div>

                    <p 
                      className="text-white/80 mb-4 leading-relaxed"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {pkg.description}
                    </p>

                    {/* Package Details */}
                    <div className="flex items-center gap-4 mb-4 text-white/70" style={{ fontSize: '0.875rem' }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.days} days, {pkg.nights} nights</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>2-8 People</span>
                      </div>
                    </div>

                    {/* Guide and Driver Information */}
                    {(pkg.guide || pkg.driver) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.guide && (
                          <span 
                            className="rounded-full text-white/80"
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            Guide: {pkg.guide.name}
                          </span>
                        )}
                        {pkg.driver && (
                          <span 
                            className="rounded-full text-white/80"
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(34, 197, 94, 0.3)'
                            }}
                          >
                            Driver: {pkg.driver.name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    <motion.button
                      className="w-full rounded-xl px-6 py-3 text-white transition-all duration-300 group-hover:bg-white group-hover:text-slate-900"
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: '500'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = `/packages/${pkg._id}`}
                    >
                      Explore Package
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Featured Packages Available
              </h3>
              <p className="text-white/80 mb-6">
                Check back soon for our latest featured travel packages!
              </p>
              <motion.button
                className="bg-white text-slate-900 px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300"
                style={{ fontWeight: '600' }}
                onClick={() => window.location.href = '/packages'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All Packages
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-20 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 
            className="text-white mb-6"
            style={{ fontSize: '2.25rem', fontWeight: 'bold' }}
          >
            Ready for Your Sri Lankan Adventure?
          </h2>
          <p 
            className="text-white/80 mb-8 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem' }}
          >
            Let our expert guides take you on a journey through the pearl of the Indian Ocean. 
            Every package is carefully crafted to give you an authentic experience.
          </p>
          <motion.button
            className="bg-white text-slate-900 px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 shadow-2xl"
            style={{ fontWeight: '600' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/packages'}
          >
            View All Packages
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
