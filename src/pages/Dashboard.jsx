import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AppSidebar from "@/components/dashboard/AppSidebar";
import ConnectWalletScreen from "@/components/dashboard/ConnectWalletScreen";
import OverviewSection from "@/components/dashboard/OverviewSection";
import SubscriptionsSection from "@/components/dashboard/SubscriptionsSection";
import BranchSection from "@/components/dashboard/BranchSection";
import PassiveIncomeSection from "@/components/dashboard/PassiveIncomeSection";
import IncubatorSection from "@/components/dashboard/IncubatorSection";
import ReferralSystemSection from "@/components/dashboard/ReferralSystemSection";
import AccountSection from "@/components/dashboard/AccountSection";
import { useWallet } from "@/contexts/WalletContext";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);
  const { isConnected } = useWallet();

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-background flex">
        <ConnectWalletScreen />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobile={isMobile} />
      <main className="flex-1 p-4 md:p-8 overflow-auto min-w-0">
        <Routes>
          <Route index element={<OverviewSection />} />
          <Route path="subscriptions" element={<SubscriptionsSection />} />
          <Route path="branch" element={<BranchSection />} />
          <Route path="passive" element={<PassiveIncomeSection />} />
          <Route path="incubator" element={<IncubatorSection />} />
          <Route path="referrals" element={<ReferralSystemSection />} />
          <Route path="account" element={<AccountSection />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
