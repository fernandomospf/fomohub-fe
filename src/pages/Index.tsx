import {
  Flame,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { Button } from "@/components/atoms/button";
import profileService from "@/api/profiles";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/router";
import { Loading } from "@/components/atoms/Loading";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";
import workoutPlanService, { WorkoutPlan } from "@/api/workout-plan";
import { TrendingPlans } from "@/components/organisms/TrendingPlans";
import { UserData } from "@/types/user";
import { Onboarding } from "./Onboarding";

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
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const { isActive, elapsedSeconds, formatTime } = useWorkoutSession();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan[]>([]);
  const [visibleCount, setVisibleCount] = useState(2);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleCollapse = () => {
    setVisibleCount(2);
  };

  useEffect(() => {
    if (sessionLoading || !session) return;

    const fetchWorkoutPlan = async () => {
      try {
        const response = await workoutPlanService.getWorkoutPlanPublic();
        setWorkoutPlan(response || []);
      } catch (err) {
        console.error("Erro ao buscar plano de treino:", err);
      }
    };
    fetchWorkoutPlan();
  }, [session, sessionLoading]);

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

  if (sessionLoading || (session && loading)) {
    return (
      <MobileLayout>
        <PageHeader />
        <Loading />
      </MobileLayout>
    );
  }

  if (!session && !sessionLoading) {
    router.push("/login");
    return null;
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
      {userData?.onboarding_completed ? (
        <>
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
                      Olá, {userData?.name?.split(' ')[0] || userData?.email || "Atleta"} 💪
                    </p>
                    <h2 className="text-2xl font-bold mb-4">
                      Pronto para treinar?
                    </h2>
                  </div>

                </div>
                <Link href="/workouts">
                  <Button variant="gradient" size="lg" className="w-full">
                    <Zap className="w-5 h-5 mr-2" />
                    Iniciar Treino
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <label className="text-md text-muted-foreground mb-2 block">
                Treinos que estão BOMBANDO 💣
              </label>
              <div className="mt-4 flex flex-col gap-4">
                {

                  workoutPlan?.slice(0, visibleCount).map((workout: any) => (
                    <TrendingPlans
                      {...workout}
                    />
                  ))
                }
              </div>
              {workoutPlan && workoutPlan.length > 2 && (
                <div className="mt-4 flex justify-center">
                  {visibleCount < workoutPlan.length ? (
                    <Button
                      variant="outline"
                      onClick={handleShowMore}
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      Ver mais
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleCollapse}
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      Recolher
                    </Button>
                  )}
                </div>
              )}
            </div>








          </div>
        </>
      ) : (
        <Onboarding />
      )}
    </MobileLayout>
  );
}
