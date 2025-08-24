import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { useAuth } from '../../contexts/AuthContext';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  UserCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Auth contexts
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { isSignedIn: isClerkSignedIn, clerkUser, signOut } = useClerkAuthContext();
  const { isAdminAuthenticated, admin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      try {
        if (typeof window !== 'undefined') {
          setScrolled(window.scrollY > 50);
        }
      } catch (error) {
        console.error('Scroll error:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle logout functionality
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
    setIsUserMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Custom Package', href: '/custom-package' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const userMenu = [
    { name: 'Profile', href: '/profile' },
    { name: 'My Bookings', href: '/bookings' },
  ];

  const currentUser = user || clerkUser || admin;
  const isUserAdmin = isAdminAuthenticated || (isAuthenticated && isAdmin());
  const isUserLoggedIn = isAuthenticated || isClerkSignedIn || isAdminAuthenticated;

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Wanderlust</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <GlobeAltIcon className={`h-8 w-8 ${scrolled ? 'text-blue-600' : 'text-white'}`} />
              <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Wanderlust
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`hover:text-blue-600 transition-colors duration-200 font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
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
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isUserLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  {currentUser?.profilePicture || currentUser?.imageUrl ? (
                    <img
                      src={currentUser.profilePicture || currentUser.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                  <span>{currentUser?.firstName || currentUser?.name || 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {userMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  Login
                </Link>
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg rounded-lg mt-2 p-4 transition-opacity duration-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block w-full text-left py-3 px-4 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Dashboard Link - Mobile */}
            {isUserAdmin && (
              <Link
                to="/admin"
                className="bg-red-600 hover:bg-red-700 text-white block px-4 py-3 rounded-md text-base font-medium transition-colors flex items-center space-x-2 mt-2"
                onClick={() => setIsOpen(false)}
              >
                <span>🚀</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            {/* Mobile User Menu */}
            {isUserLoggedIn ? (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-2">
                  {currentUser?.profilePicture || currentUser?.imageUrl ? (
                    <img
                      src={currentUser.profilePicture || currentUser.imageUrl}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.firstName || currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Account
                    </p>
                  </div>
                </div>
                {userMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Button 
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
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

export default Navigation;
