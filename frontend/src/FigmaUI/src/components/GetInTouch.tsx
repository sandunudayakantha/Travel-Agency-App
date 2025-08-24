"use client";

import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+94 11 234 5678", "+94 77 123 4567"],
    description: "Available 24/7 for your travel needs",
    actionType: "phone"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    details: ["+94 77 123 4567"],
    description: "Instant messaging for quick support",
    actionType: "whatsapp"
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@srilankaparadise.com", "bookings@srilankaparadise.com"],
    description: "We'll respond within 2 hours",
    actionType: "email"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Galle Road, Colombo 03", "Sri Lanka"],
    description: "Mon-Sat 9:00 AM - 6:00 PM",
    actionType: "location"
  }
];

const socialLinks = [
  { icon: Facebook, name: "Facebook", url: "#", color: "#1877F2" },
  { icon: Instagram, name: "Instagram", url: "#", color: "#E4405F" },
  { icon: Twitter, name: "Twitter", url: "#", color: "#1DA1F2" }
];

export default function GetInTouch() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleContactAction = (actionType: string, detail: string) => {
    switch (actionType) {
      case "phone":
        window.open(`tel:${detail}`, '_self');
        break;
      case "email":
        window.open(`mailto:${detail}?subject=Travel Inquiry&body=Hello, I would like to inquire about your travel packages.`, '_self');
        break;
      case "whatsapp":
        const whatsappNumber = detail.replace(/\s+/g, '').replace('+', '');
        const message = encodeURIComponent("Hello! I'm interested in your Sri Lankan travel packages. Could you please provide more information?");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with fixed parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1623595289196-007a22dd8560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJvJTIwc3JpJTIwbGFua2ElMjBzdW5zZXQlMjBza3lsaW5lfGVufDF8fHx8MTc1NjAyMDYyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />

      {/* Content */}
      <div className="relative z-10 pt-20 pb-16">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-white mb-6 tracking-wide"
            style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            className="text-white/90 max-w-3xl mx-auto leading-relaxed"
            style={{ fontSize: '1.25rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to embark on your Sri Lankan adventure? Contact our travel experts to plan 
            your perfect journey through the pearl of the Indian Ocean.
          </motion.p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="relative overflow-hidden rounded-3xl backdrop-blur-sm p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="mb-6">
                <h2 
                  className="text-white mb-2"
                  style={{ fontSize: '1.875rem', fontWeight: 'bold' }}
                >
                  Send us a Message
                </h2>
                <p className="text-white/80" style={{ fontSize: '1rem' }}>
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <option value="" style={{ background: '#1e293b', color: 'white' }}>Select a subject</option>
                    <option value="general" style={{ background: '#1e293b', color: 'white' }}>General Inquiry</option>
                    <option value="booking" style={{ background: '#1e293b', color: 'white' }}>Package Booking</option>
                    <option value="custom" style={{ background: '#1e293b', color: 'white' }}>Custom Tour</option>
                    <option value="support" style={{ background: '#1e293b', color: 'white' }}>Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    placeholder="Tell us about your travel plans, preferences, or any questions you have..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: '600'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden rounded-2xl backdrop-blur-sm p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: info.actionType === 'whatsapp' ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="text-white mb-2"
                          style={{ fontSize: '1.125rem', fontWeight: '600' }}
                        >
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <div key={idx} className="mb-1">
                            {info.actionType !== 'location' ? (
                              <motion.button
                                onClick={() => handleContactAction(info.actionType, detail)}
                                className="text-white/90 hover:text-white transition-colors duration-200 text-left"
                                style={{ fontSize: '0.875rem' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {detail}
                              </motion.button>
                            ) : (
                              <p className="text-white/90" style={{ fontSize: '0.875rem' }}>
                                {detail}
                              </p>
                            )}
                          </div>
                        ))}
                        <p className="text-white/70 mt-1" style={{ fontSize: '0.75rem' }}>
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Action Buttons */}
              <motion.div
                className="relative overflow-hidden rounded-2xl backdrop-blur-sm p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <h3 
                  className="text-white mb-4"
                  style={{ fontSize: '1.125rem', fontWeight: '600' }}
                >
                  Quick Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.button
                    onClick={() => handleContactAction('phone', '+94771234567')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-blue-500/20"
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="w-4 h-4 text-white" />
                    <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Call</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleContactAction('whatsapp', '+94771234567')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-green-500/20"
                    style={{
                      background: 'rgba(37, 211, 102, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(37, 211, 102, 0.2)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: '500' }}>WhatsApp</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleContactAction('email', 'info@srilankaparadise.com')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-purple-500/20"
                    style={{
                      background: 'rgba(147, 51, 234, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(147, 51, 234, 0.2)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="w-4 h-4 text-white" />
                    <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="relative overflow-hidden rounded-2xl backdrop-blur-sm p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <h3 
                  className="text-white mb-4"
                  style={{ fontSize: '1.125rem', fontWeight: '600' }}
                >
                  Follow Our Journey
                </h3>
                <p className="text-white/80 mb-4" style={{ fontSize: '0.875rem' }}>
                  Stay updated with the latest travel tips, destinations, and special offers.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      className="p-3 rounded-xl transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: social.color + '20',
                        borderColor: social.color + '40'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                className="relative overflow-hidden rounded-2xl backdrop-blur-sm p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(220,38,38,0.1))',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(220,38,38,0.3)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <h3 
                  className="text-white mb-2"
                  style={{ fontSize: '1.125rem', fontWeight: '600' }}
                >
                  Emergency Support
                </h3>
                <p className="text-white/90 mb-2" style={{ fontSize: '0.875rem' }}>
                  24/7 Emergency Hotline
                </p>
                <motion.button
                  onClick={() => handleContactAction('phone', '+94709111234')}
                  className="text-white hover:text-white/90 transition-colors duration-200"
                  style={{ fontSize: '1.25rem', fontWeight: '700' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  +94 70 911 HELP
                </motion.button>
                <p className="text-white/70 mt-1" style={{ fontSize: '0.75rem' }}>
                  Available round the clock for any travel emergencies
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <h2 
            className="text-white mb-4"
            style={{ fontSize: '2rem', fontWeight: 'bold' }}
          >
            Let's Plan Your Dream Trip
          </h2>
          <p 
            className="text-white/80 mb-8 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem' }}
          >
            Our travel experts are here to help you create unforgettable memories in Sri Lanka. 
            Get in touch today and let the adventure begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => handleContactAction('whatsapp', '+94771234567')}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-2xl"
              style={{ fontWeight: '600' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </motion.button>
            <motion.button
              onClick={() => handleContactAction('phone', '+94771234567')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-2xl"
              style={{ fontWeight: '600' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}