import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Trophy, Upload, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";

export default function MissionCenter() {
  const [missions, setMissions] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [proofDescription, setProofDescription] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    loadMissions();
    loadMySubmissions();
  }, [user]);

  const loadMissions = async () => {
    const { data } = await supabase
      .from('missions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setMissions(data);
  };

  const loadMySubmissions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('mission_submissions')
      .select('*, missions(*)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });
    if (data) setMySubmissions(data);
  };

  const handleSubmitMission = async () => {
    if (!user || !selectedMission) return;
    
    setIsSubmitting(true);
    try {
      // For now, we'll just submit the description
      // File upload can be added later with Supabase Storage
      const { error } = await supabase
        .from('mission_submissions')
        .insert({
          mission_id: selectedMission.id,
          user_id: user.id,
          proof_description: proofDescription,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: t('success'),
        description: "Mission submitted successfully! Waiting for verification.",
      });

      setSelectedMission(null);
      setProofDescription("");
      setProofFile(null);
      loadMySubmissions();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: t('error'),
        description: "Failed to submit mission",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <PageBackground variant="missions">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mission Center</h1>
        <p className="text-muted-foreground">Complete sustainable farming missions to earn XP and badges</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Missions</TabsTrigger>
          <TabsTrigger value="quests">Daily Quests</TabsTrigger>
          <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {missions.map((mission) => {
              const Icon = Target;
              return (
                <Card key={mission.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{mission.title}</CardTitle>
                          <Badge variant={mission.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{mission.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {mission.duration_days} days
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <Trophy className="w-4 h-4 text-accent" />
                        {mission.points_reward} XP
                      </div>
                    </div>
                    {mission.impact_description && (
                      <p className="text-xs text-muted-foreground">{mission.impact_description}</p>
                    )}
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedMission(mission)}
                    >
                      Start Mission
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="quests" className="space-y-4">
          <div className="space-y-4">
            {[
              {
                id: 'q1',
                title: "Quick Composting Challenge",
                description: "Create organic compost using kitchen waste",
                progress: 75,
                current: 2,
                total: 3,
                points: 50,
                icon: Target,
                difficulty: "Easy",
                duration: "2-3 days"
              },
              {
                id: 'q2',
                title: "Organic Fertilizer Challenge",
                description: "Use only organic fertilizers for optimal soil health",
                progress: 40,
                current: 8,
                total: 12,
                points: 200,
                icon: Clock,
                difficulty: "Medium",
                duration: "10-15 days"
              },
              {
                id: 'q3',
                title: "Sustainable Farm Master",
                description: "Implement complete sustainable farming ecosystem",
                progress: 60,
                current: 18,
                total: 30,
                points: 500,
                icon: Trophy,
                difficulty: "Hard",
                duration: "30 days"
              }
            ].map((quest) => {
              const Icon = quest.icon;
              return (
                <Card key={quest.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="mb-1">{quest.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{quest.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={quest.difficulty === "Hard" ? "destructive" : quest.difficulty === "Medium" ? "default" : "secondary"}>
                          {quest.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {quest.duration}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={quest.progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {quest.current}/{quest.total} completed
                      </p>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-medium">{quest.points} points</span>
                      </div>
                    </div>
                    <Button className="w-full">Continue Quest</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-submissions" className="space-y-4">
          {mySubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{submission.missions.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <strong>Your proof:</strong> {submission.proof_description}
                </p>
                {submission.officer_remarks && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Officer remarks:</strong> {submission.officer_remarks}
                  </p>
                )}
                {submission.status === 'rejected' && (
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => setSelectedMission(submission.missions)}
                  >
                    Re-submit Mission
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Mission Submission Dialog */}
      {selectedMission && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{selectedMission.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedMission.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe how you completed this mission
                </label>
                <Textarea
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Explain what you did..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Upload proof (photo/video) - Optional
                </label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedMission(null);
                    setProofDescription("");
                    setProofFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitMission}
                  disabled={isSubmitting || !proofDescription.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </PageBackground>
  );
}
