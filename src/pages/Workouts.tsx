import { useEffect, useState } from "react";
import { Loader, Plus, Search } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import workoutPlanService from "@/api/workout-plan";


export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let mounted = true;
    async function loadMyPlans() {
      try {
        setLoading(true);
        const plans = await workoutPlanService.getAllMyPlans();

        if (!mounted) return;

        setMyWorkouts(plans);
      } catch (err) {
        console.error("Erro ao buscar planos:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMyPlans();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MobileLayout>
      <PageHeader title="Meus Treinos" />
      {
        loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]" >
            <Loader
              className="animate-spin text-muted-foreground "
              size={24}
            />
            <p className="text-muted-foreground">
              Carregando seus treinos...
            </p>
          </div>
        ) : (
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

            <Link to="/workouts/new" >
              <div style={{ marginTop: '1.5rem' }} className="glass rounded-2xl p-4 flex items-center gap-4 border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Criar Nova Ficha</p>
                  <p className="text-sm text-muted-foreground">
                    Monte seu treino personalizado
                  </p>
                </div>
              </div>
            </Link>


            <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {filteredWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  to={`/workouts/${workout.id}`}
                  id={workout?.id}
                >
                  <WorkoutCard
                    {...workout}
                    onFavorite={() => { }}
                  />
                </Link>
              ))}
            </div>

            {filteredWorkouts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum treino encontrado
                </p>
              </div>
            )}
          </div>
        )
      }
    </MobileLayout>
  );
}
