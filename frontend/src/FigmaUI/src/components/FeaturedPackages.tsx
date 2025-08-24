"use client";

import { motion } from "motion/react";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const packages = [
  {
    id: 1,
    title: "Sigiriya Rock Fortress Adventure",
    location: "Sigiriya, Cultural Triangle",
    duration: "3 Days",
    groupSize: "2-8 People",
    price: "$450",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1704797390901-e1d20bd46647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTYwMTYyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Climb the ancient rock fortress and discover the breathtaking frescoes and mirror wall. Experience the royal gardens and enjoy panoramic views.",
    highlights: ["Ancient Palace Ruins", "Frescoes Gallery", "Mirror Wall", "Royal Gardens"]
  },
  {
    id: 2,
    title: "Ella Nine Arch Bridge Experience",
    location: "Ella, Hill Country",
    duration: "2 Days",
    groupSize: "2-6 People",
    price: "$320",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1559372122-1a97b2d22c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGxhJTIwbmluZSUyMGFyY2glMjBicmlkZ2UlMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTYwMTYyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Take the scenic train journey through misty mountains and witness the iconic Nine Arch Bridge. Perfect for photography enthusiasts.",
    highlights: ["Train Journey", "Mountain Views", "Photography Spots", "Local Tea Tasting"]
  },
  {
    id: 3,
    title: "Galle Fort Heritage Walk",
    location: "Galle, Southern Province",
    duration: "1 Day",
    groupSize: "2-10 People",
    price: "$180",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1551771797-9e8fce0fd731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxsZSUyMGZvcnQlMjBzcmklMjBsYW5rYSUyMHN1bnNldHxlbnwxfHx8fDE3NTYwMTYyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Explore the UNESCO World Heritage site with its Dutch colonial architecture. Walk the ramparts and enjoy stunning sunset views.",
    highlights: ["Dutch Architecture", "Lighthouse", "Rampart Walk", "Sunset Views"]
  },
  {
    id: 4,
    title: "Kandy Temple & Cultural Tour",
    location: "Kandy, Central Province",
    duration: "2 Days",
    groupSize: "2-12 People",
    price: "$280",
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYW5keSUyMHRlbXBsZSUyMHRvb3RoJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDE2MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Visit the sacred Temple of the Tooth Relic and immerse yourself in traditional Kandyan culture with dance performances.",
    highlights: ["Temple of Tooth", "Cultural Dance", "Royal Palace", "Lake Walk"]
  },
  {
    id: 5,
    title: "Mirissa Whale Watching Safari",
    location: "Mirissa, Southern Coast",
    duration: "1 Day",
    groupSize: "2-15 People",
    price: "$220",
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1693307379048-890167f73704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtaXJpc3NhJTIwYmVhY2glMjB3aGFsZSUyMHdhdGNoaW5nJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzU2MDE2MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Experience the thrill of spotting blue whales and dolphins in their natural habitat. Includes boat safari and beach relaxation.",
    highlights: ["Blue Whales", "Dolphins", "Boat Safari", "Beach Time"]
  },
  {
    id: 6,
    title: "Nuwara Eliya Tea Country Escape",
    location: "Nuwara Eliya, Hill Country",
    duration: "3 Days",
    groupSize: "2-8 People",
    price: "$390",
    rating: 4.9,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1586511426540-d28fdb7ff3f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXdhcmElMjBlbGl5YSUyMHRlYSUyMHBsYW50YXRpb24lMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTYwMTYyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Discover the misty hills and lush tea plantations. Learn about tea production and enjoy the cool mountain climate.",
    highlights: ["Tea Factory Tour", "Plantation Walk", "Cool Climate", "British Colonial Sites"]
  }
];

export default function FeaturedPackages() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with fixed parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${packages[0].image})`
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
            Discover Paradise
          </motion.h1>
          <motion.p 
            className="text-white/90 max-w-3xl mx-auto leading-relaxed"
            style={{ fontSize: '1.25rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Embark on extraordinary journeys through Sri Lanka's most breathtaking destinations. 
            From ancient fortresses to pristine beaches, create memories that last a lifetime.
          </motion.p>
        </motion.div>

        {/* Featured Packages Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="group relative overflow-hidden rounded-3xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <ImageWithFallback 
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                    }}
                  />
                  
                  {/* Price Badge */}
                  <div 
                    className="absolute top-4 right-4 rounded-full px-4 py-2"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span className="text-slate-900" style={{ fontWeight: '600' }}>{pkg.price}</span>
                  </div>

                  {/* Rating */}
                  <div 
                    className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-3 py-1"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white" style={{ fontSize: '0.875rem' }}>{pkg.rating}</span>
                    <span className="text-white/70" style={{ fontSize: '0.875rem' }}>({pkg.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-white">
                  <h3 
                    className="mb-2 group-hover:text-white/90 transition-colors"
                    style={{ fontSize: '1.25rem', fontWeight: '600' }}
                  >
                    {pkg.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-3 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span style={{ fontSize: '0.875rem' }}>{pkg.location}</span>
                  </div>

                  <p 
                    className="text-white/80 mb-4 leading-relaxed"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {pkg.description}
                  </p>

                  {/* Package Details */}
                  <div className="flex items-center gap-4 mb-4 text-white/70" style={{ fontSize: '0.875rem' }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{pkg.groupSize}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <span 
                        key={idx}
                        className="rounded-full text-white/80"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(255,255,255,0.1)'
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className="w-full rounded-xl px-6 py-3 text-white transition-all duration-300 group-hover:bg-white group-hover:text-slate-900"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: '500'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Package
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-20 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 
            className="text-white mb-6"
            style={{ fontSize: '2.25rem', fontWeight: 'bold' }}
          >
            Ready for Your Sri Lankan Adventure?
          </h2>
          <p 
            className="text-white/80 mb-8 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem' }}
          >
            Let our expert guides take you on a journey through the pearl of the Indian Ocean. 
            Every package is carefully crafted to give you an authentic experience.
          </p>
          <motion.button
            className="bg-white text-slate-900 px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 shadow-2xl"
            style={{ fontWeight: '600' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Packages
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}