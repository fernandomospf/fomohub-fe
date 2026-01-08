import { useState } from "react";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}

export default function NewWorkout() {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: "", sets: 3, reps: 12, weight: 0, restTime: 60 },
  ]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: "",
      sets: 3,
      reps: 12,
      weight: 0,
      restTime: 60,
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((e) => e.id !== id));
    }
  };

  const updateExercise = (id: number, field: keyof Exercise, value: string | number) => {
    setExercises(
      exercises.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  const handleSave = () => {
    // Save workout logic
    navigate("/workouts");
  };

  return (
    <MobileLayout hideNav>
      <PageHeader
        title="Nova Ficha"
        showBack
        rightElement={
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSave}
            disabled={!workoutName || exercises.some((e) => !e.name)}
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Workout Name */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Nome do Treino
          </label>
          <Input
            placeholder="Ex: Treino A - Push"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Exercícios</h3>
            <span className="text-sm text-muted-foreground">
              {exercises.length} exercício{exercises.length !== 1 && "s"}
            </span>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="glass rounded-xl p-4 animate-scale-in"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                  <Input
                    placeholder="Nome do exercício"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(exercise.id, "name", e.target.value)
                    }
                    className="flex-1 h-10 bg-secondary border-0 rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeExercise(exercise.id)}
                    className={cn(
                      "text-muted-foreground hover:text-destructive",
                      exercises.length === 1 && "opacity-50 pointer-events-none"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Séries
                    </label>
                    <Input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(exercise.id, "sets", parseInt(e.target.value) || 0)
                      }
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Reps
                    </label>
                    <Input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(exercise.id, "reps", parseInt(e.target.value) || 0)
                      }
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Carga (kg)
                    </label>
                    <Input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) =>
                        updateExercise(exercise.id, "weight", parseFloat(e.target.value) || 0)
                      }
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Descanso (s)
                    </label>
                    <Input
                      type="number"
                      value={exercise.restTime}
                      onChange={(e) =>
                        updateExercise(exercise.id, "restTime", parseInt(e.target.value) || 0)
                      }
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 border-dashed"
            onClick={addExercise}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exercício
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
