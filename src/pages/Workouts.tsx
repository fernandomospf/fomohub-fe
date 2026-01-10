import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const myWorkouts = [
  {
    id: 1,
    title: "Treino A - Push",
    category: "Peito/Tríceps",
    duration: "50min",
    calories: "350 kcal",
    exercises: 8,
    isFavorite: true,
  },
  {
    id: 2,
    title: "Treino B - Pull",
    category: "Costas/Bíceps",
    duration: "55min",
    calories: "380 kcal",
    exercises: 9,
    isFavorite: false,
  },
  {
    id: 3,
    title: "Treino C - Legs",
    category: "Pernas",
    duration: "60min",
    calories: "450 kcal",
    exercises: 10,
    isFavorite: true,
  },
];

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkouts = myWorkouts.filter((workout) =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout>
      <PageHeader title="Meus Treinos" />

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar treinos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Add New Workout */}
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

        {/* Workout List */}
        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {filteredWorkouts.map((workout) => (
            <Link 
              key={workout.id} 
              to={`/workouts/${workout.id}`}
            >
              <WorkoutCard
                {...workout}
                onFavorite={() => {}}
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
    </MobileLayout>
  );
}
