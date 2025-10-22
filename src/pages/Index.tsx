import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-1/2 border-r border-border">
          <ChatPanel />
        </div>
        
        <div className="hidden md:block w-1/2">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
