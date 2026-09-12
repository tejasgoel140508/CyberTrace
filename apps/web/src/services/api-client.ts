import type { ApiError } from "@cybertrace/shared";
const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
export class APIClient {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = sessionStorage.getItem("cybertrace_token");
    try { const r = await fetch(`${base}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
      if (!r.ok) { if (r.status === 401) { sessionStorage.clear(); window.dispatchEvent(new Event("cybertrace:unauthorized")); } const data = await r.json().catch(() => null) as ApiError | null; throw new Error(data?.error?.message || `Request failed (${r.status})`); }
      return r.status === 204 ? (undefined as T) : await r.json() as T;
    } catch (e) { if (e instanceof TypeError) throw new Error("CyberTrace API is unavailable. Ensure the local API server is running."); throw e; }
  }
  get<T>(path: string) { return this.request<T>(path); }
  post<T>(path: string, body?: unknown) { return this.request<T>(path, { method: "POST", body: JSON.stringify(body) }); }
}
export const api = new APIClient();
