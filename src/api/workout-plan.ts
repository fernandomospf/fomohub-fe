import { supabase } from '../lib/supabase';

const rawApiBase =
  process.env.NEXT_PUBLIC_IRONHUB_API_URL || 'http://localhost:8080';

const API_BASE = rawApiBase.replace(/\/$/, '');

export interface WorkoutSession {
  id: string;
  workout_plan_id: string;
  user_id: string;
  started_at: string;
  finished_at: string | null;
}

export interface WorkoutExercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTimeSeconds: number;
}

type ActiveWorkoutSession = {
  sessionId: string;
  startedAt: string;
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



export interface WorkoutPlan {
  map: any;
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  exercises?: WorkoutExercise[];
  likesCount?: number;
  rating_average?: number | null;
  ratings_count?: number;
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

export class WorkoutPlanService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async getToken(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token ?? null;
    } catch (err) {
      console.error('WorkoutPlanService.getToken error', err);
      return null;
    }
  }

  private async authFetch<T>(
    url: string,
    options?: RequestInit,
    requireAuth: boolean = true
  ): Promise<T> {
    const token = await this.getToken();

    if (!token && requireAuth) {
      throw new Error('Usuário não autenticado');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('Unauthorized request, signing out...');
        await supabase.auth.signOut();
        return null as T;
      }
      if (res.status >= 500) {
        console.error(`Server error (${res.status}):`, await res.text());
        return null as T;
      }
      const text = await res.text();
      throw new Error(`Request failed (${res.status}): ${text}`);
    }

    const text = await res.text();
    if (!text) return null as T;

    return JSON.parse(text) as T;
  }

  public async getMyPlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans`,
    );
  }

  public async getPublicPlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans/public`,
      undefined,
      false
    );
  }

  public async createPlan(payload: {
    name: string;
    isPublic?: boolean;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      weight: number;
      restTimeSeconds: number;
    }[];
    muscleGroups: string[];
    goals: string[];
    trainingTime: number;
    workoutType: string;
  }) {
    return this.authFetch(
      `${this.baseUrl}/workout-plans`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  }


  public async addExercise(
    planId: string,
    payload: WorkoutExercise,
  ): Promise<WorkoutExercise> {
    return this.authFetch<WorkoutExercise>(
      `${this.baseUrl}/workout-plans/${planId}/exercises`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  }

  public async toggleLike(
    planId: string,
  ): Promise<{ liked: boolean }> {
    return this.authFetch<{ liked: boolean }>(
      `${this.baseUrl}/workout-plans/${planId}/like`,
      {
        method: 'POST',
      },
    );
  }

  public async toggleFavorite(planId: string): Promise<{ favorite: boolean }> {
    return this.authFetch<{ favorite: boolean }>(
      `${this.baseUrl}/workout-plans/${planId}/favorite`,
      {
        method: 'POST',
      },
    );
  }

  public async getAllMyPlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans`,
    )
  }

  public async getPlanById(planId: string): Promise<ExerciseByIdResponse> {
    return this.authFetch<ExerciseByIdResponse>(
      `${this.baseUrl}/workout-plans/${planId}`,
      undefined,
      false
    )
  }

  public async getWorkoutPlanPublic(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans/public`,
      undefined,
      false
    )
  }

  public async listMyLikedPlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans/liked`,
    )
  }

  public async listMyFavoritePlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans/favorite`,
    )
  }

  public async startWorkoutSession(planId: string): Promise<WorkoutSession> {
    return this.authFetch<WorkoutSession>(
      `${this.baseUrl}/workout-plans/workout-sessions/start`,
      {
        method: 'POST',
        body: JSON.stringify({ planId: planId }),
      },
    )
  }

  public async addSetToSession(
    sessionId: string,
    payload: {
      workout_exercise_id: string;
      set_number: number;
      reps: number;
      weight: number;
      rest_seconds?: number;
    }
  ): Promise<void> {
    return this.authFetch<void>(
      `${this.baseUrl}/workout-plans/workout-sessions/${sessionId}/sets`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  public async getActiveWorkoutSession(planId: string): Promise<ActiveWorkoutSession> {
    return this.authFetch<ActiveWorkoutSession>(
      `${this.baseUrl}/workout-plans/${planId}/active`,
    )
  }

  public async finishWorkoutSession(sessionId: string): Promise<void> {
    return this.authFetch<void>(
      `${this.baseUrl}/workout-plans/workout-sessions/${sessionId}/finish`,
      {
        method: 'PATCH',
      },
    );
  }

  public async getExerciseHistory(
    exerciseId: string
  ): Promise<ExerciseHistory | null> {
    return this.authFetch<ExerciseHistory>(
      `${this.baseUrl}/workout-plans/exercises/${exerciseId}/history`,
    );
  }


}

export const workoutPlanService = new WorkoutPlanService();
export default workoutPlanService;
