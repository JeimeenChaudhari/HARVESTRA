import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  BookOpen, 
  Users, 
  ShoppingBag, 
  Cloud, 
  Bell, 
  User, 
  Settings,
  Menu,
  Leaf,
  Gift,
  GraduationCap,
  Rocket,
  Shield,
  TrendingUp
} from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import leafIcon from "@/assets/leaf-icon.png";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", path: "/app", icon: LayoutDashboard },
    { name: "Missions & Quests", path: "/app/missions", icon: Rocket },
    { name: "Learn", path: "/app/learn", icon: GraduationCap },
    { name: "Achievements", path: "/app/achievements", icon: Shield },
    { name: "Rewards", path: "/app/rewards", icon: Gift },
    { name: "Leaderboard", path: "/app/leaderboard", icon: Trophy },
    { name: "Community Impact", path: "/app/impact", icon: TrendingUp },
    { name: "Community", path: "/app/community", icon: Users },
    { name: "Marketplace", path: "/app/marketplace", icon: ShoppingBag },
    { name: "Weather", path: "/app/weather", icon: Cloud },
    { name: "Notifications", path: "/app/notifications", icon: Bell },
    { name: "Profile", path: "/app/profile", icon: User },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-6 border-b border-sidebar-border bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <img src={leafIcon} alt="Logo" className="w-10 h-10" />
          <div>
            <h2 className="font-bold text-lg">Harvestra</h2>
            <p className="text-xs opacity-90">Green Kerala GO</p>
          </div>
        </div>
        <p className="text-xs mt-3 opacity-90">Grow Sustainably, Earn Rewards</p>
      </div>

      <div className="p-4">
        <LanguageSelector />
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start gap-3 text-base"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground text-center">
        © 2025 Harvestra<br />
        Sustainable Farming Initiative
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
