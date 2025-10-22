import { Button } from "@/components/ui/button";
import { Sparkles, Menu, Share2, Youtube, Facebook, Linkedin, Github } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Lovable Clone</span>
        </div>
        
        {/* Social Media Icons */}
        <div className="hidden md:flex items-center gap-2 ml-6 border-l border-border pl-6">
          <a 
            href="https://youtube.com/@think2codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <Youtube className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </a>
          <a 
            href="https://tiktok.com/@think2codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <svg className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://facebook.com/think2codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </a>
          <a 
            href="https://www.linkedin.com/in/think2-codes-281686389/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </a>
          <a 
            href="https://twitter.com/think2codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <svg className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/Think2Codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-smooth hover:scale-110"
          >
            <Github className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Menu className="w-4 h-4" />
        </Button>
        <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90">
          <Share2 className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </header>
  );
};
