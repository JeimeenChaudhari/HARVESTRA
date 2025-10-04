import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Award, Search, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ModulePreviewDialog } from "@/components/ModulePreviewDialog";
import PageBackground from "@/components/PageBackground";

const Learn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [modules, setModules] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [previewModule, setPreviewModule] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadModules();
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadModules = async () => {
    const { data } = await supabase
      .from('modules')
      .select('*')
      .order('order_index', { ascending: true });
    
    // Sample expanded modules data
    const sampleModules = [
      {
        id: '1',
        title: 'Sustainable Soil Management',
        description: 'Learn organic soil preparation and maintenance techniques',
        difficulty: 'Beginner',
        points: 50,
        duration_minutes: 25,
        topics: ['Soil Health', 'Composting', 'pH Balance'],
        video_url: 'https://www.youtube.com/embed/JFVHjqTBj7E',
        content: 'Complete guide to soil management',
        quiz_questions: 6,
        order_index: 1
      },
      {
        id: '2',
        title: 'Water Conservation Techniques',
        description: 'Master efficient irrigation and water saving methods',
        difficulty: 'Intermediate',
        points: 75,
        duration_minutes: 30,
        topics: ['Drip Irrigation', 'Rainwater Harvesting', 'Mulching'],
        video_url: 'https://www.youtube.com/embed/mKhBUNEfCcI',
        content: 'Comprehensive water management strategies',
        quiz_questions: 8,
        order_index: 2
      },
      {
        id: '3',
        title: 'Organic Pest Control',
        description: 'Natural methods to protect your crops from pests',
        difficulty: 'Intermediate',
        points: 80,
        duration_minutes: 35,
        topics: ['Natural Pesticides', 'Companion Planting', 'Beneficial Insects'],
        video_url: 'https://www.youtube.com/embed/2wOvnZNv4Uk',
        content: 'Eco-friendly pest management techniques',
        quiz_questions: 7,
        order_index: 3
      },
      {
        id: '4',
        title: 'Crop Rotation Strategies',
        description: 'Plan effective crop rotation for better yields',
        difficulty: 'Advanced',
        points: 100,
        duration_minutes: 40,
        topics: ['Crop Families', 'Nutrient Cycling', 'Disease Prevention'],
        video_url: 'https://www.youtube.com/embed/jLgPUt_pROg',
        content: 'Advanced crop rotation planning',
        quiz_questions: 9,
        order_index: 4
      },
      {
        id: '5',
        title: 'Composting Mastery',
        description: 'Create nutrient-rich compost from organic waste',
        difficulty: 'Beginner',
        points: 45,
        duration_minutes: 20,
        topics: ['Brown Materials', 'Green Materials', 'Temperature Control'],
        video_url: 'https://www.youtube.com/embed/FGJmkUrTqPQ',
        content: 'Complete composting guide',
        quiz_questions: 5,
        order_index: 5
      },
      {
        id: '6',
        title: 'Seed Saving Techniques',
        description: 'Preserve and store seeds for future planting',
        difficulty: 'Intermediate',
        points: 70,
        duration_minutes: 28,
        topics: ['Seed Selection', 'Drying Methods', 'Storage Conditions'],
        video_url: 'https://www.youtube.com/embed/0-W-F7BCtlY',
        content: 'Traditional seed preservation methods',
        quiz_questions: 6,
        order_index: 6
      },
      {
        id: '7',
        title: 'Greenhouse Management',
        description: 'Optimize controlled environment agriculture',
        difficulty: 'Advanced',
        points: 120,
        duration_minutes: 45,
        topics: ['Climate Control', 'Ventilation', 'Pest Management'],
        video_url: 'https://www.youtube.com/embed/JrsHBJbJiUE',
        content: 'Professional greenhouse operations',
        quiz_questions: 10,
        order_index: 7
      },
      {
        id: '8',
        title: 'Organic Fertilizers',
        description: 'Prepare and apply natural plant nutrients',
        difficulty: 'Beginner',
        points: 55,
        duration_minutes: 22,
        topics: ['Manure Composting', 'Liquid Fertilizers', 'Application Timing'],
        video_url: 'https://www.youtube.com/embed/1Wgj2TBNR5g',
        content: 'Natural fertilizer preparation',
        quiz_questions: 6,
        order_index: 8
      },
      {
        id: '9',
        title: 'Integrated Farming Systems',
        description: 'Combine crops, livestock, and aquaculture',
        difficulty: 'Expert',
        points: 150,
        duration_minutes: 60,
        topics: ['Mixed Farming', 'Resource Optimization', 'System Design'],
        video_url: 'https://www.youtube.com/embed/M1cMnM-UJ5U',
        content: 'Holistic farming approach',
        quiz_questions: 12,
        order_index: 9
      },
      {
        id: '10',
        title: 'Climate-Smart Agriculture',
        description: 'Adapt farming to climate change challenges',
        difficulty: 'Advanced',
        points: 110,
        duration_minutes: 38,
        topics: ['Weather Adaptation', 'Resilient Varieties', 'Risk Management'],
        video_url: 'https://www.youtube.com/embed/78Bt7QJCWI8',
        content: 'Climate adaptation strategies',
        quiz_questions: 8,
        order_index: 10
      },
      {
        id: '11',
        title: 'Post-Harvest Processing',
        description: 'Preserve and add value to your produce',
        difficulty: 'Intermediate',
        points: 85,
        duration_minutes: 32,
        topics: ['Drying Techniques', 'Storage Solutions', 'Value Addition'],
        video_url: 'https://www.youtube.com/embed/jGFgJ3zHoqE',
        content: 'Crop processing and preservation',
        quiz_questions: 7,
        order_index: 11
      },
        {
          id: '12',
          title: 'Farm Business Management',
          description: 'Manage your farm as a profitable business',
          difficulty: 'Advanced',
          points: 95,
          duration_minutes: 42,
          topics: ['Cost Analysis', 'Marketing', 'Record Keeping'],
          video_url: 'https://www.youtube.com/embed/qWqRu6wZPJc',
          content: 'Farm economics and management',
          quiz_questions: 9,
          order_index: 12
        },
        {
          id: '13',
          title: 'Organic Certification Process',
          description: 'Navigate the organic certification journey in India',
          difficulty: 'Intermediate',
          points: 110,
          duration_minutes: 35,
          topics: ['Certification Bodies', 'Documentation', 'Standards Compliance'],
          video_url: 'https://www.youtube.com/embed/ZrMw3ZnhtQw',
          content: 'Complete guide to organic certification in India',
          quiz_questions: 8,
          order_index: 13
        },
        {
          id: '14',
          title: 'Medicinal Plant Cultivation',
          description: 'Grow high-value medicinal plants sustainably',
          difficulty: 'Expert',
          points: 135,
          duration_minutes: 48,
          topics: ['Ayurvedic Plants', 'Turmeric Cultivation', 'Ginger Farming'],
          video_url: 'https://www.youtube.com/embed/VPp1yKn4JpY',
          content: 'Kerala\'s traditional medicinal plant cultivation',
          quiz_questions: 10,
          order_index: 14
        },
        {
          id: '15',
          title: 'Aquaponics Systems',
          description: 'Integrate fish farming with vegetable production',
          difficulty: 'Advanced',
          points: 125,
          duration_minutes: 40,
          topics: ['System Design', 'Fish Selection', 'Plant Compatibility'],
          video_url: 'https://www.youtube.com/embed/2_VAfhKCDmw',
          content: 'Sustainable aquaponics for Kerala farmers',
          quiz_questions: 9,
          order_index: 15
        },
        {
          id: '16',
          title: 'Mushroom Cultivation',
          description: 'Grow oyster and shiitake mushrooms commercially',
          difficulty: 'Intermediate',
          points: 90,
          duration_minutes: 32,
          topics: ['Substrate Preparation', 'Spawning', 'Environmental Control'],
          video_url: 'https://www.youtube.com/embed/6b2hGKfwKGk',
          content: 'Commercial mushroom farming techniques',
          quiz_questions: 7,
          order_index: 16
        },
        {
          id: '17',
          title: 'Beekeeping & Honey Production',
          description: 'Start your sustainable beekeeping operation',
          difficulty: 'Intermediate',
          points: 100,
          duration_minutes: 36,
          topics: ['Hive Management', 'Bee Health', 'Honey Harvesting'],
          video_url: 'https://www.youtube.com/embed/XQNKYOwMKTk',
          content: 'Beekeeping fundamentals for Kerala climate',
          quiz_questions: 8,
          order_index: 17
        },
        {
          id: '18',
          title: 'Precision Agriculture Technology',
          description: 'Use IoT and sensors for smart farming',
          difficulty: 'Expert',
          points: 150,
          duration_minutes: 45,
          topics: ['Soil Sensors', 'Drone Technology', 'Data Analytics'],
          video_url: 'https://www.youtube.com/embed/wfp1pKhx2AE',
          content: 'Modern technology in sustainable farming',
          quiz_questions: 11,
          order_index: 18
        },
        {
          id: '19',
          title: 'Coconut Farming Excellence',
          description: 'Maximize coconut yield with modern techniques',
          difficulty: 'Advanced',
          points: 115,
          duration_minutes: 38,
          topics: ['Hybrid Varieties', 'Crown Management', 'Value Addition'],
          video_url: 'https://www.youtube.com/embed/HrJjK8fZDhg',
          content: 'Coconut cultivation specific to Kerala',
          quiz_questions: 9,
          order_index: 19
        },
        {
          id: '20',
          title: 'Spice Garden Management',
          description: 'Cultivate Kerala\'s famous spices sustainably',
          difficulty: 'Advanced',
          points: 120,
          duration_minutes: 42,
          topics: ['Cardamom Cultivation', 'Black Pepper Farming', 'Cinnamon Growing'],
          video_url: 'https://www.youtube.com/embed/2r9T0lZQHyI',
          content: 'Traditional Kerala spice cultivation methods',
          quiz_questions: 10,
          order_index: 20
        }
      ];
    
    // Use database data if available, otherwise use sample data
    setModules(data && data.length > 0 ? data : sampleModules);
  };

  const loadProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.id);
    
    const progressMap: Record<string, any> = {};
    data?.forEach(p => {
      progressMap[p.module_id] = p;
    });
    setProgress(progressMap);
  };

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    const diffLower = difficulty.toLowerCase();
    switch (diffLower) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-blue-500/10 text-blue-500';
      case 'advanced': return 'bg-orange-500/10 text-orange-500';
      case 'expert': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handlePreview = (module: any) => {
    setPreviewModule(module);
    setPreviewOpen(true);
  };

  return (
    <PageBackground variant="learn">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('learningModules')}</h1>
        <p className="text-muted-foreground">
          Master sustainable farming techniques through comprehensive modules
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchModules')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const moduleProgress = progress[module.id];
          const isCompleted = moduleProgress?.completed;
          const progressPercentage = moduleProgress?.progress_percentage || 0;

          return (
            <Card key={module.id} className="border-2 hover:shadow-lg transition-shadow">
              {module.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg relative group">
                  <img 
                    src={module.image_url} 
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePreview(module)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('viewDetails')}
                    </Button>
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {t(module.difficulty.toLowerCase())}
                  </Badge>
                  <Badge variant="secondary">+{module.points} {t('points')}</Badge>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {module.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration_minutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {module.topics.length} {t('topics')}
                  </div>
                </div>

                {moduleProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(module)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => navigate(`/app/learn/${module.id}`)}
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Review Module
                      </>
                    ) : moduleProgress ? (
                      t('continueLearning')
                    ) : (
                      t('startModule')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No modules found matching your search.</p>
          </div>
        </Card>
      )}

      <ModulePreviewDialog
        module={previewModule}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
      </div>
    </PageBackground>
  );
};

export default Learn;
