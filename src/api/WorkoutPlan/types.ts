export interface WorkoutSession {
  id: string;
  workout_plan_id: string;
  user_id: string;
  started_at: string;
  finished_at: string | null;
}

export type ActiveWorkoutSession = {
  sessionId: string;
  workoutId: string;
  workoutName: string;
  completedSets: number;
  totalSets: number;
  elapsedMinutes: number;
  exercises: Array<{
    workout_exercise_id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    rest_time_seconds: number;
    completed_sets: number;
  }>;
};

export type ActiveWorkoutSessionResponse = ActiveWorkoutSession | null;

export interface ExerciseHistory {
  exercise_id: string;
  exercise_name: string;
  planned_sets: number;
  planned_reps: number;
  planned_weight: number;
  history: {
    date: string;
    sets: {
      set: number;
      reps: number;
      weight: number;
    }[];
  }[];
}

export interface WorkoutExercise {
  created_at: string;
  id: string;
  name: string;
  reps: number;
  rest_time_seconds: number;
  sets: number;
  updated_at: string;
  weight: number;
  workout_plan_id: string;
}

export interface WorkoutPlan {
  calories: number | null;
  created_at: string;
  estimated_duration_minutes?: number;
  goals: string[];
  id: string;
  is_favorite: boolean;
  is_liked: boolean;
  is_public: boolean;
  likes_count: number;
  muscle_groups: string[];
  name: string;
  rating_average: number | null;
  ratings_count: number;
  source_plan_id: string | null;
  training_time: number;
  updated_at: string;
  user_id: string;
  workout_exercises: WorkoutExercise[];
}

export interface ExerciseByIdResponse {
  workout_plan_id: string;
  name: string;
  training_time: number;
  muscle_groups: string[];
  goals: string[];
  is_public: boolean;
  calories: number;
  exercises: [
    {
      id: string;
      name: string;
      sets: number;
      reps: number;
      weight: number;
      rest_time_seconds: number;
      notes: string;
      created_at: string;
    }
  ]
}

export interface MetaPagination {
  total: number;
  page: number;
  lastPage: number;
}





export interface WorkoutPlansResponse {
  data: WorkoutPlan[];
  meta: MetaPagination;
}