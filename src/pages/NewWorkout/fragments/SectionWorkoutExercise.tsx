type SectionWorkoutExerciseProps = {
    label: string;
    description?: string;
    children: React.ReactNode;
}

export function SectionWorkoutExercise({
    label,
    description,
    children
}: SectionWorkoutExerciseProps) {
    return (
        <div>
            <label className="text-md text-muted-foreground mb-2 block">
                {label}
            </label>
            {description && (
                <p className="text-sm text-muted-foreground mb-3">
                    {description}
                </p>
            )}
            {children}
        </div>
    )
}