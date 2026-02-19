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
  { id: "lombar", label: "Lombar" },
  { id: "ombros", label: "Ombros" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "antebraco", label: "Antebraço" },
  { id: "quadriceps", label: "Quadríceps" },
  { id: "posteriores", label: "Posteriores" },
  { id: "gluteos", label: "Glúteos" },
  { id: "panturrilha", label: "Panturrilha" },
  { id: "adutores", label: "Adutores" },
  { id: "abdomen", label: "Abdômen" },
];

const workoutSchema = z.object({
  goal: z.string().min(1, "Selecione um objetivo"),
  duration: z.string().min(1, "Selecione o tempo disponível"),
  muscles: z.array(z.string()).min(1, "Selecione pelo menos um grupo muscular"),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

export default function SingleWorkout() {
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

  const handleGenerate = async (data: WorkoutFormData) => {
    try {
      setIsGenerating(true);

      const response = await aiService.generateSingleWorkout({
        goal: data.goal,
        time: Number(data.duration),
        muscles: data.muscles,
      });

      toast.success("Treino gerado com sucesso!");

      router.push(`/workouts/${response?.id}`);

    } catch (error: any) {

      if (error?.response?.status === 403) {
        toast.error("Você atingiu o limite de geração com IA.");
        return;
      }

      toast.error("Erro ao gerar treino.");

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
    const updated = selectedMuscles.includes(muscleId)
      ? selectedMuscles.filter((m) => m !== muscleId)
      : [...selectedMuscles, muscleId];

    setValue("muscles", updated, { shouldValidate: true });
  };

  return (
    <MobileLayout>
      <PageHeader showBack />

      <div className="px-4 py-6 space-y-8">

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Treino Único com
          </h2>

          <h1 className="text-4xl font-bold mb-2">
            Evolu<span className="text-primary">IA</span>
          </h1>

          <p className="text-muted-foreground">
            Personalização rápida e direta para o treino de hoje.
          </p>
        </div>

        {/* Objetivo */}
        <div>
          <h3 className="font-semibold mb-3">Qual seu objetivo?</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                disabled={isGenerating}
                onClick={() =>
                  setValue("goal", goal.id, { shouldValidate: true })
                }
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
          <div className="flex gap-3 overflow-x-auto pb-2">
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
            disabled={!isValid || isGenerating || remainingCredits === 0}
            onClick={handleSubmit(handleGenerate)}
          >
            {isGenerating ? "Gerando treino..." : "Gerar Treino"}
          </Button>
        </div>

      </div>
    </MobileLayout>
  );
}
