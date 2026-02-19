export interface GenerateWorkoutRequest {
  goals: string[];
  weeklyFrequency: number;
  sessionDurationMinutes: number;
  experienceLevel: "iniciante" | "intermediario" | "avancado";
  preferredSplit?: "auto" | "fullbody" | "upper_lower" | "ppl";
}

export interface GenerateSingleWorkoutRequest {
  goal: string;
  time: number;
  muscles: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface RemainingCreditsResponse {
  status: string;
  credits: number;
}

export interface GeneratedWorkoutResponse {
  id: string;
}
