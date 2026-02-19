import { useRouter } from "next/router";
import { Sparkles, Target, Calendar } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { cn } from "@/lib/utils";

export default function ChooseWorkoutGeneration() {
  const router = useRouter();

  return (
    <MobileLayout>
      <PageHeader showBack />

      <div className="px-4 py-8 space-y-8">

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold">
            Como você quer treinar?
          </h1>

          <p className="text-muted-foreground mt-2">
            Escolha o formato ideal para sua evolução.
          </p>
        </div>

        <div className="space-y-5">

          <button
            onClick={() => router.push("/ai-workout/single")}
            className={cn(
              "w-full p-6 rounded-2xl text-left transition-all",
              "glass hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">
                Treino Único e Exclusivo
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Gere um treino personalizado imediato com IA.
              Ideal para ajustes rápidos ou treinos pontuais.
            </p>

            <div className="mt-4 text-xs text-primary font-medium">
              ⚡ Resultado imediato
            </div>
          </button>

          <button
            onClick={() => router.push("/ai-workout/program")}
            className={cn(
              "w-full p-6 rounded-2xl text-left transition-all",
              "gradient-primary text-primary-foreground shadow-glow"
            )}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">
                Protocolo Estruturado
              </h2>
            </div>

            <p className="text-sm opacity-90">
              Periodização completa com progressão real,
              controle de volume e fases estratégicas.
            </p>

            <div className="mt-4 text-xs font-medium">
              🔥 Recomendado para evolução contínua
            </div>
          </button>

        </div>

      </div>
    </MobileLayout>
  );
}
