import { UserData } from '../types/user';
import { supabase } from '../lib/supabase';

export type Profile = UserData;

const rawApiBase = process.env.NEXT_PUBLIC_IRONHUB_API_URL || 'http://localhost:8080';
const API_BASE = rawApiBase;
export class ProfileService {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE) {
		this.baseUrl = baseUrl.replace(/\/$/, '');
	}

	private async getToken(): Promise<string | null> {
		try {
			const maybeGetSession = (supabase.auth && (supabase.auth as any).getSession)
				? await (supabase.auth as any).getSession()
				: null;

			const session = maybeGetSession?.data?.session ??
				(typeof (supabase.auth as any).session === 'function' ? (supabase.auth as any).session() : null);

			const token = session?.access_token ?? session?.accessToken ?? null;

			return token;
		} catch (err: any) {
			console.error('ProfileService.getToken unexpected error', err);
			return null;
		}
	}

	public async Get(options?: { waitForToken?: boolean; timeoutMs?: number }): Promise<Profile | null> {
		const { waitForToken = true, timeoutMs = 1000 } = options ?? {};

		let token = await this.getToken();

		if (!token && waitForToken) {
			const start = Date.now();
			const interval = 150;
			while (!token && Date.now() - start < timeoutMs) {
				await new Promise((r) => setTimeout(r, interval));
				token = await this.getToken();
			}
		}

		if (!token) {
			console.debug('ProfileService.Get: no token available, skipping API call');
			return null;
		}

		const url = `${this.baseUrl}/profiles/me`;

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				if (res.status === 401) {
					console.warn('Unauthorized request in ProfileService, signing out...');
					await supabase.auth.signOut();
					return null;
				}
				if (res.status >= 500) {
					console.error(`Server error (${res.status}) in ProfileService:`, await res.text());
					return null;
				}
				const body = await res.text();
				throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText} - ${body}`);
			}

			const text = await res.text();
			if (!text) {
				console.debug(`ProfileService.Get: empty response body from ${url}`);
				return null;
			}

			try {
				return JSON.parse(text) as Profile;
			} catch (parseErr: any) {
				throw new Error(`Invalid JSON from ${url}: ${parseErr?.message ?? String(parseErr)} - body: ${text}`);
			}
		} catch (err: any) {
			console.error('ProfileService.Get fetch error', err);
			throw new Error(`Network request failed to ${url}: ${err?.message ?? String(err)}`);
		}
	}

	public async CompletedOnboarding(payload: {
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
	}): Promise<{ success: boolean }> {
		const token = await this.getToken();

		if (!token) {
			throw new Error('Usuário não autenticado');
		}

		const url = `${this.baseUrl}/profiles/onboarding`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const body = await res.text();
				throw new Error(
					`Request to ${url} failed: ${res.status} ${res.statusText} - ${body}`,
				);
			}

			const text = await res.text();
			if (!text) {
				return { success: true };
			}

			return JSON.parse(text) as { success: boolean };
		} catch (err: any) {
			console.error('ProfileService.CompletedOnboarding error', err);
			throw new Error(
				`Network request failed to ${url}: ${err?.message ?? String(err)}`,
			);
		}
	}

	public async dataProfile(options?: { waitForToken?: boolean; timeoutMs?: number }) {
		const { waitForToken = true, timeoutMs = 1000 } = options ?? {};
		let token = await this.getToken();

		if (!token && waitForToken) {
			const start = Date.now();
			const interval = 150;
			while (!token && Date.now() - start < timeoutMs) {
				await new Promise((r) => setTimeout(r, interval));
				token = await this.getToken();
			}
		}

		if (!token) {
			console.debug('ProfileService.Get: no token available, skipping API call');
			return null;
		}

		const url = `${this.baseUrl}/profiles/profile/info`;

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const body = await res.text();
				throw new Error(
					`Request to ${url} failed: ${res.status} ${res.statusText} - ${body}`,
				);
			}

			const text = await res.text();
			if (!text) {
				return null;
			}

			return JSON.parse(text) as Profile;
		} catch (err: any) {
			console.error('ProfileService.Get fetch error', err);
			throw new Error(
				`Network request failed to ${url}: ${err?.message ?? String(err)}`,
			);
		}
	}

	// Atualizações diretas via Supabase (Storage / Postgres)
	// Não passam pela API externa
	public async updateAvatarUrl(
		userId: string,
		avatarUrl: string
	): Promise<void> {
		const { error } = await supabase
			.from("profile_fitness_data")
			.update({ avatar_url: avatarUrl })
			.eq("user_id", userId);

		if (error) {
			console.error("ProfileService.updateAvatarUrl error", error);
			throw error;
		}
	}

}

export const profileService = new ProfileService();
export default profileService;

