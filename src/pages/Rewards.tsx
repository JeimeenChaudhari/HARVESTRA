import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Trophy, Package, Clock, Crown, BookOpen, Users, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  useEffect(() => {
    loadRewards();
    if (user) {
      loadUserPoints();
      loadRedemptions();
    }
  }, [user]);

  const loadRewards = async () => {
    try {
      const response = await fetch('/api/rewards/catalog');
      const data = await response.json();
    
    // ✨ REDESIGNED COMPREHENSIVE REWARD SYSTEM ✨
    // Culturally Relevant | Non-Monetary | Engaging | Scalable
    const enhancedRewards = [
      // 🏆 RECOGNITION REWARDS - Kerala Farming Heritage
      {
        id: 'r1',
        title: 'കാർഷിക യോദ്ധാവ് (Farming Warrior)',
        description: 'Honor the ancient Kerala farming tradition',
        category: 'Recognition',
        points_cost: 50,
        stock_quantity: 999,
        icon: '🏆',
        tier: 'Bronze',
        benefits: 'Malayalam title + Kerala farmer badge + Green profile border',
        image_url: '/rewards/kerala-warrior.png',
        cultural_significance: 'Celebrates Kerala\'s 5000-year farming heritage'
      },
      {
        id: 'r2',
        title: 'Monsoon Master Certificate',
        description: 'Expert in Kerala\'s monsoon farming techniques',
        category: 'Recognition',
        points_cost: 150,
        stock_quantity: 999,
        icon: '🌧️',
        tier: 'Silver',
        benefits: 'Digital certificate + Monsoon expertise badge + Seasonal bonuses',
        image_url: '/rewards/monsoon-master.png',
        cultural_significance: 'Honors mastery of monsoon-dependent agriculture'
      },
      {
        id: 'r2',
        title: 'Master Farmer Certificate',
        description: 'Downloadable certificate recognizing your expertise',
        category: 'Recognition',
        points_cost: 500,
        stock_quantity: 999,
        icon: '📜',
        tier: 'Gold',
        benefits: 'Digital certificate + LinkedIn endorsement template',
        image_url: '/rewards/certificate.png'
      },
      {
        id: 'r3',
        title: 'Community Leader Status',
        description: 'Special moderator privileges in community discussions',
        category: 'Recognition',
        points_cost: 800,
        stock_quantity: 50,
        icon: '👑',
        tier: 'Platinum',
        benefits: 'Moderation tools + Featured posts + Special flair',
        image_url: '/rewards/leader-crown.png'
      },

      // Access Category
      {
        id: 'r4',
        title: 'Premium Learning Hub',
        description: 'Access to exclusive advanced farming modules',
        category: 'Access',
        points_cost: 300,
        stock_quantity: 999,
        icon: '🎓',
        tier: 'Silver',
        benefits: '10 exclusive modules + Expert Q&A sessions',
        image_url: '/rewards/premium-hub.png'
      },
      {
        id: 'r5',
        title: 'Expert Consultation Call',
        description: '30-minute one-on-one session with farming expert',
        category: 'Access',
        points_cost: 1200,
        stock_quantity: 20,
        icon: '📞',
        tier: 'Platinum',
        benefits: 'Personal guidance + Custom farming plan + Follow-up notes',
        image_url: '/rewards/expert-call.png'
      },
      {
        id: 'r6',
        title: 'VIP Community Access',
        description: 'Join exclusive WhatsApp group with top farmers',
        category: 'Access',
        points_cost: 600,
        stock_quantity: 100,
        icon: '💎',
        tier: 'Gold',
        benefits: 'Private group + Daily tips + Priority support',
        image_url: '/rewards/vip-access.png'
      },

      // Education Category
      {
        id: 'r7',
        title: 'Digital Farming Library',
        description: 'Access to 50+ eBooks and research papers',
        category: 'Education',
        points_cost: 250,
        stock_quantity: 999,
        icon: '📚',
        tier: 'Silver',
        benefits: 'PDF downloads + Offline access + Regular updates',
        image_url: '/rewards/digital-library.png'
      },
      {
        id: 'r8',
        title: 'Seasonal Farming Calendar',
        description: 'Personalized planting and harvesting schedule',
        category: 'Education',
        points_cost: 150,
        stock_quantity: 999,
        icon: '📅',
        tier: 'Bronze',
        benefits: 'Custom calendar + Weather integration + SMS reminders',
        image_url: '/rewards/calendar.png'
      },
      {
        id: 'r9',
        title: 'Crop Disease Diagnostic Tool',
        description: 'AI-powered plant health assessment app access',
        category: 'Education',
        points_cost: 400,
        stock_quantity: 999,
        icon: '🔍',
        tier: 'Gold',
        benefits: 'Photo diagnosis + Treatment recommendations + Progress tracking',
        image_url: '/rewards/diagnostic-tool.png'
      },

      // Experience Category
      {
        id: 'r10',
        title: 'Virtual Farm Tour',
        description: 'Guided tour of model sustainable farms',
        category: 'Experience',
        points_cost: 200,
        stock_quantity: 999,
        icon: '🎬',
        tier: 'Silver',
        benefits: '360° farm tours + Interactive sessions + Q&A with farmers',
        image_url: '/rewards/virtual-tour.png'
      },
      {
        id: 'r11',
        title: 'Farming Webinar Series',
        description: 'Monthly live sessions with industry experts',
        category: 'Experience',
        points_cost: 350,
        stock_quantity: 200,
        icon: '🎭',
        tier: 'Gold',
        benefits: 'Live webinars + Recordings + Direct expert interaction',
        image_url: '/rewards/webinar-series.png'
      },
      {
        id: 'r12',
        title: 'Farm Visit Opportunity',
        description: 'Sponsored visit to a progressive farm in your region',
        category: 'Experience',
        points_cost: 2000,
        stock_quantity: 10,
        icon: '🚌',
        tier: 'Diamond',
        benefits: 'Transport + Meals + Guided tour + Networking',
        image_url: '/rewards/farm-visit.png'
      },

      // Gamified Collectibles
      {
        id: 'r13',
        title: 'Rare Seed Avatar',
        description: 'Unlock exclusive profile avatar designs',
        category: 'Collectible',
        points_cost: 75,
        stock_quantity: 999,
        icon: '🌰',
        tier: 'Bronze',
        benefits: '15 unique avatars + Seasonal variants + Animation effects',
        image_url: '/rewards/seed-avatar.png'
      },
      {
        id: 'r14',
        title: 'Digital Trading Cards',
        description: 'Collect rare farming technique cards',
        category: 'Collectible',
        points_cost: 120,
        stock_quantity: 999,
        icon: '🃏',
        tier: 'Silver',
        benefits: 'Card packs + Trading system + Leaderboard display',
        image_url: '/rewards/trading-cards.png'
      },
      {
        id: 'r15',
        title: 'Legendary Frame Collection',
        description: 'Exclusive profile frames showing your achievements',
        category: 'Collectible',
        points_cost: 300,
        stock_quantity: 500,
        icon: '🖼️',
        tier: 'Gold',
        benefits: '8 animated frames + Seasonal updates + Status symbol',
        image_url: '/rewards/legendary-frames.png'
      },

      // Tools & Resources
      {
        id: 'r16',
        title: 'Weather Alert Pro',
        description: 'Advanced weather notifications and farming alerts',
        category: 'Access',
        points_cost: 180,
        stock_quantity: 999,
        icon: '🌦️',
        tier: 'Bronze',
        benefits: 'Hourly updates + 14-day forecast + Personalized alerts',
        image_url: '/rewards/weather-pro.png'
      },
      {
        id: 'r17',
        title: 'Marketplace Priority',
        description: 'Featured listing in KrishiKhel marketplace',
        category: 'Access',
        points_cost: 450,
        stock_quantity: 100,
        icon: '🏪',
        tier: 'Gold',
        benefits: 'Top placement + Verified seller badge + Analytics dashboard',
        image_url: '/rewards/marketplace-priority.png'
      }
    ];
    
    setRewards(data && data.length > 0 ? data : enhancedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadUserPoints = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/stats?userId=${user.id}`);
      const statsData = await response.json();
      setTotalPoints(statsData.totalPoints || 0);
    } catch (error) {
      console.error('Error loading user points:', error);
    }
  };

  const loadRedemptions = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/rewards/redeem?userId=${user.id}`);
      const data = await response.json();
      setRedemptions(data || []);
    } catch (error) {
      console.error('Error loading redemptions:', error);
    }
  };

  const handleRedeem = async (reward: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to redeem rewards.",
        variant: "destructive"
      });
      return;
    }

    if (totalPoints < (reward.pointsCost || reward.points_cost)) {
      const cost = reward.pointsCost || reward.points_cost;
      toast({
        title: "Insufficient Points",
        description: `You need ${cost - totalPoints} more points.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          rewardId: reward.id
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "🎉 Reward Redeemed!",
          description: result.message
        });
        loadUserPoints();
        loadRedemptions();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Recognition': return <Crown className="w-5 h-5" />;
      case 'Access': return <Star className="w-5 h-5" />;
      case 'Education': return <BookOpen className="w-5 h-5" />;
      case 'Experience': return <Users className="w-5 h-5" />;
      case 'Collectible': return <Package className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-orange-600/10 text-orange-600';
      case 'Silver': return 'bg-gray-500/10 text-gray-600';
      case 'Gold': return 'bg-yellow-500/10 text-yellow-600';
      case 'Platinum': return 'bg-purple-500/10 text-purple-600';
      case 'Diamond': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'approved': return 'bg-blue-500/10 text-blue-500';
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Filter rewards based on selected category and tier
  const filteredRewards = rewards.filter(reward => {
    const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || reward.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const categories = ['Recognition', 'Access', 'Education', 'Experience', 'Collectible'];
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  return (
    <PageBackground variant="rewards">
      <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Enhanced Rewards</h1>
          <p className="text-muted-foreground">
            Unlock recognition, access, education, experiences, and collectibles
          </p>
        </div>
        <Card className="border-2 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Your Points</p>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="catalog">
            <Gift className="w-4 h-4 mr-2" />
            Reward Catalog
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="w-4 h-4 mr-2" />
            My Redemptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Category:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tier:</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const cost = reward.pointsCost || reward.points_cost;
              const canAfford = totalPoints >= cost;
              return (
                <Card key={reward.id} className={`border-2 ${!canAfford ? 'opacity-60' : ''}`}>
                  {reward.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={reward.image_url}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(reward.category)}
                          {reward.category}
                        </Badge>
                        {reward.tier && (
                          <Badge className={getTierColor(reward.tier)}>
                            {reward.tier}
                          </Badge>
                        )}
                      </div>
                      <Badge className="text-base px-3">
                        {cost} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {reward.icon && (
                        <span className="text-2xl">{reward.icon}</span>
                      )}
                      <CardTitle className="text-xl">{reward.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                    {reward.benefits && (
                      <div className="mt-3 p-2 bg-primary/5 rounded-lg">
                        <p className="text-xs font-medium text-primary mb-1">Benefits:</p>
                        <p className="text-xs text-muted-foreground">{reward.benefits}</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Stock: {reward.stock_quantity || 'Unlimited'} available
                      </p>
                      <Button
                        className="w-full"
                        disabled={!canAfford || reward.stock_quantity === 0}
                        onClick={() => handleRedeem(reward)}
                      >
                        {!canAfford ? (
                          `Need ${cost - totalPoints} more points`
                        ) : reward.stock_quantity === 0 ? (
                          'Out of Stock'
                        ) : (
                          'Redeem'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRewards.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No rewards match your current filters.</p>
                <p className="text-sm mt-2">Try adjusting your category or tier selection.</p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {redemptions.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No redemptions yet. Start earning points to redeem rewards!</p>
              </div>
            </Card>
          ) : (
            redemptions.map((redemption) => (
              <Card key={redemption.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {redemption.reward?.image_url && (
                        <img
                          src={redemption.reward.image_url}
                          alt={redemption.reward.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {redemption.reward?.title || redemption.reward_title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Redeemed on {new Date(redemption.redeemed_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Points spent: {redemption.points_spent}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(redemption.status)}>
                      {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      </div>
    </PageBackground>
  );
};

export default Rewards;