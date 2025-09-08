import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TravelLoading from './TravelLoading';

const PageLoader = ({ 
  isLoading, 
  children, 
  loadingMessage = "Preparing your journey...",
  minLoadingTime = 1000 
}) => {
  const [showContent, setShowContent] = useState(!isLoading);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
      setLoadingStartTime(Date.now());
    } else {
      // Ensure minimum loading time for smooth UX
      const elapsedTime = loadingStartTime ? Date.now() - loadingStartTime : 0;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setShowContent(true);
      }, remainingTime);
    }
  }, [isLoading, minLoadingTime, loadingStartTime]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <TravelLoading 
            message={loadingMessage}
            progress={100}
            size="large"
            showProgress={true}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageLoader;
