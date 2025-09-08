import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';
// FigmaUI Components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const HelpCenter = () => {
  const { settings } = useSiteSettings();
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Sri Lankan beach background
  const backgroundImage = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxsZSUyMGZvcnQlMjBzcmklMjBsYW5rYXxlbnwxfHx8fHwxNzU2MDM0ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  useEffect(() => {
    startLoading("Loading help center...", 1500);
    
    // Auto-stop loading after 2 seconds to ensure page always shows
    const timer = setTimeout(() => {
      stopLoading();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  // Fallback: ensure loading stops after 3 seconds maximum
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      stopLoading();
    }, 3000);
    
    return () => clearTimeout(fallbackTimer);
  }, [stopLoading]);

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
    { id: 'general', name: 'General Questions', icon: '❓', description: 'Basic questions about our services' },
    { id: 'booking', name: 'Booking & Payment', icon: '💳', description: 'Payment and reservation help' },
    { id: 'travel', name: 'Travel & Accommodation', icon: '✈️', description: 'Travel tips and requirements' },
    { id: 'technical', name: 'Technical Support', icon: '🛠️', description: 'Website and account issues' }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="large"
        />
      )}
      <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
        {/* Static Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src={backgroundImage}
            alt="Galle Fort - Historic fort in Sri Lanka"
            className="w-full h-full object-cover"
          />
          
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-orange-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-20">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center text-center text-white px-4">
            <motion.div 
              className="max-w-5xl space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div 
                className="flex items-center justify-center gap-2 text-orange-300"
                initial={{ opacity: 0, x: -20 }}
                animate={isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <QuestionMarkCircleIcon className="h-8 w-8" />
                <span className="text-xl">Get the Support You Need</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl lg:text-8xl leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Help
                <span className="block text-orange-400">Center</span>
                <span className="block">Support</span>
              </motion.h1>
              
              <motion.p 
                className="text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Find answers to common questions, get expert support, and learn everything 
                you need to know about your Sri Lankan travel experience.
              </motion.p>

              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30 px-6 py-3 text-lg">
                  24/7 Support • Expert Help
                </Badge>
              </motion.div>
            </motion.div>
          </section>

          {/* Category Filter */}
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                className="text-center text-white space-y-8 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                  Browse by Category
                </Badge>
                <h2 className="text-5xl leading-tight">
                  Find Help
                  <span className="block text-orange-400">By Topic</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  Choose a category below to find relevant help articles and support information 
                  for your specific needs and questions.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      onClick={() => setActiveCategory(category.id)}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      className={`h-auto p-6 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 ${
                        activeCategory === category.id
                          ? 'border-orange-400 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                          : 'border-white/20 bg-black/20 text-white hover:bg-black/30'
                      }`}
                    >
                      <div className="text-3xl mb-3">{category.icon}</div>
                      <div className="font-medium text-lg">{category.name}</div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Help Articles */}
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-7xl">
              <motion.div 
                className="text-center text-white space-y-8 mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl leading-tight">
                  {categories.find(cat => cat.id === activeCategory)?.name || 'Help Articles'}
                  <span className="block text-orange-400">Support</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  {faqData[activeCategory].length} article{faqData[activeCategory].length !== 1 ? 's' : ''} found
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {faqData[activeCategory].map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="cursor-pointer"
                  >
                    <Card className="h-full bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                      {/* Article Icon Header */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <div className="text-white text-6xl">
                          {categories.find(cat => cat.id === activeCategory)?.icon || '❓'}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="absolute top-3 left-3 bg-black/80 text-white border-transparent"
                        >
                          {categories.find(cat => cat.id === activeCategory)?.name || 'Help'}
                        </Badge>
                      </div>

                      {/* Article Content */}
                      <CardContent className="p-6 space-y-4">
                        <CardTitle className="text-white text-xl">
                          {item.question}
                        </CardTitle>

                        <AnimatePresence initial={false}>
                          {openItems[item.id] && (
                            <motion.div
                              key="content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <CardDescription className="text-gray-300 leading-relaxed">
                                {item.answer}
                              </CardDescription>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Button */}
                        <Button 
                          onClick={() => toggleItem(item.id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                        >
                          {openItems[item.id] ? (
                            <>
                              <ChevronUpIcon className="mr-2 h-5 w-5" />
                              Hide Answer
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="mr-2 h-5 w-5" />
                              Show Answer
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="px-4 py-32">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Card className="p-12 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                        <SparklesIcon className="h-10 w-10 text-orange-500" />
                      </div>
                      <h3 className="text-gray-800 text-4xl">Still Need Help?</h3>
                      <p className="text-gray-600 text-xl leading-relaxed">
                        Our customer support team is here to help you 24/7. 
                        Get personalized assistance for your Sri Lankan travel needs.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handleWhatsAppClick}
                          className="h-16 px-8 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                          <ChatBubbleLeftRightIcon className="mr-3 h-6 w-6" />
                          Chat on WhatsApp
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handleEmailClick}
                          variant="outline" 
                          className="h-16 px-8 text-lg border-orange-400 text-orange-600"
                        >
                          <EnvelopeIcon className="mr-3 h-6 w-6" />
                          Send Email
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handlePhoneClick}
                          variant="outline" 
                          className="h-16 px-8 text-lg border-orange-400 text-orange-600"
                        >
                          <PhoneIcon className="mr-3 h-6 w-6" />
                          Call Us
                        </Button>
                      </motion.div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-gray-500">
                        🏢 Colombo Office • 📞 {settings?.contactInfo?.phone || '+94 77 123 4567'} • 📧 {settings?.contactInfo?.email || 'hello@srilankandreams.com'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Bottom Spacer */}
          <div className="h-32"></div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
