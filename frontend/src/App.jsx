import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext.jsx';
import { PackageProvider } from './contexts/PackageContext.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';
import { VehicleProvider } from './contexts/VehicleContext.jsx';
import { TourGuideProvider } from './contexts/TourGuideContext.jsx';

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
import NotFound from './pages/NotFound';
import AdminLogin from './pages/auth/AdminLogin';

const RootLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'packages', element: <Packages /> },
      { path: 'packages/:id', element: <PackageDetail /> },
      { path: 'custom-package', element: <CustomPackage /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { path: 'register', element: <Register /> },
      { path: 'sign-in', element: <Login /> },
      { path: 'sign-up', element: <Register /> },

      { path: 'profile', element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ) },
      { path: 'bookings', element: (
        <PrivateRoute>
          <Bookings />
        </PrivateRoute>
      ) },
      { path: 'bookings/:id', element: (
        <PrivateRoute>
          <BookingDetail />
        </PrivateRoute>
      ) },

      { path: 'admin', element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      ) },
      { path: 'admin/packages', element: (
        <AdminRoute>
          <AdminPackages />
        </AdminRoute>
      ) },
      { path: 'admin/bookings', element: (
        <AdminRoute>
          <AdminBookings />
        </AdminRoute>
      ) },
      { path: 'admin/users', element: (
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      ) },
    ],
  },
], {
  future: {
    v7_startTransition: true,
  },
});

function App() {
  return (
    <ClerkAuthProvider>
      <AuthProvider>
        <PackageProvider>
          <BookingProvider>
            <RouterProvider router={router} />
function App() {
  return (
    <Router>
      <ClerkAuthProvider>
        <AuthProvider>
          <PackageProvider>
            <BookingProvider>
              <VehicleProvider>
              <TourGuideProvider>
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
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
                <Toaster position="top-right" />
              </TourGuideProvider>
            </VehicleProvider>
          </BookingProvider>
        </PackageProvider>
      </AuthProvider>
        </ClerkAuthProvider>
    </Router>
  );
}

export default App; 