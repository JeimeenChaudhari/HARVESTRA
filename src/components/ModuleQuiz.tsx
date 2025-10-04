import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModuleQuizProps {
  moduleId: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

export const ModuleQuiz = ({ moduleId, questions, onComplete, onClose }: ModuleQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      onComplete(score, questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setQuizComplete(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent work! 🌟";
    if (percentage >= 60) return "Good job! Keep learning! 👍";
    return "Keep practicing! You'll get better! 💪";
  };

  if (quizComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <p className="text-muted-foreground">{getScoreMessage()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {score}/{questions.length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Performance:</p>
            <Progress value={(score / questions.length) * 100} className="h-3" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Quiz
            </Button>
            <Button onClick={onClose} className="flex-1">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Module Quiz</CardTitle>
          <Badge variant="secondary">
            {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonVariant = "outline" as const;
              let icon = null;
              
              if (showResult) {
                if (index === currentQ.correctAnswer) {
                  buttonVariant = "default";
                  icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
                } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                  buttonVariant = "destructive";
                  icon = <XCircle className="w-5 h-5 text-red-600" />;
                }
              } else if (selectedAnswer === index) {
                buttonVariant = "secondary";
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {icon}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <p className="text-sm">
                <strong>Explanation:</strong> {currentQ.explanation}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Exit Quiz
          </Button>
          
          {!showResult ? (
            <Button onClick={handleNext} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleContinue}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};