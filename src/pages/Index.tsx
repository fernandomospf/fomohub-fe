import {
  Flame,
  Trophy,
  TrendingUp,
  Zap,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Sparkles,
  Users,
  ShoppingBag
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { Button } from "@/components/atoms/button";
import { profileService, workoutPlanService } from "@/infra/container";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/router";
import { Loading } from "@/components/atoms/Loading";
import { useWorkoutSession } from "@/contexts/WorkoutSessionContext";
import { TrendingPlans } from "@/components/organisms/TrendingPlans";
import { UserData } from "@/types/user";
import { Onboarding } from "./Onboarding";
import { Input } from "@/components/atoms/input";
import { WorkoutPlan } from "@/api/WorkoutPlan/types";

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
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan[]>([]);
  const [muscleGroupTag, setMuscleGroupTag] = useState<string[] | null>(null);
  const [goalsTag, setGoalsTag] = useState<string[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(2);
  const [startIndex, setStartIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    tags: string[];
    search: string;
  }>({
    tags: [],
    search: "",
  });

  const stats = [
    { icon: Flame, label: "Streak", value: "12", unit: "dias", color: "text-orange-500" },
    { icon: Trophy, label: "Ranking", value: "#3", unit: "posição", color: "text-yellow-500" },
    { icon: TrendingUp, label: "Progresso", value: "+15%", unit: "mês", color: "text-success" },
  ];

  const quickActions = [
    { icon: Sparkles, label: "Treino IA", path: "/ai-workout", gradient: true },
    { icon: Users, label: "Profissionais", path: "/professionals", gradient: false },
    { icon: Trophy, label: "Ranking", path: "/ranking", gradient: false },
    { icon: ShoppingBag, label: "Loja", path: "/marketplace", gradient: false },
  ];


  const PAGE_SIZE = 3;

  const filteredWorkoutPlan = (): WorkoutPlan[] => {
    return workoutPlan.filter((plan) => {
      const matchesTag =
        filters.tags.length === 0 ||
        filters.tags.some(
          (tag) =>
            plan.muscle_groups.includes(tag) ||
            plan.goals.includes(tag)
        );

      const matchesSearch =
        filters.search.trim() === "" ||
        plan.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesTag && matchesSearch;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };


  const handleSelectedTag = (tagName: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter((tag) => tag !== tagName)
        : [...prev.tags, tagName],
    }));
  };


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

       const profile = await profileService.get();

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const goalsTag = await workoutPlanService.getGoalsTag();
        const muscleGroupTag = await workoutPlanService.getMuscleGroupsTag();
        setGoalsTag(goalsTag);
        setMuscleGroupTag(muscleGroupTag);
      } catch (err) {
        console.error("Erro ao buscar tags:", err);
      }
    };
    fetchTags();
  }, [workoutPlan]);


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

  const filteredPlans = filteredWorkoutPlan();

  const canPaginate = filteredPlans.length > 2;
  const hasMore = visibleCount < filteredPlans.length;

  return (
    <MobileLayout>
      <PageHeader title="Fomo" showSettings />
      {userData?.onboarding_completed ? (
        <>
          <div className="px-4 py-6 space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar treino..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-12 h-12 bg-secondary border-0 rounded-xl"
                />

              </div>
              <Button
                variant={showFilters ? "gradient" : "outline"}
                className="mx-auto w-30"
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
              {
                showFilters && (
                  <div className="flex flex-col gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="flex gap-2 flex-col">
                      <span className="text-muted-foreground">Objetivos</span>
                      <div className="flex gap-2">
                        {goalsTag?.map((tag, index) => (
                          <Badge
                            key={`${tag}-${index}`}
                            variant={filters.tags.includes(tag) ? "default" : "secondary"}
                            className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm"
                            onClick={() => handleSelectedTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <span className="text-muted-foreground">Grupos musculares</span>
                      <div className="flex gap-2">
                        {startIndex > 0 && (
                          <Badge
                            variant="secondary"
                            className="cursor-pointer px-3 py-1"
                            onClick={() => {
                              setStartIndex((prev) => Math.max(0, prev - PAGE_SIZE));
                            }}
                          >
                            <ArrowLeft />
                          </Badge>
                        )}

                        {muscleGroupTag
                          ?.slice(startIndex, startIndex + PAGE_SIZE)
                          .map((tag, index) => (
                            <Badge
                              key={`${tag}-${index}`}
                              variant={filters.tags.includes(tag) ? "default" : "secondary"}
                              className="cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm"
                              onClick={() => handleSelectedTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}

                        {muscleGroupTag && muscleGroupTag.length > PAGE_SIZE && (
                          <Badge
                            variant="secondary"
                            className="cursor-pointer px-3 py-1"
                            onClick={() => {
                              setStartIndex((prev) => {
                                const nextIndex = prev + PAGE_SIZE;

                                if (nextIndex >= muscleGroupTag.length) {
                                  return 0;
                                }

                                return nextIndex;
                              });
                            }}
                          >
                            <ArrowRight />
                          </Badge>
                        )}
                      </div>

                      {(filters.tags.length > 0 || filters.search.length > 0) && (
                        <Button
                          variant="outline"
                          className="mx-auto w-60 border-primary text-primary hover:bg-primary/10"
                          onClick={() => {
                            setFilters({
                              search: "",
                              tags: []
                            });
                            setActiveTag(null);
                            setStartIndex(0);
                          }}
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </div>
                )
              }
            </div>
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

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-3 text-center"
                >
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.unit}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link key={action.path} href={action.path}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${action.gradient ? "gradient-primary shadow-glow" : "glass"
                        }`}
                    >
                      <action.icon
                        className={`w-6 h-6 ${action.gradient ? "text-primary-foreground" : "text-foreground"
                          }`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div>
              <label className="text-md text-muted-foreground mb-2 block">
                Treinos que estão BOMBANDO 💣
              </label>
              <div className="mt-4 flex flex-col gap-4">
                {
                  filteredWorkoutPlan()?.slice(0, visibleCount).map((workout: any) => (
                    <TrendingPlans
                      key={workout.id}
                      {...workout}
                    />
                  ))
                }
              </div>
              {canPaginate && (
                <div className="mt-4 flex justify-center">
                  {hasMore ? (
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
