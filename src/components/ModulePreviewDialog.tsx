import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart3, Users, Play, CheckCircle2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useState } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  duration_minutes: number;
  topics: string[];
  video_url?: string;
  content: string;
  quiz_questions?: number;
}

interface ModulePreviewDialogProps {
  module: Module | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModulePreviewDialog = ({ module, open, onOpenChange }: ModulePreviewDialogProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [videoCompleted, setVideoCompleted] = useState(false);

  if (!module) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-orange-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStartLearning = () => {
    onOpenChange(false);
    navigate(`/app/learn/${module.id}`);
  };

  const learningPoints = module.content.split('\n').filter(line => line.trim().length > 0).slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('modulePreview')}</DialogTitle>
          <p className="text-sm text-muted-foreground">{module.title}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Video Preview */}
          <div className="space-y-4">
            {module.video_url ? (
              <VideoPlayer
                videoUrl={module.video_url}
                title={`${module.title} - Preview`}
                onComplete={() => setVideoCompleted(true)}
                requiredWatchPercentage={85}
              />
            ) : (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t('watchPreview')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">{module.title}</h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('duration')}</p>
                    <p className="font-semibold">{module.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('points')}</p>
                    <p className="font-semibold text-primary">{module.points}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {t('level')}
                </Badge>
                <span className="font-medium capitalize">{module.difficulty}</span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Quiz Questions</p>
                  <p className="font-semibold">{module.quiz_questions || 6}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('enrolled')}</p>
                  <p className="font-semibold">890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - What You'll Learn */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('whatYouLearn')}</h3>
              <div className="space-y-2">
                {learningPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {module.topics.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">{t('topics')}</h4>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={handleStartLearning}
                className="w-full h-12 text-base"
                size="lg"
                disabled={module.video_url && !videoCompleted}
              >
                {module.video_url && !videoCompleted ? (
                  'Complete Preview to Start'
                ) : videoCompleted ? (
                  <>  
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {t('startLearning')}
                  </>
                ) : (
                  t('startLearning')
                )}
              </Button>
              <Button 
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full h-12 text-base mt-2"
                size="lg"
              >
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
