import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { WorkoutCard } from "@/components/organisms/workout/WorkoutCard";
import { WorkoutCardSkeleton } from "@/components/atoms/SkeletonWorkout";
import { Input } from "@/components/atoms/input";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { workoutPlanService } from "@/infra/container";
import { WorkoutsPageSkeleton } from "@/components/atoms/WorkoutsPageSkeleton";
import {
  DataResponseRequest,
  WorkoutPlansResponse,
} from "@/api/WorkoutPlan/types";

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");

  const [myWorkouts, setMyWorkouts] = useState<DataResponseRequest[]>([]);
  const [myLikedWorkouts, setMyLikedWorkouts] = useState<DataResponseRequest[]>([]);
  const [myFavoriteWorkouts, setMyFavoriteWorkouts] = useState<DataResponseRequest[]>([]);

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
      <PageHeader />

      {loadingInitial ? (
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <WorkoutsPageSkeleton key={index} />
          ))}
        </div>
      ) : (
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
                    <WorkoutCardSkeleton key={index} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="treinos-favoritos">
              <div className="flex flex-col gap-4">
                {loadingTab
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <WorkoutCardSkeleton key={index} />
                    ))
                  : myFavoriteWorkouts.map((workout) => (
                      <Link key={workout.id} href={`/workouts/${workout.id}`}>
                        <WorkoutCard {...workout} />
                      </Link>
                    ))}

                {loadingMore &&
                  Array.from({ length: 2 }).map((_, index) => (
                    <WorkoutCardSkeleton key={index} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="treinos-curtidos">
              <div className="flex flex-col gap-4">
                {loadingTab
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <WorkoutCardSkeleton key={index} />
                    ))
                  : myLikedWorkouts.map((workout) => (
                      <Link key={workout.id} href={`/workouts/${workout.id}`}>
                        <WorkoutCard {...workout} />
                      </Link>
                    ))}

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
