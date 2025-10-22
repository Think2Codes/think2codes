import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, Zap, Code, Clock, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AIQuizGameProps {
  level: number;
  onComplete: (passed: boolean) => void;
  language?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  concept: string;
  explanation?: string;
}

const QUESTION_TIME_LIMIT = 15; // 15 seconds per question
const MAX_QUESTIONS_PER_LANGUAGE = 3000; // Maximum unique questions per language

export const AIQuizGame = ({ level, onComplete, language: initialLanguage }: AIQuizGameProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage || "JavaScript");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());

  // Timer effect
  useEffect(() => {
    if (!quizStarted || gameOver || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, gameOver, selectedAnswer, currentQuestion]);

  const handleTimeout = () => {
    toast.error("Time's up! Moving to next question...");
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(QUESTION_TIME_LIMIT);
      } else {
        setGameOver(true);
        onComplete(false);
      }
    }, 1000);
  };

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      // Send already asked questions to backend to ensure no repetition
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-quiz-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          language: selectedLanguage, 
          level, 
          count: 5,
          excludeQuestions: Array.from(askedQuestions)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      
      // Track new questions
      const newAskedQuestions = new Set(askedQuestions);
      data.questions.forEach((q: QuizQuestion) => newAskedQuestions.add(q.question));
      setAskedQuestions(newAskedQuestions);
      
      toast.success(`${selectedLanguage} quiz loaded! 🎮`);
    } catch (error: any) {
      console.error('Failed to load questions:', error);
      toast.error(error.message || 'Failed to load quiz questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const startQuiz = async () => {
    setQuizStarted(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
    await fetchQuestions();
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);

    if (!correct) {
      toast.error("Wrong answer! Game over.");
      setTimeout(() => {
        setGameOver(true);
        onComplete(false);
      }, 1500);
    } else {
      setScore(score + 1);
      toast.success("Correct! +1 point");
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTimeLeft(QUESTION_TIME_LIMIT);
        } else {
          setGameOver(true);
          onComplete(true);
        }
      }, 1000);
    }
  };

  const languages = [
    "JavaScript", "Java", "C++", "C#", "TypeScript", "Python", "PHP", "Rust", "Go"
  ];

  if (!quizStarted) {
    return (
      <Card className="shadow-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Level {level} AI-Powered Quiz</CardTitle>
          </div>
          <CardDescription>
            Select your programming language. AI will generate unique questions for you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Programming Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Quiz Features:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• AI-generated unique questions</li>
              <li>• No question repetition (3000+ unique questions)</li>
              <li>• 15-second timer per question</li>
              <li>• Level-appropriate difficulty</li>
              <li>• 4 options per question</li>
            </ul>
          </div>

          <Button 
            onClick={startQuiz} 
            className="w-full" 
            size="lg" 
            variant="gaming"
            disabled={isLoadingQuestions}
          >
            {isLoadingQuestions ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Start AI Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameOver) {
    return (
      <Card className="shadow-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {score === questions.length ? (
              <Trophy className="h-12 w-12 text-accent animate-pulse" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {score === questions.length ? "Perfect Score! 🎉" : "Game Over!"}
          </CardTitle>
          <CardDescription className="text-lg">
            You scored {score} out of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <Progress value={(score / questions.length) * 100} className="h-4" />
            <p className="text-muted-foreground">
              {score === questions.length
                ? "Amazing! You've mastered this level!"
                : "Keep practicing to improve your skills!"}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Language: <span className="font-semibold text-primary">{selectedLanguage}</span></p>
              <p>Questions Answered: {askedQuestions.size}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="shadow-card max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">AI is generating your questions...</p>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="shadow-card max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">{currentQ.concept}</Badge>
          <Badge variant="secondary">{selectedLanguage}</Badge>
          <Badge variant="outline">Level {level}</Badge>
        </div>
        
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-destructive font-bold animate-pulse' : 'text-muted-foreground'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === index
                    ? isCorrect
                      ? "default"
                      : "destructive"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                  <span className="flex-1">{option}</span>
                  {selectedAnswer === index && (
                    isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {isCorrect !== null && currentQ.explanation && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className="font-semibold mb-2">
              {isCorrect ? '✅ Correct!' : '❌ Wrong answer!'}
            </p>
            {currentQ.explanation && (
              <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
