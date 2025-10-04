import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Leaf, Trophy, Users, BookOpen, Cloud, ShoppingBag, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import leafIcon from "@/assets/leaf-icon.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <img src={leafIcon} alt="Harvestra" className="w-24 h-24 animate-float drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 drop-shadow-lg">
            🌱 Harvestra GO
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground mb-4 drop-shadow-md">
            Green Kerala GO
          </p>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Grow Sustainably, Earn Rewards
          </p>
          <p className="text-lg text-primary-foreground/80 mb-12 max-w-3xl mx-auto drop-shadow">
            A Digital Initiative for Sustainable Farming in Kerala
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="text-xl px-12 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl hover:scale-105 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            Empowering Kerala Farmers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 border-border">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Engaging Quests</h3>
              <p className="text-muted-foreground">
                Complete farming challenges and earn rewards while learning sustainable practices
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up [animation-delay:200ms] border-2 border-border">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Real-Time Rewards</h3>
              <p className="text-muted-foreground">
                Track your progress and compete on leaderboards for exclusive prizes
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up [animation-delay:400ms] border-2 border-border">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Community Features</h3>
              <p className="text-muted-foreground">
                Connect with fellow farmers, share knowledge, and grow together
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up [animation-delay:600ms] border-2 border-border">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Learning Resources</h3>
              <p className="text-muted-foreground">
                Access expert guides, videos, and articles on sustainable farming
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up [animation-delay:800ms] border-2 border-border">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Cloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Weather Insights</h3>
              <p className="text-muted-foreground">
                Get accurate weather forecasts and farming recommendations
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up [animation-delay:1000ms] border-2 border-border">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-card-foreground">Marketplace</h3>
              <p className="text-muted-foreground">
                Buy and sell organic produce directly with transparent pricing
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of Kerala farmers already growing sustainably with Harvestra GO
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-xl px-12 py-6 shadow-xl hover:scale-105 transition-all">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-secondary/50 text-center text-muted-foreground border-t">
        <p>© 2025 Harvestra • Sustainable Farming Initiative</p>
      </footer>
    </div>
  );
};

export default Index;
