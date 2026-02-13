
import { TokenProvider } from '@/api/types';
import { supabase } from '../lib/supabase';

export class SupabaseTokenProvider implements TokenProvider {
    private resolvingPromise: Promise<string | null> | null = null;

    public async getToken(options?: {
        waitForToken?: boolean;
        timeoutMs?: number;
    }): Promise<string | null> {
        const { waitForToken = true, timeoutMs = 1000 } = options ?? {};

        if (this.resolvingPromise) {
            return this.resolvingPromise;
        }

        this.resolvingPromise = this.resolveToken(waitForToken, timeoutMs);

        try {
            return await this.resolvingPromise;
        } finally {
            this.resolvingPromise = null;
        }
    }

    private async resolveToken(
        waitForToken: boolean,
        timeoutMs: number
    ): Promise<string | null> {
        try {
            let token = await this.getCurrentToken();

            if (!token && waitForToken) {
                const start = Date.now();
                const interval = 150;

                while (!token && Date.now() - start < timeoutMs) {
                    await new Promise((r) => setTimeout(r, interval));
                    token = await this.getCurrentToken();
                }
            }

            return token;
        } catch (err) {
            console.error('SupabaseTokenProvider error', err);
            return null;
        }
    }

    private async getCurrentToken(): Promise<string | null> {
        const { data } = await supabase.auth.getSession();
        return data?.session?.access_token ?? null;
    }
}
