import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, Play, RotateCcw, Clock, Code, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface RunningGameProps {
  onComplete?: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  concept: string;
  explanation?: string;
}

const QUESTION_TIME_LIMIT = 30; // 30 seconds per question
const MAX_QUESTIONS_PER_LANGUAGE = 2000;
const DIFFICULTY_LEVEL = 3; // Medium difficulty

export function RunningGame({ onComplete }: RunningGameProps) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("JavaScript");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Array<{ id: number; position: number }>>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const gameLoopRef = useRef<number>();
  const obstacleCounterRef = useRef(0);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Avatar uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const startGame = () => {
    if (!avatar) {
      toast.error("Please upload your avatar first!");
      return;
    }
    if (!selectedLanguage) {
      toast.error("Please select a programming language!");
      return;
    }
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setShowQuiz(false);
    setAskedQuestions([]);
    obstacleCounterRef.current = 0;
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setShowQuiz(false);
    setPlayerPosition(50);
    setLanguageSelected(false);
    setAskedQuestions([]);
  };

  const generateQuestion = async () => {
    if (isLoadingQuestion) return;
    
    setIsLoadingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-quiz-generator', {
        body: {
          language: selectedLanguage,
          level: DIFFICULTY_LEVEL,
          count: 1,
          excludeQuestions: askedQuestions,
        },
      });

      if (error) throw error;

      if (data?.questions && data.questions.length > 0) {
        const newQuestion = data.questions[0];
        setCurrentQuestion(newQuestion);
        setAskedQuestions(prev => [...prev, newQuestion.question]);
      } else {
        throw new Error('No questions received');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      toast.error('Failed to load question. Game Over!');
      setGameOver(true);
      setShowQuiz(false);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (showQuiz || gameOver || !gameStarted) return;
    
    if (e.key === "ArrowUp" && playerPosition > 20) {
      setPlayerPosition((prev) => prev - 10);
    } else if (e.key === "ArrowDown" && playerPosition < 80) {
      setPlayerPosition((prev) => prev + 10);
    }
  };

  const moveUp = () => {
    if (showQuiz || gameOver || !gameStarted) return;
    if (playerPosition > 20) {
      setPlayerPosition((prev) => prev - 10);
    }
  };

  const moveDown = () => {
    if (showQuiz || gameOver || !gameStarted) return;
    if (playerPosition < 80) {
      setPlayerPosition((prev) => prev + 10);
    }
  };

  const checkCollision = () => {
    obstacles.forEach((obstacle) => {
      if (obstacle.position < 15 && obstacle.position > 5) {
        // Collision detected
        setShowQuiz(true);
        setTimerActive(true);
        setTimeLeft(QUESTION_TIME_LIMIT);
        
        // Generate a new unique question
        generateQuestion();
        
        setObstacles((prev) => prev.filter((obs) => obs.id !== obstacle.id));
      }
    });
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setTimerActive(false);
    setTimeout(() => {
      if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
        toast.success("Correct! Keep running!");
        setScore((prev) => prev + 10);
        setShowQuiz(false);
        setSelectedAnswer(null);
      } else {
        toast.error("Wrong answer! Game Over!");
        setGameOver(true);
        setShowQuiz(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const handleTimeout = () => {
    toast.error("Time's up! Game Over!");
    setGameOver(true);
    setShowQuiz(false);
    setTimerActive(false);
  };

  // Timer effect for quiz questions
  useEffect(() => {
    if (!timerActive || !showQuiz) return;

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
  }, [timerActive, showQuiz]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPosition, showQuiz, gameOver, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver && !showQuiz) {
      gameLoopRef.current = window.setInterval(() => {
        // Move obstacles
        setObstacles((prev) =>
          prev
            .map((obs) => ({ ...obs, position: obs.position - 3 }))
            .filter((obs) => obs.position > -10)
        );

        // Add new obstacles randomly - faster spawning
        if (Math.random() > 0.96) {
          obstacleCounterRef.current += 1;
          setObstacles((prev) => [
            ...prev,
            { id: obstacleCounterRef.current, position: 100 },
          ]);
        }

        checkCollision();
      }, 30);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameStarted, gameOver, showQuiz, obstacles]);

  if (!gameStarted && !gameOver) {
    return (
      <Card className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto shadow-glow">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2">
              <Code className="w-3 h-3 mr-1" />
              Running Game
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Avatar Running Game
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Upload your avatar, select a language, and dodge obstacles while answering quizzes!
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {avatar ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary shadow-glow"
                  />
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" className="gap-2" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                        Change Avatar
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <label htmlFor="avatar-upload" className="cursor-pointer inline-block">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="hero" size="lg" className="gap-2" asChild>
                    <span>
                      <Upload className="w-5 h-5" />
                      Upload Your Avatar
                    </span>
                  </Button>
                </label>
              )}
            </div>
            {avatar && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-sm font-semibold">Select Programming Language:</label>
                <Select value={selectedLanguage} onValueChange={(value) => {
                  setSelectedLanguage(value);
                  setLanguageSelected(true);
                }}>
                  <SelectTrigger className="w-full max-w-xs mx-auto">
                    <SelectValue placeholder="Choose a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="PHP">PHP</SelectItem>
                    <SelectItem value="Rust">Rust</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {MAX_QUESTIONS_PER_LANGUAGE} questions available per language
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-muted to-muted/50 p-4 sm:p-6 rounded-lg border border-border">
            <h3 className="font-bold mb-3 text-lg">🎮 How to Play</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-left">
              <div className="space-y-2">
                <p className="font-semibold text-primary">Controls:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ⬆️ Arrow Up: Move up</li>
                  <li>• ⬇️ Arrow Down: Move down</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-primary">Rules:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 30 seconds per question</li>
                  <li>• Correct answer: +10 points</li>
                  <li>• Wrong/timeout: Game Over</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            onClick={startGame} 
            size="lg" 
            variant="gaming"
            className="gap-2 w-full sm:w-auto" 
            disabled={!avatar}
          >
            <Play className="w-5 h-5" />
            Start Game
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-base sm:text-lg px-3 py-1">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Code className="w-3 h-3 mr-1" />
            {selectedLanguage}
          </Badge>
        </div>
        <Button onClick={resetGame} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset Game
        </Button>
      </div>

      <div className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 h-[600px] rounded-lg overflow-hidden border-4 border-primary shadow-glow">
        {/* Player */}
        <div
          className="absolute left-[10%] transition-all duration-100 z-10"
          style={{ top: `${playerPosition}%`, transform: "translateY(-50%)" }}
        >
          <img
            src={avatar!}
            alt="Player"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 sm:border-4 border-white shadow-lg"
          />
        </div>

        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="absolute top-1/2 -translate-y-1/2 w-8 h-16 sm:w-12 sm:h-24 bg-gradient-to-br from-red-600 to-red-700 rounded shadow-lg"
            style={{ left: `${obstacle.position}%` }}
          />
        ))}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0  bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <Card className="p-6 sm:p-8 text-center space-y-4 max-w-md w-screen shadow-glow">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">Game Over!</h2>
              <div className="space-y-2">
                <p className="text-lg sm:text-xl">Final Score</p>
                <Badge variant="secondary" className="text-2xl sm:text-3xl px-4 py-2">
                  {score}
                </Badge>
              </div>
              <Button onClick={resetGame} variant="gaming" size="lg" className="gap-2 w-full">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </Button>
            </Card>
          </div>
        )}

        {/* Quiz Overlay */}
        {showQuiz && currentQuestion && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <Card className="p-4 sm:p-6 max-w-2xl w-full space-y-4 shadow-glow">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-sm sm:text-base">
                  {currentQuestion.concept}
                </Badge>
                <Badge variant={timeLeft <= 10 ? "destructive" : "outline"} className="text-sm sm:text-base gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {timeLeft}s
                </Badge>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Answer to Clear Hurdle!</h3>
              <p className="text-base sm:text-lg font-medium">{currentQuestion.question}</p>
              <div className="grid gap-2 sm:gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    variant={
                      selectedAnswer === index
                        ? index === currentQuestion.correctAnswer
                          ? "default"
                          : "destructive"
                        : "outline"
                    }
                    className="w-full justify-start text-left h-auto py-3 px-4 text-sm sm:text-base"
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <Button 
            onClick={moveUp} 
            variant="outline" 
            size="lg"
            className="w-24"
            disabled={showQuiz || gameOver}
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
          <Button 
            onClick={moveDown} 
            variant="outline" 
            size="lg"
            className="w-24"
            disabled={showQuiz || gameOver}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            ⬆️⬇️ Use Arrow Keys or Buttons to move your avatar
          </p>
          <p className="text-xs text-muted-foreground">
            Answer questions within 30 seconds to continue!
          </p>
        </div>
      </div>
    </div>
  );
}
