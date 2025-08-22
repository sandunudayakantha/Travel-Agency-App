import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { 
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon 
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
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'FAQ', href: '/help' },
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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">{settings?.companyInfo?.name || 'Wanderlust'}</span>
            </div>
            <p className="text-gray-300 text-base">
              {settings?.companyInfo?.description || 'Discover amazing destinations and create unforgettable memories with our premium travel packages. Your journey starts here.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">{settings?.contactInfo?.phone || '+1 (555) 123-4567'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">{settings?.contactInfo?.email || 'info@wanderlust.com'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">{settings?.contactInfo?.address || '123 Travel Street, Adventure City, AC 12345'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              {settings?.footer?.copyright || `&copy; ${currentYear} Wanderlust Travel Agency. All rights reserved.`}
            </p>
            <div className="mt-6 md:mt-0 flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 