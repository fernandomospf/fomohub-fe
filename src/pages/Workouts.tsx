import { useEffect, useState } from "react";
import { Dumbbell, Loader, Plus, Search } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import workoutPlanService from "@/api/workout-plan";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/ui/empty-state";


export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const hasWorkouts = !!filteredWorkouts.length;

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
          <Loading />
        ) : hasWorkouts ? (
          <span>Tem treino</span>
        ) : (
          <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
        )
      }
    </MobileLayout>
  );
}
