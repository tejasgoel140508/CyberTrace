import { detectIocType } from "./detect-ioc-type";

export function normalizeIoc(value: string): string {
  const input = value.trim(); const type = detectIocType(input);
  if (type === "DOMAIN") return input.toLowerCase().replace(/\.$/, "");
  if (type === "HASH") return input.toLowerCase();
  if (type === "URL") { const url = new URL(input); url.protocol = url.protocol.toLowerCase(); url.hostname = url.hostname.toLowerCase(); return url.toString(); }
  return input;
}
