import { useEffect, useRef, useState } from "react";
import { Dumbbell, Plus, Search } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { WorkoutCard } from "@/components/organisms/workout/WorkoutCard";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import Link from "next/link";
import { EmptyState } from "@/components/atoms/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { workoutPlanService } from "@/infra/container";
import { DataResponseRequest } from "@/api/WorkoutPlan/types";
import { WorkoutPlan } from "@/types/workout-plan";
import { WorkoutCardSkeleton } from "@/components/atoms/SkeletonWorkout";
import { WorkoutsPageSkeleton } from "@/components/atoms/WorkoutsPageSkeleton";

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myWorkouts, setMyWorkouts] = useState<DataResponseRequest[]>([]);
  const [myLikedWorkouts, setMyLikedWorkouts] = useState<WorkoutPlan[]>([]);
  const [myFavoriteWorkouts, setMyFavoriteWorkouts] = useState<WorkoutPlan[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("meus-treinos");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  async function loadWorkouts(nextPage = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      else if (nextPage === 1) setLoadingInitial(true);

      const response = await workoutPlanService.getAllMyPlans({
        page: nextPage,
        limit: 10,
      });

      const newData = response.data;

      setMyWorkouts((prev) =>
        append ? [...prev, ...newData] : newData
      );

      setHasMore(nextPage < response.meta.lastPage);
      setPage(nextPage);
    } catch (err) {
      console.error("Erro ao carregar treinos:", err);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadWorkouts(1, false);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const reachedBottom =
        scrollTop + clientHeight >= scrollHeight - 200;

      if (reachedBottom && hasMore && !loadingMore) {
        loadWorkouts(page + 1, true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    async function loadByTab() {
      try {
        setLoadingTab(true);

        if (activeTab === "treinos-curtidos") {
          const plans = await workoutPlanService.listMyLikedPlans();
          setMyLikedWorkouts(plans || []);
        }

        if (activeTab === "treinos-favoritos") {
          const plans = await workoutPlanService.listMyFavoritePlans();
          setMyFavoriteWorkouts(plans || []);
        }

        if (activeTab === "meus-treinos") {
          setPage(1);
          setHasMore(true);
          await loadWorkouts(1, false);
        }
      } catch (err) {
        console.error("Erro ao buscar planos:", err);
      } finally {
        setLoadingTab(false);
      }
    }

    loadByTab();
  }, [activeTab]);

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasWorkouts =
    myWorkouts.length > 0 ||
    myLikedWorkouts.length > 0 ||
    myFavoriteWorkouts.length > 0;

  return (
    <MobileLayout ref={scrollContainerRef}>
      <PageHeader />
      {loadingInitial ? (
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <WorkoutsPageSkeleton key={`more-${index}`} />
          ))}
        </div>
      ) : hasWorkouts ? (
        <div className="px-4 py-6 space-y-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar treinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary border-0 rounded-xl"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meus-treinos">Meus treinos</TabsTrigger>
              <TabsTrigger value="treinos-favoritos">Favoritos</TabsTrigger>
              <TabsTrigger value="treinos-curtidos">Curtidos</TabsTrigger>
            </TabsList>

            <TabsContent value="meus-treinos">
              <div className="flex flex-col gap-4">
                {filteredWorkouts.map((workout) => (
                  <Link key={workout.id} href={`/workouts/${workout.id}`}>
                    <WorkoutCard {...workout} />
                  </Link>
                ))}

                {loadingMore &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <WorkoutCardSkeleton key={`more-${index}`} />
                  ))}

                {filteredWorkouts.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    Nenhum treino encontrado
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="treinos-favoritos">
              {loadingTab ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
                </div>
              ) : myFavoriteWorkouts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {myFavoriteWorkouts.map((workout) => (
                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                      <WorkoutCard {...workout} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Você ainda não favoritou nenhum treino
                </p>
              )}
            </TabsContent>

            <TabsContent value="treinos-curtidos">
              {loadingTab ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
                </div>
              ) : myLikedWorkouts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {myLikedWorkouts.map((workout) => (
                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                      <WorkoutCard {...workout} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Você ainda não curtiu nenhum treino
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          <EmptyState
            icon={Dumbbell}
            title="Nenhum treino cadastrado"
            description="Crie sua primeira ficha de treino e comece a acompanhar sua evolução!"
          >
            <Link href="/workouts/new">
              <Button className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro treino
              </Button>
            </Link>
          </EmptyState>
        </div>
      )}
    </MobileLayout>
  );
}
