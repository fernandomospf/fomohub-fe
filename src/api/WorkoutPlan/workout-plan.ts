import { ApiRequest } from "../api";
import { ActiveWorkoutSession, ActiveWorkoutSessionResponse, ExerciseByIdResponse, ExerciseHistory, WorkoutExercise, WorkoutPlan, WorkoutPlansResponse, WorkoutSession } from "./types";

export class WorkoutPlanService {
  constructor(private api: ApiRequest) { }

  public async getMyPlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans');
  }

  public async getPublicPlans({ page = 1, limit = 10 }: { page?: number, limit?: number } = {}): Promise<WorkoutPlansResponse> {
    return this.api.get<WorkoutPlansResponse>('workout-plans/public', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
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
    return this.api.post(
      'workout-plans',
      payload,
    );
  }

  public async addExercise(
    planId: string,
    payload: WorkoutExercise,
  ): Promise<WorkoutExercise> {
    return this.api.post<WorkoutExercise>(
      `workout-plans/${planId}/exercises`,
      payload,
    );
  }

  public async toggleLike(
    planId: string,
  ): Promise<{ liked: boolean }> {
    return this.api.post<{ liked: boolean }>(
      `workout-plans/${planId}/like`,
      {},
    );
  }

  public async toggleFavorite(planId: string): Promise<{ favorite: boolean }> {
    return this.api.post<{ favorite: boolean }>(
      `workout-plans/${planId}/favorite`,
      {},
    );
  }

  public async getAllMyPlans({ page = 1, limit = 10 }: { page?: number, limit?: number }): Promise<WorkoutPlansResponse> {
    return this.api.get<WorkoutPlansResponse>('workout-plans', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  public async getPlanById(planId: string): Promise<ExerciseByIdResponse> {
    return this.api.get<ExerciseByIdResponse>(`workout-plans/${planId}`);
  }

  public async getWorkoutPlanPublic({ page = 1, limit = 10 }: { page?: number, limit?: number } = {}): Promise<WorkoutPlansResponse> {
    return this.api.get<WorkoutPlansResponse>('workout-plans/public', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  public async listMyLikedPlans({ page = 1, limit = 10 }: { page?: number, limit?: number }): Promise<WorkoutPlansResponse> {
    return this.api.get<WorkoutPlansResponse>('workout-plans/liked', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  public async listMyFavoritePlans({ page = 1, limit = 10 }: { page?: number, limit?: number }): Promise<WorkoutPlansResponse> {
    return this.api.get<WorkoutPlansResponse>('workout-plans/favorite', {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      }
    });
  }

  public async startWorkoutSession(planId: string): Promise<WorkoutSession> {
    return this.api.post<WorkoutSession>(
      'workout-plans/workout-sessions/start',
      { planId: planId },
    );
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
    return this.api.post<void>(
      `workout-plans/workout-sessions/${sessionId}/sets`,
      payload,
    );
  }

  public async getActiveWorkoutSession(planId: string): Promise<ActiveWorkoutSession> {
    return this.api.get<ActiveWorkoutSession>(`workout-plans/${planId}/active`);
  }

  public async finishWorkoutSession(sessionId: string): Promise<void> {
    return this.api.patch<void>(
      `workout-plans/workout-sessions/${sessionId}/finish`,
      {},
    );
  }

  public async getExerciseHistory(
    exerciseId: string
  ): Promise<ExerciseHistory | null> {
    return this.api.get<ExerciseHistory>(`workout-plans/exercises/${exerciseId}/history`);
  }

  public async getGoalsTag(): Promise<string[]> {
    return this.api.get<string[]>(
      "workout-plans/tags/goals",
    );
  }

  public async getMuscleGroupsTag(): Promise<string[]> {
    return this.api.get<string[]>(
      'workout-plans/tags/muscle-groups',
    );
  }

  public async turnPublic(planId: string) {
    return this.api.patch(
      `workout-plans/${planId}/public`, {
      isPublic: true
    }
    )
  }

  public async turnPrivate(planId: string) {
    return this.api.patch(
      `workout-plans/${planId}/private`, {
      isPublic: false
    }
    )
  }

  public async deletePlan(planId: string) {
    return this.api.delete(
      `workout-plans/${planId}`
    )
  }

  public async getActiveSession(): Promise<ActiveWorkoutSessionResponse> {
    return this.api.get<ActiveWorkoutSessionResponse>('workout-plans/sessions/active');
  }
}