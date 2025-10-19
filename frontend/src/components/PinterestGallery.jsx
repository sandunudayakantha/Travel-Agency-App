import React from 'react';
import { motion } from 'framer-motion';

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
import PidurangalaRock from '../pages/Images/Pidurangala-Rock-Group-Shot.jpg';
import EllaExperience from '../pages/Images/Experience the magic of Ella, Sri Lanka, where a….jpg';

const PinterestGallery = () => {

  // Local images with different aspect ratios for Pinterest-style layout
  const galleryImages = [
    {
      id: 1,
      src: PidurangalaRock,
      alt: "Pidurangala Rock Group Shot",
      title: "Pidurangala Rock",
      description: "Climb Pidurangala Rock for the best view of Sigiriya Rock Fortress and enjoy a spectacular sunrise or sunset experience.",
      height: "h-64"
    },
    {
      id: 2,
      src: EllaExperience,
      alt: "Ella Sri Lanka Experience",
      title: "Ella Magic",
      description: "Experience the magic of Ella, Sri Lanka, where misty mountains meet lush tea plantations in perfect harmony.",
      height: "h-80"
    },
    {
      id: 3,
      src: Unknown3,
      alt: "Sri Lankan Attraction",
      title: "Local Attraction",
      description: "Visit this popular attraction that showcases the charm and beauty of Sri Lanka.",
      height: "h-72"
    },
    {
      id: 4,
      src: Unknown4,
      alt: "Sri Lankan View",
      title: "Panoramic View",
      description: "Enjoy breathtaking panoramic views that capture the essence of Sri Lanka's natural beauty.",
      height: "h-56"
    },
    {
      id: 5,
      src: Unknown5,
      alt: "Sri Lankan Landscape",
      title: "Natural Landscape",
      description: "Experience the diverse natural landscapes that make Sri Lanka a paradise for nature lovers.",
      height: "h-96"
    },
    {
      id: 6,
      src: Unknown6,
      alt: "Sri Lankan Heritage",
      title: "Cultural Site",
      description: "Discover Sri Lanka's rich cultural heritage through its historical sites and monuments.",
      height: "h-60"
    },
    {
      id: 7,
      src: Unknown7,
      alt: "Sri Lankan Nature",
      title: "Natural Wonder",
      description: "Witness the incredible natural wonders that make Sri Lanka a must-visit destination.",
      height: "h-76"
    },
    {
      id: 8,
      src: Unknown8,
      alt: "Sri Lankan Countryside",
      title: "Rural Beauty",
      description: "Explore the peaceful countryside and rural beauty that defines Sri Lanka's charm.",
      height: "h-68"
    },
    {
      id: 9,
      src: Unknown9,
      alt: "Sri Lankan Architecture",
      title: "Traditional Architecture",
      description: "Admire the traditional architecture and cultural landmarks that tell the story of Sri Lanka.",
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
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className={`relative ${image.height} overflow-hidden`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
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
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg font-semibold"
          >
            View All Photos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PinterestGallery;
