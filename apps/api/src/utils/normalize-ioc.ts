import { detectIocType, type IocType } from "./detect-ioc-type";

export function normalizeIoc(value: string, type = detectIocType(value)): string {
  const input = value.trim();
  if (!type) throw new Error("Invalid IOC format.");
  if (type === "HASH") return input.toLowerCase();
  if (type === "DOMAIN") return input.toLowerCase().replace(/\.$/, "");
  if (type === "URL") { const url = new URL(input); url.protocol = url.protocol.toLowerCase(); url.hostname = url.hostname.toLowerCase(); return url.toString(); }
  return input;
}
