import React, { useEffect } from 'react';
import TravelLoading from '../../components/TravelLoading';
import { useLoading } from '../../hooks/useLoading';

const Profile = () => {
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  useEffect(() => {
    startLoading("Loading your profile...", 1500);
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
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Profile
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account settings
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 text-center">
            Profile management page coming soon! This will allow users to view and edit their account information.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile; 