import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Target, Clock, Dumbbell, Zap } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { aiService } from "@/infra/container";
import { toast } from "sonner";

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

const workoutSchema = z.object({
  goal: z.string().min(1, "Selecione um objetivo"),
  duration: z.string().min(1, "Selecione o tempo disponível"),
  muscles: z.array(z.string()).min(1, "Selecione pelo menos um grupo muscular"),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

export default function AIWorkout() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      goal: "",
      duration: "",
      muscles: [],
    },
    mode: "onChange",
  });

  const handleGenerate = async () => {
    try {
      const goal = watch("goal");
      const duration = Number(watch("duration"));
      const muscles = watch("muscles");

      if (!goal || !duration || !muscles?.length) {
        console.warn("Dados inválidos para geração de treino");
        return;
      }

      setIsGenerating(true);

      const response = await aiService.generateWorkoutPlan({
        goal,
        time: duration,
        muscles,
      });

      toast.success(
        "Treino gerado com sucesso, redirecionando para o treino..."
      );

      setTimeout(() => {
        router.push(`/workouts/${response?.id}`);
      }, 1000);

    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 403) {
        toast.error("Você atingiu o limite de 14 treinos gerados com IA.");
        return;
      }

      toast.error("Erro ao gerar treino. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const fetchRemainingCredits = async () => {
      const response = await aiService.remainingCredits();
      setRemainingCredits(response?.credits || 0);
    };
    fetchRemainingCredits();
  }, []);

  const selectedGoal = watch("goal");
  const selectedDuration = watch("duration");
  const selectedMuscles = watch("muscles");

  const toggleMuscle = (muscleId: string) => {
    const currentMuscles = selectedMuscles;
    const newMuscles = currentMuscles.includes(muscleId)
      ? currentMuscles.filter((m) => m !== muscleId)
      : [...currentMuscles, muscleId];
    setValue("muscles", newMuscles, { shouldValidate: true });
  };

  return (
    <MobileLayout>
      <PageHeader title="Treino com IA" showBack />
      <div className="px-4 py-6 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Gere seu Treino</h2>
          <p className="text-muted-foreground">
            Nossa IA cria treinos personalizados baseados nos seus objetivos
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Qual seu objetivo?</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                disabled={isGenerating}
                type="button"
                onClick={() => setValue("goal", goal.id, { shouldValidate: true })}
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

        <div>
          <h3 className="font-semibold mb-3">Tempo disponível</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {durations.map((duration) => (
              <button
                key={duration.id}
                type="button"
                disabled={isGenerating}
                onClick={() =>
                  setValue("duration", duration.id, { shouldValidate: true })
                }
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

        <div>
          <h3 className="font-semibold mb-3">Grupos musculares</h3>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle.id}
                type="button"
                disabled={isGenerating}
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

        <div>
          <span className="text-sm text-muted-foreground">
            Créditos restantes: {remainingCredits}
          </span>
          <Button
            variant="gradient"
            size="xl"
            className="w-full"
            disabled={!isValid || isGenerating}
            onClick={handleSubmit(handleGenerate)}
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
      </div>
    </MobileLayout>
  );
}
