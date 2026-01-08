import { Heart, Clock, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  title: string;
  category: string;
  duration: string;
  calories: string;
  exercises: number;
  isFavorite?: boolean;
  imageUrl?: string;
  onClick?: () => void;
  onFavorite?: () => void;
}

export function WorkoutCard({
  title,
  category,
  duration,
  calories,
  exercises,
  isFavorite,
  imageUrl,
  onClick,
  onFavorite,
}: WorkoutCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl glass shadow-card cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
    >
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full gradient-primary text-primary-foreground">
            {category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}
            className={cn(
              "p-2 rounded-full transition-all",
              isFavorite
                ? "text-red-500 bg-red-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>
        </div>

        <h3 className="text-lg font-bold mb-2">{title}</h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{calories}</span>
          </div>
          <span>{exercises} exercícios</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Toque para iniciar
          </span>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChevronRight className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
