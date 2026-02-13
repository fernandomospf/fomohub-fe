import { UserData } from '../../types/user';
import { supabase } from '../../lib/supabase';
import { ApiRequest } from '../api';
import { OnboardingPayload } from './type';

export type Profile = UserData;

export class ProfileService {
	constructor(private api: ApiRequest) { }

	public async get(): Promise<Profile | null> {
		try {
			return await this.api.get<Profile>('profiles/me');
		} catch (err: any) {
			if (err.message.includes('401')) {
				await supabase.auth.signOut();
				return null;
			}
			throw err;
		}
	}

	public async completedOnboarding(payload: OnboardingPayload) {
		return this.api.post<{ success: boolean }>(
			'profiles/onboarding',
			payload
		);
	}

	public async dataProfile() {
		return this.api.get<Profile>('profiles/profile/info');
	}
}

