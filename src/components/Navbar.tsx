import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./UserProfile";
import { AuthDialog } from "./AuthDialog";
import logo  from "../assets/think2codes.jpg"
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Library", path: "/library" },
    { name: "Game", path: "/gaming" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <img src="think2codes.jpg" className="w-10 h-10 bg-gradient-primary rounded-lg shadow-glow group-hover:scale-105 transition-smooth" alt="" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Think2codes
            </span>
          </NavLink>
        </div>
        {/* Middle: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right: Auth and Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsAuthOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}

          {/* Menu Button - Only on Mobile/Tablet */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-background border-b border-border md:hidden">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </header>
  );
}
