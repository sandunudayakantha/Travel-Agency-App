import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { MapPin, Phone, Mail, Send, Palmtree, Camera, Mountain } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { useClerkAuthContext } from '../contexts/ClerkAuthContext';
import { useMessage } from '../contexts/MessageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const ContactUs = () => {
  const { user } = useAuth();
  const { clerkUser } = useClerkAuthContext();
  const { submitMessage, loading, error } = useMessage();
  const { settings } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [currentBg, setCurrentBg] = useState(0);
  const [status, setStatus] = useState('idle');

  // Animation refs
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const contentRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });
  const isContentInView = useInView(contentRef, { once: true, amount: 0.3 });

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    const currentUser = user || clerkUser;
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || currentUser.firstName || '',
        email: currentUser.email || ''
      }));
    }
  }, [user, clerkUser]);

  const backgrounds = [
    "https://images.unsplash.com/photo-1668529732834-90b5aeed93df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NjAzMjgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1559038298-ef4eecdfdbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzcmklMjBsYW5rYSUyMHRlYSUyMHBsYW50YXRpb24lMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU1OTQ1MjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1586870336143-d652f69d44c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzcmklMjBsYW5rYSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTYwMzI4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const result = await submitMessage(formData);
    
    if (result.success) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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

  const nextBackground = () => {
    setCurrentBg((prev) => (prev + 1) % backgrounds.length);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={backgrounds[currentBg]}
            alt={`Sri Lankan landscape ${currentBg + 1}`}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
        </div>
        
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
      </div>

      {/* Background Controls */}
      <motion.div 
        className="absolute top-8 right-8 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button
          onClick={nextBackground}
          variant="ghost"
          size="sm"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
        >
          <Camera className="h-4 w-4 mr-2" />
          Switch View
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div 
            ref={contentRef}
            className="text-white space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center gap-2 text-orange-300"
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Palmtree className="h-6 w-6" />
                <span className="text-lg">Experience Sri Lanka</span>
              </motion.div>
              
              <motion.h1 
                className="text-white text-5xl lg:text-6xl leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Let's Plan Your
                <span className="block text-orange-400">Dream Journey</span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-200 text-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                From pristine beaches to ancient temples, from misty mountains to vibrant culture - 
                let us craft an unforgettable Sri Lankan adventure just for you.
              </motion.p>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div 
              className="grid gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {[
                { 
                  icon: MapPin, 
                  title: "Visit Us", 
                  info: settings?.contactInfo?.address || "Colombo, Sri Lanka",
                  action: () => {}
                },
                { 
                  icon: Phone, 
                  title: "Call Us", 
                  info: settings?.contactInfo?.phone || "+94 77 123 4567",
                  action: handlePhoneClick
                },
                { 
                  icon: Mail, 
                  title: "Email Us", 
                  info: settings?.contactInfo?.email || "hello@srilankandreams.com",
                  action: handleEmailClick
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:translate-x-2 cursor-pointer"
                  onClick={item.action}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="p-3 bg-orange-500/20 rounded-full">
                    <item.icon className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat on WhatsApp
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handlePhoneClick}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-6 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl max-w-md mx-auto lg:mx-0">
              <div className="space-y-5">
                <motion.div 
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.h2 
                    className="text-gray-800 text-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    Start Your Journey
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    Tell us about your dream Sri Lankan adventure
                  </motion.p>
                </motion.div>

                {/* Auto-fill indicator */}
                {(user || clerkUser) && (
                  <motion.div 
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isFormInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <p className="text-sm text-green-700">
                      ✓ Your contact information has been auto-filled from your account
                    </p>
                  </motion.div>
                )}

                {/* Error/Success Messages */}
                {status === 'success' && (
                  <motion.div 
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm text-green-700">
                      ✓ Thank you! We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm text-red-700">
                      ✗ Failed to send message. Please try again.
                    </p>
                  </motion.div>
                )}

                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  {[
                    { name: 'name', type: 'text', placeholder: 'Your Name (Traveler)', required: true },
                    { name: 'email', type: 'email', placeholder: 'your.email@example.com', required: true },
                    { name: 'phone', type: 'tel', placeholder: 'Phone Number (Optional)', required: false },
                    { name: 'subject', type: 'text', placeholder: 'Subject (e.g., Package Inquiry, Custom Tour)', required: true }
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    >
                      <Input
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className="h-10 text-sm bg-white/80 border-gray-300 focus:border-orange-400"
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  >
                    <Textarea
                      name="message"
                      placeholder="Tell us about your dream Sri Lankan experience... Which places would you like to visit? What activities interest you? How many days are you planning to stay?"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="text-sm bg-white/80 border-gray-300 focus:border-orange-400 resize-none"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={status === 'submitting' || loading}
                      className="w-full h-12 text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {status === 'submitting' || loading ? 'Sending...' : 'Send My Travel Dreams'}
                    </Button>
                  </motion.div>
                </motion.form>

                <motion.p 
                  className="text-center text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={isFormInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  We'll respond within 24 hours with personalized recommendations
                </motion.p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10"
        initial={{ opacity: 0 }}
        animate={isSectionInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 2 }}
      ></motion.div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-1/4 left-8 text-orange-300/30 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={isSectionInView ? { 
          opacity: 1, 
          y: [0, -10, 0] 
        } : { 
          opacity: 0, 
          y: 50 
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 2.2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Mountain className="h-16 w-16" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-12 text-orange-300/20 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isSectionInView ? { 
          opacity: 1, 
          y: 0,
          scale: [1, 1.1, 1] 
        } : { 
          opacity: 0, 
          y: 30 
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 2.4 },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Palmtree className="h-20 w-20" />
      </motion.div>
    </section>
  );
};

export default ContactUs;
