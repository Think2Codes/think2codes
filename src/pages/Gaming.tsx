import { useState } from "react";
import { RunningGame } from "@/components/RunningGame";
import { AIQuizGame } from "@/components/AIQuizGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Code, Trophy } from "lucide-react";

export default function Gaming() {
  const [gameMode, setGameMode] = useState<"menu" | "running" | "quiz">("menu");
  const [level, setLevel] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);

  const handleQuizComplete = (passed: boolean) => {
    if (passed && level < 5) {
      setLevel(level + 1);
    }
    setTimeout(() => setGameMode("menu"), 2000);
  };

  if (gameMode === "running") {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setGameMode("menu")}
          >
            ← Back to Menu
          </Button>
          <RunningGame />
        </div>
      </div>
    );
  }

  if (gameMode === "quiz") {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-hero animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-4 transition-smooth hover-scale"
            onClick={() => setGameMode("menu")}
          >
            ← Back to Menu
          </Button>
          <AIQuizGame 
            level={level} 
            onComplete={handleQuizComplete} 
            language={selectedLanguage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-hero">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mx-auto">
            Gaming Zone
          </Badge>
          <h1 className="text-4xl font-bold">
            Choose Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Game Mode
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your coding skills through interactive challenges
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card hover:shadow-glow transition-smooth hover-scale cursor-pointer animate-fade-in" onClick={() => setGameMode("running")}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Gamepad2 className="h-12 w-12 text-accent animate-pulse" />
              </div>
              <CardTitle className="text-2xl">Running Game</CardTitle>
              <CardDescription>
                Dodge obstacles and answer quiz questions to survive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="gaming" className="w-full" size="lg">
                Start Running Game
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-smooth hover-scale cursor-pointer animate-fade-in" onClick={() => setGameMode("quiz")}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Code className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl">AI Quiz Challenge</CardTitle>
              <CardDescription>
                AI-powered programming quizzes with 3000+ unique questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Level:</span>
                <Badge variant="outline" className="text-lg">
                  <Trophy className="h-4 w-4 mr-1" />
                  Level {level}
                </Badge>
              </div>
              <Button variant="hero" className="w-full" size="lg">
                Start AI Quiz
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card bg-muted">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 text-center">Game Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">Running Game:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Upload your avatar</li>
                  <li>• Dodge obstacles</li>
                  <li>• Answer quiz questions</li>
                  <li>• Track your high score</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">AI Quiz Challenge:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• AI-generated questions</li>
                  <li>• 3000+ unique questions per language</li>
                  <li>• 15-second timer per question</li>
                  <li>• Multi-language support (9 languages)</li>
                  <li>• Level progression system</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
