import { cn } from "@/lib/utils";
import { WorkoutPlanResponse } from "@/types/workout-plan";
import { Star, Heart, Flame, Clock } from "lucide-react";
import { useState } from "react";
import Chip from "@/components/atoms/Chip";
import { workoutPlanService } from "@/infra/container";
import { toast } from "sonner";

export function TrendingPlans({
    id,
    name,
    likes_count,
    calories,
    ratings_count,
    workout_exercises,
    is_liked,
    is_public,
    muscle_groups,
    goals,
}: WorkoutPlanResponse) {
    const [isLiked, setIsLiked] = useState(is_liked ?? false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const res = await workoutPlanService.toggleLike(id);
            if (res) {
                setIsLiked((prev) => !prev);
                toast.success("Treino curtido");
            } else {
                toast.error("Erro ao curtir treino");
            }
        } catch {
            toast.error("Erro ao curtir treino");
        }
    };

    const MAX_RATING = 5;

    type ChipItem = {
        label: string;
        type: "public" | "goal" | "muscle";
    };

    const allChips = [
        ...(is_public ? [{ label: "Publico", variant: "public" }] : []),
        ...(goals?.map((g) => ({ label: g, variant: "goal" })) || []),
        ...(muscle_groups?.map((m) => ({ label: m, variant: "muscle" })) || []),
    ];

    return (
        <div
            className="relative overflow-hidden rounded-2xl glass shadow-card cursor-pointer group transition-all duration-300"
            id={`trending-plan-${id}`}
        >
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    scrollBehavior: "smooth",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                }}
                onWheel={(e) => {
                    if (e.deltaY !== 0) {
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}
            >
                {allChips.map((chip, index) => (
                    <Chip
                        key={index}
                        label={chip.label}
                        selected={chip.variant === "public"}
                        view={chip.variant === "view"}
                        customBackgroundColor={chip.variant === "public" ? "#b3591dff" : chip.variant === "goal" ? "#7c3aed" : chip.variant === "muscle" ? "#202126" : "#202126"}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-2">
                    <h4>{name}</h4>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: MAX_RATING }).map((_, index) => (
                            <Star
                                key={index}
                                className={cn(
                                    "w-3 h-3",
                                    index < (ratings_count ?? 0)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <button onClick={handleLike}>
                        <Heart
                            className={cn(
                                "w-4 h-4 cursor-pointer transition-colors",
                                isLiked ? "fill-red-500 stroke-none" : "text-muted-foreground"
                            )}
                        />
                    </button>
                    <label className="text-xs text-muted-foreground">
                        {isLiked ? likes_count + 1 : likes_count}
                    </label>
                </div>
            </div>

            <div className="flex items-baseline gap-4 px-4 pb-4">
                <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">
                        {calories || 0} kcal
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        60 minutos
                    </span>
                </div>

                <div className="ml-auto">
                    <p className="text-sm text-muted-foreground">
                        {workout_exercises?.length || 0} exercícios
                    </p>
                </div>
            </div>
        </div>
    );
}
