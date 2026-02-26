import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SecuritySection from "@/components/landing/SecuritySection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <EcosystemSection />
      <HowItWorksSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
