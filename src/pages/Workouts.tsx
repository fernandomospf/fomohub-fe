import { useEffect, useState } from "react";
import { Dumbbell, Plus, Search } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import workoutPlanService from "@/api/workout-plan";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myWorkouts, setMyWorkouts] = useState<any[]>([]);
  const [myLikedWorkouts, setMyLikedWorkouts] = useState<any[]>([]);
  const [myFavoriteWorkouts, setMyFavoriteWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("meus-treinos");

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasWorkouts =
    myWorkouts.length > 0 ||
    myLikedWorkouts.length > 0 ||
    myFavoriteWorkouts.length > 0;

  // 🔹 Carga inicial
  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      try {
        setLoading(true);

        const [plans, liked, favorites] = await Promise.all([
          workoutPlanService.getAllMyPlans(),
          workoutPlanService.listMyLikedPlans(),
          workoutPlanService.listMyFavoritePlans(),
        ]);

        if (!mounted) return;

        setMyWorkouts(plans);
        setMyLikedWorkouts(liked);
        setMyFavoriteWorkouts(favorites);
      } catch (err) {
        console.error("Erro ao carregar treinos:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInitial();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Recarrega ao trocar de aba
  useEffect(() => {
    let mounted = true;

    async function loadByTab() {
      try {
        setLoading(true);

        if (activeTab === "meus-treinos") {
          const plans = await workoutPlanService.getAllMyPlans();
          if (mounted) setMyWorkouts(plans);
        }

        if (activeTab === "treinos-curtidos") {
          const plans = await workoutPlanService.listMyLikedPlans();
          if (mounted) setMyLikedWorkouts(plans);
        }

        if (activeTab === "treinos-favoritos") {
          const plans = await workoutPlanService.listMyFavoritePlans();
          if (mounted) setMyFavoriteWorkouts(plans);
        }
      } catch (err) {
        console.error("Erro ao buscar planos:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadByTab();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  return (
    <MobileLayout>
      <PageHeader title="Meus Treinos" />

      {loading ? (
        <Loading />
      ) : hasWorkouts ? (
        <div className="px-4 py-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar treinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary border-0 rounded-xl"
            />
          </div>

          <Link to="/workouts/new">
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meus-treinos">Meus treinos</TabsTrigger>
              <TabsTrigger value="treinos-favoritos">Favoritos</TabsTrigger>
              <TabsTrigger value="treinos-curtidos">Curtidos</TabsTrigger>
            </TabsList>

            {/* 🏋️ Meus Treinos */}
            <TabsContent value="meus-treinos">
              <div className="space-y-4">
                {filteredWorkouts.map((workout) => (
                  <Link key={workout.id} to={`/workouts/${workout.id}`}>
                    <WorkoutCard {...workout} />
                  </Link>
                ))}

                {filteredWorkouts.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">
                    Nenhum treino encontrado
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="treinos-favoritos">
              {myFavoriteWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {myFavoriteWorkouts.map((workout) => (
                    <Link key={workout.id} to={`/workouts/${workout.id}`}>
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
              {myLikedWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {myLikedWorkouts.map((workout) => (
                    <Link key={workout.id} to={`/workouts/${workout.id}`}>
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
            <Link to="/workouts/new">
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
