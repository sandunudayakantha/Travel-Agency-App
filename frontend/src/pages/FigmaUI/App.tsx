import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { DestinationsSection } from './components/DestinationsSection';
import { SriLankanJourneySection } from './components/SriLankanJourneySection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <DestinationsSection />
      <SriLankanJourneySection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}