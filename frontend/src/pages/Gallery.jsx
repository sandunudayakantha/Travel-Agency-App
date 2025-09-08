import React, { useEffect } from 'react';
import Gallery from '../components/Gallery';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const GalleryPage = () => {
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  useEffect(() => {
    startLoading("Loading beautiful memories...", 2000);
  }, [startLoading]);

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
      <Gallery />
    </>
  );
};

export default GalleryPage;
