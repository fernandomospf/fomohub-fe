import { FieldArrayWithId, UseFieldArrayRemove, UseFormRegister, FieldValues } from "react-hook-form";

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
    restTimeSeconds: number;
}

interface FormWithExercises extends FieldValues {
    exercises: Exercise[];
}

interface TrainingCardCreateProps<T extends FormWithExercises> {
    fields: FieldArrayWithId<FormWithExercises, "exercises", "id">[];
    register: UseFormRegister<T>;
    remove: UseFieldArrayRemove;
}

export type {
    TrainingCardCreateProps,
    Exercise,
    FormWithExercises
};
