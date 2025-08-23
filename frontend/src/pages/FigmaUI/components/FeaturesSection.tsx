import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Globe, Clock, Users, Award, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your safety is our priority with 24/7 support and comprehensive travel insurance."
  },
  {
    icon: Globe,
    title: "Worldwide Destinations",
    description: "Explore over 150+ destinations across 6 continents with our expert guides."
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description: "Easy booking and cancellation policies that adapt to your changing plans."
  },
  {
    icon: Users,
    title: "Group Discounts",
    description: "Special rates for families and groups to make your adventures more affordable."
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the best travel agency for 3 consecutive years by Travel Awards."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you throughout your journey."
  }
];

export function FeaturesSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Parallax Background Elements */}
      <div 
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      ></div>
      <div 
        className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full opacity-20"
        style={{
          transform: `translateY(${scrollY * -0.1}px)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose ArTravele?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide exceptional travel experiences with unmatched service and attention to detail
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-6 shadow-lg"
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}