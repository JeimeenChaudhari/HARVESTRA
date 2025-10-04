import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlayCircle, BookOpen, Award, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";
import { getQuizQuestions, calculateQuizScore } from "@/data/quizQuestions";
import { showEngagingToast } from "@/utils/toastMessages";

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [module, setModule] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    loadModuleData();
  }, [moduleId]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timerRunning && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, timerRunning]);

  const loadModuleData = async () => {
    // Load module
    const { data: moduleData } = await supabase
      .from('modules')
      .select('*')
      .eq('id', moduleId)
      .single();
    setModule(moduleData);

    // Load quiz questions from our comprehensive question bank
    const quizQuestions = getQuizQuestions(moduleId);
    if (quizQuestions.length > 0) {
      // Create quiz data
      const quizData = {
        id: `quiz_${moduleId}`,
        module_id: moduleId,
        passing_score: 70,
        time_limit_minutes: Math.max(5, quizQuestions.length * 2), // 2 min per question, min 5 min
        title: `${moduleData?.title} Quiz`
      };
      setQuiz(quizData);
      setQuestions(quizQuestions);
    }

    // Update progress
    if (user) {
      await updateProgress();
    }
  };

  const updateProgress = async () => {
    if (!user || !moduleId) return;

    const { data: existing } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single();

    if (!existing) {
      await supabase
        .from('user_module_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          progress_percentage: 10
        });
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.time_limit_minutes * 60);
    setTimerRunning(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleSubmitQuiz = async () => {
    setTimerRunning(false);
    
    // Calculate score using our enhanced function
    const finalScore = calculateQuizScore(Object.values(answers), questions);
    setScore(finalScore);
    setQuizCompleted(true);

    const passed = finalScore >= quiz.passing_score;
    const timeTaken = (quiz.time_limit_minutes * 60) - timeLeft;

    // Show engaging feedback based on performance
    if (finalScore === 100) {
      showEngagingToast('perfectScore');
    } else if (passed) {
      showEngagingToast('quizPassed', { score: finalScore });
    } else {
      showEngagingToast('quizFailed', { score: finalScore, required: quiz.passing_score });
    }

    // Save quiz attempt (try to save, but don't fail if database unavailable)
    if (user) {
      try {
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          quiz_id: quiz.id,
          module_id: moduleId,
          score: finalScore,
          total_questions: questions.length,
          time_taken_seconds: timeTaken,
          answers: answers,
          passed: passed
        });

        if (passed) {
          // Award points
          await supabase.from('user_points').insert({
            user_id: user.id,
            points: module.points,
            source: 'module_completion',
            description: `Completed ${module.title}`
          });

          // Mark module as completed
          await supabase
            .from('user_module_progress')
            .update({
              completed: true,
              progress_percentage: 100,
              completed_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('module_id', moduleId);

          // Update streak
          await supabase.rpc('update_user_streak', { p_user_id: user.id });
          
          // Show module completion celebration
          setTimeout(() => {
            showEngagingToast('moduleCompleted', { 
              moduleName: module.title, 
              points: module.points 
            });
          }, 2000);
        }
      } catch (error) {
        console.log('Database save failed, but quiz completed locally');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!module) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <PageBackground variant="learn">
      <div className="p-6 space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/app/learn')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Modules
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{module.title}</h1>
          <p className="text-muted-foreground">{module.description}</p>
        </div>
        <Badge className="text-lg px-4 py-2">+{module.points} points</Badge>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">
            <BookOpen className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Award className="w-4 h-4 mr-2" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {module.video_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Video Lesson
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <iframe
                    src={module.video_url}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Module Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{module.content}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Topics Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {module.topics.map((topic: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{topic}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          {!quizStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>Ready to Test Your Knowledge?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {quiz?.time_limit_minutes} minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {questions.length} questions
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Passing score: {quiz?.passing_score}%
                </p>
                <Button onClick={startQuiz} className="w-full">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ) : quizCompleted ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {score >= quiz.passing_score ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Award className="w-6 h-6" />
                  )}
                  Quiz Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className={`text-8xl font-bold mb-4 animate-bounce ${
                    score >= quiz.passing_score ? 'text-green-500' : 'text-orange-500'
                  }`}>{score}%</div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold">
                      {score >= quiz.passing_score 
                        ? "🎉 Outstanding! Module Mastered!" 
                        : "💪 Keep Growing! Try Again!"}
                    </p>
                    <p className="text-muted-foreground">
                      {score === 100 ? "Perfect score! You're a farming expert!" :
                       score >= 90 ? "Excellent knowledge of sustainable farming!" :
                       score >= quiz.passing_score ? "Good job! You understand the concepts well!" :
                       "Review the module content and try again. You can do it!"}
                    </p>
                  </div>
                </div>
                
                {/* Detailed Results */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Correct Answers</span>
                    <span className="text-2xl font-bold text-green-600">
                      {Object.keys(answers).filter(idx => answers[Number(idx)] === questions[Number(idx)].correct).length} / {questions.length}
                    </span>
                  </div>
                  
                  {/* Show explanations for wrong answers */}
                  {Object.keys(answers).some(idx => answers[Number(idx)] !== questions[Number(idx)].correct) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Learn from your answers:</h4>
                      {Object.keys(answers).map(idx => {
                        const questionIdx = Number(idx);
                        const question = questions[questionIdx];
                        const userAnswer = answers[questionIdx];
                        const isCorrect = userAnswer === question.correct;
                        
                        if (isCorrect) return null;
                        
                        return (
                          <div key={idx} className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <p className="font-medium text-sm mb-2">Q{questionIdx + 1}: {question.question}</p>
                            <div className="space-y-1 text-sm">
                              <p className="text-red-600">Your answer: {question.options[userAnswer]}</p>
                              <p className="text-green-600">Correct answer: {question.options[question.correct]}</p>
                              <p className="text-muted-foreground italic">{question.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/app/learn')} className="flex-1">
                    Back to Modules
                  </Button>
                  {score < quiz.passing_score && (
                    <Button 
                      onClick={() => {
                        setQuizStarted(false);
                        setQuizCompleted(false);
                        setAnswers({});
                        setCurrentQuestion(0);
                      }} 
                      variant="outline"
                      className="flex-1"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                    <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(timeLeft)}
                    </Badge>
                  </div>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} />
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg font-medium">{questions[currentQuestion]?.question}</p>
                  
                  <RadioGroup
                    value={answers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                  >
                    {questions[currentQuestion]?.options.map((option: string, idx: number) => {
                      const isSelected = answers[currentQuestion] === idx;
                      return (
                        <div key={idx} className={`flex items-center space-x-2 p-4 border rounded-lg transition-all duration-300 cursor-pointer hover:shadow-md ${
                          isSelected 
                            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg' 
                            : 'hover:bg-accent hover:border-primary/50'
                        }`}>
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className={isSelected ? 'border-primary' : ''} />
                          <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-medium">
                            {option}
                          </Label>
                          {isSelected && (
                            <span className="text-primary animate-pulse">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      disabled={currentQuestion === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    {currentQuestion < questions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        disabled={answers[currentQuestion] === undefined}
                        className="flex-1"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(answers).length < questions.length}
                        className="flex-1"
                      >
                        Submit Quiz
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </PageBackground>
  );
};

export default ModuleDetail;