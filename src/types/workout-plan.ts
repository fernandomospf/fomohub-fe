export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;
  name: string;
  sets: number;
  reps?: number | null;
  weight?: number | null;
  rest_time_seconds?: number | null;
  notes?: string | null;

  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  is_public: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  workout_exercises?: WorkoutExercise[];
  likes?: number;
}


export interface WorkoutPlanResponse {
    id: string;
    name: string;
    user_id: string;
    is_public: boolean;
    calories: number;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    rating_average: number | null;
    ratings_count: number;
    workout_exercises: WorkoutExercise[]; 
}