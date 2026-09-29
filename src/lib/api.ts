export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const API_CACHE_PREFIX = "mstr-api-cache:";

export async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method?.toUpperCase() ?? "GET";
  const cacheKey = `${API_CACHE_PREFIX}${path}`;

  try {
    const response = await fetch(`${API_URL}${path}`, { cache: "no-store", ...options });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body && typeof body.error === "string" ? body.error : `Permintaan gagal (${response.status})`);
    }
    if (method === "GET") {
      try { window.localStorage.setItem(cacheKey, JSON.stringify(body)); } catch { /* Cache opsional. */ }
    }
    return body as T;
  } catch (requestError) {
    if (method === "GET") {
      try {
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached) as T;
      } catch { /* Gunakan error jaringan jika cache tidak tersedia. */ }
    }
    throw requestError;
  }
}