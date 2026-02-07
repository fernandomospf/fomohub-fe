export type UserData = {
  fitnessData: FitnessData;
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  phone: string;
  updated_at: string;
};

export type Measurements = {
  chest_cm?: string;
  biceps_right_cm?: string;
  biceps_left_cm?: string;
  waist_abdomen_cm?: string;
  thigh_right_cm?: string;
  thigh_left_cm?: string;
  calf_right_cm?: string;
  calf_left_cm?: string;
  forearm_right_cm?: string;
  forearm_left_cm?: string;
  hip_cm?: string;
  weight_kg?: string;
  created_at?: string;
};

export type FitnessData = {
  user_id: string;
  social_name: string;
  birth_date: string;
  gender: string;
  height_cm: number;
  goal: string;
  experience_level: string;
  training_frequency: string;
  created_at: string;
  updated_at: string;
  measurements: Measurements;
  avatar_url: string | null;
}
