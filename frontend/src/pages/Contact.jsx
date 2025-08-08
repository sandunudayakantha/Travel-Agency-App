import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Placeholder: integrate backend or email service later
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 2500);
    }, 900);
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
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="text-sm uppercase tracking-wide text-gray-500">Email</div>
              <div className="mt-2 text-gray-900 font-semibold">support@wanderlust.com</div>
              <div className="mt-1 text-gray-600">We reply within 24 hours</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="text-sm uppercase tracking-wide text-gray-500">Phone</div>
              <div className="mt-2 text-gray-900 font-semibold">+1 (555) 012-3456</div>
              <div className="mt-1 text-gray-600">Mon - Fri, 9:00am - 6:00pm</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-soft border border-gray-100">
              <div className="text-sm uppercase tracking-wide text-gray-500">Office</div>
              <div className="mt-2 text-gray-900 font-semibold">21 Beach Ave, Suite 400</div>
              <div className="mt-1 text-gray-600">Miami, FL 33101</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                  disabled={status === 'submitting'}
                  className="btn-primary"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send message'}
                </button>
                {status === 'success' && (
                  <span className="text-green-600 text-sm">Thanks! We’ll be in touch shortly.</span>
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


