import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Flame, Award, CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";
import { showEngagingToast } from "@/utils/toastMessages";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    badgesEarned: 0,
    modulesCompleted: 0,
    currentStreak: 0
  });
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [userLevel, setUserLevel] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(profileData);

    // Load total points
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', user.id);
    const totalPoints = pointsData?.reduce((sum, p) => sum + p.points, 0) || 0;

    // Load badges count
    const { data: badgesData } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id);

    // Load modules completed
    const { data: progressData } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);

    // Load streak
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setStats({
      totalPoints,
      badgesEarned: badgesData?.length || 0,
      modulesCompleted: progressData?.length || 0,
      currentStreak: streakData?.current_streak || 0
    });

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const lastCheckin = streakData?.last_activity_date;
    setCheckedInToday(lastCheckin === today);

    // Load user level
    const { data: levelData } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (levelData) {
      setUserLevel(levelData);
    }

    // Load recent badges with badge info
    const { data: recentBadgesData } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })
      .limit(3);
    setRecentBadges(recentBadgesData || []);

    // Load active modules
    const { data: modulesData } = await supabase
      .from('user_module_progress')
      .select(`
        *,
        modules (*)
      `)
      .eq('user_id', user.id)
      .eq('completed', false)
      .order('started_at', { ascending: false })
      .limit(3);
    setActiveModules(modulesData || []);
  };

  const handleCheckIn = async () => {
    if (!user || checkedInToday) return;

    try {
      const { error } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id
      });

      if (error) throw error;

      // Award 10 points for daily check-in
      await supabase.from('user_points').insert({
        user_id: user.id,
        points: 10,
        source: 'daily_checkin',
        description: 'Daily check-in bonus'
      });

      // Show engaging check-in message
      showEngagingToast('dailyCheckIn');
      
      // Check for streak milestones
      const newStreak = (streakData?.current_streak || 0) + 1;
      if (newStreak % 7 === 0) {
        setTimeout(() => {
          showEngagingToast('streakMilestone', { days: newStreak });
        }, 1500);
      }

      setCheckedInToday(true);
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <PageBackground variant="dashboard">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('welcome')} {profile?.name || 'Farmer'}! 👋
        </h1>
        {profile?.district && profile?.panchayat && (
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {profile.panchayat}, {profile.district}
          </p>
        )}
      </div>

      {/* Daily Check-in Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('checkInDaily')}</h3>
                <p className="text-sm text-muted-foreground">{t('continueStreak')}</p>
              </div>
            </div>
            <Button 
              onClick={handleCheckIn}
              disabled={checkedInToday}
              size="lg"
              className="min-w-[180px]"
            >
              {checkedInToday ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {t('alreadyCheckedIn')}
                </>
              ) : (
                t('checkIn')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      {userLevel && (
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('level')} {userLevel.current_level}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="font-medium">
                  {userLevel.total_xp} / {userLevel.next_level_xp} XP
                </span>
              </div>
              <Progress 
                value={(userLevel.total_xp / userLevel.next_level_xp) * 100} 
                className="h-3"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {userLevel.next_level_xp - userLevel.total_xp} XP until next level
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalPoints')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.totalPoints}</p>
                <p className="text-xs text-muted-foreground">Keep earning!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('currentStreak')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('badgesEarned')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-accent" />
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.badgesEarned}</p>
                <p className="text-xs text-muted-foreground">achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('modulesCompleted')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.modulesCompleted}</p>
                <p className="text-xs text-muted-foreground">finished</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Modules */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {t('activeModules')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeModules.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No active modules. Start learning from the Learn page!
            </p>
          ) : (
            activeModules.map((progress) => (
              <div key={progress.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{progress.modules.title}</p>
                    <p className="text-sm text-muted-foreground">{progress.modules.description}</p>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <Progress value={progress.progress_percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progress.progress_percentage}% completed • {progress.modules.points} points
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Badges */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {t('recentBadges')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentBadges.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No badges earned yet. Complete modules to earn badges!
              </p>
            ) : (
              recentBadges.map((userBadge) => (
                <div key={userBadge.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    {userBadge.badges.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{userBadge.badges.name}</p>
                    <p className="text-sm text-muted-foreground">{userBadge.badges.description}</p>
                  </div>
                  <Badge>+{userBadge.badges.points_reward} pts</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </PageBackground>
  );
};

export default Dashboard;
