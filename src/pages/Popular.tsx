import { useState } from "react";
import { Search, Filter, TrendingUp } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { WorkoutCard } from "@/components/organisms/workout/WorkoutCard";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";

const popularWorkouts = [
  {
    id: 1,
    title: "Treino Push Completo",
    category: "Força",
    duration: "50min",
    calories: "380 kcal",
    exercises: 9,
    isFavorite: true,
    likes: 1234,
  },
  {
    id: 2,
    title: "Pernas Destruidor",
    category: "Hipertrofia",
    duration: "65min",
    calories: "520 kcal",
    exercises: 12,
    isFavorite: false,
    likes: 987,
  },
  {
    id: 3,
    title: "Full Body Express",
    category: "Funcional",
    duration: "30min",
    calories: "280 kcal",
    exercises: 8,
    isFavorite: false,
    likes: 856,
  },
  {
    id: 4,
    title: "Costas & Bíceps Power",
    category: "Força",
    duration: "55min",
    calories: "400 kcal",
    exercises: 10,
    isFavorite: true,
    likes: 743,
  },
  {
    id: 5,
    title: "HIIT Cardio Blast",
    category: "Cardio",
    duration: "25min",
    calories: "350 kcal",
    exercises: 6,
    isFavorite: false,
    likes: 621,
  },
];

const categories = ["Todos", "Força", "Hipertrofia", "Funcional", "Cardio"];

export default function Popular() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredWorkouts = popularWorkouts.filter((workout) => {
    const matchesSearch = workout.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <PageHeader title="Treinos Populares" showBack />

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

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Trending Badge */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Mais curtidos esta semana</span>
        </div>

        {/* Workout List */}
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              {...workout}
              onClick={() => {}}
              onFavorite={() => {}}
            />
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
