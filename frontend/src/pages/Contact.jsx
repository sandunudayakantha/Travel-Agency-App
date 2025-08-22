import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { useMessage } from '../contexts/MessageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const { user } = useAuth();
  const { clerkUser } = useClerkAuthContext();
  const { submitMessage, loading, error } = useMessage();
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    const currentUser = user || clerkUser;
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || currentUser.firstName || '',
        email: currentUser.email || ''
      }));
    }
  }, [user, clerkUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const result = await submitMessage(form);
    
    if (result.success) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleWhatsAppClick = () => {
    const phone = settings?.contactInfo?.phone?.replace(/\D/g, '') || '15551234567';
    const message = encodeURIComponent('Hello! I would like to inquire about your travel packages.');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = settings?.contactInfo?.email || 'info@travelagency.com';
    const subject = encodeURIComponent('Travel Package Inquiry');
    const body = encodeURIComponent('Hello! I would like to inquire about your travel packages.');
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  const handlePhoneClick = () => {
    const phone = settings?.contactInfo?.phone || '+1 (555) 123-4567';
    const telUrl = `tel:${phone}`;
    window.open(telUrl);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1950&q=80"
            alt="Tropical beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c2e]/80 via-[#0c1c2e]/60 to-[#0c1c2e]/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            We’d love to help plan your next adventure. Send us a message and our travel experts will get back to you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Quick Contact Actions */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-soft text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat on WhatsApp
                </button>
                <button
                  onClick={handleEmailClick}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Email
                </button>
                <button
                  onClick={handlePhoneClick}
                  className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors duration-200"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Call Now
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                <div className="text-sm uppercase tracking-wide text-gray-500">Email</div>
              </div>
              <div className="mt-2 text-gray-900 font-semibold">{settings?.contactInfo?.email || 'info@travelagency.com'}</div>
              <div className="mt-1 text-gray-600">We reply within 24 hours</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <PhoneIcon className="w-5 h-5 text-green-500" />
                <div className="text-sm uppercase tracking-wide text-gray-500">Phone</div>
              </div>
              <div className="mt-2 text-gray-900 font-semibold">{settings?.contactInfo?.phone || '+1 (555) 123-4567'}</div>
              <div className="mt-1 text-gray-600">{settings?.contactInfo?.workingHours || 'Mon - Fri, 9:00am - 6:00pm'}</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <div className="text-sm uppercase tracking-wide text-gray-500">Office</div>
              </div>
              <div className="mt-2 text-gray-900 font-semibold">{settings?.contactInfo?.address || '123 Travel Street, Tourism City, TC 12345'}</div>
              <div className="mt-1 text-gray-600">Visit us during business hours</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <ClockIcon className="w-5 h-5 text-orange-500" />
                <div className="text-sm uppercase tracking-wide text-gray-500">Business Hours</div>
              </div>
              <div className="mt-2 text-gray-900 font-semibold">{settings?.contactInfo?.workingHours || 'Monday - Friday: 9:00 AM - 6:00 PM'}</div>
              <div className="mt-1 text-gray-600">We're here to help you plan your next adventure</div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-2 p-6 md:p-8 bg-white rounded-xl shadow-soft border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Auto-fill indicator */}
              {(user || clerkUser) && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Your contact information has been auto-filled from your account
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    // Only allow numbers, spaces, dashes, and plus sign
                    const value = e.target.value.replace(/[^0-9\s\-+]/g, '');
                    setForm(prev => ({ ...prev, phone: value }));
                  }}
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters (except backspace, delete, arrow keys, etc.)
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9\s\-+]/.test(char)) {
                      e.preventDefault();
                    }
                  }}
                  required
                  className="input-field"
                  placeholder="Enter phone number (e.g., +1 234 567 8900)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Tell us how we can help"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field"
                  placeholder="Share your travel plans, dates, or questions..."
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting' || loading}
                  className="btn-primary"
                >
                  {status === 'submitting' || loading ? 'Sending...' : 'Send message'}
                </button>
                {status === 'success' && (
                  <span className="text-green-600 text-sm">Thanks! We’ll be in touch shortly.</span>
                )}
                {status === 'error' && (
                  <span className="text-red-600 text-sm">Failed to send message. Please try again.</span>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


