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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const handlePageChange = (page) => {
    getGalleryItems(filters, page);
  };

  // Load gallery items on component mount
  React.useEffect(() => {
    getGalleryItems(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  // Create cell layout data with different sizes
  const createCellLayout = (videos) => {
    return videos.map((item, index) => {
      // Define cell sizes based on position for varied layout
      let cellSize = 'medium';
      
      if (index % 7 === 0) cellSize = 'large'; // Every 7th item is large
      else if (index % 5 === 0) cellSize = 'wide'; // Every 5th item is wide
      else if (index % 3 === 0) cellSize = 'tall'; // Every 3rd item is tall
      else cellSize = 'small'; // Default small
      
      return {
        ...item,
        cellSize,
        index
      };
    });
  };

  const cellLayoutVideos = createCellLayout(filteredVideos);

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
        
        {/* Header Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl leading-tight">
                Explore More
                <span className="block text-orange-400">Sri Lankan Adventures</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Discover hidden gems, cultural treasures, and natural wonders through our growing collection of travel videos.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
          </div>
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

        {/* Cell-based Video Grid */}
        {cellLayoutVideos.length > 0 && (
          <section className="px-4 pb-32">
            <div className="container mx-auto max-w-7xl">
              {/* CSS Grid with varied cell sizes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
                {cellLayoutVideos.map((item, index) => {
                  // Define grid areas based on cell size
                  const getGridArea = (cellSize) => {
                    switch (cellSize) {
                      case 'large':
                        return 'span 2 / span 2'; // 2x2 grid area
                      case 'wide':
                        return 'span 1 / span 2'; // 1x2 grid area
                      case 'tall':
                        return 'span 2 / span 1'; // 2x1 grid area
                      default:
                        return 'span 1 / span 1'; // 1x1 grid area
                    }
                  };

                  return (
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
                      style={{ gridArea: getGridArea(item.cellSize) }}
                    >
                      <Card 
                        className="bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 h-full"
                      >
                        <div className="relative h-full overflow-hidden">
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
                          
                          {/* Overlay with content */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
                                {item.title}
                              </h3>
                              
                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
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
                              
                              <div className="flex items-center justify-between text-xs text-gray-300">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {item.category}
                                </span>
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {/* Video/Image indicator */}
                            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                              {item.type === 'video' ? 'Video' : 'Image'}
                            </div>
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

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default Gallery;
