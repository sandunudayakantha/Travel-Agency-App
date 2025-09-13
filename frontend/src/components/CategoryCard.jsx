import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

const CategoryCard = ({ 
  tourType, 
  isSelected, 
  onClick, 
  index,
  isAllPackages = false 
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: { 
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-4 h-28
        border-2 transition-all duration-300 ease-out
        ${isSelected 
          ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/10 shadow-lg shadow-orange-500/25' 
          : 'border-white/20 bg-white/5 backdrop-blur-sm hover:border-orange-300/50 hover:bg-white/10'
        }
        hover:shadow-xl hover:shadow-orange-500/20
        group-hover:scale-105
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-transparent"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-300 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          {/* Icon/Image */}
          <div className="mb-2">
            {isAllPackages ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                🌍
              </div>
            ) : tourType?.image?.url ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
                <ImageWithFallback
                  src={tourType.image.url}
                  alt={tourType.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl shadow-lg">
                🏔️
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`
            font-semibold text-xs leading-tight
            ${isSelected ? 'text-orange-200' : 'text-white'}
            group-hover:text-orange-200 transition-colors duration-200
          `}>
            {isAllPackages ? 'All Packages' : tourType?.name}
          </h3>

          {/* Selection Indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full shadow-lg"
            />
          )}
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </div>
    </motion.div>
  );
};

export default CategoryCard;
