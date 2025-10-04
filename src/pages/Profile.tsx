import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Leaf, MapPin, Calendar, Edit, Flame, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarCustomizer } from "@/components/AvatarCustomizer";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";
import avatar1 from '@/assets/avatar-1.png';
import avatar2 from '@/assets/avatar-2.png';
import avatar3 from '@/assets/avatar-3.png';
import avatar4 from '@/assets/avatar-4.png';

const avatarMap: Record<string, string> = {
  '1': avatar1,
  '2': avatar2,
  '3': avatar3,
  '4': avatar4
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    modulesCompleted: 0,
    badgesEarned: 0,
    currentStreak: 0
  });
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [avatarCustomizerOpen, setAvatarCustomizerOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('🌾');

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Load profile
      const profileResponse = await fetch(`/api/users/profile?userId=${user.id}`);
      const profileData = await profileResponse.json();
      setProfile(profileData);
      setCurrentAvatar(profileData?.avatar || '🌾');

      // Load user stats
      const statsResponse = await fetch(`/api/users/stats?userId=${user.id}`);
      const statsData = await statsResponse.json();
      
      // Load achievements (badges)
      const achievementsResponse = await fetch(`/api/users/achievements?userId=${user.id}`);
      const achievementsData = await achievementsResponse.json();
      setUserBadges(achievementsData);

      // Load recent activity (redemptions for now)
      const recentResponse = await fetch(`/api/rewards/redeem?userId=${user.id}`);
      const recentData = await recentResponse.json();
      setRecentActivity(recentData.slice(0, 5));

      setStats({
        totalPoints: statsData.totalPoints || 0,
        modulesCompleted: statsData.completedModules || 0,
        badgesEarned: statsData.totalAchievements || 0,
        currentStreak: statsData.currentStreak || 0
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePointsSpent = (amount: number) => {
    setStats(prev => ({
      ...prev,
      totalPoints: Math.max(0, prev.totalPoints - amount)
    }));
    
    toast({
      title: "Points Spent",
      description: `You spent ${amount} points on customization.`,
    });
  };

  const openAvatarCustomizer = () => {
    setAvatarCustomizerOpen(true);
  };

  const statsList = [
    { label: "Total Points", value: stats.totalPoints.toString(), icon: Trophy, color: "text-primary" },
    { label: "Modules Completed", value: stats.modulesCompleted.toString(), icon: Target, color: "text-accent" },
    { label: "Badges Earned", value: stats.badgesEarned.toString(), icon: Leaf, color: "text-primary" },
  ];

  return (
    <PageBackground variant="profile">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account and track your progress</p>
      </div>

      {/* Profile Header */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarFallback className="text-4xl bg-primary/10">
                  {currentAvatar}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                onClick={openAvatarCustomizer}
                title="Customize Avatar"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile?.name || 'Farmer'}</h2>
                {stats.currentStreak > 0 && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {stats.currentStreak} day streak
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-3">
                {profile?.district && profile?.panchayat && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.panchayat}, {profile.district}</span>
                  </div>
                )}
                {profile?.primary_crop && (
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    <span>Primary Crop: {profile.primary_crop}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Points Progress</span>
                  <span className="font-medium">{stats.totalPoints} pts</span>
                </div>
                <Progress value={Math.min((stats.totalPoints / 10000) * 100, 100)} className="h-2" />
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {statsList.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Badges */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userBadges.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No badges earned yet. Complete modules to earn badges!
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {userBadges.map((achievement) => (
                <div
                  key={achievement._id}
                  className="p-4 rounded-lg border-2 border-primary bg-primary/5 text-center hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-medium mb-1">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <Badge variant="default">+{achievement.points_awarded} pts</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recent activity. Start learning to track your progress!
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity._id || activity.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.reward_title || activity.description || 'Recent Activity'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.redeemed_at || activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>
                    {activity.points_spent ? `-${activity.points_spent}` : `+${activity.points || 0}`} pts
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avatar Customizer Dialog */}
      <AvatarCustomizer
        open={avatarCustomizerOpen}
        onOpenChange={setAvatarCustomizerOpen}
        userPoints={stats.totalPoints}
        onPointsSpent={handlePointsSpent}
      />
      </div>
    </PageBackground>
  );
};

export default Profile;
