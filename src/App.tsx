import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VerifyOTP from "./pages/VerifyOTP";
import ProfileSetup from "./pages/ProfileSetup";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import ModuleDetail from "./pages/ModuleDetail";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Community from "./pages/Community";
import Marketplace from "./pages/Marketplace";
import Weather from "./pages/Weather";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MissionCenter from "./pages/MissionCenter";
import CommunityImpact from "./pages/CommunityImpact";
import Achievements from "./pages/Achievements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="learn" element={<Learn />} />
              <Route path="learn/:moduleId" element={<ModuleDetail />} />
              <Route path="missions" element={<MissionCenter />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="community" element={<Community />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="weather" element={<Weather />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="impact" element={<CommunityImpact />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
