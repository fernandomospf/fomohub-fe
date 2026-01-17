import {
  Flame,
  Trophy,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { Button } from "@/components/ui/button";
import profileService from "@/api/profile";
import { useSession } from "@/hooks/useSession";
import { Loading } from "@/components/Loading";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";

const stats = [
  {
    icon: Flame,
    label: "Streak",
    value: "12",
    unit: "dias",
    color: "text-orange-500",
  },
  {
    icon: Trophy,
    label: "Ranking",
    value: "#3",
    unit: "posição",
    color: "text-yellow-500",
  },
  {
    icon: TrendingUp,
    label: "Progresso",
    value: "+15%",
    unit: "mês",
    color: "text-success",
  },
];

export default function Index() {
  const { session, loading: sessionLoading } = useSession();
  const { isActive, elapsedSeconds, formatTime } = useWorkoutSession();

  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const profile = await profileService.Get({
          waitForToken: false,
        });

        if (!mounted) return;
        setUserData(profile);
      } catch (err) {
        console.error("Erro ao buscar profile:", err);
        if (mounted) setError("Não foi possível carregar seus dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  if (sessionLoading || loading) {
    return (
      <MobileLayout>
        <PageHeader />
        <Loading />
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <PageHeader title="Fomo" />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader title="Fomo" showSettings />

      <div className="px-4 py-6 space-y-6">
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-20 blur-3xl" />
          <div className="relative z-10">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ width: 'fit-content' }}>
                <p className="text-muted-foreground mb-1">
                  Olá, {userData?.name.split(' ')[0] || userData?.email || "Atleta"} 💪
                </p>
                <h2 className="text-2xl font-bold mb-4">
                  Pronto para treinar?
                </h2>
              </div>
              {/* <div>
                <label className="text-sm font-medium opacity-80">Tempo de treino</label>
                <div className="text-xl font-bold font-mono" style={{ textAlign: 'center' }}>
                  {isActive ? formatTime(elapsedSeconds) : "--:--"}
                </div>
              </div> */}
            </div>
            <Link to="/workouts">
              <Button variant="gradient" size="lg" className="w-full">
                <Zap className="w-5 h-5 mr-2" />
                Iniciar Treino
              </Button>
            </Link>
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-3 text-center"
            >
              <stat.icon
                className={`w-5 h-5 mx-auto mb-2 ${stat.color}`}
              />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">
                {stat.unit}
              </p>
            </div>
          ))}
        </div> */}

        {/* Workouts */}
        <div>
          {/* <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Treinos em alta</h3>
            <Link
              to="/popular"
              className="text-sm text-primary flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div> */}

          <div className="space-y-4 mb-4">
            {/* {popularWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                {...workout}
                onClick={() => {}}
                onFavorite={() => {}}
              />
            ))} */}
          </div>
        </div>

        {/* IA Banner */}
        {/* <Link to="/ai-workout">
          <div className="gradient-primary rounded-2xl p-5 shadow-glow relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary-foreground mb-1">
                  Treino com IA
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Gere treinos personalizados
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </Link> */}
      </div>
    </MobileLayout>
  );
}
