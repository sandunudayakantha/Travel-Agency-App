import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  GlobeAltIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { isSignedIn: isClerkSignedIn, clerkUser, signOut } = useClerkAuthContext();
  const { isAdminAuthenticated, admin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await logout();
      } else if (isClerkSignedIn) {
        await signOut();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Custom Package', href: '/custom-package' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const userMenu = [
    { name: 'Profile', href: '/profile' },
    { name: 'My Bookings', href: '/bookings' },
  ];

  const adminMenu = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Manage Packages', href: '/admin/packages' },
    { name: 'Manage Bookings', href: '/admin/bookings' },
    { name: 'Manage Users', href: '/admin/users' },
    { name: 'Manage Vehicles', href: '/admin/vehicles' },
    { name: 'Manage Tour Guides', href: '/admin/tour-guides' },
    { name: 'Manage Drivers', href: '/admin/drivers' },
    { name: 'Manage Places', href: '/admin/places' },
    { name: 'Custom Inquiries', href: '/admin/custom-inquiries' },
    { name: 'Messages', href: '/admin/messages' },
    { name: 'Reviews', href: '/admin/reviews' },
    { name: 'Gallery', href: '/admin/gallery' },
  ];

  const currentUser = user || clerkUser || admin;
  const isUserAdmin = isAdminAuthenticated || (isAuthenticated && isAdmin());

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Wanderlust</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Dashboard Link - Only show for admin users */}
            {isUserAdmin && (
              <Link
                to="/admin"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>🚀</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {(isAuthenticated || isClerkSignedIn) ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>{currentUser?.name || 'User'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      {isUserAdmin && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {isUserAdmin && (
                      <>
                        <div className="px-2 py-1">
                          <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Admin Panel
                          </p>
                          {adminMenu.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    
                    <div className="px-2 py-1">
                      <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Account
                      </p>
                      {userMenu.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Dashboard Link - Mobile - Only show for admin users */}
            {isUserAdmin && (
              <Link
                to="/admin"
                className="bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <span>🚀</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            {(isAuthenticated || isClerkSignedIn) ? (
              <div className="pt-4 border-t">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  {isUserAdmin && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                
                {isUserAdmin && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Admin Panel
                      </p>
                    </div>
                    {adminMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
                
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Account
                  </p>
                </div>
                {userMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white block text-center px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar; 