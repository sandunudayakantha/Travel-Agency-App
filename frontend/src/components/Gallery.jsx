import React, { useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Play, Heart, Eye, Share2, Calendar, 
  MapPin, Users, Search, X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useGallery } from '../contexts/GalleryContext';

const Gallery = () => {
  const {
    galleryItems,
    categories,
    loading,
    pagination,
    filters,
    getGalleryItems,
    setFilters,
    clearFilters
  } = useGallery();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentBg, setCurrentBg] = useState(0);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Esala Perahera background
  const backgroundImage = "https://images.unsplash.com/photo-1566766188646-5d0310191714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc2FsYSUyMHBlcmFoZXJhJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDU0MjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) {
      return galleryItems;
    }

    const query = searchQuery.toLowerCase();
    return galleryItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [searchQuery, galleryItems]);

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const featuredVideos = filteredVideos.filter(item => item.featured);
  const regularVideos = filteredVideos.filter(item => !item.featured);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
  };

  const handlePageChange = (page) => {
    getGalleryItems(filters, page);
  };

  // Load gallery items on component mount
  React.useEffect(() => {
    getGalleryItems(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Static Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src={backgroundImage}
          alt="Esala Perahera - Kandy's magnificent cultural procession"
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
              <Play className="h-8 w-8" />
              <span className="text-xl">Visual Journey Through Sri Lanka</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl lg:text-8xl leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Experience
              <span className="block text-orange-400">Sri Lanka</span>
              <span className="block">Through Video</span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              From the magnificent Esala Perahera procession to hidden waterfalls, 
              witness the beauty of Sri Lanka through our curated video collection.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-orange-300" />
                </div>
                <Input
                  type="text"
                  placeholder="Search videos... (e.g., 'temple', 'safari', 'food', 'kandy')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-12 pr-12 text-lg bg-black/30 backdrop-blur-md border-white/30 text-white placeholder:text-gray-300 focus:border-orange-400 focus:ring-orange-400/30 rounded-xl transition-all duration-300 hover:bg-black/40 hover:border-white/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-300 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </form>
              
              {/* Search Results Info */}
              {searchQuery && (
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                    {searchQuery.trim() && ` for "${searchQuery}"`}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            {!searchQuery && (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30 px-6 py-3 text-lg">
                  {galleryItems.length} Amazing Videos • Updated Weekly
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Search Results - No Results Found */}
        {searchQuery && filteredVideos.length === 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-4xl text-center text-white">
              <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                    <Search className="h-12 w-12 text-orange-300" />
                  </div>
                  <h2 className="text-3xl">No videos found</h2>
                  <p className="text-xl text-gray-300">
                    We couldn't find any videos matching "{searchQuery}". 
                    Try searching for destinations like "Kandy", "Sigiriya", or activities like "safari", "temple".
                  </p>
                  <Button 
                    onClick={clearSearch}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Show All Videos
                  </Button>
                </motion.div>
              </Card>
            </div>
          </section>
        )}

        {/* Featured Videos Section */}
        {featuredVideos.length > 0 && (
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
                  {searchQuery ? 'Featured Search Results' : 'Featured Videos'}
                </Badge>
                <h2 className="text-5xl leading-tight">
                  Must-Watch
                  <span className="block text-orange-400">Sri Lankan Experiences</span>
                </h2>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredVideos.map((item, index) => (
                  <motion.div
                    key={item._id}
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
                    <Card 
                      className="bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {item.type === 'video' ? (
                          <iframe
                            src={getYouTubeEmbedUrl(item.video.videoId)}
                            title={item.title}
                            className="w-full h-full transition-transform duration-500 hover:scale-105"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                        
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                          {item.type === 'video' ? 'Video' : 'Image'}
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <h3 className="text-white text-xl">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">{item.description}</p>
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="outline" 
                                className="text-xs border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer transition-all duration-200 hover:scale-105"
                                onClick={() => setSearchQuery(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {item.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-orange-300 transition-colors duration-200">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-orange-300 transition-colors duration-200">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Instagram-style Video Grid */}
        {regularVideos.length > 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                className="text-center text-white space-y-8 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl leading-tight">
                  {searchQuery ? 'More Results' : 'Explore More'}
                  <span className="block text-orange-400">Sri Lankan Adventures</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  {searchQuery 
                    ? `Discover more videos matching "${searchQuery}"`
                    : 'Discover hidden gems, cultural treasures, and natural wonders through our growing collection of travel videos.'
                  }
                </p>
              </motion.div>

              {/* Instagram-style Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularVideos.map((item, index) => {
                  // Create varied heights for Instagram-like layout
                  const isLarge = index % 5 === 0 || index % 7 === 0;
                  
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.08,
                        y: -15,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }}
                      className="cursor-pointer"
                    >
                      <Card 
                        className={`bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 ${isLarge ? "lg:row-span-2" : ""}`}
                      >
                        <div className={`relative ${isLarge ? 'aspect-[4/5]' : 'aspect-video'} overflow-hidden`}>
                          {item.type === 'video' ? (
                            <iframe
                              src={getYouTubeEmbedUrl(item.video.videoId)}
                              title={item.title}
                              className="w-full h-full transition-transform duration-500 hover:scale-110"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img
                              src={item.image.url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          )}
                          
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                            {item.type === 'video' ? 'Video' : 'Image'}
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <h3 className="text-white text-lg">
                            {item.title}
                          </h3>
                          {isLarge && (
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          
                          {/* Tags for larger cards */}
                          {isLarge && item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex} 
                                  variant="outline" 
                                  className="text-xs border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer transition-all duration-200 hover:scale-105"
                                  onClick={() => setSearchQuery(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.category}
                            </span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Popular Search Tags */}
        {!searchQuery && (
          <section className="px-4 py-16">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div 
                className="text-white space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl">Popular Searches</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['temple', 'safari', 'kandy', 'food', 'beach', 'mountain', 'heritage', 'festival'].map((tag) => (
                    <motion.div
                      key={tag}
                      whileHover={{ 
                        scale: 1.1,
                        y: -5,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer px-4 py-2 text-sm transition-all duration-200"
                        onClick={() => setSearchQuery(tag)}
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Statistics Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl leading-tight">
                Our Video
                <span className="block text-orange-400">Journey So Far</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "500K+", label: "Total Views", icon: Eye },
                { number: "25+", label: "Destinations Covered", icon: MapPin },
                { number: "50+", label: "Videos Created", icon: Play },
                { number: "10K+", label: "Subscribers", icon: Users }
              ].map((stat, index) => (
                <motion.div
                  key={index}
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
                  <Card 
                    className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-orange-500/20 rounded-full">
                        <stat.icon className="h-10 w-10 text-orange-300" />
                      </div>
                    </div>
                    <div className="text-white text-4xl mb-3">{stat.number}</div>
                    <div className="text-gray-300 text-lg">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <section className="px-4 py-16">
            <div className="container mx-auto max-w-4xl">
              <motion.div 
                className="flex justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <nav className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-2">
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
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
                        variant={page === pagination.currentPage ? "default" : "ghost"}
                        size="sm"
                        className={page === pagination.currentPage 
                          ? "bg-orange-500 hover:bg-orange-600 text-white" 
                          : "text-white hover:bg-white/20"
                        }
                      >
                        {page}
                      </Button>
                    </motion.div>
                  ))}
                  
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    Next →
                  </Button>
                </nav>
              </motion.div>
            </div>
          </section>
        )}

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
                    <h3 className="text-gray-800 text-4xl">Ready to Experience Sri Lanka?</h3>
                    <p className="text-gray-600 text-xl leading-relaxed">
                      Let these videos inspire your next adventure. Contact us to plan 
                      your personalized Sri Lankan journey and create your own unforgettable memories.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="h-16 px-8 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                        <Heart className="mr-3 h-6 w-6" />
                        Plan Your Journey
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="h-16 px-8 text-lg border-orange-400 text-orange-600">
                        <Play className="mr-3 h-6 w-6" />
                        Subscribe for More
                      </Button>
                    </motion.div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-gray-500">
                      🎥 New videos every week • 📧 hello@srilankandreams.com
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
  );
};

export default Gallery;
