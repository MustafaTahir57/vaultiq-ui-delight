import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BranchManager from "./pages/BranchManager";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <WalletProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app/*" element={<Dashboard />} />
          <Route path="/branch-manager" element={<BranchManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </TooltipProvider>
);

export default App;
