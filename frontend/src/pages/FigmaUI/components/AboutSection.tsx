import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Users, MapPin, Calendar } from 'lucide-react';

export function AboutSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Travelers" },
    { icon: MapPin, value: "150+", label: "Destinations" },
    { icon: Calendar, value: "15+", label: "Years Experience" },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Creating Memories That Last
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600"> Forever</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              For over 15 years, ArTravele has been crafting extraordinary travel experiences that go beyond the ordinary. We believe that travel is not just about visiting places, but about creating stories, building connections, and discovering the beauty of our diverse world.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team of passionate travel experts works tirelessly to curate unique experiences that match your interests, budget, and dreams. From luxury getaways to adventure-packed expeditions, we make every journey unforgettable.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
            >
              <Play className="h-5 w-5" />
              <span>Watch Our Story</span>
            </motion.button>
          </motion.div>

          {/* Images with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div 
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  transform: `translateY(${scrollY * 0.05}px)`,
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1647291718042-676c0428fc25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHRyYXZlbHxlbnwxfHx8fDE3NTU1OTQ0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Travel experience"
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Floating Card */}
              <motion.div 
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20"
                style={{
                  transform: `translateY(${scrollY * -0.1}px)`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Expert Guides</div>
                    <div className="text-sm text-gray-600">Local knowledge & passion</div>
                  </div>
                </div>
              </motion.div>

              {/* Background Elements */}
              <div 
                className="absolute top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-60"
                style={{
                  transform: `translateY(${scrollY * 0.08}px)`,
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}