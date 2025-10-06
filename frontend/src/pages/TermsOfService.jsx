import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

const TermsOfService = () => {
  const lastUpdated = 'January 15, 2024';

  // Background image for hero section
  const backgroundImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 bg-black/60" />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center text-white space-y-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block p-4">
              <Badge variant="secondary" className="bg-orange-500/30 text-orange-200 border-orange-300/50 mb-4">
                Legal Information
              </Badge>
              <h1 className="text-5xl lg:text-6xl leading-tight font-bold">
                Terms of
                <span className="block text-orange-400">Service</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mt-4">
                Please read these terms carefully before using our travel services. Your journey with us begins with understanding our policies.
              </p>
              <p className="text-sm text-gray-300 mt-4">
                Last updated: {lastUpdated}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none text-white"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ScaleIcon className="w-6 h-6 text-orange-400" />
                Agreement to Terms
              </h2>
              <p className="text-gray-200 mb-6">
                By accessing and using our travel agency services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-200 mb-8">
                These Terms of Service ("Terms") govern your use of our website and services operated by our SeekingLanka ("we," "us," or "our").
              </p>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-orange-400" />
                Use of Services
              </h2>
              <p className="text-gray-200 mb-4">You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the services:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the services</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-orange-400" />
                Booking and Reservations
              </h2>
              <h3 className="text-xl font-semibold text-white mb-4">Booking Process</h3>
              <p className="text-gray-200 mb-4">When making a booking through our services:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>All bookings are subject to availability and confirmation</li>
                <li>Prices are subject to change until full payment is received</li>
                <li>You must provide accurate and complete information</li>
                <li>We reserve the right to refuse service to anyone</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">Payment Terms</h3>
              <p className="text-gray-200 mb-4">Payment requirements and terms:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Full payment is required to confirm your booking</li>
                <li>We accept major credit cards, PayPal, and bank transfers</li>
                <li>All prices are quoted in the specified currency</li>
                <li>Additional fees may apply for special requests or modifications</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <XCircleIcon className="w-6 h-6 text-orange-400" />
                Cancellation and Refund Policy
              </h2>
              <p className="text-gray-200 mb-4">Our cancellation policy is as follows:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li><strong>30+ days before departure:</strong> Full refund minus processing fees</li>
                <li><strong>15-29 days before departure:</strong> 50% refund</li>
                <li><strong>8-14 days before departure:</strong> 25% refund</li>
                <li><strong>Less than 7 days:</strong> No refund</li>
              </ul>
              <p className="text-gray-200 mb-6">
                <strong>Note:</strong> Some packages may have different cancellation policies. Please check your specific booking details for exact terms.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
                Travel Documents and Requirements
              </h2>
              <p className="text-gray-200 mb-4">It is your responsibility to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Obtain and maintain valid travel documents (passport, visas, etc.)</li>
                <li>Check and comply with entry requirements for your destination</li>
                <li>Ensure you have adequate travel insurance</li>
                <li>Arrive at departure points on time</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CurrencyDollarIcon className="w-6 h-6 text-orange-400" />
                Pricing and Fees
              </h2>
              <p className="text-gray-200 mb-4">Our pricing policy includes:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>All prices are subject to change without notice</li>
                <li>Additional fees may apply for special requests</li>
                <li>Service charges and taxes are included where applicable</li>
                <li>Currency conversion rates may affect final pricing</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-orange-400" />
                Changes and Modifications
              </h2>
              <h3 className="text-xl font-semibold text-white mb-4">Service Changes</h3>
              <p className="text-gray-200 mb-4">We reserve the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Modify or discontinue services at any time</li>
                <li>Change itineraries due to circumstances beyond our control</li>
                <li>Substitute accommodations or services of similar quality</li>
                <li>Cancel trips due to insufficient bookings or force majeure</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">Customer Changes</h3>
              <p className="text-gray-200 mb-4">Modification requests:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Changes must be requested in writing</li>
                <li>Modification fees may apply</li>
                <li>Changes are subject to availability</li>
                <li>Some changes may not be possible after booking confirmation</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Limitation of Liability</h2>
              <p className="text-gray-200 mb-4">Our liability is limited as follows:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount paid for the service</li>
                <li>We are not responsible for acts of third-party service providers</li>
                <li>Force majeure events are beyond our control and liability</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property</h2>
              <p className="text-gray-200 mb-6">
                The content, features, and functionality of our website are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Privacy and Data Protection</h2>
              <p className="text-gray-200 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the services, to understand our practices regarding the collection and use of your personal information.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Governing Law</h2>
              <p className="text-gray-200 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Dispute Resolution</h2>
              <p className="text-gray-200 mb-4">In the event of a dispute:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>We encourage direct communication to resolve issues</li>
                <li>Mediation may be required before legal action</li>
                <li>Any legal proceedings must be brought in our jurisdiction</li>
                <li>You waive any right to a jury trial</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Severability</h2>
              <p className="text-gray-200 mb-6">
                If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Changes to Terms</h2>
              <p className="text-gray-200 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-gray-200 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <p className="text-gray-200 mb-2">
                  <strong>Email:</strong> legal@seekinglanka.com
                </p>
                <p className="text-gray-200 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-200 mb-2">
                  <strong>Address:</strong> 123 Travel Street, Tourism City, TC 12345
                </p>
                <p className="text-gray-200">
                  <strong>Legal Department:</strong> legal@seekinglanka.com
                </p>
              </div>

              <div className="mt-8 p-6 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-200 mb-2">Important Notice</h3>
                <p className="text-orange-100">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
                </p>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
