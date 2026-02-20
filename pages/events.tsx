import { useEffect, useState } from "react";
import { Search, Plus, Calendar as CalendarIcon, MapPin, Ticket } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/organisms/events/EventCard";
import { useRouter } from "next/router";
import { eventsService } from "@/infra/container";
import { Event } from "@/api/Events/types";
import { Loading } from "@/components/atoms/Loading";

const categories = [
  { id: "all", label: "Todos", icon: Ticket },
  { id: "catraca", label: "Catraca Livre", icon: Ticket },
  { id: "degustacao", label: "Degustação", icon: Ticket },
  { id: "corrida", label: "Corrida", icon: Ticket },
  { id: "trilha", label: "Trilha", icon: Ticket },
];

function formatEventDate(isoDate: string) {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsService.list();
        const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
        setEvents(list);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (event.category ?? "").toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <MobileLayout>
      <PageHeader
        rightElement={
          <Button variant="gradient" size="sm" onClick={() => router.push("/create-event")}>
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

        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Featured Event */}
            {filteredEvents.length > 0 && (() => {
              const featured = filteredEvents[0];
              const { date, time } = formatEventDate(featured.event_date);
              return (
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/events/${featured.id}`)}
                >
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 gradient-primary opacity-60" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium mb-2 inline-block">
                      Em destaque
                    </span>
                    <h3 className="font-bold text-lg mb-2">{featured.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{date} · {time}</span>
                      </div>
                      {featured.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{featured.location.split(" - ")[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {filteredEvents.length > 1 && (
              <div className="space-y-4">
                <h3 className="font-bold">Próximos Eventos</h3>
                {filteredEvents.slice(1).map((event) => {
                  const { date, time } = formatEventDate(event.event_date);
                  return (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      category={event.category ?? ""}
                      location={event.location ?? ""}
                      date={date}
                      time={time}
                      participants={event.participants ?? 0}
                      imageUrl={event.image_url}
                      isFree={event.is_free}
                      onClick={() => router.push(`/events/${event.id}`)}
                    />
                  );
                })}
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento encontrado</p>
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
