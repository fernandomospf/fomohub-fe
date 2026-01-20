import { Calendar, MapPin, Users, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  imageUrl?: string;
  isFree?: boolean;
  onClick?: () => void;
}

export function EventCard({
  title,
  category,
  location,
  date,
  time,
  participants,
  imageUrl,
  isFree,
  onClick,
}: EventCardProps) {
  const getCategoryColor = () => {
    switch (category) {
      case "Catraca Livre":
        return "bg-green-500/20 text-green-400";
      case "Degustação":
        return "bg-orange-500/20 text-orange-400";
      case "Corrida":
        return "bg-blue-500/20 text-blue-400";
      case "Trilha":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
    >
      {imageUrl && (
        <div className="relative h-32 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {isFree && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-semibold">
              Grátis
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor())}>
            {category}
          </span>
        </div>

        <h3 className="font-bold mb-3">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{participants} participantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
