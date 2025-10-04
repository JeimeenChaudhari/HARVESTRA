import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, TrendingUp, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageBackground from "@/components/PageBackground";

const Leaderboard = () => {
  const { user } = useAuth();
  const [topFarmers, setTopFarmers] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  // Unified points calculation function (matches Dashboard logic)
  const calculateUserPoints = async (userId: string) => {
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', userId);
    
    const totalPoints = pointsData?.reduce((sum, p) => sum + p.points, 0) || 0;
    return totalPoints;
  };

  const loadLeaderboard = async () => {
    try {
      // Sample leaderboard data for demo - always show this first
      const sampleFarmers = [
        {
          user_id: 'sample-1',
          name: 'Ravi Krishnan',
          location: 'Kottayam',
          points: 2850,
          achievements: ['Organic Master', 'Water Saver'],
          streak_days: 45,
          modules_completed: 8,
          rank: 1,
          change: '+2',
          profile_color: '#4ade80'
        },
        {
          user_id: 'sample-2', 
          name: 'Priya Menon',
          location: 'Thrissur',
          points: 2620,
          achievements: ['Composting Pro', 'Seed Saver'],
          streak_days: 38,
          modules_completed: 7,
          rank: 2,
          change: '+1',
          profile_color: '#60a5fa'
        },
        {
          user_id: 'sample-3',
          name: 'Mohan Das',
          location: 'Wayanad',
          points: 2340,
          achievements: ['Pest Fighter', 'Soil Guardian'],
          streak_days: 22,
          modules_completed: 6,
          rank: 3,
          change: '-1',
          profile_color: '#f472b6'
        },
        {
          user_id: 'sample-4',
          name: 'Lakshmi Nair',
          location: 'Alappuzha',
          points: 2180,
          achievements: ['Green Thumb'],
          streak_days: 31,
          modules_completed: 5,
          rank: 4,
          change: '+0',
          profile_color: '#fb7185'
        },
        {
          user_id: 'sample-5',
          name: 'Suresh Kumar',
          location: 'Palakkad',
          points: 1950,
          achievements: ['Water Master', 'Climate Warrior'],
          streak_days: 28,
          modules_completed: 4,
          rank: 5,
          change: '+3',
          profile_color: '#a78bfa'
        },
        {
          user_id: 'sample-6',
          name: 'Anitha Raj',
          location: 'Kozhikode',
          points: 1820,
          achievements: ['Learning Expert'],
          streak_days: 19,
          modules_completed: 4,
          rank: 6,
          change: '+1',
          profile_color: '#34d399'
        },
        {
          user_id: 'sample-7',
          name: 'Vineeth Thomas',
          location: 'Ernakulam',
          points: 1650,
          achievements: ['Rising Star'],
          streak_days: 15,
          modules_completed: 3,
          rank: 7,
          change: '-2',
          profile_color: '#fbbf24'
        },
        {
          user_id: 'sample-8',
          name: 'Maya Pillai',
          location: 'Thiruvananthapuram',
          points: 1480,
          achievements: ['Newcomer'],
          streak_days: 12,
          modules_completed: 3,
          rank: 8,
          change: '+0',
          profile_color: '#f87171'
        },
        {
          user_id: 'sample-9',
          name: 'Ajith Kumar',
          location: 'Kasaragod',
          points: 1320,
          achievements: ['Dedicated Learner'],
          streak_days: 8,
          modules_completed: 2,
          rank: 9,
          change: '+1',
          profile_color: '#818cf8'
        },
        {
          user_id: 'sample-10',
          name: 'Kavitha Devi',
          location: 'Idukki',
          points: 1180,
          achievements: [],
          streak_days: 5,
          modules_completed: 2,
          rank: 10,
          change: '+0',
          profile_color: '#fb923c'
        },
        {
          user_id: 'sample-11',
          name: 'Ashwin Menon',
          location: 'Kollam',
          points: 1050,
          achievements: ['First Steps'],
          streak_days: 3,
          modules_completed: 1,
          rank: 11,
          change: '+2',
          profile_color: '#10b981'
        },
        {
          user_id: 'sample-12',
          name: 'Deepa Kumari',
          location: 'Kannur',
          points: 950,
          achievements: ['Quick Learner'],
          streak_days: 7,
          modules_completed: 2,
          rank: 12,
          change: '+1',
          profile_color: '#3b82f6'
        },
        {
          user_id: 'sample-13',
          name: 'Baiju Nambiar',
          location: 'Malappuram',
          points: 875,
          achievements: [],
          streak_days: 2,
          modules_completed: 1,
          rank: 13,
          change: '-1',
          profile_color: '#f59e0b'
        },
        {
          user_id: 'sample-14',
          name: 'Latha Radhika',
          location: 'Pathanamthitta',
          points: 780,
          achievements: ['Newcomer'],
          streak_days: 4,
          modules_completed: 1,
          rank: 14,
          change: '+0',
          profile_color: '#8b5cf6'
        },
        {
          user_id: 'sample-15',
          name: 'Unni Krishnan',
          location: 'Alappuzha',
          points: 650,
          achievements: [],
          streak_days: 1,
          modules_completed: 1,
          rank: 15,
          change: '+3',
          profile_color: '#ef4444'
        },
        {
          user_id: 'sample-16',
          name: 'Sreeja Thomas',
          location: 'Kottayam',
          points: 520,
          achievements: [],
          streak_days: 1,
          modules_completed: 0,
          rank: 16,
          change: '-2',
          profile_color: '#06b6d4'
        },
        {
          user_id: 'sample-17',
          name: 'Manoj Kumar',
          location: 'Thrissur',
          points: 420,
          achievements: [],
          streak_days: 2,
          modules_completed: 0,
          rank: 17,
          change: '+1',
          profile_color: '#84cc16'
        },
        {
          user_id: 'sample-18',
          name: 'Radha Devi',
          location: 'Ernakulam',
          points: 320,
          achievements: [],
          streak_days: 1,
          modules_completed: 0,
          rank: 18,
          change: '+0',
          profile_color: '#f97316'
        },
        {
          user_id: 'sample-19',
          name: 'Gopal Nair',
          location: 'Wayanad',
          points: 250,
          achievements: [],
          streak_days: 0,
          modules_completed: 0,
          rank: 19,
          change: '-1',
          profile_color: '#ec4899'
        },
        {
          user_id: 'sample-20',
          name: 'Bindu Rani',
          location: 'Kasaragod',
          points: 180,
          achievements: [],
          streak_days: 1,
          modules_completed: 0,
          rank: 20,
          change: '+0',
          profile_color: '#6366f1'
        }
      ];

      // Always show sample data for demo immediately
      setTopFarmers(sampleFarmers);
      
      // Try to get real users data to potentially augment the leaderboard
      try {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, name, panchayat');
          
        if (usersData && usersData.length > 0) {
          // Get points for each user (using same logic as Dashboard)
          const farmersWithPoints = await Promise.all(
            usersData.map(async (profile) => {
              const totalPoints = await calculateUserPoints(profile.id);

              return {
                user_id: profile.id,
                name: profile.name,
                location: profile.panchayat || 'Kerala',
                points: totalPoints,
                achievements: [],
                streak_days: 0,
                modules_completed: 0,
                profile_color: '#4ade80'
              };
            })
          );

          // Sort by points and add ranks
          const sorted = farmersWithPoints
            .filter(f => f.points > 0)
            .sort((a, b) => b.points - a.points)
            .map((farmer, index) => ({
              ...farmer,
              rank: sampleFarmers.length + index + 1,
              change: '+0'
            }));

          // Merge real users with sample data if any exist
          if (sorted.length > 0) {
            setTopFarmers([...sampleFarmers, ...sorted]);
          }
          
          // Find current user's rank
          if (user) {
            const allFarmers = sorted.length > 0 ? [...sampleFarmers, ...sorted] : sampleFarmers;
            const currentUserRank = allFarmers.find(f => f.user_id === user?.id);
            setUserRank(currentUserRank);
          }
        }
      } catch (dbError) {
        console.log("Database query failed, using sample data:", dbError);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      // Fallback to sample data on error - use the same comprehensive list
      setTopFarmers(sampleFarmers);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageBackground variant="leaderboard">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">🏆 Community Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among Kerala's top sustainable farmers</p>
      </div>

      {/* Community Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{topFarmers.length}</p>
                <p className="text-xs text-muted-foreground">Active Farmers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{topFarmers.reduce((sum, f) => sum + f.points, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{topFarmers.reduce((sum, f) => sum + f.achievements.length, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{topFarmers.reduce((sum, f) => sum + f.modules_completed, 0)}</p>
                <p className="text-xs text-muted-foreground">Modules Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          {topFarmers.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
                <p>Start earning points to appear on the leaderboard!</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Top 3 Showcase */}
              {topFarmers.length >= 3 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {topFarmers.slice(0, 3).map((farmer, index) => (
                    <Card 
                      key={farmer.rank} 
                      className={`border-2 ${
                        index === 0 ? "md:order-2 bg-gradient-to-br from-primary/5 to-accent/5" : 
                        index === 1 ? "md:order-1" : "md:order-3"
                      }`}
                    >
                      <CardContent className="pt-6 text-center space-y-3">
                        <div className="flex justify-center">
                          {getRankIcon(farmer.rank)}
                        </div>
                        <Avatar className="w-20 h-20 mx-auto border-4" style={{borderColor: farmer.profile_color}}>
                          <AvatarFallback className="text-xl" style={{backgroundColor: farmer.profile_color + '20', color: farmer.profile_color}}>
                            {getInitials(farmer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{farmer.name}</p>
                          <p className="text-sm text-muted-foreground">{farmer.location}</p>
                          {farmer.achievements && farmer.achievements.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {farmer.achievements.slice(0, 2).map((achievement, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            <span className="text-2xl font-bold">{farmer.points.toLocaleString()}</span>
                          </div>
                          <div className="text-center text-xs text-muted-foreground">
                            🔥 {farmer.streak_days} days • 📚 {farmer.modules_completed} modules
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Rest of the Rankings */}
              {topFarmers.length > 3 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Top Farmers in Kerala</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topFarmers.slice(3).map((farmer) => (
                        <div 
                          key={farmer.rank}
                          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors ${
                            farmer.user_id === user?.id ? 'bg-primary/10 border-2 border-primary' : ''
                          }`}
                        >
                          <div className="w-12 text-center">
                            {getRankIcon(farmer.rank)}
                          </div>
                          <Avatar className="border-2" style={{borderColor: farmer.profile_color}}>
                            <AvatarFallback style={{backgroundColor: farmer.profile_color + '20', color: farmer.profile_color}}>
                              {getInitials(farmer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {farmer.name}
                              </p>
                              {farmer.user_id === user?.id && <Badge className="ml-2" variant="default">You</Badge>}
                              {farmer.change && farmer.change !== '+0' && (
                                <Badge variant={farmer.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                                  {farmer.change}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{farmer.location}</p>
                            {farmer.achievements && farmer.achievements.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {farmer.achievements.slice(0, 1).map((achievement, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Trophy className="w-4 h-4 text-primary" />
                              <span className="font-bold">{farmer.points.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              🔥 {farmer.streak_days}d • 📚 {farmer.modules_completed}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User's Rank if not in top 10 */}
              {userRank && userRank.rank > 10 && (
                <Card className="border-2 border-primary">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        <span className="text-lg font-bold text-primary">#{userRank.rank}</span>
                      </div>
                      <Avatar className="border-2 border-primary">
                        <AvatarFallback className="bg-primary/10">
                          {getInitials(userRank.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">Your Ranking</p>
                        <p className="text-sm text-muted-foreground">{userRank.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-primary" />
                          <span className="font-bold">{userRank.points.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="border-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Weekly leaderboard resets every Monday</p>
              <p className="text-sm mt-2">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="border-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Monthly leaderboard resets on the 1st of each month</p>
              <p className="text-sm mt-2">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PageBackground>
  );
};

export default Leaderboard;
