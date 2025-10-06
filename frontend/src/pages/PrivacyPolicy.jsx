import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  DocumentTextIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 15, 2024';

  // Background image for hero section
  const backgroundImage = "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1920&q=80";

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
                Privacy & Security
              </Badge>
              <h1 className="text-5xl lg:text-6xl leading-tight font-bold">
                Privacy
                <span className="block text-orange-400">Policy</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mt-4">
                We are committed to protecting your privacy and ensuring the security of your personal information. Your trust is our foundation.
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
                <EyeIcon className="w-6 h-6 text-orange-400" />
                Introduction
              </h2>
              <p className="text-gray-200 mb-6">
                Welcome to our SeekingLanka. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way. We are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
              <p className="text-gray-200 mb-8">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-orange-400" />
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              <p className="text-gray-200 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Date of birth and passport information</li>
                <li>Travel preferences and requirements</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Emergency contact information</li>
                <li>Special dietary or accessibility requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">Automatically Collected Information</h3>
              <p className="text-gray-200 mb-4">When you visit our website, we automatically collect:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on each page</li>
                <li>Referring website information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <GlobeAltIcon className="w-6 h-6 text-orange-400" />
                How We Use Your Information
              </h2>
              <p className="text-gray-200 mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Process and manage your travel bookings</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send booking confirmations and travel documents</li>
                <li>Improve our services and website functionality</li>
                <li>Send promotional offers and newsletters (with your consent)</li>
                <li>Comply with legal obligations and regulations</li>
                <li>Ensure the security and safety of our services</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <LockClosedIcon className="w-6 h-6 text-orange-400" />
                Information Sharing and Disclosure
              </h2>
              <p className="text-gray-200 mb-4">We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our business (hotels, airlines, tour operators)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-orange-400" />
                Data Security
              </h2>
              <p className="text-gray-200 mb-4">We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Employee training on data protection practices</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-orange-400" />
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-200 mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve website functionality and user experience</li>
              </ul>
              <p className="text-gray-200 mb-6">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Your Rights and Choices</h2>
              <p className="text-gray-200 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-200 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Children's Privacy</h2>
              <p className="text-gray-200 mb-6">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">International Data Transfers</h2>
              <p className="text-gray-200 mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Changes to This Privacy Policy</h2>
              <p className="text-gray-200 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              <p className="text-gray-200 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
                <p className="text-gray-200 mb-2">
                  <strong>Email:</strong> privacy@seekinglanka.com
                </p>
                <p className="text-gray-200 mb-2">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-200 mb-2">
                  <strong>Address:</strong> 123 Travel Street, Tourism City, TC 12345
                </p>
                <p className="text-gray-200">
                  <strong>Data Protection Officer:</strong> dpo@seekinglanka.com
                </p>
              </div>

              <div className="mt-8 p-6 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-200 mb-2">Your Privacy Matters</h3>
                <p className="text-orange-100">
                  We are committed to protecting your privacy and ensuring transparency in how we handle your personal information. If you have any concerns or questions, please don't hesitate to reach out to us.
                </p>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
