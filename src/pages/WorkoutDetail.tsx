import { useEffect, useState } from "react";
import { Play, Clock, Flame } from "lucide-react";
import { useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExerciseItem } from "@/components/workout/ExerciseItem";
import { RestTimer } from "@/components/workout/RestTimer";
import { Button } from "@/components/ui/button";
import workoutPlanService from "@/api/workout-plan";
import { Exercise } from "@/types/exercise";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";
import { Loading } from "@/components/Loading";

type ExerciseState = Exercise & {
  completedSets: number;
  created_at: string;
  exercise_id: string;
  exercise_name: string;
  reps: number;
  rest_time_seconds: number;
  sets: number;
  updated_at: string;
  weight: number;
  workout_plan_id: string;
};

export default function WorkoutDetail() {
  const { id } = useParams();
  const { startWorkout, endWorkout, activeWorkoutId } = useWorkoutSession();
  const [exercises, setExercises] = useState<ExerciseState[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [workoutInfo, setWorkoutInfo] = useState<{
    id: string,
    name: string,
    calories: number,
    training_time: number,
    muscle_groups: string[],
    goals: string[],
    is_public: boolean,
  }>();
  const [currentRestTime, setCurrentRestTime] = useState(60);
  const isWorkoutStarted = activeWorkoutId === id;
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadWorkoutDetail() {
      try {
        setLoading(true);

        const details = await workoutPlanService.getPlanById(id);
        setWorkoutInfo({
          id: details.workout_plan_id,
          name: details.name,
          calories: details.calories,
          training_time: details.training_time,
          muscle_groups: details.muscle_groups,
          goals: details.goals,
          is_public: details.is_public
        })
        if (!mounted) return;

        const mapped = (details.exercises ?? []).map((e) => ({
          ...e,
          workout_plan_id: details.workout_plan_id,
          updated_at: e.created_at,
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
        if (e.exercise_id !== exerciseId) return e;

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

  const formatElapsedTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };


  useEffect(() => {
    if (!isWorkoutStarted) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutStarted]);

  useEffect(() => {
    if (progress === 100 && isWorkoutStarted) {
      endWorkout();
    }
  }, [progress, isWorkoutStarted, endWorkout]);

  return (
    <MobileLayout>
      <PageHeader
        showBack
      />
      {
        loading ? (<Loading />) : (
          <>
            {
              showTimer && (
                <RestTimer
                  initialTime={currentRestTime}
                  onComplete={() => setShowTimer(false)}
                  onSkip={() => setShowTimer(false)}
                />
              )
            }
            <div className="px-4 py-6 space-y-6" id={workoutInfo?.id}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <label className="text-lg text-muted-foreground mb-2 block">
                    {workoutInfo?.name}
                  </label>
                  <label className="text-sm text-muted-foreground">
                    {isWorkoutStarted ? "Tempo decorrido" : "Tempo estimado"}
                  </label>
                  <span className="text-sm">
                    {isWorkoutStarted
                      ? formatElapsedTime(elapsedSeconds)
                      : `${workoutInfo?.training_time} min`}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {workoutInfo?.training_time} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">
                      {workoutInfo?.calories} kcal
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-sm text-muted-foreground">
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
                    name={exercise?.exercise_name}
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
                    onComplete={() => handleCompleteSet(exercise.exercise_id)}
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
          </>
        )
      }
    </MobileLayout>
  );
}
