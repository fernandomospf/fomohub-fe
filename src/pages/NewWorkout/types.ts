interface ExerciseForm {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    restTimeSeconds: number;
}

interface NewWorkoutForm {
    name: string;
    isPublic: boolean;
    exercises: ExerciseForm[];
    workoutType: string;
    muscleGroups: string[];
    goals: string[];
    trainingTime: string;
}

export type { ExerciseForm, NewWorkoutForm };