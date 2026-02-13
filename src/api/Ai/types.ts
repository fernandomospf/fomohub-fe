export interface GenerateWorkoutRequest {
  age: number;    
  goal: string;   
  level: string;  
  time: number;   
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