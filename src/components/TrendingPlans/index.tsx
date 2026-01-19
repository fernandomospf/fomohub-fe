import { cn } from "@/lib/utils";
import { WorkoutPlanResponse } from "@/types/workout-plan";
import { Star, Heart, Flame, Clock } from 'lucide-react';
import { useState } from "react";
import Chip from "../ui/Chip";
import workoutPlanService from "@/api/workout-plan";
import { toast } from "sonner";

export function TrendingPlans({
    id,
    name,
    likes_count,
    calories,
    ratings_count,
    workout_exercises,
    is_liked
}: WorkoutPlanResponse) {
    const [isLiked, setIsLiked] = useState(is_liked ?? false);
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        const res = workoutPlanService.toggleLike(id);
        if (res) {
            setIsLiked(!isLiked);
            toast.success("Treino curtido");
        } else {
            toast.error("Erro ao curtir treino");
        }
    };

    const MAX_RATING: number = 5;
    return (
        <div
            className=" relative overflow-hidden rounded-2xl glass shadow-card cursor-pointer group transition-all duration-300"
            id={`trending-plan-${id}`}
        >
            <div className="pl-3 flex gap-2">
                <Chip label="Publico" />
                <Chip label="Hipertrofia" />
                <Chip label="Emagrecimento" />
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
                                    index < (ratings_count ?? 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
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
                    <label
                        className="text-xs text-muted-foreground"
                    >{likes_count}</label>
                </div>
            </div>

            <div className="flex items-baseline gap-4 px-4 pb-4">
                <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">{calories || 0} kcal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">60 minutos</span>
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