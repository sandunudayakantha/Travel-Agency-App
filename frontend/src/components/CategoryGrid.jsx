import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ 
  tourTypes, 
  selectedTourType, 
  onTourTypeSelect, 
  onClearFilter,
  loading = false 
}) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-white/70 text-sm">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
    >
      {/* All Packages Card */}
      <CategoryCard
        tourType={null}
        isSelected={!selectedTourType}
        onClick={onClearFilter}
        index={0}
        isAllPackages={true}
      />

      {/* Tour Type Categories */}
      {tourTypes?.map((tourType, index) => (
        <CategoryCard
          key={tourType._id}
          tourType={tourType}
          isSelected={selectedTourType === tourType._id}
          onClick={() => onTourTypeSelect(tourType._id)}
          index={index + 1}
        />
      ))}
    </motion.div>
  );
};

export default CategoryGrid;
