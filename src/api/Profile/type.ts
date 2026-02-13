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