import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Trees, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function CommunityImpact() {
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalMissions: 0,
    totalXP: 0,
    waterSaved: 0,
    treesPlanted: 0,
    organicAcres: 0,
  });

  useEffect(() => {
    loadCommunityStats();
  }, []);

  const loadCommunityStats = async () => {
    // Get total farmers
    const { count: farmersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get completed missions
    const { count: missionsCount } = await supabase
      .from('mission_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');

    // Get total XP
    const { data: xpData } = await supabase
      .from('user_levels')
      .select('total_xp');
    
    const totalXP = xpData?.reduce((sum, user) => sum + user.total_xp, 0) || 0;

    setStats({
      totalFarmers: farmersCount || 0,
      totalMissions: missionsCount || 0,
      totalXP,
      waterSaved: (missionsCount || 0) * 500, // Estimate 500L per mission
      treesPlanted: (missionsCount || 0) * 10, // Estimate 10 trees per mission
      organicAcres: (missionsCount || 0) * 2, // Estimate 2 acres per mission
    });
  };

  const impactData = [
    {
      icon: Droplets,
      title: "Water Conserved",
      value: `${stats.waterSaved.toLocaleString()}L`,
      description: "Liters of water saved through sustainable practices",
      progress: 65,
      color: "text-blue-500",
    },
    {
      icon: Trees,
      title: "Trees Planted",
      value: stats.treesPlanted.toLocaleString(),
      description: "Native species planted across farms",
      progress: 45,
      color: "text-green-500",
    },
    {
      icon: Leaf,
      title: "Organic Farming",
      value: `${stats.organicAcres.toLocaleString()} acres`,
      description: "Land converted to organic practices",
      progress: 58,
      color: "text-emerald-500",
    },
    {
      icon: Users,
      title: "Active Farmers",
      value: stats.totalFarmers.toLocaleString(),
      description: "Farmers participating in sustainable practices",
      progress: 72,
      color: "text-primary",
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Impact</h1>
        <p className="text-muted-foreground">
          Our collective progress towards sustainable farming in Kerala
        </p>
      </div>

      {/* Overall Stats */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Collective Achievement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{stats.totalFarmers}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Farmers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">{stats.totalMissions}</p>
              <p className="text-sm text-muted-foreground mt-1">Missions Completed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{stats.totalXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total XP Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        {impactData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-3xl font-bold mt-2">{item.value}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress to goal</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* District Comparison */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Top Performing Districts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Wayanad', 'Idukki', 'Kottayam', 'Palakkad', 'Thrissur'].map((district, index) => (
              <div key={district} className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-primary">#{index + 1}</div>
                <div className="flex-1">
                  <p className="font-medium">{district}</p>
                  <Progress value={90 - index * 12} className="h-2 mt-1" />
                </div>
                <p className="text-sm font-medium">{1500 - index * 200} XP</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}