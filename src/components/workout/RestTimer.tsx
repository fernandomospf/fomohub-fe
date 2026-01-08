import { useState, useEffect } from "react";
import { X, Plus, Minus, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  initialTime: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ initialTime, onComplete, onSkip }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  
  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onComplete]);

  const addTime = (seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-lg mb-2">Tempo de Descanso</p>
        <p className="text-sm text-muted-foreground">
          Descanse e prepare-se para a próxima série
        </p>
      </div>

      {/* Circular Progress */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-secondary"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(258 90% 66%)" />
              <stop offset="100%" stopColor="hsl(231 91% 65%)" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold animate-timer-pulse">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => addTime(-15)}
          className="rounded-full"
        >
          <Minus className="w-5 h-5 mr-2" />
          15s
        </Button>
        
        <Button
          variant={isPaused ? "gradient" : "secondary"}
          size="lg"
          onClick={() => setIsPaused(!isPaused)}
          className="rounded-full px-8"
        >
          {isPaused ? "Continuar" : "Pausar"}
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          onClick={() => addTime(15)}
          className="rounded-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          15s
        </Button>
      </div>

      <Button
        variant="ghost"
        size="lg"
        onClick={onSkip}
        className="text-muted-foreground"
      >
        <SkipForward className="w-5 h-5 mr-2" />
        Pular Descanso
      </Button>
    </div>
  );
}
