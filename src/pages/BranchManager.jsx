import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, ArrowRight, Lock, AlertTriangle,
  LayoutDashboard, Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useAccount } from "wagmi";
import useUserBranches from "@/hooks/dataFetcher/useUserBranches";
import BranchDashboardTab from "@/components/branchManager/BranchDashboardTab";
import ProtocolOpsTab from "@/components/branchManager/ProtocolOpsTab";

const BranchManager = () => {
  const { isConnected, isBranchManager } = useWallet();
  const { address } = useAccount();
  const { userBranches: userBranchAddresses } = useUserBranches(address);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    if (userBranchAddresses?.length > 0 && !selectedBranch) {
      setSelectedBranch(userBranchAddresses[0]);
    }
  }, [userBranchAddresses, selectedBranch]);

  if (!isConnected || !isBranchManager) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          This portal is restricted to authorized Branch Managers. Please connect a qualifying wallet to proceed.
        </p>
        <Link to="/">
          <Button variant="outline" size="lg">
            <ArrowRight className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24 flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-destructive/40 bg-destructive/10 text-sm text-destructive"
          >
            <Lock className="h-3.5 w-3.5" />
            Restricted Access
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            <span className="gradient-text">Branch Manager</span>
            <br />
            <span className="text-foreground/90">Control Center</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Dashboard, deployment, and protocol operations for authorized branch operators.
          </p>

          <Link to="/">
            <Button variant="outline" size="lg" className="text-base px-8 py-5 border-border/60 text-foreground hover:bg-secondary">
              <ArrowRight className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full sm:w-auto bg-secondary/50 border border-border mb-8">
              <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Branch Dashboard
              </TabsTrigger>
              <TabsTrigger value="operations" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Terminal className="h-4 w-4" />
                Protocol Ops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <BranchDashboardTab
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                userBranchAddresses={userBranchAddresses}
              />
            </TabsContent>
            <TabsContent value="operations">
              <ProtocolOpsTab selectedBranch={selectedBranch} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-10 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-5 flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              All operations require authorized wallet signature and are executed on <span className="text-foreground font-medium">BNB Smart Chain</span>.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BranchManager;
