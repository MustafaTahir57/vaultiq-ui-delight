import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppSidebar from "@/components/dashboard/AppSidebar";
import OverviewSection from "@/components/dashboard/OverviewSection";
import SubscriptionsSection from "@/components/dashboard/SubscriptionsSection";
import BranchSection from "@/components/dashboard/BranchSection";
import PassiveIncomeSection from "@/components/dashboard/PassiveIncomeSection";
import IncubatorSection from "@/components/dashboard/IncubatorSection";
import ReferralSystemSection from "@/components/dashboard/ReferralSystemSection";
import AccountSection from "@/components/dashboard/AccountSection";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
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
