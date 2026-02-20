import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Dumbbell, Zap, Clock } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { trainingProgramService } from "@/infra/container";
import { toast } from "sonner";

const schema = z.object({
  goal: z.enum(["hypertrophy", "strength", "endurance", "fat_loss"]),
  experienceLevel: z.enum(["iniciante", "intermediario", "avancado"]),
  workoutType: z.enum(["ppl", "upper_lower", "full_body"]),
  totalWeeks: z.number(),
  weeklyFrequency: z.number().min(2).max(6),
});

type FormData = z.infer<typeof schema>;

const durations = [4, 8, 12, 16, 20, 26];
const frequencies = [2, 3, 4, 5, 6];

const goals = [
  { id: "hypertrophy", label: "Hipertrofia", icon: Dumbbell },
  { id: "strength", label: "Força", icon: Zap },
  { id: "endurance", label: "Resistência", icon: Clock },
  { id: "fat_loss", label: "Emagrecimento", icon: Sparkles },
];

const workoutTypes = [
  { id: "ppl", label: "Push Pull Legs" },
  { id: "upper_lower", label: "Upper / Lower" },
  { id: "full_body", label: "Full Body" },
];

const experienceLevels = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

export default function ProgramWorkout() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      goal: "hypertrophy",
      experienceLevel: "iniciante",
      workoutType: "ppl",
      totalWeeks: 12,
      weeklyFrequency: 3,
    },
    mode: "onChange",
  });

  const handleGenerate = async (data: FormData) => {
    try {
      setIsGenerating(true);

      await trainingProgramService.generateProgram({
        goal: data.goal,
        experienceLevel: data.experienceLevel,
        totalWeeks: data.totalWeeks,
        weeklyFrequency: data.weeklyFrequency,
        workoutType: data.workoutType,
      });

      toast.success("Protocolo gerado com sucesso!");
      router.push(`/workouts`);

    } catch {
      toast.error("Erro ao gerar protocolo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MobileLayout>
      <PageHeader showBack />

      <div className="px-4 py-6 space-y-8">

        <div className="text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-bold">
            Protocolo Estruturado
          </h1>
          <p className="text-muted-foreground mt-2">
            Periodização inteligente e progressiva.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Objetivo</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() =>
                  setValue("goal", goal.id as any, { shouldValidate: true })
                }
                className={cn(
                  "p-4 rounded-xl text-center transition-all",
                  watch("goal") === goal.id
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                <goal.icon className="w-6 h-6 mx-auto mb-1" />
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Experiência</h3>
          <div className="grid grid-cols-3 gap-3">
            {experienceLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() =>
                  setValue("experienceLevel", level.id as any, { shouldValidate: true })
                }
                className={cn(
                  "p-4 rounded-xl text-center transition-all",
                  watch("experienceLevel") === level.id
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Dias por Semana</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {frequencies.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() =>
                  setValue("weeklyFrequency", f, { shouldValidate: true })
                }
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all",
                  watch("weeklyFrequency") === f
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {f} dias
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Estrutura do Treino</h3>
          <div className="grid grid-cols-1 gap-3">
            {workoutTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setValue("workoutType", type.id as any, { shouldValidate: true })
                }
                className={cn(
                  "p-4 rounded-xl text-center transition-all",
                  watch("workoutType") === type.id
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Duração</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  setValue("totalWeeks", d, { shouldValidate: true })
                }
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all",
                  watch("totalWeeks") === d
                    ? "gradient-primary text-primary-foreground"
                    : "glass hover:bg-secondary"
                )}
              >
                {d} semanas
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          disabled={!isValid || isGenerating}
          onClick={handleSubmit(handleGenerate)}
        >
          {isGenerating ? "Gerando protocolo..." : "Gerar Protocolo"}
        </Button>

      </div>
    </MobileLayout>
  );
}
