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
  is_favorited: boolean;
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