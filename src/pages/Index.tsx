import HeroSection from "@/components/landing/HeroSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/30">
        <span className="font-display text-xl font-bold gradient-text">VaultIQ</span>
        <a href="/app" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Launch App →
        </a>
      </nav>
      <HeroSection />
    </div>
  );
};

export default Index;
