import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/dashboard/AppSidebar";
import ConnectWalletScreen from "@/components/dashboard/ConnectWalletScreen";
import ActivationFeeScreen from "@/components/dashboard/ActivationFeeScreen";
import OverviewSection from "@/components/dashboard/OverviewSection";
import SubscriptionsSection from "@/components/dashboard/SubscriptionsSection";
import BranchSection from "@/components/dashboard/BranchSection";
import PassiveIncomeSection from "@/components/dashboard/PassiveIncomeSection";
import IncubatorSection from "@/components/dashboard/IncubatorSection";
import ReferralSystemSection from "@/components/dashboard/ReferralSystemSection";
import AccountSection from "@/components/dashboard/AccountSection";
import { useWallet } from "@/contexts/WalletContext";
import useRegistrationStatus from "@/hooks/dataFetcher/useRegistrationStatus";
import { Loader2 } from "lucide-react";

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
  const { isConnected, isWrongChain, isBranchManager, branchesLoading, justConnected, clearJustConnected, address } = useWallet();
  const { isRegistered, isLoading: registrationLoading, refetch: refetchRegistration } = useRegistrationStatus(address);
  const navigate = useNavigate();

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  // Redirect branch managers on first connection
  useEffect(() => {
    if (justConnected && isConnected && !branchesLoading && isBranchManager) {
      clearJustConnected();
      navigate("/branch-manager", { replace: true });
    } else if (justConnected && !branchesLoading) {
      clearJustConnected();
    }
  }, [justConnected, isConnected, isBranchManager, branchesLoading, navigate, clearJustConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-background flex">
        <ConnectWalletScreen />
      </div>
    );
  }

  if (isWrongChain) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">Switching to the correct network...</span>
        </div>
      </div>
    );
  }

  // Loading registration status
  if (registrationLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">Checking registration status...</span>
        </div>
      </div>
    );
  }

  if (!isRegistered && !isBranchManager) {
    return (
      <div className="min-h-screen w-full bg-background flex">
        <ActivationFeeScreen onRegistered={() => refetchRegistration()} />
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
