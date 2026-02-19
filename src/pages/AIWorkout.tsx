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

type ExperienceLevel = "iniciante" | "intermediario" | "avancado";
type PreferredSplit = "auto" | "fullbody" | "upper_lower" | "ppl";

const goalOptions = [
  {
    id: "hipertrofia",
    label: "Hipertrofia",
    icon: Dumbbell,
    description:
      "Foco em aumento de massa muscular com volume moderado e progressão de carga.",
    goals: ["hipertrofia"],
  },
  {
    id: "forca",
    label: "Força",
    icon: Zap,
    description:
      "Foco em aumento de carga e desempenho neuromuscular com repetições mais baixas.",
    goals: ["forca"],
  },
  {
    id: "resistencia",
    label: "Resistência",
    icon: Clock,
    description:
      "Foco em resistência muscular e melhora do condicionamento metabólico.",
    goals: ["resistencia"],
  },
  {
    id: "definicao",
    label: "Definição",
    icon: Target,
    description:
      "Foco em redução de gordura mantendo o máximo de massa muscular possível.",
    goals: ["definicao"],
  },
  {
    id: "hipertrofia_forca",
    label: "Hipertrofia + Força",
    icon: Dumbbell,
    description:
      "Combinação estratégica para ganhar massa muscular enquanto desenvolve força máxima.",
    goals: ["hipertrofia", "forca"],
  },
  {
    id: "hipertrofia_definicao",
    label: "Hipertrofia + Definição",
    icon: Dumbbell,
    description:
      "Foco em ganho de massa com controle de gordura, ideal para recomposição corporal.",
    goals: ["hipertrofia", "definicao"],
  },
  {
    id: "resistencia_definicao",
    label: "Resistência + Definição",
    icon: Clock,
    description:
      "Treinos mais densos e metabólicos para melhorar condicionamento e reduzir gordura.",
    goals: ["resistencia", "definicao"],
  },
];

const durations = [
  { id: "30", label: "30 min" },
  { id: "45", label: "45 min" },
  { id: "60", label: "60 min" },
  { id: "90", label: "90 min" },
];

const frequencies = [
  { id: "2", label: "2x por semana" },
  { id: "3", label: "3x por semana" },
  { id: "4", label: "4x por semana" },
  { id: "5", label: "5x por semana" },
  { id: "6", label: "6x por semana" },
  { id: "7", label: "7x por semana" },
];

const experienceLevels: { id: ExperienceLevel; label: string }[] = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

const splits: { id: PreferredSplit; label: string }[] = [
  { id: "auto", label: "IA decide" },
  { id: "fullbody", label: "Full Body" },
  { id: "upper_lower", label: "Upper / Lower" },
  { id: "ppl", label: "Push / Pull / Legs" },
];

const splitDescriptions: Record<PreferredSplit, string> = {
  auto: "A IA escolherá a melhor divisão baseada na sua frequência.",
  fullbody: "Treina o corpo inteiro em cada sessão. Ideal até 3x por semana.",
  upper_lower: "Alterna membros superiores e inferiores. Excelente para 4x semana.",
  ppl: "Divide em empurrar, puxar e pernas. Ideal para 5x ou mais.",
};

const workoutSchema = z.object({
  selectedGoalOption: z.string().min(1),
  duration: z.string().min(1),
  weeklyFrequency: z.string().min(1),
  experienceLevel: z.enum(["iniciante", "intermediario", "avancado"]),
  preferredSplit: z.enum(["auto", "fullbody", "upper_lower", "ppl"]),
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
      selectedGoalOption: "",
      duration: "",
      weeklyFrequency: "",
      experienceLevel: "iniciante",
      preferredSplit: "auto",
    },
    mode: "onChange",
  });

  const selectedGoalOption = watch("selectedGoalOption");

  const handleGoalSelect = (optionId: string) => {
    const option = goalOptions.find((g) => g.id === optionId);
    if (!option) return;

    setValue("selectedGoalOption", optionId, { shouldValidate: true });

    toast.info(option.description);

    if (optionId === "hipertrofia_forca") {
      toast.success(
        "Excelente escolha. Essa combinação acelera ganhos estruturais e neuromusculares."
      );
    }
  };

  const handleSplitSelect = (splitId: PreferredSplit) => {
    setValue("preferredSplit", splitId, { shouldValidate: true });
    toast.info(splitDescriptions[splitId]);
  };

  const handleGenerate = async () => {
    try {
      const goalOptionId = watch("selectedGoalOption");
      const duration = Number(watch("duration"));
      const weeklyFrequency = Number(watch("weeklyFrequency"));
      const experienceLevel = watch("experienceLevel");
      const preferredSplit = watch("preferredSplit");

      const goalOption = goalOptions.find(
        (g) => g.id === goalOptionId
      );

      if (!goalOption || !duration || !weeklyFrequency) return;

      setIsGenerating(true);

      const response = await aiService.generateWorkoutPlan({
        goals: goalOption.goals,
        weeklyFrequency,
        sessionDurationMinutes: duration,
        experienceLevel,
        preferredSplit,
      });

      toast.success("Plano gerado com sucesso!");

      setTimeout(() => {
        router.push(`/workouts/${response?.id}`);
      }, 800);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error("Você atingiu o limite de geração com IA.");
        return;
      }
      toast.error("Erro ao gerar plano.");
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

  return (
    <MobileLayout>
      <PageHeader showBack />
      <div className="px-4 py-6 space-y-8">

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Gere seu Plano com</h2>
          <h1 className="text-4xl font-bold mb-2">
            Evolu<span className="text-primary">IA</span>
          </h1>
          <p className="text-muted-foreground">
            Nossa <span className="text-primary">IA especialista</span> cria planos semanais completos <span className="text-primary"> personalizados</span> baseados nos seus <span className="text-primary"> objetivos</span> e <span className="text-primary"> tempo disponível</span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Qual seu objetivo?</h3>
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isGenerating}
                onClick={() => handleGoalSelect(option.id)}
                className={cn(
                  "p-4 rounded-xl transition-all flex flex-col items-center gap-2",
                  selectedGoalOption === option.id
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "glass hover:bg-secondary"
                )}
              >
                <option.icon className="w-6 h-6" />
                <span className="font-medium text-center">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Tempo por treino</h3>
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
                  watch("duration") === duration.id
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
          <h3 className="font-semibold mb-3">
            Quantos dias por semana?
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {frequencies.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setValue("weeklyFrequency", item.id, { shouldValidate: true, })}
                className={cn("px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all", watch("weeklyFrequency") === item.id ? "gradient-primary text-primary-foreground" : "glass hover:bg-secondary")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Seu nível
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {experienceLevels.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setValue("experienceLevel", item.id, { shouldValidate: true, })}
                className={cn("p-4 rounded-xl transition-all text-center", watch("experienceLevel") === item.id ? "gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-secondary")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">
            Preferência de divisão
          </h3>
          <div
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"> {splits.map((item) => (<button
              key={item.id}
              type="button"
              disabled={isGenerating}
              onClick={() => handleSplitSelect(item.id)}
              className={cn("px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all", watch("preferredSplit") === item.id ? "gradient-primary text-primary-foreground" : "glass hover:bg-secondary")} > {item.label} </button>))}
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
            {isGenerating ? "Gerando plano..." : "Gerar Plano Semanal"} 
          </Button>
        </div>
      </div>

    </MobileLayout>
  );
}
