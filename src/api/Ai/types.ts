export interface GenerateWorkoutRequest {
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

export interface GenerateWorkoutResponse {
  name: string;           
  duration: number;       
  exercises: Exercise[];  
}

export interface RemainingCreditsResponse {
  status: string;
  credits: number;
}

export interface GeneratedWorkoutResponse {
  id: string;
}
