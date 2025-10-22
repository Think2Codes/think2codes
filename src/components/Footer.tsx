import { Mail, Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Our Team
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Shan - Lead Developer
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Saif - Co-Developer
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Us
            </h3>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:think2codes@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-smooth block"
              >
                think2codes@gmail.com
              </a>
              <a 
                href="/contact" 
                className="text-muted-foreground hover:text-primary transition-smooth block"
              >
                Contact Page
              </a>
              <a 
                href="https://www.linkedin.com/company/think2codes" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-smooth block"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Think2codes</h3>
            <p className="text-sm text-muted-foreground">
              Your intelligent coding companion powered by AI. Learn, code, and level up your programming skills with real-time assistance.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Think2codes. Built with ❤️ by Saif & Shan</p>
        </div>
      </div>
    </footer>
  );
}
