import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';
import { 
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
// FigmaUI Components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const faqs = [
  {
    q: 'How do I book a travel package?',
    a: 'Browse our Packages page, open a package to see details, and click Book Now. You can also contact us for a tailored itinerary.',
    category: 'Booking',
    icon: '📦'
  },
  {
    q: 'Can I customize my trip?',
    a: 'Yes. Use the Custom Package page to share your preferences, dates, and budget. Our team will craft a plan for you.',
    category: 'Customization',
    icon: '✈️'
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Policies vary by package and supplier. Generally, free cancellation applies within 24-48 hours of booking. Check each package\'s policy before purchase.',
    category: 'Policies',
    icon: '📋'
  },
  {
    q: 'Do you offer group discounts?',
    a: 'We do! Group discounts typically start at 6+ travelers. Contact us with group size and dates for a custom quote.',
    category: 'Pricing',
    icon: '👥'
  },
  {
    q: 'Is travel insurance included?',
    a: 'Travel insurance is optional but recommended. You can add it during checkout or purchase your own policy.',
    category: 'Insurance',
    icon: '🛡️'
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept major credit/debit cards and secure online payments. Some destinations may support bank transfer - contact support for details.',
    category: 'Payment',
    icon: '💳'
  },
  {
    q: 'What should I pack for Sri Lanka?',
    a: 'Pack light, breathable clothing, comfortable walking shoes, sunscreen, and a hat. Don\'t forget your camera for those amazing temple and wildlife shots!',
    category: 'Travel Tips',
    icon: '🎒'
  },
  {
    q: 'Do you provide airport transfers?',
    a: 'Yes! We offer convenient airport pickup and drop-off services. Let us know your flight details and we\'ll arrange everything.',
    category: 'Transportation',
    icon: '🚗'
  },
  {
    q: 'Are meals included in packages?',
    a: 'Most packages include breakfast. Lunch and dinner are included in some premium packages. Check individual package details for specifics.',
    category: 'Meals',
    icon: '🍽️'
  },
  {
    q: 'What languages do your guides speak?',
    a: 'Our guides are fluent in English, Sinhala, and Tamil. Some also speak other languages - just let us know your preference!',
    category: 'Guides',
    icon: '🗣️'
  }
];


const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Sri Lankan background image
  const backgroundImage = "/src/pages/Images/photo-1544750040-4ea9b8a27d38.jpeg";

  useEffect(() => {
    startLoading("Loading frequently asked questions...", 1500);
    
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

  // Reset openIndex when category changes
  useEffect(() => {
    setOpenIndex(null);
  }, [selectedCategory]);

  const toggle = (originalIdx) => {
    setOpenIndex((prev) => (prev === originalIdx ? null : originalIdx));
  };

  // Get unique categories
  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];

  // Filter FAQs by category
  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);


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
            alt="Beautiful Sri Lankan landscape - Perfect backdrop for FAQ section"
            className="w-full h-full object-cover"
          />
          
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-orange-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-20">

          {/* Category Filter - Cell Layout */}
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
                  Find Answers
                  <span className="block text-orange-400">By Topic</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  Filter questions by category to quickly find the information you need 
                  for your travel planning and booking process.
                </p>
              </motion.div>
              
              {/* Cell-based Grid Layout with consistent padding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 p-8">
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`w-full h-32 p-6 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 rounded-xl ${
                        selectedCategory === category
                          ? 'border-orange-400 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                          : 'border-white/20 bg-black/20 text-white hover:bg-black/30'
                      }`}
                    >
                      <div className="text-4xl mb-3">
                        {category === 'All' ? '🌍' : 
                         category === 'Booking' ? '📦' :
                         category === 'Customization' ? '✈️' :
                         category === 'Policies' ? '📋' :
                         category === 'Pricing' ? '👥' :
                         category === 'Insurance' ? '🛡️' :
                         category === 'Payment' ? '💳' :
                         category === 'Travel Tips' ? '🎒' :
                         category === 'Transportation' ? '🚗' :
                         category === 'Meals' ? '🍽️' :
                         category === 'Guides' ? '🗣️' : '❓'}
                      </div>
                      <div className="font-medium text-sm text-center leading-tight">{category}</div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ List */}
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
                  {selectedCategory === 'All' ? 'All Questions' : selectedCategory}
                  <span className="block text-orange-400">Answered</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFaqs.length > 0 ? filteredFaqs.map((item, idx) => {
                  // Find the original index in the full faqs array
                  const originalIdx = faqs.findIndex(faq => faq.q === item.q);
                  
                  return (
                    <motion.div
                      key={originalIdx}
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
                        {/* FAQ Icon Header */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <div className="text-white text-6xl">{item.icon}</div>
                          <Badge 
                            variant="outline" 
                            className="absolute top-3 left-3 bg-black/80 text-white border-transparent"
                          >
                            {item.category}
                          </Badge>
                        </div>

                        {/* FAQ Content */}
                        <CardContent className="p-6 space-y-4">
                          <CardTitle className="text-white text-xl">
                            {item.q}
                          </CardTitle>

                          <AnimatePresence initial={false}>
                            {openIndex === originalIdx && (
                              <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <CardDescription className="text-gray-300 leading-relaxed">
                                  {item.a}
                                </CardDescription>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Action Button */}
                          <Button 
                            onClick={() => toggle(originalIdx)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                          >
                            {openIndex === originalIdx ? (
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
                  );
                }) : (
                  <div className="text-center py-12 text-white col-span-full">
                    <Card className="p-12 bg-black/20 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-24 h-24 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
                          <QuestionMarkCircleIcon className="h-12 w-12 text-orange-300" />
                        </div>
                        <h3 className="text-3xl">No Questions Found</h3>
                        <p className="text-xl text-gray-300">
                          No questions found for the selected category. Try selecting a different category or browse all questions.
                        </p>
                        <Button
                          onClick={() => setSelectedCategory('All')}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          View All Questions
                        </Button>
                      </motion.div>
                    </Card>
                  </div>
                )}
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
                <Card className="p-12 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-orange-500/20 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center border border-orange-300/30">
                        <SparklesIcon className="h-10 w-10 text-orange-300" />
                      </div>
                      <h3 className="text-white text-4xl font-bold">Still Have Questions?</h3>
                      <p className="text-gray-200 text-xl leading-relaxed">
                        Our travel experts are here to help! Get personalized answers 
                        and expert advice for your Sri Lankan adventure.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="h-16 px-8 text-lg bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-200 hover:bg-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
                          <HeartIcon className="mr-3 h-6 w-6" />
                          Contact Our Experts
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="h-16 px-8 text-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                          <GlobeAltIcon className="mr-3 h-6 w-6" />
                          Browse Packages
                        </Button>
                      </motion.div>
                    </div>

                    <div className="pt-6 border-t border-white/20">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                        <p className="text-gray-200">
                          🏢 Colombo Office • 📞 +94 77 123 4567 • 📧 hello@seekinglanka.com
                        </p>
                      </div>
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

export default FAQ;


