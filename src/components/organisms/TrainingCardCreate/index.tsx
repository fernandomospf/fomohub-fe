import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { TrainingCardCreateProps, FormWithExercises } from "./type";
import { Path } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";

export function TrainingCardCreate<T extends FormWithExercises>({
    fields,
    register,
    remove,
}: TrainingCardCreateProps<T>) {
    const { t } = useTranslate();
    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="glass rounded-xl p-4 animate-scale-in"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-medium">
                            {index + 1}
                        </span>

                        <Input
                            placeholder={t('new_workout.exercise_name_placeholder')}
                            className="flex-1 h-10 bg-secondary border-0 rounded-lg"
                            {...register(`exercises.${index}.name` as Path<T>, {
                                required: true,
                            })}
                        />

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => remove(index)}
                            className={cn(
                                "text-muted-foreground hover:text-destructive",
                                fields.length === 1 && "opacity-50 pointer-events-none"
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block">
                                {t('new_workout.sets_label')}
                            </label>
                            <Input
                                type="number"
                                className="h-10 bg-secondary border-0 rounded-lg text-center"
                                {...register(`exercises.${index}.sets` as Path<T>, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block">
                                {t('new_workout.reps_label')}
                            </label>
                            <Input
                                type="number"
                                className="h-10 bg-secondary border-0 rounded-lg text-center"
                                {...register(`exercises.${index}.reps` as Path<T>, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block">
                                {t('new_workout.weight_label')}
                            </label>
                            <Input
                                type="number"
                                className="h-10 bg-secondary border-0 rounded-lg text-center"
                                {...register(`exercises.${index}.weight` as Path<T>, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-muted-foreground mb-1 block">
                                {t('new_workout.rest_time_label')}
                            </label>
                            <Input
                                type="number"
                                className="h-10 bg-secondary border-0 rounded-lg text-center"
                                {...register(
                                    `exercises.${index}.restTimeSeconds` as Path<T>,
                                    { valueAsNumber: true }
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}