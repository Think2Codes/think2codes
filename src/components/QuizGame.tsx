import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, Zap, Code, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface QuizGameProps {
  level: number;
  onComplete: (passed: boolean) => void;
  language?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  concept: string;
  difficulty: number;
  language: string;
}

const QUESTION_TIME_LIMIT = 15; // 15 seconds per question

// Comprehensive quiz questions covering all programming concepts
const allQuizQuestions: QuizQuestion[] = [
  // LEVEL 1: Variables & Basic Syntax - JavaScript
  { question: "In JavaScript, which keyword is used to declare a variable that can be reassigned?", options: ["const", "let", "var", "all of the above"], correctAnswer: 1, concept: "Variables", difficulty: 1, language: "JavaScript" },
  { question: "What will 'typeof 42' return in JavaScript?", options: ["'int'", "'number'", "'integer'", "'float'"], correctAnswer: 1, concept: "Data Types", difficulty: 1, language: "JavaScript" },
  { question: "Which symbol is used for single-line comments in JavaScript?", options: ["#", "/*", "//", "<!--"], correctAnswer: 2, concept: "Basic Syntax", difficulty: 1, language: "JavaScript" },
  { question: "What is the correct way to declare a constant in JavaScript?", options: ["var PI = 3.14", "let PI = 3.14", "const PI = 3.14", "constant PI = 3.14"], correctAnswer: 2, concept: "Variables", difficulty: 1, language: "JavaScript" },
  
  // LEVEL 1: Variables & Basic Syntax - Python
  { question: "In Python, which of these is NOT a valid variable name?", options: ["my_var", "_private", "2ndVariable", "varTwo"], correctAnswer: 2, concept: "Variables", difficulty: 1, language: "Python" },
  { question: "What is the output of type(3.14) in Python?", options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"], correctAnswer: 1, concept: "Data Types", difficulty: 1, language: "Python" },
  { question: "How do you create a comment in Python?", options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"], correctAnswer: 2, concept: "Basic Syntax", difficulty: 1, language: "Python" },
  { question: "Which operator is used to assign a value to a variable in Python?", options: ["set", "var", "let", "="], correctAnswer: 3, concept: "Variables", difficulty: 1, language: "Python" },

  // LEVEL 2: Conditionals - JavaScript
  { question: "What is the correct syntax for an if statement in JavaScript?", options: ["if x > 5 then", "if (x > 5)", "if x > 5:", "if {x > 5}"], correctAnswer: 1, concept: "If/Else", difficulty: 2, language: "JavaScript" },
  { question: "Which operator checks for both value AND type equality in JavaScript?", options: ["==", "===", "=", "!="], correctAnswer: 1, concept: "Comparison Operators", difficulty: 2, language: "JavaScript" },
  { question: "What does '5 > 3 && 2 < 4' evaluate to?", options: ["true", "false", "undefined", "null"], correctAnswer: 0, concept: "Boolean Logic", difficulty: 2, language: "JavaScript" },
  { question: "Which statement is used when none of the if/else if conditions are true?", options: ["default", "else", "otherwise", "final"], correctAnswer: 1, concept: "If/Else", difficulty: 2, language: "JavaScript" },

  // LEVEL 2: Conditionals - Python
  { question: "In Python, what comes after an if statement?", options: ["{", ":", "(", "["], correctAnswer: 1, concept: "If/Else", difficulty: 2, language: "Python" },
  { question: "Which keyword is used for alternative conditions in Python?", options: ["else if", "elseif", "elif", "otherwise"], correctAnswer: 2, concept: "If/Else", difficulty: 2, language: "Python" },
  { question: "What does 'not True' evaluate to in Python?", options: ["True", "False", "0", "1"], correctAnswer: 1, concept: "Boolean Logic", difficulty: 2, language: "Python" },
  { question: "Which operator checks if two values are equal in Python?", options: ["=", "==", "===", "is"], correctAnswer: 1, concept: "Comparison Operators", difficulty: 2, language: "Python" },

  // LEVEL 3: Loops - JavaScript
  { question: "Which loop is guaranteed to execute at least once?", options: ["for loop", "while loop", "do-while loop", "foreach loop"], correctAnswer: 2, concept: "Loops", difficulty: 3, language: "JavaScript" },
  { question: "What does 'break' do in a loop?", options: ["Skips current iteration", "Exits the loop completely", "Pauses the loop", "Restarts the loop"], correctAnswer: 1, concept: "Loop Control", difficulty: 3, language: "JavaScript" },
  { question: "What is the output of: for(let i=0; i<3; i++) console.log(i);", options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"], correctAnswer: 0, concept: "For Loops", difficulty: 3, language: "JavaScript" },
  { question: "Which statement skips the current iteration?", options: ["break", "continue", "skip", "next"], correctAnswer: 1, concept: "Loop Control", difficulty: 3, language: "JavaScript" },

  // LEVEL 3: Loops - Python
  { question: "Which loop in Python is used to iterate over a sequence?", options: ["while", "for", "do-while", "foreach"], correctAnswer: 1, concept: "Loops", difficulty: 3, language: "Python" },
  { question: "What does 'range(5)' produce in Python?", options: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[1,2,3,4]"], correctAnswer: 1, concept: "For Loops", difficulty: 3, language: "Python" },
  { question: "Which keyword exits a loop immediately in Python?", options: ["exit", "break", "stop", "end"], correctAnswer: 1, concept: "Loop Control", difficulty: 3, language: "Python" },
  { question: "What is the correct syntax for a while loop in Python?", options: ["while (x < 5):", "while x < 5:", "while {x < 5}:", "while x < 5 do:"], correctAnswer: 1, concept: "While Loops", difficulty: 3, language: "Python" },

  // LEVEL 4: Functions - JavaScript
  { question: "What keyword is used to define a function in JavaScript?", options: ["func", "function", "def", "method"], correctAnswer: 1, concept: "Functions", difficulty: 4, language: "JavaScript" },
  { question: "What does a function return if no return statement is specified?", options: ["null", "0", "undefined", "false"], correctAnswer: 2, concept: "Return Values", difficulty: 4, language: "JavaScript" },
  { question: "Which of these is a valid arrow function?", options: ["=> (x) {return x*2}", "(x) => x*2", "x -> x*2", "x => return x*2"], correctAnswer: 1, concept: "Functions", difficulty: 4, language: "JavaScript" },
  { question: "What is a closure in JavaScript?", options: ["A function that returns nothing", "A function with access to outer scope", "A function without parameters", "A recursive function"], correctAnswer: 1, concept: "Scope", difficulty: 4, language: "JavaScript" },

  // LEVEL 4: Functions - Python
  { question: "Which keyword is used to define a function in Python?", options: ["function", "def", "func", "define"], correctAnswer: 1, concept: "Functions", difficulty: 4, language: "Python" },
  { question: "What is returned if a Python function has no return statement?", options: ["0", "False", "None", "null"], correctAnswer: 2, concept: "Return Values", difficulty: 4, language: "Python" },
  { question: "How do you define a function parameter with a default value?", options: ["def func(x=5):", "def func(x default 5):", "def func(x := 5):", "def func(x: 5):"], correctAnswer: 0, concept: "Parameters", difficulty: 4, language: "Python" },
  { question: "What is *args used for in Python functions?", options: ["Fixed arguments", "Variable number of arguments", "Keyword arguments", "Return values"], correctAnswer: 1, concept: "Parameters", difficulty: 4, language: "Python" },

  // LEVEL 5: Arrays/Lists - JavaScript
  { question: "Which method adds an element to the end of a JavaScript array?", options: ["append()", "push()", "add()", "insert()"], correctAnswer: 1, concept: "Array Methods", difficulty: 5, language: "JavaScript" },
  { question: "What does array.map() do?", options: ["Filters elements", "Creates new array with transformed elements", "Sorts array", "Finds an element"], correctAnswer: 1, concept: "Array Methods", difficulty: 5, language: "JavaScript" },
  { question: "Which method removes the last element from an array?", options: ["pop()", "remove()", "delete()", "shift()"], correctAnswer: 0, concept: "Array Methods", difficulty: 5, language: "JavaScript" },
  { question: "What does array.filter() return?", options: ["First matching element", "Boolean", "New array with matching elements", "Index of element"], correctAnswer: 2, concept: "Array Methods", difficulty: 5, language: "JavaScript" },

  // LEVEL 5: Arrays/Lists - Python
  { question: "Which method adds an element to the end of a Python list?", options: ["push()", "add()", "append()", "insert()"], correctAnswer: 2, concept: "List Methods", difficulty: 5, language: "Python" },
  { question: "What does list.sort() return?", options: ["Sorted list", "New sorted list", "None", "True"], correctAnswer: 2, concept: "List Methods", difficulty: 5, language: "Python" },
  { question: "How do you access the last element of a list in Python?", options: ["list[-1]", "list[last]", "list.last()", "list[end]"], correctAnswer: 0, concept: "List Access", difficulty: 5, language: "Python" },
  { question: "What is list slicing [1:3] in Python?", options: ["Elements at index 1 and 3", "Elements from 1 to 3 (inclusive)", "Elements from index 1 to 2", "Elements after index 1"], correctAnswer: 2, concept: "List Slicing", difficulty: 5, language: "Python" },
];

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random questions based on level and language, excluding already asked
const getRandomQuestions = (level: number, language: string, excludeQuestions: Set<string>, count: number = 5): QuizQuestion[] => {
  const filteredQuestions = allQuizQuestions.filter(
    q => q.difficulty === level && q.language === language && !excludeQuestions.has(q.question)
  );
  const shuffled = shuffleArray(filteredQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const QuizGame = ({ level, onComplete, language: initialLanguage }: QuizGameProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage || "JavaScript");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
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

  useEffect(() => {
    if (quizStarted) {
      const randomQuestions = getRandomQuestions(level, selectedLanguage, askedQuestions, 5);
      setQuestions(randomQuestions);
      
      // Track new questions
      const newAskedQuestions = new Set(askedQuestions);
      randomQuestions.forEach((q) => newAskedQuestions.add(q.question));
      setAskedQuestions(newAskedQuestions);
    }
  }, [level, selectedLanguage, quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
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

  if (!quizStarted) {
    return (
      <Card className="shadow-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Level {level} Quiz</CardTitle>
          </div>
          <CardDescription>
            Select your programming language and start the quiz
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
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Quiz Features:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• No question repetition</li>
              <li>• 15-second timer per question</li>
              <li>• Level-appropriate difficulty</li>
              <li>• 4 options per question</li>
            </ul>
          </div>
          
          <Button onClick={startQuiz} className="w-full" size="lg" variant="gaming">
            <Zap className="mr-2 h-5 w-5" />
            Start Quiz
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
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading questions...</p>
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
        
        {isCorrect !== null && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className="font-semibold">
              {isCorrect ? '✅ Correct!' : '❌ Wrong answer! Game over.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
