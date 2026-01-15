import { WorkoutExerciseFormValues } from './workout-exercise-form';

export interface WorkoutPlanWithExercisesFormValues {
  name: string;
  isPublic: boolean;
  exercises: WorkoutExerciseFormValues[];
}
