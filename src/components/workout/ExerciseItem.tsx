import { useState } from "react";
import { Check, Minus, Plus, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  completedSets: number;
  onComplete: () => void;
  onWeightChange: (weight: number) => void;
  onRestTimeChange: (time: number) => void;
}

interface HistorySet {
  series: number;
  reps: number;
  weight: string;
}

interface HistorySession {
  date: string;
  sets: HistorySet[];
}

const MOCK_HISTORY: HistorySession[] = [
  {
    date: "15/01/2026",
    sets: [
      { series: 1, reps: 12, weight: "100kg" },
      { series: 2, reps: 10, weight: "105kg" },
      { series: 3, reps: 8, weight: "110kg" },
    ],
  },
  {
    date: "12/01/2026",
    sets: [
      { series: 1, reps: 12, weight: "95kg" },
      { series: 2, reps: 12, weight: "95kg" },
      { series: 3, reps: 12, weight: "95kg" },
    ],
  },
  {
    date: "10/01/2026",
    sets: [
      { series: 1, reps: 15, weight: "90kg" },
      { series: 2, reps: 12, weight: "95kg" },
      { series: 3, reps: 10, weight: "100kg" },
    ],
  },
];

export function ExerciseItem({
  name,
  sets,
  reps,
  weight,
  restTime,
  completedSets,
  onComplete,
  onWeightChange,
  onRestTimeChange,
}: ExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(2);
  const isCompleted = completedSets >= sets;
  const progress = (completedSets / sets) * 100;

  return (
    <div
      className={cn(
        "rounded-2xl glass p-4 transition-all duration-300",
        isCompleted && "border-success/50 bg-success/10"
      )}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">{name}</h4>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              isCompleted
                ? "bg-success text-success-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-xs font-bold">
                {completedSets}/{sets}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{sets} séries</span>
          <span>×</span>
          <span>{reps} reps</span>
          <span>•</span>
          <span>{weight}kg</span>
        </div>

        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Carga (kg)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => onWeightChange(Math.max(0, weight - 2.5))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="flex-1 text-center font-bold">{weight}</span>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => onWeightChange(weight + 2.5)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Descanso (seg)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => onRestTimeChange(Math.max(15, restTime - 15))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="flex-1 text-center font-bold">{restTime}</span>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => onRestTimeChange(restTime + 15)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {!isCompleted && (
            <Button
              variant="gradient"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Concluir Série {completedSets + 1}
            </Button>
          )}
        </div>
      )}
      {isExpanded && (
        <div className="mt-4">
          <label className="text-s text-muted-foreground mb-2 block">
            Histórico de exercícios
          </label>
          <ul style={{ listStyle: "none" }}>
            {MOCK_HISTORY.slice(0, visibleHistoryCount).map((session, sessionIndex) => (
              <li key={sessionIndex} className="flex flex-col gap-2 text-xs mb-4">
                <div className="font-semibold text-muted-foreground">
                  Data: {session.date}
                </div>
                <div className="pl-2 flex flex-col gap-2">
                  {session.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex gap-3 text-muted-foreground">
                      <span className="w-16">Série: {set.series}</span>
                      <span className="w-16">Reps: {set.reps}</span>
                      <span className="w-20">Carga: {set.weight}</span>
                    </div>
                  ))}
                </div>
                {sessionIndex <
                  Math.min(visibleHistoryCount, MOCK_HISTORY.length) - 1 && (
                    <hr className="mt-2 text-border" />
                  )}
              </li>
            ))}
          </ul>
          {visibleHistoryCount < MOCK_HISTORY.length && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-primary"
              onClick={() => setVisibleHistoryCount((prev) => prev + 2)}
            >
              Ver mais histórico
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
