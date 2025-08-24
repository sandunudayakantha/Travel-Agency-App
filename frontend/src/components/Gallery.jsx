import React, { useState, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Play, Heart, Eye, Share2, Calendar, 
  MapPin, Users, Search, X, Camera
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
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Esala Perahera background
  const backgroundImage = "https://images.unsplash.com/photo-1566766188646-5d0310191714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc2FsYSUyMHBlcmFoZXJhJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDU0MjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  useEffect(() => {
    getGalleryItems(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  // Filter gallery items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return galleryItems;
    }

    const query = searchQuery.toLowerCase();
    return galleryItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
      item.category.toLowerCase().includes(query)
    );
  }, [searchQuery, galleryItems]);

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

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
              <span className="block">Through Media</span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              From the magnificent Esala Perahera procession to hidden waterfalls, 
              witness the beauty of Sri Lanka through our curated media collection.
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
                  placeholder="Search media... (e.g., 'temple', 'safari', 'food', 'kandy')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-12 pr-12 text-lg bg-black/30 backdrop-blur-md border-white/30 text-white placeholder:text-gray-300 focus:border-orange-400 focus:ring-orange-400/30 rounded-xl"
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
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
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
                  {galleryItems.length} Amazing Items • Updated Regularly
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Search Results - No Results Found */}
        {searchQuery && filteredItems.length === 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-4xl text-center text-white">
              <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20">
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                    <Search className="h-12 w-12 text-orange-300" />
                  </div>
                  <h2 className="text-3xl">No items found</h2>
                  <p className="text-xl text-gray-300">
                    We couldn't find any items matching "{searchQuery}". 
                    Try searching for destinations like "Kandy", "Sigiriya", or activities like "safari", "temple".
                  </p>
                  <Button 
                    onClick={clearSearch}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  >
                    Show All Items
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Featured Items Section */}
        {featuredItems.length > 0 && (
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
                  {searchQuery ? 'Featured Search Results' : 'Featured Items'}
                </Badge>
                <h2 className="text-5xl leading-tight">
                  Must-See
                  <span className="block text-orange-400">Sri Lankan Experiences</span>
                </h2>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden">
                        {item.type === 'image' ? (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <iframe
                              src={getYouTubeEmbedUrl(item.video.videoId)}
                              title={item.title}
                              className="w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out border-2 border-orange-400/30 rounded-lg"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                            
                            {/* Video Hover Overlay */}
                            <motion.div 
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div 
                                className="w-20 h-20 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Play className="w-8 h-8 text-white ml-1" />
                              </motion.div>
                            </motion.div>
                          </div>
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
                                className="text-xs border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer"
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
                            <Button size="sm" variant="ghost" className="text-gray-400 rounded-xl">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 rounded-xl">
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

        {/* Instagram-style Media Grid */}
        {regularItems.length > 0 && (
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
                    ? `Discover more items matching "${searchQuery}"`
                    : 'Discover hidden gems, cultural treasures, and natural wonders through our growing collection of media.'
                  }
                </p>
              </motion.div>

              {/* Instagram-style Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularItems.map((item, index) => {
                  // Create varied heights for Instagram-like layout
                  const isLarge = index % 5 === 0 || index % 7 === 0;
                  
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className={`bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden group cursor-pointer ${isLarge ? "lg:row-span-2" : ""}`}>
                        <div className={`relative ${isLarge ? 'aspect-[4/5]' : 'aspect-video'} overflow-hidden`}>
                          {item.type === 'image' ? (
                            <img
                              src={item.image.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <iframe
                                src={getYouTubeEmbedUrl(item.video.videoId)}
                                title={item.title}
                                className="w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out border-2 border-orange-400/30 rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                              
                              {/* Video Hover Overlay */}
                              <motion.div 
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                              >
                                <motion.div 
                                  className="w-16 h-16 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Play className="w-6 h-6 text-white ml-1" />
                                </motion.div>
                              </motion.div>
                            </div>
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
                                  className="text-xs border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer"
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <nav className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20 p-2">
                    <Button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                    >
                      ← Previous
                    </Button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={page === pagination.currentPage ? "default" : "ghost"}
                        size="sm"
                        className={page === pagination.currentPage 
                          ? "bg-orange-500 hover:bg-orange-600 text-white rounded-xl" 
                          : "text-white hover:bg-white/20 rounded-xl"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                    >
                      Next →
                    </Button>
                  </nav>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Popular Search Tags */}
        {!searchQuery && (
          <section className="px-4 py-16">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div 
                className="text-white space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl">Popular Searches</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.slice(0, 8).map((category) => (
                    <Badge 
                      key={category}
                      variant="outline" 
                      className="border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer px-4 py-2 text-sm"
                      onClick={() => setSearchQuery(category)}
                    >
                      {category}
                    </Badge>
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
                Our Media
                <span className="block text-orange-400">Journey So Far</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: `${galleryItems.length}+`, label: "Total Items", icon: Eye },
                { number: `${categories.length}+`, label: "Categories Covered", icon: MapPin },
                { number: "24/7", label: "Available", icon: Play },
                { number: "100%", label: "Sri Lankan", icon: Users }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center">
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

        
        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default Gallery;
