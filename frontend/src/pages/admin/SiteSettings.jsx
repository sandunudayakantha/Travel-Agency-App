import React, { useState, useEffect } from 'react';
import { useClerkAuthContext } from '../../contexts/ClerkAuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { 
  ExclamationTriangleIcon, 
  CogIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const SiteSettings = () => {
  const { isSignedIn, isAdmin, authLoading } = useClerkAuthContext();
  const { settings, loading, updateSiteSettings } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      workingHours: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    companyInfo: {
      name: '',
      tagline: '',
      description: '',
      website: ''
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    footer: {
      copyright: '',
      additionalLinks: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  // Load settings into form when available
  useEffect(() => {
    if (settings) {
      setFormData({
        contactInfo: {
          phone: settings.contactInfo?.phone || '',
          email: settings.contactInfo?.email || '',
          address: settings.contactInfo?.address || '',
          workingHours: settings.contactInfo?.workingHours || ''
        },
        socialMedia: {
          facebook: settings.socialMedia?.facebook || '',
          twitter: settings.socialMedia?.twitter || '',
          instagram: settings.socialMedia?.instagram || '',
          linkedin: settings.socialMedia?.linkedin || '',
          youtube: settings.socialMedia?.youtube || ''
        },
        companyInfo: {
          name: settings.companyInfo?.name || '',
          tagline: settings.companyInfo?.tagline || '',
          description: settings.companyInfo?.description || '',
          website: settings.companyInfo?.website || ''
        },
        seo: {
          title: settings.seo?.title || '',
          description: settings.seo?.description || '',
          keywords: settings.seo?.keywords || ''
        },
        footer: {
          copyright: settings.footer?.copyright || '',
          additionalLinks: settings.footer?.additionalLinks || []
        }
      });
    }
  }, [settings]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateSiteSettings(formData);
    } catch (error) {
      console.error('Error updating site settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'contact', name: 'Contact Info', icon: PhoneIcon },
    { id: 'social', name: 'Social Media', icon: GlobeAltIcon },
    { id: 'company', name: 'Company Info', icon: DocumentTextIcon },
    { id: 'seo', name: 'SEO Settings', icon: EyeIcon },
    { id: 'footer', name: 'Footer', icon: DocumentTextIcon }
  ];

  // Check if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h3>
            <p className="text-gray-500">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check admin role
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h3>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CogIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          </div>
          <p className="text-gray-600">Manage your website's contact information, social media links, and other settings.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading site settings...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Contact Info Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <PhoneIcon className="h-4 w-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="info@travelagency.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPinIcon className="h-4 w-4 inline mr-1" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.contactInfo.address}
                          onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Travel Street, Tourism City, TC 12345"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <ClockIcon className="h-4 w-4 inline mr-1" />
                          Working Hours
                        </label>
                        <input
                          type="text"
                          value={formData.contactInfo.workingHours}
                          onChange={(e) => handleInputChange('contactInfo', 'workingHours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://facebook.com/travelagency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          value={formData.socialMedia.twitter}
                          onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://twitter.com/travelagency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://instagram.com/travelagency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={formData.socialMedia.linkedin}
                          onChange={(e) => handleInputChange('socialMedia', 'linkedin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://linkedin.com/company/travelagency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube URL
                        </label>
                        <input
                          type="url"
                          value={formData.socialMedia.youtube}
                          onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://youtube.com/travelagency"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info Tab */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyInfo.name}
                          onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Travel Agency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={formData.companyInfo.tagline}
                          onChange={(e) => handleInputChange('companyInfo', 'tagline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your Journey Begins Here"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.companyInfo.description}
                          onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="We provide exceptional travel experiences with personalized service and unforgettable adventures."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={formData.companyInfo.website}
                          onChange={(e) => handleInputChange('companyInfo', 'website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://travelagency.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Page Title
                        </label>
                        <input
                          type="text"
                          value={formData.seo.title}
                          onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Travel Agency - Your Journey Begins Here"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={formData.seo.description}
                          onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Discover amazing travel destinations and book your next adventure with our expert travel services."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keywords
                        </label>
                        <input
                          type="text"
                          value={formData.seo.keywords}
                          onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="travel, tourism, vacation, booking, adventure, destinations"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Tab */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Footer Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Copyright Text
                        </label>
                        <input
                          type="text"
                          value={formData.footer.copyright}
                          onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="© 2024 Travel Agency. All rights reserved."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;
