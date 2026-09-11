export type RiskInput = { reputation: "BENIGN" | "UNKNOWN" | "SUSPICIOUS" | "MALICIOUS"; sourceCount: number; recentActivity: boolean; malwareAssociated: boolean; campaignAssociated: boolean };
export function calculateRiskScore(input: RiskInput) {
  let score = 0; const reasons: string[] = [];
  if (input.reputation === "MALICIOUS") { score += 30; reasons.push("Malicious reputation evidence (+30)."); }
  if (input.sourceCount >= 2) { score += 20; reasons.push("Two or more intelligence sources (+20)."); }
  if (input.recentActivity) { score += 15; reasons.push("Recent activity observed (+15)."); }
  if (input.malwareAssociated) { score += 20; reasons.push("Malware association evidenced (+20)."); }
  if (input.campaignAssociated) { score += 15; reasons.push("Campaign association evidenced (+15)."); }
  score = Math.min(score, 100);
  const severity = score <= 20 ? "LOW" : score <= 40 ? "MODERATE" : score <= 60 ? "MEDIUM" : score <= 80 ? "HIGH" : "CRITICAL";
  return { score, severity, reasons };
}
