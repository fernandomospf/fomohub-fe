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