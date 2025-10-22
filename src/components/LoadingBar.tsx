import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 200);
    const timer3 = setTimeout(() => setProgress(90), 300);
    const timer4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
      style={{
        opacity: loading ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div
        className="h-full bg-gradient-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px hsl(var(--primary))",
        }}
      />
    </div>
  );
}
