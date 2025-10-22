import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Settings } from "lucide-react";

interface Suggestion {
  type: "variable" | "loop" | "condition" | "function" | "syntax" | "keyword";
  code: string;
  description: string;
  example?: string;
}

interface CodeSuggestionsProps {
  selectedLanguage: string;
  currentCode: string;
  onSuggestionClick: (code: string) => void;
}

const languageSuggestions: Record<string, Suggestion[]> = {
  "Python": [
    { type: "variable", code: "variable_name = ", description: "Assign a variable", example: "user_name = 'John'" },
    { type: "loop", code: "for item in items:\n    # code here", description: "For loop", example: "Iterate through items" },
    { type: "loop", code: "while condition:\n    # code here", description: "While loop", example: "Loop while condition is true" },
    { type: "condition", code: "if condition:\n    # code here", description: "If statement", example: "Execute code conditionally" },
    { type: "condition", code: "if condition:\n    # code here\nelse:\n    # else code", description: "If-else statement" },
    { type: "function", code: "def function_name():\n    # code here", description: "Function definition" },
    { type: "keyword", code: "import ", description: "Import module", example: "import math" },
    { type: "keyword", code: "class ClassName:\n    def __init__(self):\n        pass", description: "Class definition" },
  ],
  "Java": [
    { type: "variable", code: "int variableName = ", description: "Integer variable", example: "int age = 25;" },
    { type: "variable", code: "String variableName = ", description: "String variable", example: "String name = \"John\";" },
    { type: "loop", code: "for (int i = 0; i < length; i++) {\n    // code here\n}", description: "For loop" },
    { type: "loop", code: "while (condition) {\n    // code here\n}", description: "While loop" },
    { type: "condition", code: "if (condition) {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "public static void methodName() {\n    // code here\n}", description: "Method declaration" },
    { type: "keyword", code: "public class ClassName {\n    // code here\n}", description: "Class declaration" },
  ],
  "C++": [
    { type: "variable", code: "int variableName = ", description: "Integer variable", example: "int age = 25;" },
    { type: "variable", code: "string variableName = ", description: "String variable", example: "string name = \"John\";" },
    { type: "loop", code: "for (int i = 0; i < size; i++) {\n    // code here\n}", description: "For loop" },
    { type: "loop", code: "while (condition) {\n    // code here\n}", description: "While loop" },
    { type: "condition", code: "if (condition) {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "void functionName() {\n    // code here\n}", description: "Function declaration" },
    { type: "keyword", code: "#include <iostream>", description: "Include header", example: "Include standard library" },
  ],
  "C#": [
    { type: "variable", code: "int variableName = ", description: "Integer variable", example: "int age = 25;" },
    { type: "variable", code: "string variableName = ", description: "String variable", example: "string name = \"John\";" },
    { type: "loop", code: "for (int i = 0; i < length; i++) {\n    // code here\n}", description: "For loop" },
    { type: "loop", code: "foreach (var item in items) {\n    // code here\n}", description: "Foreach loop" },
    { type: "condition", code: "if (condition) {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "public void MethodName() {\n    // code here\n}", description: "Method declaration" },
    { type: "keyword", code: "using System;", description: "Using directive", example: "Import namespace" },
  ],
  "HTML": [
    { type: "syntax", code: "<div></div>", description: "Div element", example: "Container element" },
    { type: "syntax", code: "<p></p>", description: "Paragraph element" },
    { type: "syntax", code: "<h1></h1>", description: "Heading element" },
    { type: "syntax", code: "<a href=\"\"></a>", description: "Link element" },
    { type: "syntax", code: "<img src=\"\" alt=\"\">", description: "Image element" },
  ],
  "PHP": [
    { type: "variable", code: "$variableName = ", description: "Declare a variable", example: "$userName = 'John';" },
    { type: "loop", code: "for ($i = 0; $i < $length; $i++) {\n    // code here\n}", description: "For loop" },
    { type: "loop", code: "foreach ($array as $item) {\n    // code here\n}", description: "Foreach loop" },
    { type: "condition", code: "if ($condition) {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "function functionName() {\n    // code here\n}", description: "Function declaration" },
    { type: "keyword", code: "<?php\n// code here\n?>", description: "PHP tags" },
  ],
  "TypeScript": [
    { type: "variable", code: "let variableName: type = ", description: "Typed variable", example: "let userName: string = 'John';" },
    { type: "variable", code: "const constantName: type = ", description: "Typed constant" },
    { type: "function", code: "function functionName(): returnType {\n  // code here\n}", description: "Typed function" },
    { type: "keyword", code: "interface InterfaceName {\n  // properties\n}", description: "Interface definition" },
    { type: "keyword", code: "type TypeName = {\n  // properties\n}", description: "Type alias" },
  ],
  "JavaScript": [
    { type: "variable", code: "let variableName = ", description: "Variable declaration", example: "let userName = 'John';" },
    { type: "variable", code: "const constantName = ", description: "Constant declaration", example: "const PI = 3.14;" },
    { type: "loop", code: "for (let i = 0; i < length; i++) {\n  // code here\n}", description: "For loop" },
    { type: "loop", code: "for (const item of items) {\n  // code here\n}", description: "For...of loop" },
    { type: "loop", code: "while (condition) {\n  // code here\n}", description: "While loop" },
    { type: "condition", code: "if (condition) {\n  // code here\n}", description: "If statement" },
    { type: "condition", code: "if (condition) {\n  // code here\n} else {\n  // else code\n}", description: "If-else statement" },
    { type: "function", code: "function functionName() {\n  // code here\n}", description: "Function declaration" },
    { type: "function", code: "const functionName = () => {\n  // code here\n}", description: "Arrow function" },
    { type: "keyword", code: "class ClassName {\n  constructor() {\n    // code here\n  }\n}", description: "Class declaration" },
  ],
  "Go": [
    { type: "variable", code: "var variableName type = ", description: "Variable declaration", example: "var userName string = \"John\"" },
    { type: "variable", code: "variableName := ", description: "Short variable declaration" },
    { type: "loop", code: "for i := 0; i < length; i++ {\n    // code here\n}", description: "For loop" },
    { type: "condition", code: "if condition {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "func functionName() {\n    // code here\n}", description: "Function declaration" },
    { type: "keyword", code: "package main", description: "Package declaration" },
  ],
  "Rust": [
    { type: "variable", code: "let variable_name = ", description: "Immutable variable", example: "let user_name = \"John\";" },
    { type: "variable", code: "let mut variable_name = ", description: "Mutable variable" },
    { type: "loop", code: "for item in items {\n    // code here\n}", description: "For loop" },
    { type: "loop", code: "while condition {\n    // code here\n}", description: "While loop" },
    { type: "condition", code: "if condition {\n    // code here\n}", description: "If statement" },
    { type: "function", code: "fn function_name() {\n    // code here\n}", description: "Function declaration" },
    { type: "keyword", code: "use std::collections::HashMap;", description: "Use statement", example: "Import from standard library" },
  ]
};

export function CodeSuggestions({ selectedLanguage, currentCode, onSuggestionClick }: CodeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const baseSuggestions = languageSuggestions[selectedLanguage] || [];
    setSuggestions(baseSuggestions);
  }, [selectedLanguage]);

  const getAISuggestions = async () => {
    if (!currentCode.trim()) {
      return;
    }

    setIsLoadingAI(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/code-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code: currentCode, language: selectedLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get suggestions');
      }

      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error: any) {
      console.error('Error getting AI suggestions:', error);
      setAiSuggestions([`// Error: ${error.message}`]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const typeColors = {
    variable: "bg-blue-500/10 text-blue-700 border-blue-200",
    loop: "bg-green-500/10 text-green-700 border-green-200",
    condition: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    function: "bg-purple-500/10 text-purple-700 border-purple-200",
    syntax: "bg-pink-500/10 text-pink-700 border-pink-200",
    keyword: "bg-orange-500/10 text-orange-700 border-orange-200",
  };

  return (
    <div className="space-y-4">
      {/* Language-specific Suggestions */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            {selectedLanguage} Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                     onClick={() => onSuggestionClick(suggestion.code)}>
                  <Badge variant="outline" className={`text-xs ${typeColors[suggestion.type]}`}>
                    {suggestion.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{suggestion.description}</p>
                    <code className="text-xs text-muted-foreground bg-muted px-1 rounded">
                      {suggestion.code.split('\n')[0]}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-powered Suggestions */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Suggestions
            <Button 
              size="sm" 
              variant="outline" 
              onClick={getAISuggestions}
              disabled={isLoadingAI}
              className="ml-auto"
            >
              {isLoadingAI ? "Loading..." : "Get Suggestions"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aiSuggestions.length > 0 ? (
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} 
                     className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors text-sm border border-border/50"
                     onClick={() => onSuggestionClick(suggestion)}>
                  <code className="text-xs">{suggestion}</code>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click "Get Suggestions" for AI-powered code recommendations based on your current code.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}