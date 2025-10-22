import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileCode, Search, Calendar, Trash2, Play, Mail, Users } from "lucide-react";
import { toast } from "sonner";

interface Project {
  code: string;
  timestamp: string;
  language: string;
  id?: string;
}

export default function Library() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const saved = localStorage.getItem("aicodeBuddyProjects");
    if (saved) {
      const projectsData = JSON.parse(saved);
      const projectsWithIds = projectsData.map((project: Project, index: number) => ({
        ...project,
        id: index.toString()
      }));
      setProjects(projectsWithIds);
    }
  };

  const deleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    localStorage.setItem("aicodeBuddyProjects", JSON.stringify(updatedProjects));
    toast.success("Project deleted from your library");
  };

  const openProject = (project: Project) => {
    // Store the project to be loaded
    localStorage.setItem("currentProject", JSON.stringify(project));
    navigate("/editor");
    toast.success(`Opening ${project.language} project`);
  };

  const getCodePreview = (code: string) => {
    return code.split('\n').slice(0, 3).join('\n') + (code.split('\n').length > 3 ? '...' : '');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredProjects = projects.filter(project =>
    project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 bg-gradient-hero">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Your Code Library</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            All your coding projects are automatically saved here. Browse, search, and continue working on your code.
          </p>
          
          {/* Team Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Built by Saif & Shan</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <a href="mailto:think2codes@gmail.com" className="hover:text-primary transition-smooth">
                think2codes@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by code or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">{projects.length}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-accent">
                {new Set(projects.map(p => p.language)).size}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Languages Used</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {projects.reduce((acc, p) => acc + p.code.split('\n').length, 0)}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Lines of Code</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project, index) => (
              <Card key={project.id || index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader className="pb-3 p-4 sm:p-6 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Project {index + 1}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">{project.language}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{formatDate(project.timestamp)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="bg-muted rounded-lg p-2 sm:p-3">
                    <pre className="text-[10px] sm:text-xs font-mono text-muted-foreground overflow-hidden">
                      {getCodePreview(project.code)}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => openProject(project)}
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Open
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteProject(index)}
                      className="px-2 sm:px-3"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <FileCode className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Start coding to automatically save your projects here!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/#code-editor">
                <Button variant="hero" className="text-sm sm:text-base">
                  Start Your First Project
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Try adjusting your search terms or create a new project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}