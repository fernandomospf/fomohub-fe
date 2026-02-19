import { Play, CheckCircle, Clock, Dumbbell } from "lucide-react";
import { Button } from "@/components/atoms/button";
import Link from "next/link";

interface ActiveWorkoutBannerProps {
    workoutId: number;
    workoutName: string;
    completedSets: number;
    totalSets: number;
    elapsedMinutes: number;
    onFinish: () => void;
}

export function ActiveWorkoutBanner({
    workoutId,
    workoutName,
    completedSets,
    totalSets,
    elapsedMinutes,
    onFinish,
}: ActiveWorkoutBannerProps) {
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card shadow-glow">
            <div className="absolute inset-0 opacity-10 gradient-primary" />

            <div className="relative z-10 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            Treino Ativo
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{elapsedMinutes} min</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="font-bold text-foreground truncate">{workoutName}</p>
                </div>

                <div className="mb-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">
                            {completedSets}/{totalSets} séries
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                            className="h-full gradient-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Link href={`/workouts/${workoutId}`} className="flex-1">
                        <Button variant="gradient" size="sm" className="w-full gap-2">
                            <Play className="w-4 h-4" />
                            Continuar
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={onFinish}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Concluir
                    </Button>
                </div>
            </div>
        </div>
    );
}
