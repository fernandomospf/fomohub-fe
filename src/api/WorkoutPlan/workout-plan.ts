import { ApiRequest } from "../api";
import { ActiveWorkoutSession, ExerciseByIdResponse, ExerciseHistory, WorkoutExercise, WorkoutPlan, WorkoutSession } from "./type";

export class WorkoutPlanService {
  constructor(private api: ApiRequest) { }

  public async getMyPlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans');
  }

  public async getPublicPlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans/public');
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

  public async getAllMyPlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans');
  }

  public async getPlanById(planId: string): Promise<ExerciseByIdResponse> {
    return this.api.get<ExerciseByIdResponse>(`workout-plans/${planId}`);
  }

  public async getWorkoutPlanPublic(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans/public');
  }

  public async listMyLikedPlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans/liked');
  }

  public async listMyFavoritePlans(): Promise<WorkoutPlan[]> {
    return this.api.get<WorkoutPlan[]>('workout-plans/favorite');
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
}