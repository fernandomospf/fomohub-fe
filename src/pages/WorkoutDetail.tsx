import { useEffect, useState } from "react";
import { Play, Clock, Flame, Edit2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExerciseItem } from "@/components/workout/ExerciseItem";
import { RestTimer } from "@/components/workout/RestTimer";
import { Button } from "@/components/ui/button";
import workoutPlanService from "@/api/workout-plan";
import { Exercise } from "@/types/exercise";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";

type ExerciseState = Exercise & {
  completedSets: number;
};

export default function WorkoutDetail() {
  const { id } = useParams();

  const { startWorkout, endWorkout, activeWorkoutId } = useWorkoutSession();
  const [exercises, setExercises] = useState<ExerciseState[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [currentRestTime, setCurrentRestTime] = useState(60);

  // Local state for UI, but derived or synced with global could be better.
  // For now, let's allow local start to trigger global start.
  // If we assume only ONE workout active at a time:
  const isWorkoutStarted = activeWorkoutId === id;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadWorkoutDetail() {
      try {
        setLoading(true);

        const details = await workoutPlanService.getPlanById(id);

        if (!mounted) return;

        const mapped: ExerciseState[] = details.map((e) => ({
          ...e,
          completedSets: 0,
        }));

        setExercises(mapped);
      } catch (err) {
        console.error("[::WorkoutDetails::] - Erro ao buscar exercícios:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWorkoutDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleWeightChange = (exerciseId: string, weight: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId ? { ...e, weight } : e
      )
    );
  };

  const handleRestTimeChange = (exerciseId: string, restTime: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exerciseId
          ? { ...e, rest_time_seconds: restTime }
          : e
      )
    );
  };

  const handleCompleteSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e;
        if (e.completedSets >= e.sets) return e;

        setCurrentRestTime(e.rest_time_seconds);
        setShowTimer(true);

        return {
          ...e,
          completedSets: e.completedSets + 1,
        };
      })
    );
  };

  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSets = exercises.reduce(
    (acc, e) => acc + e.completedSets,
    0
  );
  const progress =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <MobileLayout>
      <PageHeader
        title="Treino A - Push"
        showBack
        rightElement={
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Edit2 className="w-5 h-5" />
          </Button>
        }
      />
      {showTimer && (
        <RestTimer
          initialTime={currentRestTime}
          onComplete={() => setShowTimer(false)}
          onSkip={() => setShowTimer(false)}
        />
      )}
      <div className="px-4 py-6 space-y-6">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">50min</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm">350 kcal</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold">
                {completedSets}/{totalSets} séries
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!isWorkoutStarted && (
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => {
                if (id) startWorkout(id);
              }}
              disabled={loading}
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Treino
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg">Exercícios</h3>

          {loading && (
            <p className="text-sm text-muted-foreground">
              Carregando exercícios...
            </p>
          )}

          {!loading && exercises.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum exercício encontrado.
            </p>
          )}

          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              weight={exercise.weight}
              restTime={exercise.rest_time_seconds}
              completedSets={exercise.completedSets}
              onWeightChange={(weight) =>
                handleWeightChange(exercise.id, weight)
              }
              onRestTimeChange={(time) =>
                handleRestTimeChange(exercise.id, time)
              }
              onComplete={() => handleCompleteSet(exercise.id)}
            />
          ))}
        </div>

        {progress === 100 && totalSets > 0 && (
          <div className="glass rounded-2xl p-6 text-center border-success/50">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Treino Concluído!</h3>
            <p className="text-muted-foreground mb-4">
              Parabéns! Você completou todas as séries.
            </p>
            <Button onClick={() => endWorkout()} variant="default" className="w-full">
              Finalizar Treino
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
