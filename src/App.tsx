import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Actors from "./pages/Actors";
import ERPConnect from "./pages/ERPConnect";
import QRVerify from "./pages/QRVerify";
import SettingsPage from "./pages/SettingsPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import VerifiedActorOnboarding from "./pages/VerifiedActorOnboarding";
import CompanyOnboarding from "./pages/CompanyOnboarding";
import VerifiedActorDashboard from "./pages/VerifiedActorDashboard";
import UnverifiedProducts from "./pages/UnverifiedProducts";
import { BatchProvider } from "./context/BatchContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BatchProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Homepage - no layout */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* All other routes use DashboardLayout with role-based sidebar */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/erp" element={<ERPConnect />} />
              <Route path="/verify" element={<QRVerify />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/verified-actor-onboarding" element={<VerifiedActorOnboarding />} />
              <Route path="/company-onboarding" element={<CompanyOnboarding />} />
              <Route path="/verified-actor-dashboard" element={<VerifiedActorDashboard />} />
              <Route path="/unverified-products" element={<UnverifiedProducts />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BatchProvider>
  </QueryClientProvider>
);

export default App;
