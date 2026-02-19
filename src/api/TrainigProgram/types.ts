export interface GenerateProgramPayload {
  goal: 'hypertrophy' | 'strength' | 'endurance' | 'fat_loss';
  experienceLevel: 'iniciante' | 'intermediario' | 'avancado';
  totalWeeks: number;
  weeklyFrequency: number;
  workoutType: 'ppl' | 'upper_lower' | 'full_body';
  equipment?: string[];
}

export interface TrainingProgramResponse {
  id: string;
  name: string;
  totalWeeks: number;
  split: string;
  phases: {
    id: string;
    name: string;
    startWeek: number;
    endWeek: number;
  }[];
  weeks: {
    weekNumber: number;
    phase: string;
    days: {
      dayOrder: number;
      exercises: {
        exerciseId: string;
        name: string;
        sets: number;
        reps: number;
        restSeconds: number;
      }[];
    }[];
  }[];
}