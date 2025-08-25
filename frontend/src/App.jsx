import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoadScript } from '@react-google-maps/api';
import { getGoogleMapsApiKey, getGoogleMapsMapId, isGoogleMapsMapIdConfigured } from './config/maps';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext.jsx';
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';
import { PackageProvider } from './contexts/PackageContext.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';
import { VehicleProvider } from './contexts/VehicleContext.jsx';
import { TourGuideProvider } from './contexts/TourGuideContext.jsx';
import { DriverProvider } from './contexts/DriverContext.jsx';
import { PlaceProvider } from './contexts/PlaceContext.jsx';
import { TourTypeProvider } from './contexts/TourTypeContext.jsx';
import { CustomInquiryProvider } from './contexts/CustomInquiryContext.jsx';
import { ReviewProvider } from './contexts/ReviewContext.jsx';
import { MessageProvider } from './contexts/MessageContext.jsx';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext.jsx';
import { GalleryProvider } from './contexts/GalleryContext.jsx';

// Components
import Navigation from './components/layout/Navigation.jsx';
import Footer from './components/layout/Footer.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import AuthNotification from './components/AuthNotification.jsx';

// Pages
import Home from './pages/Home.jsx';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import CustomPackage from './pages/CustomPackage';
import AboutUs from './pages/AboutUs.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPackages from './pages/admin/Packages';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';
import AdminVehicles from './pages/admin/Vehicles';
import AdminTourGuides from './pages/admin/TourGuides';
import AdminDrivers from './pages/admin/Drivers';
import AdminPlaces from './pages/admin/Places';
import AdminPlaceDetail from './pages/admin/PlaceDetail';
import PlaceDetail from './pages/PlaceDetail';
import AdminCustomInquiries from './pages/admin/CustomInquiries';
import AdminReviews from './pages/admin/Reviews';
import AdminMessages from './pages/admin/Messages';
import AdminSiteSettings from './pages/admin/SiteSettings';
import Gallery from './pages/Gallery';
import AdminGallery from './pages/admin/Gallery';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/auth/AdminLogin';
import FloatingContact from './components/FloatingContact';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  // Check Map ID configuration on startup
  React.useEffect(() => {
    if (isGoogleMapsMapIdConfigured()) {
      console.log('🎯 Google Maps Map ID is properly configured for Advanced Markers');
    } else {
      console.warn('⚠️ Google Maps Map ID not configured - Advanced Markers may not work');
    }
  }, []);

  return (
    <LoadScript 
      googleMapsApiKey={getGoogleMapsApiKey() || 'your-api-key'}
      libraries={['places', 'geometry', 'marker']}
      version="weekly"
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ClerkAuthProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <PackageProvider>
              <BookingProvider>
                <VehicleProvider>
                  <TourGuideProvider>
                    <DriverProvider>
                      <PlaceProvider>
                        <TourTypeProvider>
                                                  <CustomInquiryProvider>
                          <ReviewProvider>
                            <MessageProvider>
                              <SiteSettingsProvider>
                                <GalleryProvider>
                    <div className="min-h-screen flex flex-col">
                      <AuthNotification />
                      <Navigation />
                      <main className="flex-grow">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/packages" element={<Packages />} />
                          <Route path="/packages/:id" element={<PackageDetail />} />
                          <Route path="/custom-package" element={<CustomPackage />} />
                          <Route path="/about" element={<AboutUs />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/gallery" element={<Gallery />} />
                          <Route path="/places/:id" element={<PlaceDetail />} />
                          
                          {/* Auth Routes */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          
                          {/* Protected Routes */}
                          <Route path="/profile" element={
                            <PrivateRoute>
                              <Profile />
                            </PrivateRoute>
                          } />
                          <Route path="/bookings" element={
                            <PrivateRoute>
                              <Bookings />
                            </PrivateRoute>
                          } />
                          <Route path="/bookings/:id" element={
                            <PrivateRoute>
                              <BookingDetail />
                            </PrivateRoute>
                          } />
                          
                          {/* Admin Routes */}
                          <Route path="/admin" element={
                            <AdminRoute>
                              <AdminDashboard />
                            </AdminRoute>
                          } />
                          <Route path="/admin/packages" element={
                            <AdminRoute>
                              <AdminPackages />
                            </AdminRoute>
                          } />
                        <Route path="/admin/bookings" element={
                          <AdminRoute>
                            <AdminBookings />
                          </AdminRoute>
                        } />
                        <Route path="/admin/users" element={
                          <AdminRoute>
                            <AdminUsers />
                          </AdminRoute>
                        } />
                        <Route path="/admin/vehicles" element={
                          <AdminRoute>
                            <AdminVehicles />
                          </AdminRoute>
                        } />
                        <Route path="/admin/tour-guides" element={
                          <AdminRoute>
                            <AdminTourGuides />
                          </AdminRoute>
                        } />
                        <Route path="/admin/drivers" element={
                          <AdminRoute>
                            <AdminDrivers />
                          </AdminRoute>
                        } />
                        <Route path="/admin/places" element={
                          <AdminRoute>
                            <AdminPlaces />
                          </AdminRoute>
                        } />
                        <Route path="/admin/places/:id" element={
                          <AdminRoute>
                            <AdminPlaceDetail />
                          </AdminRoute>
                        } />
                        <Route path="/admin/custom-inquiries" element={
                          <AdminRoute>
                            <AdminCustomInquiries />
                          </AdminRoute>
                        } />
                        <Route path="/admin/reviews" element={
                          <AdminRoute>
                            <AdminReviews />
                          </AdminRoute>
                        } />
                        <Route path="/admin/messages" element={
                          <AdminRoute>
                            <AdminMessages />
                          </AdminRoute>
                        } />
                        <Route path="/admin/site-settings" element={
                          <AdminRoute>
                            <AdminSiteSettings />
                          </AdminRoute>
                        } />
                        <Route path="/admin/gallery" element={
                          <AdminRoute>
                            <AdminGallery />
                          </AdminRoute>
                        } />
                        
                        {/* Legal and Help Routes */}
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <FloatingContact />
                  <Toaster position="top-right" />
                </GalleryProvider>
                </SiteSettingsProvider>
              </MessageProvider>
            </ReviewProvider>
          </CustomInquiryProvider>
        </TourTypeProvider>
      </PlaceProvider>
    </DriverProvider>
  </TourGuideProvider>
</VehicleProvider>
</BookingProvider>
</PackageProvider>
</AdminAuthProvider>
</AuthProvider>
</ClerkAuthProvider>
    </Router>
    </LoadScript>
  );
}

export default App; 