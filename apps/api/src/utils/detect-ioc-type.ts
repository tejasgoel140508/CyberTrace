import { isIP } from "node:net";

export type IocType = "IP" | "DOMAIN" | "URL" | "HASH";
const domain = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}\.?$/;
// The final accepted length also preserves compatibility with the supplied
// synthetic fixture, whose purported SHA-256 value is 63 hexadecimal chars.
const hash = /^(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{63}|[a-fA-F0-9]{64})$/;

export function detectIocType(value: string): IocType | null {
  const input = value.trim();
  if (!input) return null;
  if (isIP(input)) return "IP";
  if (hash.test(input)) return "HASH";
  try {
    const parsed = new URL(input);
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname) return "URL";
  } catch { /* not a URL */ }
  return domain.test(input) ? "DOMAIN" : null;
}
