import { useState } from "react";
import { Search, Plus, Filter, Calendar as CalendarIcon, MapPin, Ticket } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/events/EventCard";

const categories = [
  { id: "all", label: "Todos", icon: Ticket },
  { id: "catraca", label: "Catraca Livre", icon: Ticket },
  { id: "degustacao", label: "Degustação", icon: Ticket },
  { id: "corrida", label: "Corrida", icon: Ticket },
  { id: "trilha", label: "Trilha", icon: Ticket },
];

const eventsData = [
  {
    id: 1,
    title: "Catraca Livre - Smart Fit Paulista",
    category: "Catraca Livre",
    location: "Av. Paulista, 1000 - São Paulo",
    date: "15 Jan",
    time: "06:00 - 22:00",
    participants: 234,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    isFree: true,
  },
  {
    id: 2,
    title: "Degustação Whey Protein - Max Titanium",
    category: "Degustação",
    location: "Loja Corpo Perfeito - Shopping Vila Olímpia",
    date: "18 Jan",
    time: "14:00 - 18:00",
    participants: 89,
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    isFree: true,
  },
  {
    id: 3,
    title: "Corrida Noturna SP - 5km",
    category: "Corrida",
    location: "Parque Ibirapuera",
    date: "20 Jan",
    time: "19:00",
    participants: 456,
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
    isFree: false,
  },
  {
    id: 4,
    title: "Trilha Pico do Jaraguá",
    category: "Trilha",
    location: "Parque Estadual do Jaraguá",
    date: "22 Jan",
    time: "07:00",
    participants: 32,
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
    isFree: false,
  },
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      event.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <PageHeader
        title="Eventos"
        rightElement={
          <Button variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Criar
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                selectedCategory === cat.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Event */}
        {filteredEvents.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={filteredEvents[0].imageUrl}
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium mb-2 inline-block">
                Em destaque
              </span>
              <h3 className="font-bold text-lg mb-2">{filteredEvents[0].title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{filteredEvents[0].date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{filteredEvents[0].location.split(" - ")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="space-y-4">
          <h3 className="font-bold">Próximos Eventos</h3>
          {filteredEvents.slice(1).map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum evento encontrado</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
