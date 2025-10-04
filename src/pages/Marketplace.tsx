import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, MapPin, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageBackground from "@/components/PageBackground";

const Marketplace = () => {
  const { user } = useAuth();
  const [userPanchayat, setUserPanchayat] = useState<string>("");

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('panchayat')
      .eq('id', user?.id)
      .single();
    
    if (data) setUserPanchayat(data.panchayat || "");
  };

  const products = [
    {
      id: 1,
      name: "Organic Kerala Rice",
      seller: "രാജേഷ് കുമാർ",
      location: "Wayanad",
      price: "₹65/kg",
      unit: "50kg minimum",
      rating: 4.8,
      verified: true
    },
    {
      id: 2,
      name: "Fresh Coconuts",
      seller: "പ്രിയ മേനോൻ",
      location: "Kottayam",
      price: "₹35/pc",
      unit: "100 pcs available",
      rating: 4.9,
      verified: true
    },
    {
      id: 3,
      name: "Organic Vegetables Mix",
      seller: "അനിൽ വർഗീസ്",
      location: "Thrissur",
      price: "₹80/kg",
      unit: "20kg available",
      rating: 4.7,
      verified: true
    },
    {
      id: 4,
      name: "Kerala Banana (Nendran)",
      seller: "സുമ രാജേന്ദ്രൻ",
      location: "Palakkad",
      price: "₹40/dozen",
      unit: "500 dozens",
      rating: 4.8,
      verified: true
    }
  ];

  const trending = [
    { name: "Organic Fertilizer", growth: "+25%" },
    { name: "Drip Irrigation Kits", growth: "+18%" },
    { name: "Organic Seeds", growth: "+15%" }
  ];

  const filteredProducts = userPanchayat 
    ? products.filter(p => p.location === userPanchayat)
    : products;

  return (
    <PageBackground variant="marketplace">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell organic produce directly with transparent pricing</p>
      </div>

      {/* Search */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trending Products */}
      <Card className="border-2 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {trending.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                {item.name}
                <span className="ml-2 text-primary font-bold">{item.growth}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Products from Your Area</h2>
        {userPanchayat && (
          <p className="text-sm text-muted-foreground">Showing products from {userPanchayat}</p>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
              <Card key={product.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        {product.verified && (
                          <Badge variant="default" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">by {product.seller}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                      <p className="text-xs text-muted-foreground">{product.unit}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {product.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button variant="outline">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No products available in your area yet.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageBackground>
  );
};

export default Marketplace;
