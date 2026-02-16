import {
  Heart,
  Clock,
  Flame,
  ChevronRight,
  Bookmark,
  MoreHorizontal,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Chip from "@/components/atoms/Chip";
import { workoutPlanService } from "@/infra/container";
import { WorkoutPlan } from "./type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

interface WorkoutCardProps extends WorkoutPlan {
  onDelete?: (id: string) => void;
}

export function WorkoutCard({
  id,
  name,
  calories,
  duration,
  imageUrl,
  workout_exercises,
  muscle_groups,
  is_favorited,
  is_liked,
  is_public,
  onFavorite,
  onDelete,
}: WorkoutCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(is_liked ?? false);
  const [isFavorite, setIsFavorite] = useState<boolean>(is_favorited ?? false);
  const [isPublic, setIsPublic] = useState<boolean>(is_public ?? false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(is_liked ?? false);
  }, [is_liked]);

  useEffect(() => {
    setIsFavorite(is_favorited ?? false);
  }, [is_favorited]);

  useEffect(() => {
    setIsPublic(is_public ?? false);
  }, [is_public]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    try {
      const res = await workoutPlanService.toggleFavorite(id);
      setIsFavorite(res.favorite);

      toast.success(
        res.favorite
          ? "Treino adicionado aos favoritos"
          : "Treino removido dos favoritos"
      );

      onFavorite?.();
    } catch {
      toast.error("Erro ao atualizar favoritos");
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    try {
      const res = await workoutPlanService.toggleLike(id);
      setIsLiked(res.liked);

      toast.success(
        res.liked ? "Treino curtido" : "Curtida removida"
      );
    } catch {
      toast.error("Erro ao curtir treino");
    }
  };

  const handleTogglePublic = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    try {
      if (isPublic) {
        await workoutPlanService.turnPrivate(id);
        setIsPublic(false);
        toast.success("Treino tornado privado");
      } else {
        await workoutPlanService.turnPublic(id);
        setIsPublic(true);
        toast.success("Treino tornado público");
      }
    } catch {
      toast.error("Erro ao atualizar treino");
    }
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    try {
      setIsDeleting(true);

      await workoutPlanService.deletePlan(id);

      toast.success("Treino excluído com sucesso");

      onDelete?.(id);

      setIsDeleteModalOpen(false);
      setIsMenuOpen(false);
    } catch {
      toast.error("Erro ao excluir treino");
    } finally {
      setIsDeleting(false);
    }
  };

  const CHIP_CATEGORY = muscle_groups ? [...muscle_groups] : [];

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl glass cursor-pointer group transition-all duration-300 w-full">
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2 flex-wrap">
              {CHIP_CATEGORY.slice(0, 4).map((chip, index) => (
                <Chip key={index} label={chip} view />
              ))}
              {CHIP_CATEGORY.length > 4 && (
                <Chip label="..." view={false} />
              )}
            </div>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem onClick={handleFavorite}>
                  <Bookmark
                    className={cn(
                      "w-4 h-4 mr-2",
                      isFavorite && "fill-current"
                    )}
                  />
                  {isFavorite ? "Remover favorito" : "Favoritar"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLike}>
                  <Heart
                    className={cn(
                      "w-4 h-4 mr-2",
                      isLiked && "fill-red-500 text-red-500"
                    )}
                  />
                  {isLiked ? "Descurtir" : "Curtir"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleTogglePublic}>
                  {isPublic ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Tornar privado
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Tornar público
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={openDeleteModal}>
                  <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-red-500">Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="text-lg font-bold mb-2">{name}</h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{duration ?? "60 min"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{calories ?? "350 cal"}</span>
            </div>
            <span>{workout_exercises?.length ?? 0} exercícios</span>
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

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-card rounded-xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Confirmar exclusão
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
              Você tem certeza que deseja excluir este treino?
              Essa ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
