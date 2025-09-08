import React, { useEffect } from 'react';
import AboutUs from '../components/AboutUs';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const AboutUsPage = () => {
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  useEffect(() => {
    startLoading("Learning about our story...", 1500);
  }, [startLoading]);

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="medium"
        />
      )}
      <AboutUs />
    </>
  );
};

export default AboutUsPage;
