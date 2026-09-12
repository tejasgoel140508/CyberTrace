import type { Reputation, Severity } from "@prisma/client";
export type RiskInput = { reputation: Reputation | "BENIGN" | "UNKNOWN" | "SUSPICIOUS" | "MALICIOUS"; sourceCount: number; recentActivity: boolean; malwareAssociated: boolean; campaignAssociated: boolean };
export function calculateRiskScore(input: RiskInput) {
  let score = 0; const reasons: string[] = [];
  const add = (condition: boolean, points: number, reason: string) => { if (condition) { score += points; reasons.push(reason); } };
  add(input.reputation === "MALICIOUS", 30, "Malicious reputation evidence (+30)");
  add(input.sourceCount >= 2, 20, "Evidence from at least two sources (+20)");
  add(input.recentActivity, 15, "Recent activity observed (+15)");
  add(input.malwareAssociated, 20, "Malware association evidence (+20)");
  add(input.campaignAssociated, 15, "Campaign association evidence (+15)");
  score = Math.min(score, 100);
  const severity: Severity = score <= 20 ? "LOW" : score <= 40 ? "MODERATE" : score <= 60 ? "MEDIUM" : score <= 80 ? "HIGH" : "CRITICAL";
  return { score, severity, reasons };
}
