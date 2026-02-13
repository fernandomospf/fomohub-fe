import { Heart, Clock, Flame, ChevronRight, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import Chip from "@/components/atoms/Chip";
import { workoutPlanService } from "@/infra/container";
import { WorkoutCardProps } from "./type";

export function WorkoutCard({
  id,
  name,
  duration,
  calories,
  workout_exercises,
  muscle_groups,
  is_favorited,
  is_liked,
  imageUrl,
  is_public,
  onFavorite,
}: WorkoutCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(is_liked ?? false);
  const [isFavorite, setIsFavorite] = useState<boolean>(is_favorited ?? false);
  const [isPublic, setIsPublic] = useState<boolean>(is_public ?? false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await workoutPlanService.toggleFavorite(id);

      setIsFavorite(res.favorite);
      toast.success(
        res.favorite
          ? "Treino adicionado aos favoritos"
          : "Treino removido dos favoritos"
      );

      onFavorite?.();
    } catch (err) {
      toast.error("Erro ao atualizar favoritos");
    }
  };


  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const res = workoutPlanService.toggleLike(id);
    if (res) {
      setIsLiked((prev) => !prev);
      toast.success("Treino curtido");
    } else {
      toast.error("Erro ao curtir treino");
    }
  };

const handleTogglePublic = async () => {
  try {
    if(isPublic){
      await workoutPlanService.turnPrivate(id);
      setIsPublic(false);
      toast.success("Treino tornado privado");
    }else{
      await workoutPlanService.turnPublic(id);
      setIsPublic(true);
      toast.success("Treino tornado público");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao atualizar treino");
  }
};


  const CHIP_CATEGORY = muscle_groups ? [...muscle_groups] : [];
  return (
    <div
      className="
        relative 
        overflow-hidden 
        rounded-2xl 
        glass 
        cursor-pointer 
        group 
        transition-all 
        duration-300
        w-full
        "
    >
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            {
              CHIP_CATEGORY.slice(0, 4).map((chip, index) => (
                <Chip key={index} label={chip} view={true} />
              ))
            }
            {CHIP_CATEGORY.length > 3 && (
              <Chip label="..." view={false} />
            )}
          </div>
          <div>
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isFavorite
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Bookmark
                  className={cn(
                    "w-5 h-5 transition-all",
                    isFavorite && "fill-current"
                  )}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(e);
                }}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-muted-foreground"
                style={{
                  color: isPublic ? '#4CAF50' : '#9E9E9E',
                  transition: 'color 0.3s ease',
                }}
              >
                {isPublic ? 'Público' : 'Privado'}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTogglePublic();
                }}
                style={{
                  border: '1px solid #9E9E9E',
                  borderRadius: '10px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '40px',
                  height: '20px',
                  position: 'relative',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isPublic ? '#4CAF50' : '#9E9E9E',
                    position: 'absolute',
                    top: '50%',
                    left: '4px',
                    transform: isPublic
                      ? 'translateX(0) translateY(-50%)'
                      : 'translateX(20px) translateY(-50%)',
                    transition: 'transform 0.5s ease, background-color 0.3s ease',
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2">{name}</h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration ? duration : "60 min"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{calories ? calories : "350 cal"}</span>
          </div>
          <span>{workout_exercises?.length || 0} exercícios</span>
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
