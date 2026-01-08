import { useState } from "react";
import { Play, Clock, Flame, Edit2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExerciseItem } from "@/components/workout/ExerciseItem";
import { RestTimer } from "@/components/workout/RestTimer";
import { Button } from "@/components/ui/button";

const exercisesData = [
  { id: 1, name: "Supino Reto com Barra", sets: 4, reps: 12, weight: 60, restTime: 60 },
  { id: 2, name: "Supino Inclinado com Halteres", sets: 4, reps: 10, weight: 24, restTime: 60 },
  { id: 3, name: "Crucifixo na Máquina", sets: 3, reps: 12, weight: 40, restTime: 60 },
  { id: 4, name: "Tríceps Corda", sets: 3, reps: 15, weight: 25, restTime: 45 },
  { id: 5, name: "Tríceps Francês", sets: 3, reps: 12, weight: 15, restTime: 45 },
];

export default function WorkoutDetail() {
  const { id } = useParams();
  const [exercises, setExercises] = useState(
    exercisesData.map((e) => ({ ...e, completedSets: 0 }))
  );
  const [showTimer, setShowTimer] = useState(false);
  const [currentRestTime, setCurrentRestTime] = useState(60);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSets = exercises.reduce((acc, e) => acc + e.completedSets, 0);
  const progress = (completedSets / totalSets) * 100;

  const handleCompleteSet = (exerciseId: number) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise && exercise.completedSets < exercise.sets) {
      setExercises((prev) =>
        prev.map((e) =>
          e.id === exerciseId
            ? { ...e, completedSets: e.completedSets + 1 }
            : e
        )
      );
      setCurrentRestTime(exercise.restTime);
      setShowTimer(true);
    }
  };

  const handleWeightChange = (exerciseId: number, weight: number) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === exerciseId ? { ...e, weight } : e))
    );
  };

  const handleRestTimeChange = (exerciseId: number, restTime: number) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === exerciseId ? { ...e, restTime } : e))
    );
  };

  if (showTimer) {
    return (
      <RestTimer
        initialTime={currentRestTime}
        onComplete={() => setShowTimer(false)}
        onSkip={() => setShowTimer(false)}
      />
    );
  }

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

      <div className="px-4 py-6 space-y-6">
        {/* Workout Info */}
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

          {/* Progress */}
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
              onClick={() => setIsWorkoutStarted(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Treino
            </Button>
          )}
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Exercícios</h3>
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              {...exercise}
              onComplete={() => handleCompleteSet(exercise.id)}
              onWeightChange={(weight) => handleWeightChange(exercise.id, weight)}
              onRestTimeChange={(time) => handleRestTimeChange(exercise.id, time)}
            />
          ))}
        </div>

        {progress === 100 && (
          <div className="glass rounded-2xl p-6 text-center border-success/50">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Treino Concluído!</h3>
            <p className="text-muted-foreground">
              Parabéns! Você completou todas as séries.
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
