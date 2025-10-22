import { Code2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PreviewPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Preview
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Code2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden bg-gradient-secondary shadow-soft p-8 border border-border">
            <div className="absolute inset-0 bg-gradient-accent opacity-50"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-block">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-clip-text">
                Welcome to Your App
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start building your amazing project with AI assistance. Just describe what you want, and watch it come to life in real-time.
              </p>

              <div className="flex gap-4 justify-center pt-4">
                <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  Get Started
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Fast Development", desc: "Build apps in minutes, not hours" },
              { title: "AI Powered", desc: "Intelligent code generation" },
              { title: "Live Preview", desc: "See changes instantly" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
