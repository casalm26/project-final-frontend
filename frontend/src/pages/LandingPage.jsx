import { Navbar, HeroSection, FeaturesSection, AboutSection, Footer } from '../components/ui';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}; 