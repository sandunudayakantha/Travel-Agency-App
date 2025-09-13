import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// Import local images
import Unknown from '../pages/Images/Unknown.jpg';
import Unknown2 from '../pages/Images/Unknown-2.jpg';
import Unknown3 from '../pages/Images/Unknown-3.jpg';
import Unknown4 from '../pages/Images/Unknown-4.jpg';
import Unknown5 from '../pages/Images/Unknown-5.jpg';
import Unknown6 from '../pages/Images/Unknown-6.jpg';
import Unknown7 from '../pages/Images/Unknown-7.jpg';
import Unknown8 from '../pages/Images/Unknown-8.jpg';
import Unknown9 from '../pages/Images/Unknown-9.jpg';
import AdamsPeak from '../pages/Images/The epic climb up Adam\'s Peak in Sri Lanka! The….jpg';
import TalallaBeach from '../pages/Images/Talalla Beach, Sri Lanka - Tropical Paradise.jpg';
import Fishermen from '../pages/Images/Fishermen - Koggala, Sri Lanka.jpg';
import EllaBridge from '../pages/Images/Ella-Nine-Arch-Bridge-1-scaled copy.jpg';
import GalleFort from '../pages/Images/galle-fort-1050x700-1.jpg';
import Jaffna from '../pages/Images/Jaffna,_srilanka.jpg';
import NuwaraEliya from '../pages/Images/nuwara-eliya-highlights-waterfall-tea-and-picturesque-train-ride-4058.webp';
import TempleKandy from '../pages/Images/temple-sacred-tooth-relic-kandy-sri-lanka.jpg';

const PinterestGallery = () => {
  const [likedImages, setLikedImages] = useState(new Set());
  const [hoveredImage, setHoveredImage] = useState(null);

  // Local images with different aspect ratios for Pinterest-style layout
  const galleryImages = [
    {
      id: 1,
      src: Unknown,
      alt: "Beautiful Sri Lankan Landscape",
      title: "Tropical Paradise",
      description: "Experience the breathtaking beauty of Sri Lanka's diverse landscapes, from lush green hills to pristine beaches.",
      height: "h-64"
    },
    {
      id: 2,
      src: Unknown2,
      alt: "Scenic Sri Lankan View",
      title: "Natural Beauty",
      description: "Discover the stunning natural wonders that make Sri Lanka one of the world's most beautiful destinations.",
      height: "h-80"
    },
    {
      id: 3,
      src: Unknown3,
      alt: "Sri Lankan Heritage",
      title: "Cultural Heritage",
      description: "Immerse yourself in Sri Lanka's rich cultural heritage, spanning over 2,500 years of history and tradition.",
      height: "h-72"
    },
    {
      id: 4,
      src: Unknown4,
      alt: "Coastal Sri Lanka",
      title: "Coastal Charm",
      description: "Explore Sri Lanka's stunning coastline with pristine beaches, coral reefs, and charming fishing villages.",
      height: "h-56"
    },
    {
      id: 5,
      src: Unknown5,
      alt: "Mountain Views",
      title: "Mountain Majesty",
      description: "Witness the majestic mountain ranges of Sri Lanka, home to misty peaks and breathtaking panoramic views.",
      height: "h-96"
    },
    {
      id: 6,
      src: Unknown6,
      alt: "Traditional Architecture",
      title: "Ancient Architecture",
      description: "Marvel at Sri Lanka's ancient architectural wonders, showcasing the island's rich historical legacy.",
      height: "h-60"
    },
    {
      id: 7,
      src: Unknown7,
      alt: "Wildlife in Sri Lanka",
      title: "Wildlife Wonder",
      description: "Encounter Sri Lanka's incredible wildlife, including elephants, leopards, and over 400 species of birds.",
      height: "h-76"
    },
    {
      id: 8,
      src: Unknown8,
      alt: "Tea Plantations",
      title: "Tea Country",
      description: "Visit the world-famous tea plantations of Sri Lanka, where the finest Ceylon tea is grown in misty highlands.",
      height: "h-68"
    },
    {
      id: 9,
      src: Unknown9,
      alt: "Temple Architecture",
      title: "Sacred Temples",
      description: "Explore ancient Buddhist temples and sacred sites that have been centers of spirituality for centuries.",
      height: "h-52"
    },
    {
      id: 10,
      src: AdamsPeak,
      alt: "Adam's Peak Climb",
      title: "Sacred Mountain",
      description: "Climb Adam's Peak (Sri Pada), a sacred mountain revered by Buddhists, Hindus, Muslims, and Christians alike.",
      height: "h-84"
    },
    {
      id: 11,
      src: TalallaBeach,
      alt: "Talalla Beach Paradise",
      title: "Beach Paradise",
      description: "Relax on Talalla Beach, a pristine stretch of golden sand perfect for swimming, surfing, and beach activities.",
      height: "h-72"
    },
    {
      id: 12,
      src: Fishermen,
      alt: "Traditional Fishermen",
      title: "Cultural Experience",
      description: "Witness the traditional stilt fishing in Koggala, a unique fishing method passed down through generations.",
      height: "h-88"
    },
    {
      id: 13,
      src: EllaBridge,
      alt: "Ella Nine Arch Bridge",
      title: "Railway Romance",
      description: "Walk across the iconic Nine Arch Bridge in Ella, a stunning railway bridge surrounded by lush green tea plantations.",
      height: "h-64"
    },
    {
      id: 14,
      src: GalleFort,
      alt: "Galle Fort Heritage",
      title: "Colonial Heritage",
      description: "Explore Galle Fort, a UNESCO World Heritage site showcasing 400 years of colonial architecture and history.",
      height: "h-76"
    },
    {
      id: 15,
      src: Jaffna,
      alt: "Jaffna Northern Beauty",
      title: "Northern Charm",
      description: "Discover Jaffna, the cultural capital of the north, famous for its temples, cuisine, and unique Tamil heritage.",
      height: "h-68"
    },
    {
      id: 16,
      src: NuwaraEliya,
      alt: "Nuwara Eliya Tea Country",
      title: "Tea Country",
      description: "Visit Nuwara Eliya, known as 'Little England', famous for its cool climate, tea plantations, and colonial charm.",
      height: "h-80"
    },
    {
      id: 17,
      src: TempleKandy,
      alt: "Temple of Sacred Tooth Relic",
      title: "Sacred Temple",
      description: "Visit the Temple of the Sacred Tooth Relic in Kandy, one of Buddhism's most sacred sites and a UNESCO World Heritage site.",
      height: "h-72"
    }
  ];

  const handleLike = (imageId) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Travel Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the beauty of Sri Lanka through our curated collection of stunning destinations, from ancient temples to pristine beaches
          </p>
        </motion.div>

        {/* Pinterest-style Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              className="break-inside-avoid mb-6 group cursor-pointer"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                {/* Image */}
                <div className={`relative ${image.height} overflow-hidden`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Action buttons */}
                  <AnimatePresence>
                    {hoveredImage === image.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 right-4 flex gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image.id);
                          }}
                          className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors duration-200"
                        >
                          {likedImages.has(image.id) ? (
                            <HeartSolidIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-white" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors duration-200"
                        >
                          <ShareIcon className="h-5 w-5 text-white" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Content overlay */}
                <AnimatePresence>
                  {hoveredImage === image.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-4"
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                        <h3 className="text-white font-semibold text-lg mb-2">
                          {image.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {image.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Default content (always visible) */}
                <div className="p-4">
                  <h3 className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {image.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {image.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 text-gray-800 rounded-full hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-xl font-semibold"
          >
            View All Photos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PinterestGallery;
