import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const phrases = [
    'Adventure seekers',
    'Culture enthusiasts',
    'Memory makers',
    'World explorers',
    'Travel dreamers'
  ];

  const currentPhrase = phrases[currentPhraseIndex];

  // Typing animation effect
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;

    if (!isDeleting && typedText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhrase]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "500+", label: "Destinations", icon: "🗺️" },
    { number: "10K+", label: "Happy Travelers", icon: "😊" },
    { number: "50+", label: "Countries", icon: "🌍" },
    { number: "24/7", label: "Support", icon: "🛡️" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      bio: "Former travel blogger turned entrepreneur. Passionate about making travel accessible to everyone.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Marcus Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Ex-hotel manager with 15+ years in hospitality. Ensures every journey is seamless.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Elena Rodriguez",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      bio: "Photographer and storyteller. Captures the essence of every destination.",
      social: { linkedin: "#", instagram: "#" }
    },
    {
      name: "David Kim",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "Full-stack developer who loves to travel. Builds the platform that connects travelers worldwide.",
      social: { linkedin: "#", github: "#" }
    }
  ];

  const values = [
    {
      icon: "🌍",
      title: "Global Perspective",
      description: "We believe travel opens minds and connects cultures across borders."
    },
    {
      icon: "🤝",
      title: "Authentic Experiences",
      description: "Every journey is crafted to provide genuine local experiences and meaningful connections."
    },
    {
      icon: "♻️",
      title: "Sustainable Travel",
      description: "Committed to eco-friendly practices and supporting local communities."
    },
    {
      icon: "💎",
      title: "Quality Assurance",
      description: "Every package is personally vetted to ensure exceptional standards."
    }
  ];

  const milestones = [
    { year: "2018", title: "Founded", description: "Started with a dream to make travel accessible" },
    { year: "2019", title: "First 1000", description: "Helped our first 1000 travelers explore the world" },
    { year: "2020", title: "Digital Pivot", description: "Launched our comprehensive online platform" },
    { year: "2021", title: "Global Reach", description: "Expanded to 50+ countries worldwide" },
    { year: "2022", title: "Award Winner", description: "Recognized as Best Travel Agency of the Year" },
    { year: "2023", title: "10K Milestone", description: "Celebrated helping 10,000+ travelers" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0c1c2e] via-[#0c1c2e] to-[#1a2d3e] overflow-hidden">
        {/* Beach Video Background */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/855246/855246-hd_1920_1080_25fps.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2070&q=80"
          />
          {/* Atmosphere overlay removed per request (no animations) */}
        </div>
        
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="mr-2">✨</span> About Wanderlust Travel
            </motion.p>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We are
              <span className="block text-2xl font-normal mt-2 text-white/90">
                <span>{typedText}</span>
                <span className={`ml-1 inline-block w-0.5 h-6 bg-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}></span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Dedicated to crafting unforgettable journeys and connecting travelers with the world's most amazing destinations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-[#0c1c2e] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Story & Mission
            </motion.h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {[
                { id: 'story', label: 'Our Story', icon: '📖' },
                { id: 'mission', label: 'Our Mission', icon: '🎯' },
                { id: 'values', label: 'Our Values', icon: '💎' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#0c1c2e] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#0c1c2e] hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'story' && (
              <div className="text-center">
                <div className="text-6xl mb-6">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It All Began</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Founded in 2018 by a group of passionate travelers, Wanderlust Travel started as a simple blog 
                  sharing authentic travel experiences. What began as a way to document adventures quickly evolved 
                  into a mission to help others discover the world's hidden gems.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, we're proud to have helped over 10,000 travelers create unforgettable memories across 
                  50+ countries, each journey carefully crafted to provide authentic, meaningful experiences.
                </p>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To democratize travel by making authentic, meaningful experiences accessible to everyone. 
                  We believe that travel has the power to transform lives, broaden perspectives, and create 
                  lasting connections across cultures.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Through our carefully curated packages and personalized service, we strive to be the bridge 
                  between travelers and the world's most incredible destinations, ensuring every journey is 
                  not just a trip, but a life-changing experience.
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    className="text-center p-6 bg-white rounded-xl shadow-soft"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming a trusted travel partner for thousands
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-[#0c1c2e]/20"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0c1c2e] rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-soft border-l-4 border-[#0c1c2e]">
                      <div className="text-2xl font-bold text-[#0c1c2e] mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind every unforgettable journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#0c1c2e] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {member.role}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {Object.entries(member.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className="text-gray-400 hover:text-[#0c1c2e] transition-colors"
                    >
                      {platform === 'linkedin' && '💼'}
                      {platform === 'twitter' && '🐦'}
                      {platform === 'instagram' && '📷'}
                      {platform === 'github' && '💻'}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0c1c2e] to-[#1a2d3e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with us. 
              Your next adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/packages"
                className="bg-white text-[#0c1c2e] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Packages
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#0c1c2e] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
