import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Play, Heart, Eye, Share2, Calendar, 
  MapPin, Users, Search, X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Single Esala Perahera background
  const backgroundImage = "https://images.unsplash.com/photo-1566766188646-5d0310191714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc2FsYSUyMHBlcmFoZXJhJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDU0MjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  // Sample YouTube videos for Sri Lankan travel content
  const allVideos = [
    {
      id: "dQw4w9WgXcQ", // Replace with actual Sri Lankan travel video IDs
      title: "Esala Perahera 2024 - Full Ceremony",
      description: "Experience the grandest cultural procession in Sri Lanka",
      duration: "12:34",
      views: "245K",
      date: "2 weeks ago",
      featured: true,
      tags: ["cultural", "festival", "kandy", "ceremony", "traditional"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Sigiriya Rock Fortress Climb",
      description: "Ancient wonder from sunrise to sunset",
      duration: "8:45",
      views: "89K",
      date: "1 month ago",
      featured: false,
      tags: ["heritage", "climbing", "ancient", "unesco", "adventure"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Kandy Temple of Sacred Tooth",
      description: "Inside Sri Lanka's most sacred temple",
      duration: "6:23",
      views: "156K",
      date: "3 weeks ago",
      featured: true,
      tags: ["temple", "sacred", "buddhist", "kandy", "spiritual"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Ella Nine Arch Bridge Train",
      description: "Scenic train journey through tea country",
      duration: "4:12",
      views: "67K",
      date: "2 weeks ago",
      featured: false,
      tags: ["train", "bridge", "ella", "tea", "scenic", "mountains"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Yala National Park Safari",
      description: "Leopards and elephants in the wild",
      duration: "15:20",
      views: "198K",
      date: "1 week ago",
      featured: false,
      tags: ["safari", "wildlife", "leopard", "elephant", "nature", "yala"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Galle Fort Colonial Architecture",
      description: "Dutch heritage meets ocean views",
      duration: "7:56",
      views: "92K",
      date: "4 days ago",
      featured: false,
      tags: ["galle", "fort", "colonial", "dutch", "heritage", "ocean"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Sri Lankan Street Food Tour",
      description: "Authentic flavors from Colombo streets",
      duration: "11:18",
      views: "134K",
      date: "5 days ago",
      featured: true,
      tags: ["food", "street", "colombo", "local", "cuisine", "authentic"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Adam's Peak Sunrise Pilgrimage",
      description: "Sacred mountain climbing experience",
      duration: "9:33",
      views: "78K",
      date: "1 week ago",
      featured: false,
      tags: ["adams peak", "sunrise", "pilgrimage", "mountain", "hiking", "sacred"]
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Mirissa Whale Watching",
      description: "Blue whales in their natural habitat",
      duration: "13:45",
      views: "112K",
      date: "6 days ago",
      featured: false,
      tags: ["whale", "mirissa", "ocean", "blue whale", "marine", "wildlife"]
    }
  ];

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) {
      return allVideos;
    }

    const query = searchQuery.toLowerCase();
    return allVideos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const featuredVideos = filteredVideos.filter(video => video.featured);
  const regularVideos = filteredVideos.filter(video => !video.featured);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen">
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
          <div className="max-w-5xl space-y-8">
            <div className="flex items-center justify-center gap-2 text-orange-300">
              <Play className="h-8 w-8" />
              <span className="text-xl">Visual Journey Through Sri Lanka</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl leading-tight">
              Experience
              <span className="block text-orange-400">Sri Lanka</span>
              <span className="block">Through Video</span>
            </h1>
            
            <p className="text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              From the magnificent Esala Perahera procession to hidden waterfalls, 
              witness the beauty of Sri Lanka through our curated video collection.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-orange-300" />
                </div>
                <Input
                  type="text"
                  placeholder="Search videos... (e.g., 'temple', 'safari', 'food', 'kandy')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-12 pr-12 text-lg bg-black/30 backdrop-blur-md border-white/30 text-white placeholder:text-gray-300 focus:border-orange-400 focus:ring-orange-400/30 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-300 transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
              
              {/* Search Results Info */}
              {searchQuery && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                    {searchQuery.trim() && ` for "${searchQuery}"`}
                  </Badge>
                </div>
              )}
            </div>

            {!searchQuery && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30 px-6 py-3 text-lg">
                  {allVideos.length} Amazing Videos • Updated Weekly
                </Badge>
              </div>
            )}
          </div>
        </section>

        {/* Search Results - No Results Found */}
        {searchQuery && filteredVideos.length === 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-4xl text-center text-white">
              <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20">
                <div className="space-y-6">
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
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Featured Videos Section */}
        {featuredVideos.length > 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center text-white space-y-8 mb-16">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                  {searchQuery ? 'Featured Search Results' : 'Featured Videos'}
                </Badge>
                <h2 className="text-5xl leading-tight">
                  Must-Watch
                  <span className="block text-orange-400">Sri Lankan Experiences</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {featuredVideos.map((video, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden"
                  >
                    <div className="relative aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(video.id)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <h3 className="text-white text-xl">
                        {video.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{video.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {video.tags.slice(0, 3).map((tag, tagIndex) => (
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
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {video.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {video.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Instagram-style Video Grid */}
        {regularVideos.length > 0 && (
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center text-white space-y-8 mb-16">
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
              </div>

              {/* Instagram-style Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularVideos.map((video, index) => {
                  // Create varied heights for Instagram-like layout
                  const isLarge = index % 5 === 0 || index % 7 === 0;
                  
                  return (
                    <Card 
                      key={index} 
                      className={`bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden ${isLarge ? "lg:row-span-2" : ""}`}
                    >
                      <div className={`relative ${isLarge ? 'aspect-[4/5]' : 'aspect-video'}`}>
                        <iframe
                          src={getYouTubeEmbedUrl(video.id)}
                          title={video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <h3 className="text-white text-lg">
                          {video.title}
                        </h3>
                        {isLarge && (
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {video.description}
                          </p>
                        )}
                        
                        {/* Tags for larger cards */}
                        {isLarge && (
                          <div className="flex flex-wrap gap-1">
                            {video.tags.slice(0, 2).map((tag, tagIndex) => (
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
                            {video.views}
                          </span>
                          <span>{video.date}</span>
                        </div>
                      </div>
                    </Card>
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
              <div className="text-white space-y-6">
                <h3 className="text-2xl">Popular Searches</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['temple', 'safari', 'kandy', 'food', 'beach', 'mountain', 'heritage', 'festival'].map((tag) => (
                    <Badge 
                      key={tag}
                      variant="outline" 
                      className="border-orange-400/50 text-orange-300 hover:bg-orange-400/20 cursor-pointer px-4 py-2 text-sm"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Statistics Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center text-white space-y-8 mb-16">
              <h2 className="text-5xl leading-tight">
                Our Video
                <span className="block text-orange-400">Journey So Far</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "500K+", label: "Total Views", icon: Eye },
                { number: "25+", label: "Destinations Covered", icon: MapPin },
                { number: "50+", label: "Videos Created", icon: Play },
                { number: "10K+", label: "Subscribers", icon: Users }
              ].map((stat, index) => (
                <Card 
                  key={index} 
                  className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-orange-500/20 rounded-full">
                      <stat.icon className="h-10 w-10 text-orange-300" />
                    </div>
                  </div>
                  <div className="text-white text-4xl mb-3">{stat.number}</div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-4xl text-center">
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
                  <Button className="h-16 px-8 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <Heart className="mr-3 h-6 w-6" />
                    Plan Your Journey
                  </Button>
                  <Button variant="outline" className="h-16 px-8 text-lg border-orange-400 text-orange-600">
                    <Play className="mr-3 h-6 w-6" />
                    Subscribe for More
                  </Button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-gray-500">
                    🎥 New videos every week • 📧 hello@srilankandreams.com
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default Gallery;