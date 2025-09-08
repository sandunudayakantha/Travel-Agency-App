import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const HelpCenter = () => {
  const { settings } = useSiteSettings();
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    startLoading("Loading help center...", 1500);
  }, [startLoading]);

  const toggleItem = (itemId) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleWhatsAppClick = () => {
    const phone = settings?.contactInfo?.phone?.replace(/\D/g, '') || '15551234567';
    const message = encodeURIComponent('Hello! I need help with my travel booking.');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = settings?.contactInfo?.email || 'info@travelagency.com';
    const subject = encodeURIComponent('Help Request');
    const body = encodeURIComponent('Hello! I need assistance with my travel booking.');
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handlePhoneClick = () => {
    const phone = settings?.contactInfo?.phone || '+1 (555) 123-4567';
    const telUrl = `tel:${phone}`;
    window.open(telUrl);
  };

  const faqData = {
    general: [
      {
        id: 'general-1',
        question: 'How do I book a travel package?',
        answer: 'You can book a travel package by browsing our packages page, selecting your desired destination, and clicking "Book This Package". You can also contact us directly for custom packages.'
      },
      {
        id: 'general-2',
        question: 'Do I need to create an account to book?',
        answer: 'No, you can book packages without creating an account. However, creating an account allows you to track your bookings and access exclusive deals.'
      },
      {
        id: 'general-3',
        question: 'What documents do I need for travel?',
        answer: 'Required documents vary by destination. Generally, you\'ll need a valid passport, visa (if required), and any specific health documents. We\'ll provide detailed information for your specific trip.'
      },
      {
        id: 'general-4',
        question: 'Can I modify my booking after confirmation?',
        answer: 'Yes, you can modify your booking up to 48 hours before departure, subject to availability and any applicable fees. Contact our customer service team for assistance.'
      }
    ],
    booking: [
      {
        id: 'booking-1',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment plans are available for select packages.'
      },
      {
        id: 'booking-2',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.'
      },
      {
        id: 'booking-3',
        question: 'What is your cancellation policy?',
        answer: 'Cancellation policies vary by package. Generally, cancellations made 30+ days before departure receive a full refund, 15-29 days receive 50% refund, and less than 15 days are non-refundable.'
      },
      {
        id: 'booking-4',
        question: 'Do you offer travel insurance?',
        answer: 'Yes, we offer comprehensive travel insurance packages. We strongly recommend purchasing insurance to protect against unexpected cancellations, medical emergencies, and lost luggage.'
      }
    ],
    travel: [
      {
        id: 'travel-1',
        question: 'What is included in my travel package?',
        answer: 'Package inclusions vary but typically include accommodation, transportation, guided tours, and some meals. Check your specific package details for a complete list of inclusions and exclusions.'
      },
      {
        id: 'travel-2',
        question: 'Can you accommodate dietary restrictions?',
        answer: 'Yes, we can accommodate most dietary restrictions including vegetarian, vegan, gluten-free, and religious dietary requirements. Please inform us at least 7 days before departure.'
      },
      {
        id: 'travel-3',
        question: 'What if I have mobility issues?',
        answer: 'We offer accessible travel options and can accommodate various mobility needs. Please contact us in advance so we can ensure your trip is comfortable and accessible.'
      },
      {
        id: 'travel-4',
        question: 'Do you provide airport transfers?',
        answer: 'Airport transfers are included in most packages. If not included, we can arrange transfers for an additional fee. Please check your package details or contact us for arrangements.'
      }
    ],
    technical: [
      {
        id: 'technical-1',
        question: 'I can\'t log into my account. What should I do?',
        answer: 'Try resetting your password using the "Forgot Password" link. If that doesn\'t work, contact our support team and we\'ll help you regain access to your account.'
      },
      {
        id: 'technical-2',
        question: 'The website isn\'t loading properly. What can I do?',
        answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support team.'
      },
      {
        id: 'technical-3',
        question: 'How do I update my contact information?',
        answer: 'Log into your account and go to your profile settings to update your contact information. You can also contact our customer service team for assistance.'
      },
      {
        id: 'technical-4',
        question: 'I didn\'t receive my booking confirmation email.',
        answer: 'Check your spam folder first. If you still haven\'t received it, contact our support team with your booking details and we\'ll resend the confirmation.'
      }
    ]
  };

  const categories = [
    { id: 'general', name: 'General Questions', icon: QuestionMarkCircleIcon },
    { id: 'booking', name: 'Booking & Payment', icon: CreditCardIcon },
    { id: 'travel', name: 'Travel & Accommodation', icon: MapPinIcon },
    { id: 'technical', name: 'Technical Support', icon: DocumentTextIcon }
  ];

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="medium"
        />
      )}
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help Center
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find answers to common questions, get support, and learn everything you need to know about your travel experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-blue-50 rounded-lg"
            >
              <PhoneIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">{settings?.contactInfo?.phone || '+1 (555) 123-4567'}</p>
              <button
                onClick={handlePhoneClick}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Call Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-green-50 rounded-lg"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-3">Quick chat support</p>
              <button
                onClick={handleWhatsAppClick}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Start Chat
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-purple-50 rounded-lg"
            >
              <EnvelopeIcon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-3">{settings?.contactInfo?.email || 'info@travelagency.com'}</p>
              <button
                onClick={handleEmailClick}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Send Email
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find quick answers to the most common questions about our services.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData[activeCategory].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openItems[item.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItems[item.id] && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-gray-600">
              Explore these helpful resources for more information.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gray-50 rounded-lg text-center"
            >
              <DocumentTextIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Travel Guides</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive guides for popular destinations and travel tips.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Browse Guides
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-gray-50 rounded-lg text-center"
            >
              <ShieldCheckIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Safety Information</h3>
              <p className="text-gray-600 mb-4">
                Important safety tips and travel advisories for your destination.
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium">
                View Safety Info
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-6 bg-gray-50 rounded-lg text-center"
            >
              <UserIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Customer Stories</h3>
              <p className="text-gray-600 mb-4">
                Read reviews and experiences from our satisfied customers.
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                Read Reviews
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our customer support team is here to help you 24/7. Don't hesitate to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Chat on WhatsApp
              </button>
              <button
                onClick={handleEmailClick}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Send Email
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HelpCenter;
