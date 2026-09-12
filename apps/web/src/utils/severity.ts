import type { Reputation, Severity } from "@cybertrace/shared";
export const severityClass: Record<Severity, string> = { LOW:"bg-slate-700 text-slate-200", MODERATE:"bg-blue-900 text-blue-200", MEDIUM:"bg-amber-900 text-amber-200", HIGH:"bg-orange-900 text-orange-200", CRITICAL:"bg-red-900 text-red-200" };
export const reputationClass: Record<Reputation,string> = { BENIGN:"bg-emerald-900 text-emerald-200", UNKNOWN:"bg-slate-700 text-slate-200", SUSPICIOUS:"bg-amber-900 text-amber-200", MALICIOUS:"bg-red-900 text-red-200" };
