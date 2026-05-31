const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = new URL(buildUrl(path), window.location.origin);

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
};
