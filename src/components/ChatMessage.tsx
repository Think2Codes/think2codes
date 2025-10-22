import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isUser ? "bg-secondary/50" : "bg-card"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-muted" : "bg-gradient-primary shadow-glow"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        )}
      </div>
      
      <div className="flex-1 pt-1">
        <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
