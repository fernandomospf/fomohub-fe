import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import workoutPlanService, { ExerciseHistory } from "@/api/workout-plan";

interface ExerciseItemProps {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  completedSets: number;
  exerciseId: string;
  workoutSessionId: string | null;
  onComplete: () => void;
  onWeightChange: (weight: number) => void;
  onRestTimeChange: (time: number) => void;
}

export function ExerciseItem({
  workoutSessionId,
  name,
  sets,
  reps,
  weight,
  restTime,
  completedSets,
  exerciseId,
  onComplete,
  onWeightChange,
  onRestTimeChange,
}: ExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(2);
  const [history, setHistory] = useState<ExerciseHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const isCompleted = completedSets >= sets;
  const progress = sets > 0 ? (completedSets / sets) * 100 : 0;
  const canCompleteSet = Boolean(workoutSessionId);

  const handleCompleteSet = async () => {
    if (!workoutSessionId) return;

    try {
      await workoutPlanService.addSetToSession(workoutSessionId, {
        workout_exercise_id: exerciseId,
        set_number: completedSets + 1,
        reps,
        weight,
        rest_seconds: restTime,
      });

      onComplete();
    } catch (error) {
      console.error("[ExerciseItem] Erro ao concluir série:", error);
    }
  };

  useEffect(() => {
    if (!isExpanded || history || loadingHistory) return;

    async function loadHistory() {
      try {
        setLoadingHistory(true);
        const data = await workoutPlanService.getExerciseHistory(exerciseId);
        setHistory(data?.[0] ?? null);
      } catch (err) {
        console.error("[ExerciseItem] erro ao carregar histórico", err);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [exerciseId, isExpanded, history, loadingHistory]);

  return (
    <div
      className={cn(
        "rounded-2xl glass p-4 transition-all duration-300",
        isCompleted && "border-success/50 bg-success/10"
      )}
    >
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg text-muted-foreground">{name}</h4>

          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
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
            className="h-full gradient-primary transition-all"
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
              disabled={!canCompleteSet}
              onClick={handleCompleteSet}
            >
              <Check className="w-4 h-4 mr-2" />
              {canCompleteSet
                ? `Concluir Série ${completedSets + 1}`
                : "Inicie o treino para registrar séries"}
            </Button>
          )}

          {history?.history?.length > 0 && (
            <div className="mt-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Histórico de exercícios
              </label>

              <ul className="space-y-4">
                {history.history
                  .slice(0, visibleHistoryCount)
                  .map((session, idx) => (
                    <li key={idx} className="text-xs">
                      <div className="font-semibold text-muted-foreground mb-2">
                        Data: {session.date}
                      </div>

                      <div className="pl-2 space-y-1">
                        {session.sets.map((set) => (
                          <div key={set.set} className="flex gap-4">
                            <span className="text-muted-foreground">Série: {set.set}</span>
                            <span className="text-muted-foreground">Reps: {set.reps}</span>
                            <span className="text-muted-foreground">Carga: {set.weight}kg</span>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>

              {visibleHistoryCount < history.history.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-primary"
                  onClick={() =>
                    setVisibleHistoryCount((prev) => prev + 2)
                  }
                >
                  Ver mais histórico
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
