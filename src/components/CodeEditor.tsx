import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Save, Download, Sparkles, CheckCircle, AlertCircle, Code, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { CodeSuggestions } from "./CodeSuggestions";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIResponse {
  language: string;
  confidence: number;
  errors: Array<{
    line: number | null;
    severity: "error" | "warning" | "info";
    message: string;
    snippet: string | null;
  }>;
  corrected_code: string;
  explanation: string;
  one_line_summary: string;
  suggestions: string[];
}

export function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [code, setCode] = useState(`// Welcome to Think2codes!
// Write your code here and I'll help you fix any issues

function greetUser(name) {
  console.log("Hello, " + name + "!");
}

greetUser("Coder");`);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  // Load project from localStorage if available
  useEffect(() => {
    const currentProject = localStorage.getItem("currentProject");
    if (currentProject) {
      const project = JSON.parse(currentProject);
      setCode(project.code);
      setSelectedLanguage(project.language);
      localStorage.removeItem("currentProject"); // Clear after loading
    }
  }, []);
  
  const [output, setOutput] = useState("");
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const languages = [
    "JavaScript", "Java", "C++", "C#", "TypeScript", "Python", "PHP", "HTML", "Rust", "Go"
  ];

  // Auto-detect language from code
  const detectLanguage = (code: string): string => {
    if (code.includes('<?php') || code.includes('$_')) return 'PHP';
    if (code.includes('fn main') || code.includes('let mut')) return 'Rust';
    if (code.includes('func ') || code.includes('package main')) return 'Go';
    if (code.includes('public static void main') || code.includes('System.out')) return 'Java';
    if (code.includes('def ') || code.includes('print(')) return 'Python';
    if (code.includes('interface ') || code.includes(': ')) return 'TypeScript';
    if (code.includes('#include') || code.includes('std::')) return 'C++';
    if (code.includes('using System') || code.includes('Console.WriteLine')) return 'C#';
    return 'JavaScript';
  };

  const mockAIAnalysis = (): AIResponse => {
    return {
      language: selectedLanguage,
      confidence: 0.95,
      errors: [
        {
          line: 4,
          severity: "warning",
          message: "Consider using template literals for string concatenation",
          snippet: 'console.log("Hello, " + name + "!");'
        }
      ],
      corrected_code: `function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
}

greetUser("Coder");`,
      explanation: `I've improved your ${selectedLanguage} code by using template literals instead of string concatenation, which is more readable and performant in modern JavaScript.`,
      one_line_summary: "Improved string concatenation using template literals",
      suggestions: [
        "Add input validation for the name parameter",
        "Consider using arrow functions for modern syntax",
        "Add JSDoc comments for better documentation"
      ]
    };
  };

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realtime-code-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisResult = await response.json();
      setAiResponse(analysisResult);
      toast.success(analysisResult.one_line_summary || "AI analysis complete! ✨");
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || "Analysis failed. Please try again");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runCode = () => {
    try {
      let executionOutput = "";
      
      if (selectedLanguage === "JavaScript") {
        // Capture console.log outputs
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(String).join(' '));
          originalLog(...args);
        };
        
        try {
          // Execute the code - this allows loops, functions, etc.
          eval(code);
          executionOutput = logs.join("\n");
        } catch (execError: any) {
          executionOutput = `Error: ${execError.message}`;
        } finally {
          console.log = originalLog;
        }
      } else {
        executionOutput = `Code execution for ${selectedLanguage} - Output would appear here`;
      }
      
      setOutput(executionOutput || "Code executed successfully (no output)");
      toast.success("Code executed! Check the output panel below.");
    } catch (error: any) {
      setOutput(`Error: ${error.message || error}`);
      toast.error("Execution failed");
    }
  };

  const saveProject = () => {
    const projectData = {
      code,
      language: selectedLanguage,
      timestamp: new Date().toISOString(),
    };
    
    const saved = localStorage.getItem("aicodeBuddyProjects");
    const projects = saved ? JSON.parse(saved) : [];
    projects.push(projectData);
    localStorage.setItem("aicodeBuddyProjects", JSON.stringify(projects));
    
    toast.success("Project saved to your library!");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCode(code + "\n" + suggestion);
    toast.success("Code suggestion added!");
  };

  const applyCorrection = () => {
    if (aiResponse?.corrected_code) {
      setCode(aiResponse.corrected_code);
      toast.success("AI correction applied to your code!");
    }
  };

  const languageTemplates: Record<string, string> = {
    "JavaScript": `// JavaScript Template
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
}

greetUser("World");`,
    "Python": `# Python Template
def greet_user(name):
    print(f"Hello, {name}!")

greet_user("World")`,
    "Java": `// Java Template
public class HelloWorld {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}`,
    "C++": `// C++ Template
#include <iostream>
#include <string>

int main() {
    std::string name = "World";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
    "C#": `// C# Template
using System;

class Program {
    static void Main() {
        string name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
}`,
    "HTML/CSS": `<!-- HTML/CSS Template -->
<!DOCTYPE html>
<html>
<head>
    <style>
        .greeting {
            color: blue;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <h1 class="greeting">Hello, World!</h1>
</body>
</html>`,
    "React": `// React Template
import React from 'react';

function Greeting({ name = "World" }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
}

export default Greeting;`,
    "TypeScript": `// TypeScript Template
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user: User = { name: "World", age: 25 };
console.log(greetUser(user));`,
    "Go": `// Go Template
package main

import "fmt"

func greetUser(name string) {
    fmt.Printf("Hello, %s!\\n", name)
}

func main() {
    greetUser("World")
}`,
    "PHP": `<?php
// PHP Template
function greetUser($name) {
    echo "Hello, " . $name . "!\\n";
}

greetUser("World");
?>`,
    "Rust": `// Rust Template
fn greet_user(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    greet_user("World");
}`
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(languageTemplates[language] || "// Start coding here...");
    setAiResponse(null);
    setOutput("");
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'max-w-7xl mx-auto'} p-4 sm:p-6 space-y-4 sm:space-y-6 transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold">Code Editor</h2>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="hero" size="sm" onClick={analyzeCode} disabled={isAnalyzing} className="flex-1 sm:flex-none">
            <Sparkles className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Get AI Suggestions"}
          </Button>
          <Button variant="gaming" size="sm" onClick={runCode} className="flex-1 sm:flex-none">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button variant="outline" size="sm" onClick={saveProject} className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Mobile Layout: Code Editor above, Output below */}
      {isMobile ? (
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>Code Input - {selectedLanguage}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onDoubleClick={() => setIsFullscreen(!isFullscreen)}
                className={`w-full ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64'} font-mono text-xs resize-none`}
                placeholder={`Write your ${selectedLanguage} code here... (Double-click for fullscreen)`}
              />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-0">
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs">AI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="output" className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Console Output</h3>
                    <div className="bg-muted p-3 rounded-lg min-h-32 font-mono text-xs">
                      {output || "Run your code to see output here..."}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="p-4">
                  {aiResponse ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <h3 className="font-semibold text-sm">AI Analysis Complete</h3>
                      </div>
                      
                      {aiResponse.errors.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium">Issues Found:</h4>
                          {aiResponse.errors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                              <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-medium">Line {error.line}: {error.message}</p>
                                {error.snippet && (
                                  <code className="text-[10px] bg-background p-1 rounded mt-1 block break-all">
                                    {error.snippet}
                                  </code>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium">Explanation:</h4>
                        <p className="text-xs text-muted-foreground">{aiResponse.explanation}</p>
                      </div>
                      
                      {aiResponse.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium">Suggestions:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {aiResponse.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button variant="code" size="sm" className="w-full text-xs" onClick={applyCorrection}>
                        <Download className="h-3 w-3 mr-2" />
                        Apply Corrections
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-50" />
                      <p className="text-xs">Run AI Analysis to get feedback on your code</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <CodeSuggestions 
            selectedLanguage={selectedLanguage}
            currentCode={code}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      ) : (
        /* Desktop/Tablet Layout: Resizable panels */
        <div className="space-y-4">
          <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <Card className="h-full border-0 rounded-none shadow-none">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <span>Code Input - {selectedLanguage}</span>
                    </div>
                    {aiResponse && (
                      <Badge variant="secondary" className="text-sm">
                        {aiResponse.language} - {Math.round(aiResponse.confidence * 100)}% confidence
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[calc(100%-5rem)]">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onDoubleClick={() => setIsFullscreen(!isFullscreen)}
                    className={`w-full ${isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-full'} font-mono text-sm resize-none`}
                    placeholder={`Write your ${selectedLanguage} code here... (Double-click for fullscreen)`}
                  />
                  {isFullscreen && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Double-click again to exit fullscreen
                    </p>
                  )}
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Output Panel */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <Card className="h-full border-0 rounded-none shadow-none">
                <CardContent className="p-0 h-full">
                  <Tabs defaultValue="output" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="output" className="text-sm">Output</TabsTrigger>
                      <TabsTrigger value="ai" className="text-sm">AI Analysis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="output" className="p-6 flex-1 overflow-auto">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-base">Console Output</h3>
                        <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm whitespace-pre-wrap">
                          {output || "Run your code to see output here..."}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ai" className="p-6 flex-1 overflow-auto">
                      {aiResponse ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-accent" />
                            <h3 className="font-semibold text-base">AI Analysis Complete</h3>
                          </div>
                          
                          {aiResponse.errors.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Issues Found:</h4>
                              {aiResponse.errors.map((error, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <div className="text-sm">
                                    <p className="font-medium">Line {error.line}: {error.message}</p>
                                    {error.snippet && (
                                      <code className="text-xs bg-background p-1 rounded mt-1 block break-all">
                                        {error.snippet}
                                      </code>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Explanation:</h4>
                            <p className="text-sm text-muted-foreground">{aiResponse.explanation}</p>
                          </div>
                          
                          {aiResponse.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Suggestions:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {aiResponse.suggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button variant="code" size="sm" className="w-full text-sm" onClick={applyCorrection}>
                            <Download className="h-4 w-4 mr-2" />
                            Apply Corrections
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Run AI Analysis to get feedback on your code</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>

          <CodeSuggestions 
            selectedLanguage={selectedLanguage}
            currentCode={code}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      )}
    </div>
  );
}