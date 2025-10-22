import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Code, Zap, Trophy, BookOpen, Users, ArrowRight, Brain, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { CodeEditor } from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");

  const handleAIConnect = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to connect AI Analytics.",
        variant: "destructive"
      });
      return;
    }
    
    // Save API key to localStorage for now
    localStorage.setItem("openai_api_key", apiKey);
    
    toast({
      title: "AI Analytics Connected! 🤖",
      description: "Your OpenAI API key has been configured successfully.",
    });
  };
  const features = [{
    icon: <Code className="h-8 w-8" />,
    title: "Smart Code Analysis",
    description: "AI-powered code review with instant feedback and corrections"
  }, {
    icon: <Zap className="h-8 w-8" />,
    title: "Real-time Learning",
    description: "Learn as you code with intelligent suggestions and explanations"
  }, {
    icon: <Trophy className="h-8 w-8" />,
    title: "Gamified Progress",
    description: "Level up your skills through challenges and achievements"
  }, {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Project Library",
    description: "Save and organize all your coding projects in one place"
  }, {
    icon: <Brain className="h-8 w-8" />,
    title: "AI Analytics",
    description: "Advanced AI-powered code analytics with OpenAI integration"
  }];

  const languages = ["JavaScript", "Python", "Java", "C++", "C#", "HTML", "PHP", "TypeScript", "Go", "Rust"];
  
  const heroSlides = [
    {
      title: "Master Coding with AI Guidance",
      description: "Write code, get instant AI feedback, and level up your programming skills through gamified learning experiences.",
      icon: <Code className="h-16 w-16" />
    },
    {
      title: "Real-time Code Analysis",
      description: "Our AI analyzes your code in real-time, providing instant feedback and corrections to help you learn faster.",
      icon: <Zap className="h-16 w-16" />
    },
    {
      title: "Gamified Learning Experience",
      description: "Unlock achievements, level up your skills, and compete with other developers in our interactive coding challenges.",
      icon: <Trophy className="h-16 w-16" />
    }
  ];

  return <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section with Video */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-programmer-working-on-code-at-night-4427-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Content at top */}
          <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
            <Badge variant="secondary" className="w-fit mx-auto text-xs sm:text-sm">
              AI-Powered Learning Platform
            </Badge>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full" onClick={() => window.location.hash = '#code-editor'}>
                  <span className="text-sm sm:text-base">Start Coding Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/gaming" className="w-full sm:w-auto">
                <Button variant="gaming" size="xl" className="w-full">
                  <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Gaming Mode</span>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 justify-center px-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Supported languages:</span>
              {languages.slice(0, 4).map(lang => <Badge key={lang} variant="outline" className="text-[10px] sm:text-xs">
                  {lang}
                </Badge>)}
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                +{languages.length - 4} more
              </Badge>
            </div>
          </div>

          {/* Slider replacing image */}
          <div className="relative max-w-4xl mx-auto px-4">
            <Carousel className="w-full">
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                        <div className="p-3 sm:p-4 bg-gradient-primary rounded-full text-primary-foreground">
                          {slide.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                          {slide.title}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                          {slide.description}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Why Choose Think2codes?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Experience the future of coding education with AI-powered assistance, 
              gamified learning, and a community of passionate developers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {features.slice(0, 4).map((feature, index) => (
              <Card key={index} className="shadow-card border-border/50 hover:shadow-glow transition-smooth">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto p-2 sm:p-3 bg-gradient-primary rounded-lg w-fit text-primary-foreground mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="text-center text-xs sm:text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
            
            {/* AI Analytics Card with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="shadow-card border-border/50 hover:shadow-glow transition-smooth cursor-pointer">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <div className="mx-auto p-2 sm:p-3 bg-gradient-primary rounded-lg w-fit text-primary-foreground mb-3 sm:mb-4">
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">AI Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="text-center text-xs sm:text-sm">
                      Advanced AI-powered code analytics with OpenAI integration
                    </CardDescription>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg">Connect AI Analytics</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Enter your OpenAI API key to enable advanced AI-powered code analytics.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">OpenAI API Key</label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <Button onClick={handleAIConnect} className="w-full text-xs sm:text-sm">
                    <Key className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Connect AI Analytics
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Lines of Code Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-accent">500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">10</div>
              <div className="text-sm sm:text-base text-muted-foreground">Programming Languages</div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Code Editor Section */}
      <section id="code-editor" className="py-12 sm:py-16 lg:py-5 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Start Coding Now
            </h2>
          </div>
          <CodeEditor />
        </div>
      </section>
    </div>;
}