import { useEffect, useRef, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { WorkoutCard } from "@/components/organisms/workout/WorkoutCard";
import { WorkoutCardSkeleton } from "@/components/atoms/SkeletonWorkout";
import { Input } from "@/components/atoms/input";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { workoutPlanService } from "@/infra/container";
import { WorkoutsPageSkeleton } from "@/components/atoms/WorkoutsPageSkeleton";
import {
  WorkoutPlan,
  WorkoutPlansResponse,
} from "@/api/WorkoutPlan/types";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Workouts() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const [myWorkouts, setMyWorkouts] = useState<WorkoutPlan[]>([]);
  const [myLikedWorkouts, setMyLikedWorkouts] = useState<WorkoutPlan[]>([]);
  const [myFavoriteWorkouts, setMyFavoriteWorkouts] = useState<WorkoutPlan[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [likedPage, setLikedPage] = useState(1);
  const [likedHasMore, setLikedHasMore] = useState(true);

  const [favoritePage, setFavoritePage] = useState(1);
  const [favoriteHasMore, setFavoriteHasMore] = useState(true);

  const [activeTab, setActiveTab] = useState("meus-treinos");

  const handleDeleteFromMyWorkouts = (id: string) => {
    setMyWorkouts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteFromFavorites = (id: string) => {
    setMyFavoriteWorkouts((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleDeleteFromLiked = (id: string) => {
    setMyLikedWorkouts((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };


  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  async function loadWorkouts(nextPage = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      else setLoadingInitial(true);

      const response: WorkoutPlansResponse =
        await workoutPlanService.getAllMyPlans({
          page: nextPage,
          limit: 10,
        });

      setMyWorkouts((prev) =>
        append ? [...prev, ...response.data] : response.data
      );

      setHasMore(nextPage < response.meta.lastPage);
      setPage(nextPage);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }

  async function loadLiked(nextPage = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      else setLoadingTab(true);

      const response: WorkoutPlansResponse =
        await workoutPlanService.listMyLikedPlans({
          page: nextPage,
          limit: 10,
        });

      setMyLikedWorkouts((prev) =>
        append ? [...prev, ...response.data] : response.data
      );

      setLikedHasMore(nextPage < response.meta.lastPage);
      setLikedPage(nextPage);
    } finally {
      setLoadingMore(false);
      setLoadingTab(false);
    }
  }

  async function loadFavorites(nextPage = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      else setLoadingTab(true);

      const response: WorkoutPlansResponse =
        await workoutPlanService.listMyFavoritePlans({
          page: nextPage,
          limit: 10,
        });

      setMyFavoriteWorkouts((prev) =>
        append ? [...prev, ...response.data] : response.data
      );

      setFavoriteHasMore(nextPage < response.meta.lastPage);
      setFavoritePage(nextPage);
    } finally {
      setLoadingMore(false);
      setLoadingTab(false);
    }
  }

  useEffect(() => {
    loadWorkouts(1, false);
  }, []);

  useEffect(() => {
    async function loadByTab() {
      if (activeTab === "meus-treinos") {
        setPage(1);
        setHasMore(true);
        await loadWorkouts(1, false);
      }

      if (activeTab === "treinos-curtidos") {
        setLikedPage(1);
        setLikedHasMore(true);
        await loadLiked(1, false);
      }

      if (activeTab === "treinos-favoritos") {
        setFavoritePage(1);
        setFavoriteHasMore(true);
        await loadFavorites(1, false);
      }
    }

    loadByTab();
  }, [activeTab]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const reachedBottom =
        scrollTop + clientHeight >= scrollHeight - 200;

      if (!reachedBottom || loadingMore) return;

      if (activeTab === "meus-treinos" && hasMore) {
        loadWorkouts(page + 1, true);
      }

      if (activeTab === "treinos-curtidos" && likedHasMore) {
        loadLiked(likedPage + 1, true);
      }

      if (activeTab === "treinos-favoritos" && favoriteHasMore) {
        loadFavorites(favoritePage + 1, true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    page,
    likedPage,
    favoritePage,
    hasMore,
    likedHasMore,
    favoriteHasMore,
    activeTab,
    loadingMore,
  ]);

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout ref={scrollContainerRef}>
      <PageHeader loading={loadingInitial} onboardingCompleted={true}/>
      {loadingInitial ? (
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <WorkoutsPageSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 space-y-6">
          <div className="flex flex-col gap-2">
            <Link href="/workouts/new">
              <div className="glass rounded-2xl p-4 flex items-center gap-4 border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Criar novo plano de treino</p>
                  <p className="text-sm text-muted-foreground">
                    Monte seu treino personalizado
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/ai-workout">
              <div className="glass rounded-2xl p-4 flex items-center gap-4 border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Evolu<span className="text-primary">IA</span></p>
                  <p className="text-sm text-muted-foreground">
                    Monte seu treino exclusivo com IA
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="meus-treinos">Meus treinos</TabsTrigger>
              <TabsTrigger value="protocolos">Protocolos</TabsTrigger>
              <TabsTrigger value="treinos-favoritos">Favoritos</TabsTrigger>
              <TabsTrigger value="treinos-curtidos">Curtidos</TabsTrigger>
            </TabsList>

            <TabsContent value="meus-treinos">
              <div className="flex flex-col gap-4">
                {filteredWorkouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 h-[300px] text-center">
                    <div className="w-[180px] h-[180px] relative">
                      <Image
                        src="/empty_workout.png"
                        alt="empty workout"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>

                    <p className="text-muted-foreground max-w-[260px]">
                      Nenhum treino encontrado.
                    </p>
                  </div>
                ) : (
                  filteredWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      onClick={() => router.push(`/workouts/${workout.id}`)}
                    >
                      <WorkoutCard
                        {...workout}
                        onDelete={handleDeleteFromMyWorkouts}
                      />
                    </div>
                  ))
                )}

                {loadingMore &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="protocolos">
              <div className="flex flex-col gap-4">
                {loadingTab ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))
                ) : []?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 h-[300px] text-center">
                    <div className="w-[180px] h-[180px] relative">
                      <Image
                        src="/empty_workout.png"
                        alt="empty workout"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>

                    <p className="text-muted-foreground max-w-[260px]">
                      Nenhum treino encontrado.
                    </p>
                  </div>
                ) : (
                  [].map((workout) => (
                    <div
                      key={workout.id}
                      onClick={() => router.push(`/workouts/${workout.id}`)}
                    >
                      <WorkoutCard
                        {...workout}
                        onDelete={handleDeleteFromMyWorkouts}
                      />
                    </div>
                  ))
                )}

                {loadingMore &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="treinos-favoritos">
              <div className="flex flex-col gap-4">
                {loadingTab ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))
                ) : myFavoriteWorkouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 h-[300px] text-center">
                    <div className="w-[180px] h-[180px] relative">
                      <Image
                        src="/empty_workout.png"
                        alt="empty workout"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>

                    <p className="text-muted-foreground max-w-[260px]">
                      Nenhum treino favorito encontrado.
                    </p>
                  </div>

                ) : (
                  myFavoriteWorkouts.map((workout) => (
                    <div key={workout.id} onClick={() => router.push(`/workouts/${workout?.id}`)}>
                      <WorkoutCard
                        {...workout}
                        onDelete={handleDeleteFromFavorites}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="treinos-curtidos">
              <div className="flex flex-col gap-4">
                {loadingTab
                  ? Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  )) : myLikedWorkouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 h-[300px] text-center">
                      <div className="w-[180px] h-[180px] relative">
                        <Image
                          src="/empty_workout.png"
                          alt="empty workout"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>

                      <p className="text-muted-foreground max-w-[260px]">
                        Nenhum treino curtido encontrado.
                      </p>
                    </div>

                  ) : (
                    myLikedWorkouts.map((workout) => (
                      <div key={workout.id} onClick={() => router.push(`/workouts/${workout?.id}`)}>
                        <WorkoutCard
                          {...workout}
                          onDelete={handleDeleteFromLiked}
                        />
                      </div>
                    ))
                  )}

                {loadingMore &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </MobileLayout>
  );
}
