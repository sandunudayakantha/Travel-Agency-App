import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  PlayIcon, 
  ArrowRightIcon, 
  MapPinIcon, 
  XMarkIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import StarRating from '../components/StarRating';
import TravelersReviewSection from '../components/TravelersReviewSection';
import SearchSection from '../components/SearchSection';
import FeaturedPackages from '../components/FeaturedPackages';
import GetInTouchSection from '../components/GetInTouchSection';


// Typing effect component
const TypewriterText = ({ words, speed = 100, delay = 2000 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      // Deleting effect
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
      }, speed / 2);
      
      return () => clearTimeout(timeout);
    } else {
      // Typing effect
      if (currentText === currentWord) {
        // Word is complete, wait then start deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
        
        return () => clearTimeout(timeout);
      }
      
      const timeout = setTimeout(() => {
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Home = () => {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  
  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  


  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative h-screen overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Sigiriya Lion Rock Fortress, Sri Lanka" 
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
                {/* Enhanced Parallax Background Elements */}
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full -translate-x-48 -translate-y-48"
                style={{
            transform: `translate(-192px, -192px) translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
                }}
              ></div>
        <div 
          className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-blue-300/20 rounded-full translate-x-32"
          style={{
            transform: `translate(128px, 0px) translateY(${scrollY * -0.08}px) rotate(${scrollY * -0.02}deg)`,
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full translate-x-32 translate-y-32"
          style={{
            transform: `translate(128px, 128px) translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.03}deg)`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center px-4 max-w-4xl">
          <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
                <span className="text-blue-400 uppercase tracking-wide">Best in the World</span>
              </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Discover Your Next<br />
                <TypewriterText 
                  words={["Adventure", "Journey", "Experience", "Destination", "Escape"]}
                  speed={150}
                  delay={2500}
                />
            </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
            >
              Experience the world's most amazing destinations with our curated travel packages. 
            </motion.p>
            


            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
            
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/packages')}
                className="relative px-8 py-4  backdrop-blur-sm border-2 border-white/30 text-white rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl overflow-hidden group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 font-bold">View Destinations</span>
              </motion.button>
            </motion.div>
              </div>
            </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-sm uppercase tracking-wide">Scroll to explore</span>
            <ArrowRightIcon className="h-6 w-6 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* FigmaUI Enhanced Search Section */}
      <SearchSection />



      {/* Sigiriya Showcase Section with Parallax */}


      {/* Enhanced Popular Destinations Section with Parallax */}
 

      {/* FigmaUI Enhanced Featured Packages Section */}
      <FeaturedPackages />

      {/* FigmaUI Enhanced Travelers Review Section */}
      <TravelersReviewSection />

      {/* FigmaUI Enhanced Get in Touch Section */}
      <GetInTouchSection />

      {/* Enhanced CTA Section with Parallax */}

    </div>
  );
};

export default Home; 