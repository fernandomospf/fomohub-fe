import { useEffect, useRef, useState } from "react";
import { Plus, Minus, SkipForward } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface RestTimerProps {
  initialTime: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ initialTime, onComplete, onSkip }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  }, [initialTime]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, onComplete]);

  const addTime = (seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds));
  };

  const progress =
    initialTime > 0
      ? ((initialTime - timeLeft) / initialTime) * 100
      : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      {/* TEXTO RESTAURADO */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-lg mb-2">
          Tempo de Descanso
        </p>
        <p className="text-sm text-muted-foreground">
          Descanse e prepare-se para a próxima série
        </p>
      </div>

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
            stroke="hsl(258 90% 66%)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" size="lg" onClick={() => addTime(-15)}>
          <Minus className="w-5 h-5 mr-2" /> 15s
        </Button>

        <Button
          variant={isPaused ? "gradient" : "secondary"}
          size="lg"
          onClick={() => setIsPaused((p) => !p)}
        >
          {isPaused ? "Continuar" : "Pausar"}
        </Button>

        <Button variant="secondary" size="lg" onClick={() => addTime(15)}>
          <Plus className="w-5 h-5 mr-2" /> 15s
        </Button>
      </div>

      <Button variant="ghost" size="lg" onClick={onSkip}>
        <SkipForward className="w-5 h-5 mr-2" />
        Pular Descanso
      </Button>
    </div>
  );
}
