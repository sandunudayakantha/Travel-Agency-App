import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TravelLoading from '../components/TravelLoading';
import { useLoading } from '../hooks/useLoading';

const faqs = [
  {
    q: 'How do I book a travel package?',
    a: 'Browse our Packages page, open a package to see details, and click Book Now. You can also contact us for a tailored itinerary.'
  },
  {
    q: 'Can I customize my trip?',
    a: 'Yes. Use the Custom Package page to share your preferences, dates, and budget. Our team will craft a plan for you.'
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Policies vary by package and supplier. Generally, free cancellation applies within 24–48 hours of booking. Check each package’s policy before purchase.'
  },
  {
    q: 'Do you offer group discounts?',
    a: 'We do! Group discounts typically start at 6+ travelers. Contact us with group size and dates for a custom quote.'
  },
  {
    q: 'Is travel insurance included?',
    a: 'Travel insurance is optional but recommended. You can add it during checkout or purchase your own policy.'
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept major credit/debit cards and secure online payments. Some destinations may support bank transfer—contact support for details.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { isLoading: pageLoading, startLoading, stopLoading, progress, message } = useLoading();

  useEffect(() => {
    startLoading("Loading frequently asked questions...", 1500);
  }, [startLoading]);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      {pageLoading && (
        <TravelLoading 
          message={message}
          progress={progress}
          size="medium"
        />
      )}
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1950&q=80"
            alt="FAQ tropical"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c2e]/85 via-[#0c1c2e]/65 to-[#0c1c2e]/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Quick answers about bookings, customization, payments, and more.
          </motion.p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-soft border border-gray-100">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-6">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-900">{item.q}</span>
                  <span className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border ${openIndex === idx ? 'rotate-45 border-primary-500 text-primary-600' : 'border-gray-300 text-gray-500'} transition-transform`}>
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-600 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default FAQ;


