import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, Code, Trophy, Heart, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const team = [
    {
      name: "Shan Ali Umar",
      role: "Frontend Developer",
      description: `who creates modern, responsive, and visually appealing web experiences.`,
      avatar: "SAU"
    },
    {
      name: "Saif kaleem",
      role: "Frontend Developer",
      description: `who creates modern, responsive, and visually appealing web experiences.`,
      avatar: "SK"
    }
  ];

  const stats = [
    { number: "50K+", label: "Lines of Code Analyzed" },
    { number: "1,200+", label: "Active Learners" },
    { number: "8", label: "Programming Languages" },
    { number: "95%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-hero">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="w-fit mx-auto">
            About Think2codes
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">
            Revolutionizing Code Education with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make programming accessible to everyone through
            intelligent tutoring, gamified learning, and instant feedback systems.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Programming shouldn't be a barrier to innovation. We believe that with the right
              guidance and intelligent feedback, anyone can learn to code effectively.
            </p>
            <p className="text-lg text-muted-foreground">
              Think2codes combines cutting-edge artificial intelligence with proven educational
              methodologies to create a personalized learning experience that adapts to each
              student's pace and style.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-card text-center">
              <CardContent className="pt-6">
                <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">AI-powered code review</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Gamification</h3>
                <p className="text-sm text-muted-foreground">Learn through play</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">Learn together</p>
              </CardContent>
            </Card>
            <Card className="shadow-card text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold">Real-time</h3>
                <p className="text-sm text-muted-foreground">Instant feedback</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate developers, educators, and AI researchers working together
              to transform how people learn programming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-center">
            {team.map((member, index) => (
              <Card key={index} className="shadow-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Accessibility First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe everyone deserves access to quality programming education,
                  regardless of their background or experience level.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Zap className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of educational technology,
                  leveraging AI to create better learning experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learning is better together. We foster a supportive community
                  where learners can grow and help each other succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center space-y-6 bg-muted/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions or want to contribute? We'd love to hear from you!
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.linkedin.com/in/think2-codes-281686389/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}