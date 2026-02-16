import { Trophy, Clock, Flame, Dumbbell, BarChart3, Share2, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { useRouter } from "next/router";
interface WorkoutCompleteProps {
    workoutName: string;
    totalSets: number;
    totalExercises: number;
    duration?: string;
    calories?: number;
    onClose: () => void;
}
export function WorkoutComplete({
    workoutName,
    totalSets,
    totalExercises,
    duration = "48:32",
    calories = 350,
    onClose,
}: WorkoutCompleteProps) {
    const router = useRouter();
    const stats = [
        { label: "Duração", value: duration, icon: <Clock className="w-5 h-5" /> },
        { label: "Calorias", value: `${calories}`, unit: "kcal", icon: <Flame className="w-5 h-5" /> },
        { label: "Séries", value: `${totalSets}`, icon: <BarChart3 className="w-5 h-5" /> },
        { label: "Exercícios", value: `${totalExercises}`, icon: <Dumbbell className="w-5 h-5" /> },
    ];

    const handleClose = () => {
        onClose();
        router.push("/workouts");
    }

    return (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md">
            <div className="flex flex-col h-screen">

                <div className="w-full flex justify-end p-6">
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-6">
                    <div className="flex flex-col items-center text-center gap-6 max-w-sm mx-auto pb-6">

                        <div className="relative animate-scale-in">
                            <div className="w-28 h-28 rounded-full gradient-primary flex items-center justify-center shadow-xl shadow-primary/30">
                                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                                    <Trophy className="w-12 h-12 text-primary" />
                                </div>
                            </div>
                            <div className="absolute -inset-3 rounded-full border-2 border-primary/20 animate-[pulse_2s_ease-in-out_infinite]" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Treino Concluído! 💪</h1>
                            <p className="text-muted-foreground">
                                Você finalizou{" "}
                                <span className="text-foreground font-semibold">
                                    {workoutName}
                                </span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="glass rounded-2xl p-4 flex flex-col items-center gap-2 animate-scale-in"
                                    style={{
                                        animationDelay: `${(i + 1) * 100}ms`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        {stat.icon}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold leading-tight">
                                            {stat.value}
                                            {stat.unit && (
                                                <span className="text-xs text-muted-foreground ml-0.5">
                                                    {stat.unit}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <div className="w-full max-w-sm mx-auto px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-3">
                    <Button
                        variant="gradient"
                        size="lg"
                        className="w-full"
                        onClick={handleClose}
                    >
                        Finalizar
                    </Button>

                    <Button 
                        variant="glass" 
                        size="lg" 
                        className="w-full gap-2"
                        disabled={true}
                    >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                    </Button>
                </div>

            </div>
        </div>
    );
}