import { supabase } from '../lib/supabase';

export interface TokenProvider {
    getToken(options?: {
        waitForToken?: boolean;
        timeoutMs?: number;
    }): Promise<string | null>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}


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


export class ApiRequest {
  constructor(
    private baseUrl: string,
    private tokenProvider: TokenProvider,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  private async request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {

  const { requireAuth = true, headers = {} } = options ?? {};

  let authHeader: Record<string, string> = {};

  if (requireAuth) {
    const token = await this.tokenProvider.getToken();

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    authHeader = { Authorization: `Bearer ${token}` };
  }

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...this.defaultHeaders,
    ...authHeader,
    ...headers,
  };

  const url = `${this.baseUrl}/${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Request to ${url} failed: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const contentType = res.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return (await res.json()) as T;
  }

  return {} as T;
}

  public get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  public post<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return this.request<T>('POST', endpoint, body, options);
  }

  public patch<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  public delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}
