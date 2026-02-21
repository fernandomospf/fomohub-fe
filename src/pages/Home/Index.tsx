import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import Link from "next/link";
import React, { useEffect } from "react";

import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { Button } from "@/components/atoms/button";
import { workoutPlanService } from "@/infra/container";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/router";
import { IndexSkeleton } from "@/components/organisms/IndexSkeleton";
import { WorkoutCardSkeleton } from "@/components/atoms/SkeletonWorkout";
import { TrendingPlans } from "@/components/organisms/TrendingPlans";
import { Onboarding } from "../Onboarding";
import { ActiveWorkoutBanner } from "@/components/organisms/workout/ActiveWorkoutBanner";
import { useMe } from "@/hooks/useMe";
import { useLastTraining } from "@/hooks/useLastTraining";
import { useOffensiveDays } from "@/hooks/useOffensiveDays";
import { usePublicWorkoutPlans } from "@/hooks/usePublicWorkoutPlans";
import { useGoalsTag } from "@/hooks/useGoalsTag";
import { useMuscleGroupsTag } from "@/hooks/useMuscleGroupsTag";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useHomeStore } from "./store";
import { useTranslate } from "@/hooks/useTranslate";

export default function Index() {
  const { t } = useTranslate();
  const router = useRouter();
  const {
    loading,
    setLoading,
    error,
    setError,
    userData,
    setUserData,
    workoutPlan,
    setWorkoutPlan,
    muscleGroupTag,
    setMuscleGroupTag,
    goalsTag,
    setGoalsTag,
    offset,
    setOffset,
    limit,
    setLimit,
    hasMore,
    setHasMore,
    loadingMore,
    setLoadingMore,
    startIndex,
    setStartIndex,
    showFilters,
    setShowFilters,
    setOffensiveDays,
    activeSession,
    setActiveSession,
    lastTraining,
    setLastTraining,
    setActiveTag,
    filters,
    setFilters,
    stats,
    quickActions,
    showDevModal,
    setShowDevModal,
    filteredWorkoutPlan,
    handleSearch,
    handleSelectedTag,
  } = useHomeStore();
  const { data: user, loading: userLoading } = useMe();
  const { data: lastTrainingData, loading: lastTrainingLoading } = useLastTraining();
  const { data: offensiveDaysData, loading: offensiveDaysLoading } = useOffensiveDays();
  const { data: goalsTagData, loading: goalsTagLoading } = useGoalsTag();
  const { data: muscleGroupTagData, loading: muscleGroupTagLoading } = useMuscleGroupsTag();
  const { data: activeSessionData, loading: activeSessionLoading } = useActiveSession();
  const { session, loading: sessionLoading } = useSession();

  const PAGE_SIZE = 3;
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [loadingInitial, setLoadingInitial] = React.useState(true);

  const loadTrendingPlansRef = React.useRef(false);

  const loadTrendingPlans = React.useCallback(async (newOffset = 5, append = false) => {
    if (loadTrendingPlansRef.current) return;
    loadTrendingPlansRef.current = true;

    try {
      if (append) setLoadingMore(true);
      else {
        setLoadingInitial(true);
      }

      const response = await workoutPlanService.getWorkoutPlanPublic({
        offset: newOffset,
        limit: limit,
      });

      const currentPlans = useHomeStore.getState().workoutPlan;
      let nextPlans = response.data;
      if (append) {
        const newUniqueItems = response.data.filter(
          (newItem) => !currentPlans.some((existingItem) => existingItem.id === newItem.id)
        );
        nextPlans = [...currentPlans, ...newUniqueItems];
      }

      setWorkoutPlan(nextPlans);
      
      const isEndReached = response.data.length < limit || newOffset + response.data.length >= response.meta.total;
      setHasMore(!isEndReached); 
      setOffset(newOffset);
    } catch (err) {
      console.error("[ERROR - Home/Index.tsx] Erro ao carregar treinos públicos:", err);
      setError("Erro ao carregar treinos públicos");
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
      setTimeout(() => {
        loadTrendingPlansRef.current = false;
      }, 500);
    }
  }, [limit]);

  useEffect(() => {
    if (sessionLoading || !session) return;
    if (workoutPlan.length === 0) {
      loadTrendingPlans(0, false);
    } else {
      setLoadingInitial(false);
    }
  }, [session, sessionLoading]);


  useEffect(() => {
    if (sessionLoading || !session) return;

    setLoading(
      userLoading ||
      lastTrainingLoading ||
      offensiveDaysLoading ||
      goalsTagLoading ||
      muscleGroupTagLoading ||
      activeSessionLoading ||
      loadingInitial
    );

    if (user !== undefined) setUserData(user);
    if (lastTrainingData !== undefined) setLastTraining(lastTrainingData);
    if (offensiveDaysData !== undefined) setOffensiveDays(offensiveDaysData || 0);
    if (goalsTagData !== undefined) setGoalsTag(goalsTagData);
    if (muscleGroupTagData !== undefined) setMuscleGroupTag(muscleGroupTagData);
    if (activeSessionData !== undefined) setActiveSession(activeSessionData);

  }, [
    session,
    sessionLoading,
    userLoading,
    lastTrainingLoading,
    offensiveDaysLoading,
    goalsTagLoading,
    muscleGroupTagLoading,
    activeSessionLoading,
    loadingInitial,
    user,
    lastTrainingData,
    offensiveDaysData,
    goalsTagData,
    muscleGroupTagData,
    activeSessionData,
  ]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const reachedBottom =
        scrollTop + clientHeight >= scrollHeight - 400;

      const { hasMore: freshHasMore, limit: freshLimit, offset: freshOffset, loadingMore: freshLoadingMore } = useHomeStore.getState();

      if (!reachedBottom || freshLoadingMore || !freshHasMore) return;

      loadTrendingPlans(freshOffset + freshLimit, true);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadTrendingPlans, loading, sessionLoading]);

  useEffect(() => {
    const alreadySeen = localStorage.getItem("dev-modal-seen");

    if (!alreadySeen) {
      setShowDevModal(true);
    }
  }, []);

  if (sessionLoading || (session && loading)) {
    return (
      <MobileLayout ref={scrollContainerRef}>
        <PageHeader loading={true} />
        <IndexSkeleton />
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
        <PageHeader />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-destructive">{t("home.error")}</p>
          <Button onClick={() => window.location.reload()}>
            {t("home.try_again")}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const filteredPlans = filteredWorkoutPlan();
  const ONBOARDING_COMPLETED = userData?.onboarding_completed;

  return (
    <MobileLayout 
      ref={scrollContainerRef} 
      loading={loading} 
      onboardingCompleted={ONBOARDING_COMPLETED}
    >
      <PageHeader
        searchQuery={filters.search}
        setSearchQuery={handleSearch}
        placeholder={t("home.search_placeholder")}
        loading={loading}
        onboardingCompleted={ONBOARDING_COMPLETED}
      />
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">
              {t("home.dev_mode")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("home.dev_desc")}
            </p>

            <div className="flex flex-col gap-2">
              <Button
                variant="gradient"
                onClick={() => {
                  localStorage.setItem("dev-modal-seen", "true");
                  setShowDevModal(false);
                }}
              >
                {t("home.understood")}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowDevModal(false)}
              >
                {t("home.close")}
              </Button>
            </div>
          </div>
        </div>
      )}
      {ONBOARDING_COMPLETED ? (
        <>
          <div className="px-4 py-6 space-y-6">
            {
              activeSession && (
                <ActiveWorkoutBanner
                  workoutId={activeSession.workoutId}
                  workoutName={activeSession.workoutName}
                  completedSets={activeSession.completedSets}
                  totalSets={activeSession.totalSets}
                  elapsedMinutes={activeSession.elapsedMinutes}
                  onFinish={async () => {
                    try {
                      await workoutPlanService.finishWorkoutSession(
                        activeSession.sessionId
                      );
                      setActiveSession(null);
                    } catch (err) {
                      console.error("[ERROR - Home/Index.tsx] Erro ao finalizar treino:", err);
                    }
                  }}
                />
              )
            }
            <div className="glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-20 blur-3xl" />
              <div className="relative z-10">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div style={{ width: 'fit-content' }}>
                    <p className="text-muted-foreground mb-1">
                      {t("home.greeting", { name: userData?.name?.split(' ')[0] || userData?.email || t("home.greeting_fallback") })}
                    </p>
                    <h2 className="text-2xl font-bold mb-4">
                      {t("home.ready_to_train")}
                    </h2>
                    <div className="flex gap-1 flex-col mb-4">
                      {lastTraining?.lastTraining ? (
                        <>
                          {(() => {
                            const finishedAt = lastTraining.lastTraining.finished_at
                              ? new Date(lastTraining.lastTraining.finished_at)
                              : null;
                            const isValid = finishedAt && !isNaN(finishedAt.getTime());
                            const days = isValid
                              ? Math.floor((Date.now() - finishedAt.getTime()) / 86400000)
                              : null;
                            return (
                              <span
                                className="text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                  __html: !days || days <= 0
                                    ? t("home.last_training_today")
                                    : t("home.last_training_days", { days })
                                }}
                              />
                            );
                          })()}
                          <span className="text-muted-foreground">{t("home.training_of")}
                            <span className="font-bold"> {lastTraining.lastTraining.workout_plan?.name}</span>
                          </span>
                          <span className="text-muted-foreground">{t("home.muscles")}
                            <span className="font-bold"> {lastTraining.lastTraining.workout_plan?.muscle_groups?.join(", ")}</span>
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">{t("home.no_training_yet")}</span>
                      )}
                    </div>
                  </div>

                </div>
                {
                  !activeSession && (
                    <Link href="/workouts" className="w-full md:w-auto mt-4 md:mt-0">
                      <Button variant="gradient" size="lg" className="w-full md:w-auto md:px-12">
                        <Zap className="w-5 h-5 mr-2" />
                        {t("home.start_training")}
                      </Button>
                    </Link>
                  )
                }
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-3 text-center"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 gradient-primary opacity-20 blur-3xl" />
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
              <div className="flex mb-6">
                <Button
                  variant={showFilters ? "gradient" : "outline"}
                  onClick={() => {
                    setShowFilters(!showFilters);
                  }}
                >
                  <Filter className="w-5 h-5 mr-2" />
                  {t("home.filters_btn")}
                </Button>
              </div>
              {
                showFilters && (
                  <div className="flex flex-col gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
                    <div className="flex gap-2 flex-col">
                      <span className="text-muted-foreground">{t("home.goals")}</span>
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
                      <span className="text-muted-foreground">{t("home.muscle_groups")}</span>
                      <div className="flex gap-2">
                        {startIndex > 0 && (
                          <Badge
                            variant="secondary"
                            className="cursor-pointer px-3 py-1"
                            onClick={() => {
                              setStartIndex(Math.max(0, startIndex - PAGE_SIZE));
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
                              const nextIndex = startIndex + PAGE_SIZE;
                              setStartIndex(nextIndex >= muscleGroupTag.length ? 0 : nextIndex);
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
                            setFilters({ search: '', tags: [] });
                            setActiveTag(null);
                            setStartIndex(0);
                          }}
                        >
                          {t("home.clear_filters")}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              }
              <h2 className="text-md text-white mb-2 block" dangerouslySetInnerHTML={{ __html: t("home.trending_trainings") }} />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                  filteredWorkoutPlan()?.map((workout: any) => (
                    <TrendingPlans
                      key={workout.id}
                      disabledOnClick={true}
                      {...workout}
                    />
                  ))
                }
              </div>
              {loadingMore && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
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
