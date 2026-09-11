import { isIP } from "node:net";

const domain = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}\.?$/;
export function detectIocType(value: string): "IP" | "DOMAIN" | "URL" | "HASH" | null {
  const input = value.trim();
  if (!input) return null;
  if (isIP(input)) return "IP";
  if (/^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(input)) return "HASH";
  if (/^https?:\/\//i.test(input)) {
    try { const url = new URL(input); return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname ? "URL" : null; } catch { return null; }
  }
  return domain.test(input) && !input.includes("..") ? "DOMAIN" : null;
}
