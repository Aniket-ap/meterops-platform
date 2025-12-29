import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import TrustBar from '../../components/landing/TrustBar';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import Pricing from '../../components/landing/Pricing';
import DeveloperSection from '../../components/landing/DeveloperSection';
import FinalCTA from '../../components/landing/FinalCTA';
import Footer from '../../components/landing/Footer';

const Landing = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <DeveloperSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
