import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import Pricing from '../../components/landing/Pricing';
import TrustBar from '../../components/landing/TrustBar';
import DeveloperSection from '../../components/landing/DeveloperSection';
import UpcomingFeatures from '../../components/landing/UpcomingFeatures';
import FinalCTA from '../../components/landing/FinalCTA';
import Footer from '../../components/landing/Footer';
import SEO from '../../components/common/SEO';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <SEO 
        title="Home" 
        description="MeterOps provides the complete infrastructure for usage-based billing, metering, and tenant management for modern SaaS applications."
        keywords="usage based billing, metering infrastructure, saas billing, stripe metering, tenant management"
      />
      <Navbar />
      <main/>
        <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <DeveloperSection />
      <UpcomingFeatures />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Landing;
