import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TravelLoading = ({ 
  message = "Loading your journey...", 
  progress = 0, 
  size = "large",
  showProgress = true,
  theme = "sri-lanka"
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [dots, setDots] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Loading steps for dynamic messaging
  const loadingSteps = [
    "Preparing your adventure...",
    "Loading amazing destinations...",
    "Gathering travel insights...",
    "Almost ready to explore..."
  ];

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Update message when prop changes
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  // Cycle through loading steps
  useEffect(() => {
    if (!message || message === "Loading your journey...") {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % loadingSteps.length);
      }, 2000);
      return () => clearInterval(stepInterval);
    }
  }, [message, loadingSteps.length]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const progressVariants = {
    animate: {
      width: `${progress}%`,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-orange-900/90 backdrop-blur-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              <div className={`w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm`}></div>
            </motion.div>
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Modern Spinner Container */}
          <div className="relative mb-12">
            {/* Outer Glow Ring */}
            <motion.div
              className={`${sizeClasses[size]} absolute inset-0 bg-gradient-to-r from-orange-400/20 via-orange-500/30 to-orange-600/20 rounded-full blur-lg`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main Spinner Ring */}
            <motion.div
              className={`${sizeClasses[size]} relative border-4 border-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full mx-auto`}
              style={{
                background: 'conic-gradient(from 0deg, #fb923c, #f97316, #ea580c, #fb923c)',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)',
              }}
              variants={spinnerVariants}
              animate="animate"
            />
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Center Logo/Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <motion.div
                    className="text-2xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ✈️
                  </motion.div>
                </div>
                
                {/* Orbiting Elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Dynamic Loading Message */}
          <motion.div
            className={`${textSizeClasses[size]} text-white font-semibold mb-8 min-h-[2.5rem] flex items-center justify-center`}
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500">
              {message !== "Loading your journey..." ? currentMessage : loadingSteps[currentStep]}
            </span>
            <motion.span 
              className="text-orange-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {dots}
            </motion.span>
          </motion.div>

          {/* Modern Progress Bar */}
          {showProgress && (
            <div className="w-80 mx-auto mb-8">
              <div className="relative">
                {/* Background */}
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Progress Fill */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full relative overflow-hidden"
                    variants={progressVariants}
                    animate="animate"
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Progress Text */}
                <motion.div 
                  className="text-sm text-white/80 mt-3 font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(progress)}% Complete
                </motion.div>
              </div>
            </div>
          )}

          {/* Travel Icons */}
          <div className="flex justify-center space-x-6 text-2xl opacity-70">
            {['🏔️', '🌊', '🏛️', '🐘', '🌴'].map((icon, i) => (
              <motion.span
                key={i}
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, i % 2 === 0 ? 5 : -5, 0],
                }}
                transition={{ 
                  duration: 2 + i * 0.2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              >
                {icon}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom Loading Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TravelLoading;
