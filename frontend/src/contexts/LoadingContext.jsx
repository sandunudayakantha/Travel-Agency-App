import React, { createContext, useContext, useState, useCallback } from 'react';
import TravelLoading from '../components/TravelLoading';

const LoadingContext = createContext();

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback((loadingMessage = 'Loading...', duration = 3000) => {
    setIsLoading(true);
    setMessage(loadingMessage);
    setProgress(0);

    // Simulate progress
    let currentProgress = 0;
    const increment = 100 / (duration / 100);
    
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      setProgress(currentProgress);
    }, 100);

    // Auto stop after duration
    setTimeout(() => {
      stopLoading();
    }, duration);

    return () => stopLoading();
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(100);
    
    // Reset after animation
    setTimeout(() => {
      setProgress(0);
      setMessage('Loading...');
    }, 500);
  }, []);

  const updateMessage = useCallback((newMessage) => {
    setMessage(newMessage);
  }, []);

  const updateProgress = useCallback((newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  const value = {
    isLoading,
    message,
    progress,
    startLoading,
    stopLoading,
    updateMessage,
    updateProgress
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
    </LoadingContext.Provider>
  );
};
