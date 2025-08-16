import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoadScript } from '@react-google-maps/api';
import { getGoogleMapsApiKey } from './config/maps';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext.jsx';
import { PackageProvider } from './contexts/PackageContext.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';
import { VehicleProvider } from './contexts/VehicleContext.jsx';
import { TourGuideProvider } from './contexts/TourGuideContext.jsx';
import { DriverProvider } from './contexts/DriverContext.jsx';
import { PlaceProvider } from './contexts/PlaceContext.jsx';
import { TourTypeProvider } from './contexts/TourTypeContext.jsx';

// Components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';

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
import NotFound from './pages/NotFound';
import AdminLogin from './pages/auth/AdminLogin';

function App() {
  return (
    <LoadScript 
      googleMapsApiKey={getGoogleMapsApiKey() || 'your-api-key'}
      libraries={['places', 'geometry']}
      onLoad={() => console.log('Google Maps API loaded successfully')}
      onError={(error) => console.error('Google Maps API failed to load:', error)}
    >
      <Router>
        <ClerkAuthProvider>
          <AuthProvider>
            <PackageProvider>
              <BookingProvider>
                <VehicleProvider>
                  <TourGuideProvider>
                    <DriverProvider>
                      <PlaceProvider>
                        <TourTypeProvider>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
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
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <Toaster position="top-right" />
                        </TourTypeProvider>
                  </PlaceProvider>
                  </DriverProvider>
                </TourGuideProvider>
              </VehicleProvider>
            </BookingProvider>
          </PackageProvider>
        </AuthProvider>
      </ClerkAuthProvider>
    </Router>
    </LoadScript>
  );
}

export default App; 