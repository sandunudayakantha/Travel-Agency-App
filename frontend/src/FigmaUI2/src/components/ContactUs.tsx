import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { MapPin, Phone, Mail, Send, Palmtree, Camera, Mountain } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    "https://images.unsplash.com/photo-1668529732834-90b5aeed93df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMGJlYWNoJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NjAzMjgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1559038298-ef4eecdfdbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzcmklMjBsYW5rYSUyMHRlYSUyMHBsYW50YXRpb24lMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU1OTQ1MjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1586870336143-d652f69d44c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzcmklMjBsYW5rYSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTYwMzI4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
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
                { icon: MapPin, title: "Visit Us", info: "Colombo, Sri Lanka" },
                { icon: Phone, title: "Call Us", info: "+94 77 123 4567" },
                { icon: Mail, title: "Email Us", info: "hello@srilankandreams.com" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:translate-x-2"
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
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <Card className="p-8 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-gray-800 text-3xl">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600">Tell us about your dream Sri Lankan adventure</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Your Name (Traveler)"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-lg bg-white/80 border-gray-300 focus:border-orange-400"
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
                      className="h-12 text-lg bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 text-lg bg-white/80 border-gray-300 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Tell us about your dream Sri Lankan experience... Which places would you like to visit? What activities interest you? How many days are you planning to stay?"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="text-lg bg-white/80 border-gray-300 focus:border-orange-400 resize-none"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send My Travel Dreams
                    </Button>
                  </div>
                </form>

                <p className="text-center text-sm text-gray-500">
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