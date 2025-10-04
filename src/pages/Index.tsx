import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sprout, Trophy, Users, BookOpen, Gift, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroFarm from "@/assets/hero-farming.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const features = [
    {
      icon: Sprout,
      title: "Personalized Quests",
      description: "Get farming missions tailored to your crops and location",
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      description: "Complete quests to earn XP, badges, and real benefits",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with farmers across Kerala and share success",
    },
    {
      icon: BookOpen,
      title: "Learn & Grow",
      description: "Access expert knowledge and sustainable farming techniques",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroFarm})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6 animate-fade-in">
            {/* Language Selector */}
            <div className="flex justify-center gap-2 mb-4">
              {["en", "ml", "hi"].map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage(lang)}
                >
                  {lang === "en" ? "English" : lang === "ml" ? "മലയാളം" : "हिंदी"}
                </Button>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 animate-bounce-in">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Kerala Govt Initiative</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-farm to-harvest bg-clip-text text-transparent">
              KrishiKhel
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ml"
                ? "കളിക്കുക, പഠിക്കുക, സമ്പാദിക്കുക – കേരള കർഷകർക്കായി സുസ്ഥിര കൃഷി"
                : language === "hi"
                ? "खेलें, सीखें और कमाएं – केरल के किसानों के लिए टिकाऊ खेती"
                : "Play, Learn & Earn – Sustainable Farming for Kerala Farmers"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/auth")}
                className="group"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/app")}
                className="border-2"
              >
                View Demo Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
              <div className="text-center p-4 bg-card/50 backdrop-blur rounded-lg border border-border">
                <p className="text-3xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
              </div>
              <div className="text-center p-4 bg-card/50 backdrop-blur rounded-lg border border-border">
                <p className="text-3xl font-bold text-success">78%</p>
                <p className="text-sm text-muted-foreground">Adoption Rate</p>
              </div>
              <div className="text-center p-4 bg-card/50 backdrop-blur rounded-lg border border-border">
                <p className="text-3xl font-bold text-harvest">₹12L</p>
                <p className="text-sm text-muted-foreground">Rewards Given</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Farmers Love KrishiKhel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-farm/20 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary via-farm to-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of Kerala farmers earning rewards for sustainable practices
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/auth")}
            className="shadow-xl hover:shadow-2xl"
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">KrishiKhel Kerala</h4>
            <p className="text-muted-foreground">Play, Learn & Earn – Sustainable Farming for Kerala Farmers.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="/auth" className="hover:underline">Get Started</a></li>
              <li><a href="/app/missions" className="hover:underline">Missions</a></li>
              <li><a href="/app/learn" className="hover:underline">Knowledge Hub</a></li>
              <li><a href="/app/community" className="hover:underline">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact & Policy</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>support@krishikhel.in</li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
