export type OnboardingForm = {
  name: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
  objective: string;
  experience: string;
  frequency: string;
  parq: (boolean | null)[];
  acceptedTerms: boolean;
  acceptedMedical: boolean;
};
