export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight: number;
  created_at: string;
  updated_at: string;
  workout_plan_id: string;
  rest_time_seconds: number;
}

export interface WorkoutCardProps {
  id: string;
  name: string;
  category: string;
  duration: string;
  calories: string;
  is_liked: boolean;
  workout_exercises: Array<Exercise>;
  is_public?: boolean;
  is_favorite?: boolean;
  like_count?: number;
  ratings_count?: number;
  muscle_groups?: Array<string>;
  goals?: Array<string>;
  imageUrl?: string;
  onClick?: () => void;
  onFavorite?: () => void;
}

export type Goal = 'hipertrofia' | string;
export type MuscleGroup = 'glúteos' | 'pernas' | string;

export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;

  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time_seconds: number;

  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  goals: Goal[];
  muscle_groups: MuscleGroup[];
  training_time: number;
  calories: number | null;
  is_favorite: boolean;
  is_liked: boolean;
  is_public: boolean;
  likes_count: number;
  rating_average: number | null;
  ratings_count: number;
  source_plan_id: string | null;
  created_at: string;
  updated_at: string;
  workout_exercises: WorkoutExercise[];
  category?: string;
  duration?: string;
  imageUrl?: string;
  onFavorite?: () => void;
}
