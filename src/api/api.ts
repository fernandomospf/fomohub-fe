import { RequestOptions, TokenProvider } from "./types";

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
