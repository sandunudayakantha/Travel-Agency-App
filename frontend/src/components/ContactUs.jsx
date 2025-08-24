import React, { useState, useEffect } from 'react';
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
    <section className="relative min-h-screen overflow-hidden">
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
      <div className="absolute top-8 right-8 z-50">
        <Button
          onClick={nextBackground}
          variant="ghost"
          size="sm"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
        >
          <Camera className="h-4 w-4 mr-2" />
          Switch View
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-300">
                <Palmtree className="h-6 w-6" />
                <span className="text-lg">Experience Sri Lanka</span>
              </div>
              
              <h1 className="text-white text-5xl lg:text-6xl leading-tight">
                Let's Plan Your
                <span className="block text-orange-400">Dream Journey</span>
              </h1>
              
              <p className="text-gray-200 text-xl leading-relaxed">
                From pristine beaches to ancient temples, from misty mountains to vibrant culture - 
                let us craft an unforgettable Sri Lankan adventure just for you.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid gap-4">
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
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:translate-x-2 cursor-pointer"
                  onClick={item.action}
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
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chat on WhatsApp
              </Button>
              <Button
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <Card className="p-6 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl max-w-md mx-auto lg:mx-0">
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <h2 className="text-gray-800 text-2xl">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600 text-sm">Tell us about your dream Sri Lankan adventure</p>
                </div>

                {/* Auto-fill indicator */}
                {(user || clerkUser) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Your contact information has been auto-filled from your account
                    </p>
                  </div>
                )}

                {/* Error/Success Messages */}
                {status === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Thank you! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      ✗ Failed to send message. Please try again.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Your Name (Traveler)"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-10 text-sm bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-10 text-sm bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 text-sm bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Input
                      name="subject"
                      type="text"
                      placeholder="Subject (e.g., Package Inquiry, Custom Tour)"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="h-10 text-sm bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Tell us about your dream Sri Lankan experience... Which places would you like to visit? What activities interest you? How many days are you planning to stay?"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="text-sm bg-white/80 border-gray-300 focus:border-orange-400 resize-none"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={status === 'submitting' || loading}
                      className="w-full h-12 text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {status === 'submitting' || loading ? 'Sending...' : 'Send My Travel Dreams'}
                    </Button>
                  </div>
                </form>

                <p className="text-center text-xs text-gray-500">
                  We'll respond within 24 hours with personalized recommendations
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-8 text-orange-300/30 z-10 animate-bounce">
        <Mountain className="h-16 w-16" />
      </div>
      
      <div className="absolute bottom-1/4 right-12 text-orange-300/20 z-10 animate-pulse">
        <Palmtree className="h-20 w-20" />
      </div>
    </section>
  );
};

export default ContactUs;
