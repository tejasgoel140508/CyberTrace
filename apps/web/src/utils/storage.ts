const key = "cybertrace.auth";
export type AuthSession = { token: string; user: { id: string; name: string; email: string } };
export const readSession = (): AuthSession | null => { try { const v=sessionStorage.getItem(key); return v ? JSON.parse(v) as AuthSession : null; } catch { return null; } };
export const saveSession = (s: AuthSession) => sessionStorage.setItem(key, JSON.stringify(s));
export const clearSession = () => sessionStorage.removeItem(key);
