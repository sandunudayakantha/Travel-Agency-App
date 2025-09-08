import React, { useEffect } from 'react';
import ContactUs from '../components/ContactUs';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const Contact = () => {
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  useEffect(() => {
    startLoading("Connecting you with us...", 1500);
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
      <ContactUs />
    </>
  );
};

export default Contact;


