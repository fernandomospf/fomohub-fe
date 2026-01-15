import { Exercise } from '@/types/exercise';
import { supabase } from '../lib/supabase';

const rawApiBase =
  process.env.NEXT_PUBLIC_IRONHUB_API_URL || 'http://localhost:8080';

const API_BASE = rawApiBase.replace(/\/$/, '');

export interface WorkoutExercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTimeSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  exercises?: WorkoutExercise[];
  likesCount?: number;
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
  ): Promise<T> {
    const token = await this.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers ?? {}),
      },
    });

    if (!res.ok) {
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

  public async getAllMyPlans(): Promise<WorkoutPlan[]> {
    return this.authFetch<WorkoutPlan[]>(
      `${this.baseUrl}/workout-plans`,
    )
  }

  public async getPlanById(planId: string): Promise<Exercise[]> {
    return this.authFetch<Exercise[]>(
      `${this.baseUrl}/workout-plans/${planId}`,
    )
  }

}

export const workoutPlanService = new WorkoutPlanService();
export default workoutPlanService;
