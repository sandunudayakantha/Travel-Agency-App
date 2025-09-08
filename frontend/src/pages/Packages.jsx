import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  StarIcon, 
  ArrowRightIcon,
  XMarkIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { usePackage } from '../contexts/PackageContext';
import { useTourType } from '../contexts/TourTypeContext';
import StarRating from '../components/StarRating';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';
// FigmaUI Components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const Packages = () => {
  const { packages, loading, error, getPackages, pagination } = usePackage();
  const { tourTypes, getTourTypes, loading: tourTypesLoading } = useTourType();
  const [selectedTourType, setSelectedTourType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  // Sri Lankan landscape background
  const backgroundImage = "https://images.unsplash.com/photo-1526785777381-db1fdcbb0a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGxhJTIwbmluZSUyYXJjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NTYwMzQ4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  useEffect(() => {
    // Start loading when component mounts
    startLoading("Discovering amazing packages...", 2000);
    
    // Fetch tour types and initial packages on component mount
    getTourTypes({ status: 'active' });
    getPackages({}, 1);
  }, [getTourTypes, getPackages, startLoading]);

  // Handle loading states
  useEffect(() => {
    if (loading && !pageLoading) {
      startLoading("Loading packages...", 1500);
    } else if (!loading && pageLoading) {
      stopLoading();
    }
  }, [loading, pageLoading, startLoading, stopLoading]);

  useEffect(() => {
    // Fetch packages based on selected tour type (skip initial load)
    if (currentPage > 1 || selectedTourType) {
      const filters = {};
      if (selectedTourType) {
        filters.tourType = selectedTourType;
        startLoading("Filtering packages...", 1000);
      }
      getPackages(filters, currentPage);
    }
  }, [selectedTourType, currentPage, getPackages, startLoading]);

  const handleTourTypeClick = (tourTypeId) => {
    setSelectedTourType(tourTypeId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleClearFilter = () => {
    setSelectedTourType(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const selectedTourTypeData = tourTypes.find(type => type._id === selectedTourType);

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
      <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Static Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src={backgroundImage}
          alt="Ella Nine Arch Bridge - Sri Lankan mountain landscape"
          className="w-full h-full object-cover"
        />
        
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-orange-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center text-center text-white px-4">
          <motion.div 
            className="max-w-5xl space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-2 text-orange-300"
              initial={{ opacity: 0, x: -20 }}
              animate={isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlobeAltIcon className="h-8 w-8" />
              <span className="text-xl">Discover Sri Lankan Adventures</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl lg:text-8xl leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Travel
              <span className="block text-orange-400">Packages</span>
              <span className="block">That Inspire</span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              From ancient temples to pristine beaches, discover carefully crafted journeys 
              that reveal the true essence of Sri Lanka's beauty and culture.
            </motion.p>

            {!selectedTourType && (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30 px-6 py-3 text-lg">
                  {packages.length} Amazing Packages • Curated Experiences
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Tour Type Categories */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                Browse by Category
              </Badge>
              <h2 className="text-5xl leading-tight">
                Choose Your
                <span className="block text-orange-400">Adventure Style</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                From cultural heritage tours to wildlife safaris, find the perfect package 
                that matches your travel dreams and preferences.
              </p>
            </motion.div>
            
            {tourTypesLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* All Packages Option */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Button
                    onClick={handleClearFilter}
                    variant={!selectedTourType ? "default" : "outline"}
                    className={`h-auto p-6 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 ${
                      !selectedTourType
                        ? 'border-orange-400 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                        : 'border-white/20 bg-black/20 text-white hover:bg-black/30'
                    }`}
                  >
                    <div className="text-3xl mb-3">🌍</div>
                    <div className="font-medium text-lg">All Packages</div>
                  </Button>
                </motion.div>

                {/* Tour Type Categories */}
                {tourTypes.map((tourType, index) => (
                  <motion.div
                    key={tourType._id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      onClick={() => handleTourTypeClick(tourType._id)}
                      variant={selectedTourType === tourType._id ? "default" : "outline"}
                      className={`h-auto p-6 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 ${
                        selectedTourType === tourType._id
                          ? 'border-orange-400 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                          : 'border-white/20 bg-black/20 text-white hover:bg-black/30'
                      }`}
                    >
                      <div className="text-3xl mb-3">
                        {tourType.image?.url ? (
                          <ImageWithFallback
                            src={tourType.image.url} 
                            alt={tourType.name}
                            className="w-12 h-12 mx-auto rounded-full object-cover"
                          />
                        ) : (
                          '🏔️'
                        )}
                      </div>
                      <div className="font-medium text-lg">{tourType.name}</div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Selected Category Info */}
        {selectedTourType && selectedTourTypeData && (
          <section className="px-4 py-16">
            <div className="container mx-auto max-w-4xl">
              <motion.div 
                className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="text-2xl font-semibold mb-2">
                      {selectedTourTypeData.name}
                    </h3>
                    {selectedTourTypeData.description && (
                      <p className="text-gray-300 text-lg">
                        {selectedTourTypeData.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleClearFilter}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Packages Grid */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-white">
                <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-24 h-24 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                      <SparklesIcon className="h-12 w-12 text-orange-300" />
                    </div>
                    <h3 className="text-3xl">Error Loading Packages</h3>
                    <p className="text-xl text-gray-300">
                      {error}
                    </p>
                    <Button
                      onClick={() => getPackages({}, 1)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Try Again
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Card>
              </div>
            ) : packages.length > 0 ? (
              <>
                <motion.div 
                  className="text-center text-white space-y-8 mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl leading-tight">
                    {selectedTourType ? 'Selected Packages' : 'Featured'}
                    <span className="block text-orange-400">Travel Experiences</span>
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -10,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      className="cursor-pointer"
                    >
                      <Card className="h-full bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                        {/* Package Image */}
                        <div className="relative h-48 overflow-hidden">
                          {pkg.image?.url ? (
                            <ImageWithFallback
                              src={pkg.image.url}
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                              <span className="text-white text-4xl">🏔️</span>
                            </div>
                          )}
                          {pkg.featured && (
                            <Badge 
                              variant="secondary" 
                              className="absolute top-3 left-3 bg-orange-500 text-white border-orange-500"
                            >
                              Featured
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className="absolute top-3 right-3 bg-black/80 text-white border-transparent"
                          >
                            {formatPrice(pkg.price)}
                          </Badge>
                        </div>

                        {/* Package Content */}
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <Badge variant="outline" className="border-orange-400/50 text-orange-300 hover:bg-orange-400/20">
                              {pkg.tourType?.name || 'Adventure'}
                            </Badge>
                          </div>

                          <CardTitle className="text-white text-xl">
                            {pkg.title}
                          </CardTitle>

                          <CardDescription className="text-gray-300 leading-relaxed">
                            {pkg.description}
                          </CardDescription>

                          {/* Rating */}
                          <div className="flex items-center">
                            <StarRating rating={pkg.averageRating || 0} readonly size="sm" />
                            <span className="text-sm text-gray-400 ml-2">
                              {pkg.averageRating ? pkg.averageRating.toFixed(1) : '0.0'} 
                              {pkg.numReviews > 0 && ` (${pkg.numReviews} review${pkg.numReviews !== 1 ? 's' : ''})`}
                            </span>
                          </div>

                          {/* Package Details */}
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-400">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {pkg.days} days, {pkg.nights} nights
                            </div>
                            {pkg.itinerary?.[0]?.places?.[0] && (
                              <div className="flex items-center text-sm text-gray-400">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                {pkg.itinerary[0].places[0].name}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <Button 
                            asChild 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                          >
                            <Link to={`/packages/${pkg._id}`}>
                              Explore Package
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-16">
                    <motion.div 
                      className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                      >
                        ← Previous
                      </Button>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.div
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handlePageChange(page)}
                            variant={page === currentPage ? "default" : "ghost"}
                            size="sm"
                            className={page === currentPage 
                              ? "bg-orange-500 hover:bg-orange-600 text-white" 
                              : "text-white hover:bg-white/20"
                            }
                          >
                            {page}
                          </Button>
                        </motion.div>
                      ))}
                      
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                      >
                        Next →
                      </Button>
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-white">
                <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-24 h-24 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                      <GlobeAltIcon className="h-12 w-12 text-orange-300" />
                    </div>
                    <h3 className="text-3xl">
                      {selectedTourType ? 'No Packages Found' : 'No Packages Available'}
                    </h3>
                    <p className="text-xl text-gray-300">
                      {selectedTourType 
                        ? `No packages found for this category. Try selecting a different category or browse all packages.`
                        : 'Check back soon for our latest travel packages!'
                      }
                    </p>
                    {selectedTourType && (
                      <Button
                        onClick={handleClearFilter}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        View All Packages
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </motion.div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <Card className="p-12 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-gray-800 text-4xl">Ready for Your Sri Lankan Adventure?</h3>
                    <p className="text-gray-600 text-xl leading-relaxed">
                      Let us craft the perfect journey for you. From sunrise at Adam's Peak 
                      to candlelit dinners in Galle Fort, your dream vacation awaits.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="h-16 px-8 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                        <HeartIcon className="mr-3 h-6 w-6" />
                        Start Your Journey
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="h-16 px-8 text-lg border-orange-400 text-orange-600">
                        <GlobeAltIcon className="mr-3 h-6 w-6" />
                        Contact Us
                      </Button>
                    </motion.div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-gray-500">
                      🏢 Colombo Office • 📞 +94 77 123 4567 • 📧 hello@srilankandreams.com
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
      </div>
    </>
  );
};

export default Packages; 