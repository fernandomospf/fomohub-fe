import { useState } from "react";
import { Search, Filter, Star, Dumbbell, Apple, BadgeCheck } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { ProfessionalCard } from "@/components/organisms/professionals/ProfessionalCard";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Todos", icon: Star },
  { id: "personal", label: "Personal", icon: Dumbbell },
  { id: "nutri", label: "Nutricionista", icon: Apple },
];

const professionalsData = [
  {
    id: 1,
    name: "Ricardo Mendes",
    avatar: "https://i.pravatar.cc/150?img=11",
    specialty: "Personal Trainer",
    rating: 4.9,
    reviews: 234,
    price: 150,
    experience: "8 anos",
    isVerified: true,
    isAvailable: true,
    category: "personal",
  },
  {
    id: 2,
    name: "Dra. Camila Santos",
    avatar: "https://i.pravatar.cc/150?img=23",
    specialty: "Nutricionista Esportiva",
    rating: 4.8,
    reviews: 189,
    price: 200,
    experience: "6 anos",
    isVerified: true,
    isAvailable: true,
    category: "nutri",
  },
  {
    id: 3,
    name: "Fernando Costa",
    avatar: "https://i.pravatar.cc/150?img=12",
    specialty: "Personal Trainer - Hipertrofia",
    rating: 4.7,
    reviews: 156,
    price: 120,
    experience: "5 anos",
    isVerified: true,
    isAvailable: false,
    category: "personal",
  },
  {
    id: 4,
    name: "Dra. Ana Paula",
    avatar: "https://i.pravatar.cc/150?img=25",
    specialty: "Nutricionista - Emagrecimento",
    rating: 4.9,
    reviews: 312,
    price: 180,
    experience: "10 anos",
    isVerified: true,
    isAvailable: true,
    category: "nutri",
  },
  {
    id: 5,
    name: "Lucas Oliveira",
    avatar: "https://i.pravatar.cc/150?img=13",
    specialty: "Personal Trainer - Funcional",
    rating: 4.6,
    reviews: 98,
    price: 100,
    experience: "3 anos",
    isVerified: false,
    isAvailable: true,
    category: "personal",
  },
];

export default function Professionals() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfessionals = professionalsData.filter((pro) => {
    const matchesSearch =
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || pro.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <PageHeader title="Profissionais" />

      <div className="px-4 py-6 space-y-6">
        {/* Info Banner */}
        <div className="glass rounded-2xl p-4 border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <BadgeCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Profissionais Verificados</h4>
              <p className="text-sm text-muted-foreground">
                Todos os profissionais com selo são certificados e passaram por análise
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar profissional..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                selectedCategory === cat.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Professionals List */}
        <div className="space-y-4">
          {filteredProfessionals.map((pro) => (
            <ProfessionalCard
              key={pro.id}
              {...pro}
              onClick={() => {}}
              onBook={() => {}}
            />
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum profissional encontrado</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
