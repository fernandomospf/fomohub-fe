import { useState } from "react";
import { Sparkles, Target, Clock, Dumbbell, Zap } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const goals = [
  { id: "hipertrofia", label: "Hipertrofia", icon: Dumbbell },
  { id: "forca", label: "Força", icon: Zap },
  { id: "resistencia", label: "Resistência", icon: Clock },
  { id: "definicao", label: "Definição", icon: Target },
];

const durations = [
  { id: "30", label: "30 min" },
  { id: "45", label: "45 min" },
  { id: "60", label: "60 min" },
  { id: "90", label: "90 min" },
];

const muscleGroups = [
  { id: "peito", label: "Peito" },
  { id: "costas", label: "Costas" },
  { id: "ombros", label: "Ombros" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "pernas", label: "Pernas" },
  { id: "abdomen", label: "Abdômen" },
  { id: "gluteos", label: "Glúteos" },
];

export default function AIWorkout() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleMuscle = (muscleId: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscleId)
        ? prev.filter((m) => m !== muscleId)
        : [...prev, muscleId]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Navigate to generated workout
    }, 2000);
  };

  const isValid = selectedGoal && selectedDuration && selectedMuscles.length > 0;

  return (
    <MobileLayout>
      <PageHeader title="Treino com IA" showBack />

      <div className="px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Gere seu Treino</h2>
          <p className="text-muted-foreground">
            Nossa IA cria treinos personalizados baseados nos seus objetivos
          </p>
        </div>

        {/* Goal Selection */}
        <div>
          <h3 className="font-semibold mb-3">Qual seu objetivo?</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={cn(
                  "p-4 rounded-xl transition-all flex flex-col items-center gap-2",
                  selectedGoal === goal.id
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "glass hover:bg-secondary"
                )}
              >
                <goal.icon className="w-6 h-6" />
                <span className="font-medium">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <h3 className="font-semibold mb-3">Tempo disponível</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {durations.map((duration) => (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all",
                  selectedDuration === duration.id
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        {/* Muscle Groups */}
        <div>
          <h3 className="font-semibold mb-3">Grupos musculares</h3>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle.id}
                onClick={() => toggleMuscle(muscle.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedMuscles.includes(muscle.id)
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {muscle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          disabled={!isValid || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Gerando treino...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Gerar Treino
            </>
          )}
        </Button>
      </div>
    </MobileLayout>
  );
}
