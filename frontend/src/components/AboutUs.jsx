import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Heart, Users, Award, Camera, MapPin, Star, 
  Palmtree, Eye, Leaf, TreePine, Waves, Phone,
  Calendar, DollarSign
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const backgrounds = [
    {
      image: "https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWdpcml5YSUyMHJvY2slMjBmb3J0cmVzcyUyMHNyaSUyMGxhbmthfGVufDF8fHx8MTc1NjAzNDgyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Sigiriya Rock Fortress",
      description: "Ancient marvel rising from misty plains"
    },
    {
      image: "https://images.unsplash.com/photo-1694962951262-a5f84ad0da68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYW5keSUyMHRlbXBsZSUyMHRvb3RoJTIwcmVsaWN8ZW58MXx8fHwxNzU2MDM0ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Temple of the Sacred Tooth",
      description: "Kandy's spiritual heart"
    },
    {
      image: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxsZSUyMGZvcnQlMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NTYwMzQ4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Galle Dutch Fort",
      description: "Colonial charm meets ocean breeze"
    },
    {
      image: "https://images.unsplash.com/photo-1526785777381-db1fdcbb0a3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGxhJTIwbmluZSUyYXJjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NTYwMzQ4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Nine Arch Bridge, Ella",
      description: "Engineering wonder in emerald hills"
    }
  ];

  const nextBackground = () => {
    setCurrentBg((prev) => (prev + 1) % backgrounds.length);
  };

  const stats = [
    { number: "3,500+", label: "Travelers Enchanted", icon: Users },
    { number: "18", label: "Years of Sri Lankan Magic", icon: Award },
    { number: "50+", label: "Hidden Gems Discovered", icon: MapPin },
    { number: "99.2%", label: "Hearts Captured", icon: Star }
  ];

  const destinations = [
    {
      name: "Sigiriya",
      description: "Ancient rock fortress with breathtaking frescoes",
      icon: TreePine,
      speciality: "UNESCO World Heritage"
    },
    {
      name: "Kandy",
      description: "Sacred city of temples and cultural treasures",
      icon: Heart,
      speciality: "Spiritual Journey"
    },
    {
      name: "Galle",
      description: "Dutch colonial fort meets pristine beaches",
      icon: Waves,
      speciality: "Historical Charm"
    },
    {
      name: "Ella",
      description: "Misty mountains and emerald tea plantations",
      icon: Leaf,
      speciality: "Nature's Paradise"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authentic Sri Lankan Experiences",
      description: "From village homestays in Habarana to sunrise ceremonies at Adam's Peak, we showcase the real Sri Lanka that lives in the hearts of its people."
    },
    {
      icon: Leaf,
      title: "Eco-Conscious Tourism",
      description: "Every rupee you spend supports local artisans in Kandy, elephant conservation in Pinnawala, and coral restoration in Hikkaduwa."
    },
    {
      icon: Eye,
      title: "Local Expert Guidance",
      description: "Our guides aren't just knowledgeable - they're storytellers who share legends of Ravana, secrets of Ayurveda, and flavors of authentic kottu roti."
    }
  ];

  const team = [
    {
      name: "Thilaka Rathnayake",
      role: "Founder & Cultural Heritage Guide",
      location: "Born in Anuradhapura",
      experience: "25+ years sharing ancient stories",
      specialty: "Buddhist temples, royal history, archaeological wonders",
      languages: "Sinhala, Tamil, English, German"
    },
    {
      name: "Chaminda Wickramasinghe",
      role: "Wildlife & Safari Specialist",
      location: "Raised near Yala National Park",
      experience: "Former wildlife ranger, 20+ years",
      specialty: "Leopard tracking, bird watching, elephant behavior",
      languages: "Sinhala, English, Japanese"
    },
    {
      name: "Sanduni Perera",
      role: "Coastal & Cultural Adventure Guide",
      location: "From the Southern Province",
      experience: "Marine biologist & cultural enthusiast",
      specialty: "Whale watching, snorkeling, traditional fishing",
      languages: "Sinhala, English, French"
    }
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src={backgrounds[currentBg].image}
          alt={backgrounds[currentBg].title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-orange-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
      </div>

      {/* Background Controls */}
      <motion.div 
        className="fixed top-8 right-8 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={isSectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-white text-sm mb-2">
            <div className="opacity-90">{backgrounds[currentBg].title}</div>
            <div className="text-orange-300 text-xs">{backgrounds[currentBg].description}</div>
          </div>
          <Button
            onClick={nextBackground}
            variant="ghost"
            size="sm"
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <Camera className="h-4 w-4 mr-2" />
            Next Location
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20">
        
        {/* Hero Section */}
        

        {/* Our Story Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                className="text-white space-y-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30 mb-6">
                    Our Journey
                  </Badge>
                  <h2 className="text-5xl leading-tight mb-6">
                    Born from
                    <span className="block text-orange-400">Island Passion</span>
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
                  <p>
                    It began with a simple dream in 2006. Thilaka, our founder, was guiding friends 
                    through the ruins of Anuradhapura when she realized that every stone had a story, 
                    every temple held secrets, and every sunset painted memories.
                  </p>
                  
                  <p>
                    What started as sharing her beloved homeland with a handful of travelers has blossomed 
                    into a family of passionate Sri Lankans dedicated to revealing the soul of our island - 
                    from the misty peaks of Ella to the azure waters of Mirissa.
                  </p>

                  <motion.div 
                    className="bg-orange-500/10 rounded-xl p-6 border border-orange-300/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-4">
                      <Heart className="h-8 w-8 text-orange-400 mt-1" />
                      <div>
                        <h3 className="text-white text-xl mb-2">Our Sacred Promise</h3>
                        <p className="text-orange-200">
                          We don't just show you Sri Lanka - we invite you to feel it, taste it, 
                          and carry its magic in your heart forever.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-10 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
                  <div className="space-y-8">
                    <h3 className="text-white text-3xl text-center font-bold">What Sets Us Apart</h3>
                    
                    <div className="space-y-8">
                      {values.map((value, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-start gap-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="p-4 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-300/30">
                            <value.icon className="h-8 w-8 text-orange-300" />
                          </div>
                          <div>
                            <h4 className="text-white text-xl mb-3 font-semibold">{value.title}</h4>
                            <p className="text-gray-200 leading-relaxed text-lg">{value.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl leading-tight">
                Trip Cost
                <span className="block text-orange-400">Calculator</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Calculate your personalized Sri Lankan adventure costs with our interactive calculator
              </p>
            </motion.div>

            {/* Calculation Grid - 3 equal cells with consistent padding */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Cell 1: Duration Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-80 bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center">
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-orange-500/20 rounded-full">
                        <Calendar className="h-10 w-10 text-orange-300" />
                      </div>
                    </div>
                    <h3 className="text-white text-2xl mb-4">Duration</h3>
                    <div className="space-y-4">
                      <div className="text-white text-4xl font-bold">7-14</div>
                      <div className="text-gray-300 text-lg">Days</div>
                      <div className="text-orange-300 text-sm">Recommended</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Cell 2: Group Size Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-80 bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center">
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-orange-500/20 rounded-full">
                        <Users className="h-10 w-10 text-orange-300" />
                      </div>
                    </div>
                    <h3 className="text-white text-2xl mb-4">Group Size</h3>
                    <div className="space-y-4">
                      <div className="text-white text-4xl font-bold">2-8</div>
                      <div className="text-gray-300 text-lg">Travelers</div>
                      <div className="text-orange-300 text-sm">Optimal</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Cell 3: Budget Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-80 bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center">
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-orange-500/20 rounded-full">
                        <DollarSign className="h-10 w-10 text-orange-300" />
                      </div>
                    </div>
                    <h3 className="text-white text-2xl mb-4">Budget Range</h3>
                    <div className="space-y-4">
                      <div className="text-white text-4xl font-bold">$800</div>
                      <div className="text-gray-300 text-lg">Per Person</div>
                      <div className="text-orange-300 text-sm">Starting From</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Calculate Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                Calculate My Trip Cost
              </button>
            </motion.div>
          </div>
        </section>

        {/* Destinations Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                Our Favorite Places
              </Badge>
              <h2 className="text-5xl leading-tight">
                Sri Lankan Gems
                <span className="block text-orange-400">We Call Home</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                These aren't just destinations - they're pieces of our hearts, 
                places where we've witnessed countless travelers fall in love with Sri Lanka.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {destinations.map((destination, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-orange-500/20 rounded-full">
                        <destination.icon className="h-8 w-8 text-orange-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-white text-2xl">{destination.name}</h3>
                          <Badge variant="outline" className="border-orange-400 text-orange-300">
                            {destination.speciality}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">{destination.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center text-white space-y-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-300/30">
                Meet Our Family
              </Badge>
              <h2 className="text-5xl leading-tight">
                Your Sri Lankan
                <span className="block text-orange-400">Story Weavers</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Born and raised across different provinces of Sri Lanka, our guides don't just know the country - 
                they embody its spirit, speak its languages, and live its traditions.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-white text-2xl mb-2">{member.name}</h3>
                        <p className="text-orange-300 text-lg mb-4">{member.role}</p>
                        
                        <div className="space-y-3 text-sm">
                          <div className="bg-orange-500/10 rounded-lg p-3">
                            <p className="text-orange-200">📍 {member.location}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-300">🏆 {member.experience}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-300">⭐ {member.specialty}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-gray-300">🗣️ {member.languages}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-32">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-12 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-white text-4xl font-bold">Ready for Your Sri Lankan Adventure?</h3>
                    <p className="text-gray-200 text-xl leading-relaxed">
                      Let us paint your dreams with the colors of Sri Lanka. From sunrise at Adam's Peak 
                      to candlelit dinners in Galle Fort, your perfect journey awaits.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/packages">
                      <Button className="h-16 px-8 text-lg bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-200 hover:bg-orange-500/30 hover:border-orange-400/50 transition-all duration-300">
                        <Heart className="mr-3 h-6 w-6" />
                        Start Your Sri Lankan Story
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button className="h-16 px-8 text-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                        <Phone className="mr-3 h-6 w-6" />
                        Call Our Colombo Office
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <p className="text-gray-200">
                        🏢 Colombo Office • 📞 +94 77 123 4567 • 📧 hello@seekinglanka.com
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default AboutUs;
