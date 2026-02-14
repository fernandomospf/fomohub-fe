export type OnboardingPayload = {
	fitnessData: {
		socialName?: string;
		birthDate: string;
		gender?: string;
		heightCm: number;
		weightKg: number;
		goal: string;
		experienceLevel: string;
		trainingFrequency: string;
		};
		parq: {
			hasHeartCondition: boolean;
			chestPainDuringActivity: boolean;
			chestPainLastMonth: boolean;
			dizzinessOrFainting: boolean;
			boneOrJointProblem: boolean;
			usesHeartOrPressureMedication: boolean;
			otherReasonNotToExercise: boolean;
		};
		consent: {
			type: string;
			accepted: boolean;
			acceptedAt: string;
			version: string;
		};
	}

export type OffensiveDaysResponse = {
	offensiveDays: number;
}

export type LastTrainingResponse = {
	lastTraining: {
		finished_at: string;
		workout_plan: {
			id: string;
			user_id: string;
			name: string;
			is_public: boolean;
			is_favorite: boolean;
			created_at: string;
			updated_at: string;
			likes_count: number;
			rating_average: number | null;
			ratings_count: number;
			source_plan_id: string | null;
			muscle_groups: string[];
			goals: string[];
			training_time: number;
			workout_type: string;
		}
	}
}
