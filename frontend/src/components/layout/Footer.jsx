import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { 
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Packages', href: '/packages' },
      { name: 'Custom Package', href: '/custom-package' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
    social: [
      {
        name: 'Facebook',
        href: settings?.socialMedia?.facebook || '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
            <path
              fillRule="evenodd"
              d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Instagram',
        href: settings?.socialMedia?.instagram || '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Twitter',
        href: settings?.socialMedia?.twitter || '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {'SeekingLanka'}
                </h2>
                <p className="text-sm text-gray-400">SeekingLanka</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              {settings?.companyInfo?.description || 'Discover amazing destinations and create unforgettable memories with our premium travel packages. Your journey starts here.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <PhoneIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-gray-300 font-medium">{settings?.contactInfo?.phone || '+1 (555) 123-4567'}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-300 font-medium">{settings?.contactInfo?.email || 'info@wanderlust.com'}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <MapPinIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-gray-300 font-medium">{settings?.contactInfo?.address || '123 Travel Street, Adventure City, AC 12345'}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
             
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    <ArrowRightIcon className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              
              Support
            </h3>
            <ul className="space-y-3">
              {navigation.support.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    <ArrowRightIcon className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
        
        </motion.div>

        {/* Social Links and Copyright */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <p className="text-gray-400 text-center lg:text-left">
              {settings?.footer?.copyright || `&copy; ${currentYear} SeekingLanka. All rights reserved.`}
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="p-3 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 