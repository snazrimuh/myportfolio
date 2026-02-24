interface FetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export function useApi() {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase as string
  const token = useCookie('admin_token');

  async function request<T = any>(endpoint: string, opts: FetchOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...opts.headers,
    };

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    const res = await $fetch<T>(`${API_BASE}${endpoint}`, {
      method: (opts.method || 'GET') as any,
      headers,
      body: opts.body ? opts.body : undefined,
    });

    return res;
  }

  return {
    get: <T = any>(endpoint: string) => request<T>(endpoint),
    post: <T = any>(endpoint: string, body: any) => request<T>(endpoint, { method: 'POST', body }),
    put: <T = any>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body }),
    patch: <T = any>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body }),
    del: <T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  };
}
