import { useEffect, useState, useCallback, useRef } from "react";
import { Play, Clock, Flame, Check } from "lucide-react";
import { useRouter } from "next/router";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { ExerciseItem } from "@/components/organisms/workout/ExerciseItem";
import { RestTimer } from "@/components/organisms/workout/RestTimer";
import { Button } from "@/components/atoms/button";
import { Exercise } from "@/types/exercise";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";
import { Loading } from "@/components/atoms/Loading";
import { workoutPlanService } from "@/infra/container";
import { WorkoutComplete } from "@/components/organisms/TrainingFinishedModal";

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
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { startWorkout, endWorkout, activeWorkoutId } = useWorkoutSession();

  const [exercises, setExercises] = useState<ExerciseState[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentRestTime, setCurrentRestTime] = useState(60);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  const hasFinishedRef = useRef(false);
  const didRestoreSessionRef = useRef(false);

  const isWorkoutStarted = !!activeWorkoutId;

  const [workoutInfo, setWorkoutInfo] = useState<{
    id: string;
    name: string;
    calories: number;
    training_time: number;
    muscle_groups: string[];
    goals: string[];
    is_public: boolean;
  }>();

  const handleRestComplete = useCallback(() => {
    setShowTimer(false);
  }, []);

  const handleRestSkip = useCallback(() => {
    setShowTimer(false);
  }, []);

  const handleWeightChange = (exerciseId: string, weight: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.exercise_id === exerciseId ? { ...e, weight } : e
      )
    );
  };

  const handleRestTimeChange = (exerciseId: string, restTime: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.exercise_id === exerciseId
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

  const handleStartWorkout = async () => {
    if (!id) return;

    try {
      const session = await workoutPlanService.startWorkoutSession(id);

      const startedAt = Date.now();
      localStorage.setItem("workout_started_at", String(startedAt));
      localStorage.setItem("workout_session_id", session.id);

      startWorkout(session.id);
      setElapsedSeconds(0);
      hasFinishedRef.current = false;
    } catch (error) {
      console.error("Erro ao iniciar treino:", error);
    }
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkoutId) return;

    try {
      await workoutPlanService.finishWorkoutSession(activeWorkoutId);

      localStorage.removeItem("workout_started_at");
      localStorage.removeItem("workout_session_id");

      endWorkout();

      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setShowFinishedModal(true);
      }
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);
    }
  };

  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSets = exercises.reduce(
    (acc, e) => acc + e.completedSets,
    0
  );
  const totalReps = exercises.reduce(
    (acc, e) => acc + e.completedSets * e.reps,
    0
  );
  const totalExercises = exercises.length;

  const progress =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const formatElapsedTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadWorkoutDetail() {
      try {
        setLoading(true);

        const details = await workoutPlanService.getPlanById(id);
        if (!mounted) return;

        setWorkoutInfo({
          id: details.workout_plan_id,
          name: details.name,
          calories: details.calories,
          training_time: details.training_time,
          muscle_groups: details.muscle_groups,
          goals: details.goals,
          is_public: details.is_public,
        });

        let mappedExercises = (details.exercises ?? []).map((e) => ({
          ...e,
          workout_plan_id: details.workout_plan_id,
          updated_at: e.created_at,
          completedSets: 0,
        }));

        try {
          const activeSession =
            await workoutPlanService.getActiveWorkoutSession(id);

          if (!mounted) return;

          if (activeSession && !didRestoreSessionRef.current) {
            didRestoreSessionRef.current = true;
            startWorkout(activeSession.sessionId);

            const progressMap = new Map(
              activeSession.exercises.map((e) => [
                e.workout_exercise_id,
                e.completed_sets,
              ])
            );

            mappedExercises = mappedExercises.map((e) => ({
              ...e,
              completedSets: progressMap.get(e.exercise_id) ?? 0,
            }));
          }
        } catch {
          console.warn("Nenhuma sessão ativa");
        }

        setExercises(mappedExercises);
      } catch (err) {
        console.error("Erro ao carregar treino:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWorkoutDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    const startedAt = localStorage.getItem("workout_started_at");
    const sessionId = localStorage.getItem("workout_session_id");

    if (startedAt && sessionId) {
      const diff = Math.floor((Date.now() - Number(startedAt)) / 1000);
      setElapsedSeconds(diff);
      startWorkout(sessionId);
    }
  }, []);

  useEffect(() => {
    if (!isWorkoutStarted) return;

    const interval = setInterval(() => {
      const startedAt = localStorage.getItem("workout_started_at");
      if (!startedAt) return;

      const diff = Math.floor((Date.now() - Number(startedAt)) / 1000);
      setElapsedSeconds(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutStarted]);

  useEffect(() => {
    if (!isWorkoutStarted || hasFinishedRef.current) return;

    const allCompleted =
      exercises.length > 0 &&
      exercises.every((e) => e.completedSets >= e.sets);

    if (allCompleted) {
      handleFinishWorkout();
    }
  }, [exercises, isWorkoutStarted]);

  return (
    <MobileLayout>
      <PageHeader showBack />

      {loading ? (
        <Loading />
      ) : (
        <>
          {showTimer && (
            <RestTimer
              initialTime={currentRestTime}
              onComplete={handleRestComplete}
              onSkip={handleRestSkip}
            />
          )}

          {showFinishedModal && (
            <WorkoutComplete
              workoutName={workoutInfo?.name ?? ""}
              totalSets={totalSets}
              totalExercises={totalExercises}
              duration={formatElapsedTime(elapsedSeconds)}
              calories={workoutInfo?.calories || 0}
              onClose={() => setShowFinishedModal(false)}
            />
          )}

          <div className="px-4 py-6 space-y-6">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-lg text-muted-foreground">
                  {workoutInfo?.name}
                </span>
              </div>

              <div className="flex gap-4 my-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {workoutInfo?.training_time} min
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {workoutInfo?.calories} kcal
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">
                    {isWorkoutStarted
                      ? formatElapsedTime(elapsedSeconds)
                      : `${workoutInfo?.training_time}:00`}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>
                    {completedSets}/{totalSets} séries
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {!isWorkoutStarted ? (
                <Button className="w-full" size="lg" onClick={handleStartWorkout}>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Treino
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  variant="secondary"
                  onClick={handleFinishWorkout}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Concluir Treino
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Exercícios</h3>

              {exercises.map((exercise) => (
                <ExerciseItem
                  key={exercise.exercise_id}
                  id={exercise.exercise_id}
                  exerciseId={exercise.exercise_id}
                  workoutSessionId={activeWorkoutId!}
                  name={exercise.exercise_name}
                  sets={exercise.sets}
                  reps={exercise.reps}
                  weight={exercise.weight}
                  restTime={exercise.rest_time_seconds}
                  completedSets={exercise.completedSets}
                  onWeightChange={(weight) =>
                    handleWeightChange(exercise.exercise_id, weight)
                  }
                  onRestTimeChange={(time) =>
                    handleRestTimeChange(exercise.exercise_id, time)
                  }
                  onComplete={() =>
                    handleCompleteSet(exercise.exercise_id)
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
    </MobileLayout>
  );
}
