import { useState, useCallback, useRef } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading...');
  const [loadingSteps, setLoadingSteps] = useState([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const startLoading = useCallback((initialMessage = 'Loading...', duration = 3000) => {
    setIsLoading(true);
    setProgress(0);
    setMessage(initialMessage);
    setLoadingSteps([]);

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulate progress
    let currentProgress = 0;
    const increment = 100 / (duration / 100);
    
    intervalRef.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(intervalRef.current);
      }
      setProgress(currentProgress);
    }, 100);

    // Auto stop after duration
    timeoutRef.current = setTimeout(() => {
      stopLoading();
    }, duration);

    return () => stopLoading();
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(100);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset progress after a short delay
    setTimeout(() => {
      setProgress(0);
      setMessage('Loading...');
      setLoadingSteps([]);
    }, 500);
  }, []);

  const updateMessage = useCallback((newMessage) => {
    setMessage(newMessage);
  }, []);

  const updateProgress = useCallback((newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  const addLoadingStep = useCallback((step) => {
    setLoadingSteps(prev => [...prev, step]);
  }, []);

  const clearLoadingSteps = useCallback(() => {
    setLoadingSteps([]);
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isLoading,
    progress,
    message,
    loadingSteps,
    startLoading,
    stopLoading,
    updateMessage,
    updateProgress,
    addLoadingStep,
    clearLoadingSteps,
    cleanup
  };
};
