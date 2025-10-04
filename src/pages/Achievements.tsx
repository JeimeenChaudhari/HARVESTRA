import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Star, 
  Leaf, 
  Droplets, 
  Zap, 
  Target, 
  Crown, 
  Flame,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Sprout
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageBackground from "@/components/PageBackground";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  progress: number;
  max_progress: number;
  unlocked: boolean;
  unlocked_date?: string;
}

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    points: 0
  });

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    // Sample achievements data for demo
    const sampleAchievements: Achievement[] = [
      // Learning Achievements
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first learning module',
        icon: BookOpen,
        category: 'learning',
        points: 50,
        rarity: 'common',
        requirement: 'Complete 1 module',
        progress: 1,
        max_progress: 1,
        unlocked: true,
        unlocked_date: '2025-01-02'
      },
      {
        id: '2',
        title: 'Knowledge Seeker',
        description: 'Complete 5 learning modules',
        icon: Star,
        category: 'learning',
        points: 150,
        rarity: 'rare',
        requirement: 'Complete 5 modules',
        progress: 3,
        max_progress: 5,
        unlocked: false
      },
      {
        id: '3',
        title: 'Master Learner',
        description: 'Complete all available learning modules',
        icon: Crown,
        category: 'learning',
        points: 500,
        rarity: 'legendary',
        requirement: 'Complete all 12 modules',
        progress: 3,
        max_progress: 12,
        unlocked: false
      },
      // Streak Achievements
      {
        id: '4',
        title: 'Streak Starter',
        description: 'Maintain a 7-day learning streak',
        icon: Flame,
        category: 'streak',
        points: 100,
        rarity: 'common',
        requirement: 'Learn for 7 consecutive days',
        progress: 7,
        max_progress: 7,
        unlocked: true,
        unlocked_date: '2025-01-05'
      },
      {
        id: '5',
        title: 'Dedication',
        description: 'Maintain a 30-day learning streak',
        icon: Calendar,
        category: 'streak',
        points: 300,
        rarity: 'epic',
        requirement: 'Learn for 30 consecutive days',
        progress: 12,
        max_progress: 30,
        unlocked: false
      },
      // Points Achievements
      {
        id: '6',
        title: 'Point Collector',
        description: 'Earn your first 1000 points',
        icon: Target,
        category: 'points',
        points: 100,
        rarity: 'common',
        requirement: 'Earn 1000 points',
        progress: 850,
        max_progress: 1000,
        unlocked: false
      },
      {
        id: '7',
        title: 'High Achiever',
        description: 'Earn 5000 points total',
        icon: TrendingUp,
        category: 'points',
        points: 250,
        rarity: 'rare',
        requirement: 'Earn 5000 points',
        progress: 850,
        max_progress: 5000,
        unlocked: false
      },
      // Sustainability Achievements
      {
        id: '8',
        title: 'Organic Master',
        description: 'Complete all organic farming modules',
        icon: Leaf,
        category: 'sustainability',
        points: 200,
        rarity: 'rare',
        requirement: 'Complete organic modules',
        progress: 2,
        max_progress: 4,
        unlocked: false
      },
      {
        id: '9',
        title: 'Water Saver',
        description: 'Master water conservation techniques',
        icon: Droplets,
        category: 'sustainability',
        points: 150,
        rarity: 'rare',
        requirement: 'Complete water conservation module with 90%+ score',
        progress: 0,
        max_progress: 1,
        unlocked: false
      },
      // Community Achievements
      {
        id: '10',
        title: 'Community Helper',
        description: 'Help 10 fellow farmers in discussions',
        icon: Users,
        category: 'community',
        points: 200,
        rarity: 'rare',
        requirement: 'Help 10 farmers',
        progress: 3,
        max_progress: 10,
        unlocked: false
      },
      // Special Achievements
      {
        id: '11',
        title: 'Early Adopter',
        description: 'One of the first 100 users to join Harvestra',
        icon: Shield,
        category: 'special',
        points: 500,
        rarity: 'legendary',
        requirement: 'Join in first 100 users',
        progress: 1,
        max_progress: 1,
        unlocked: true,
        unlocked_date: '2025-01-01'
      },
      {
        id: '12',
        title: 'Rising Star',
        description: 'Reach top 10 in leaderboard',
        icon: Sprout,
        category: 'special',
        points: 300,
        rarity: 'epic',
        requirement: 'Rank in top 10',
        progress: 0,
        max_progress: 1,
        unlocked: false
      }
    ];

    setAchievements(sampleAchievements);
    
    // Calculate stats
    const unlocked = sampleAchievements.filter(a => a.unlocked);
    const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);
    
    setStats({
      total: sampleAchievements.length,
      unlocked: unlocked.length,
      points: totalPoints
    });
    
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'rare': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'epic': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'legendary': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⚪';
      case 'rare': return '🔵';
      case 'epic': return '🟣';
      case 'legendary': return '🟡';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return BookOpen;
      case 'streak': return Flame;
      case 'points': return Target;
      case 'sustainability': return Leaf;
      case 'community': return Users;
      case 'special': return Crown;
      default: return Award;
    }
  };

  const categories = ['all', 'learning', 'streak', 'points', 'sustainability', 'community', 'special'];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <PageBackground variant="achievements">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Track your farming journey and unlock rewards for your dedication
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.unlocked}</p>
                <p className="text-xs text-muted-foreground">of {stats.total} unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.points}</p>
                <p className="text-xs text-muted-foreground">achievement points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round((stats.unlocked / stats.total) * 100)}%</p>
                <p className="text-xs text-muted-foreground">completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => {
            const Icon = category === 'all' ? Award : getCategoryIcon(category);
            const count = category === 'all' 
              ? achievements.length 
              : achievements.filter(a => a.category === category).length;
            
            return (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline capitalize">{category}</span>
                <Badge variant="secondary" className="ml-1 text-xs">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {(category === 'all' ? achievements : achievements.filter(a => a.category === category))
                .map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercentage = Math.round((achievement.progress / achievement.max_progress) * 100);
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`border-2 transition-all hover:shadow-lg ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20' 
                          : 'opacity-75'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              achievement.unlocked 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">
                                  {achievement.title}
                                </CardTitle>
                                {achievement.unlocked && (
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    ✓ Unlocked
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getRarityColor(achievement.rarity)} border`}>
                              {getRarityIcon(achievement.rarity)} {achievement.rarity}
                            </Badge>
                            <p className="text-sm font-bold text-primary mt-1">
                              +{achievement.points} pts
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {achievement.requirement}
                            </span>
                            <span className="font-medium">
                              {achievement.progress} / {achievement.max_progress}
                            </span>
                          </div>
                          
                          <Progress 
                            value={progressPercentage} 
                            className="h-2"
                          />
                          
                          {achievement.unlocked && achievement.unlocked_date && (
                            <p className="text-xs text-muted-foreground">
                              🎉 Unlocked on {new Date(achievement.unlocked_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      </div>
    </PageBackground>
  );
};

export default Achievements;