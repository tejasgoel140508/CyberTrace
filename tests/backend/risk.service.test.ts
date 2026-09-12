import { describe, expect, it } from "vitest";
import { calculateRiskScore } from "../../apps/api/src/services/risk.service";

describe("calculateRiskScore", () => {
  it("returns UNKNOWN-style zero risk without evidence", () => {
    expect(calculateRiskScore({ reputation: "UNKNOWN", sourceCount: 0, recentActivity: false, malwareAssociated: false, campaignAssociated: false })).toMatchObject({ score: 0, severity: "LOW", reasons: [] });
  });
  it("applies each transparent evidence rule", () => {
    const result = calculateRiskScore({ reputation: "MALICIOUS", sourceCount: 2, recentActivity: true, malwareAssociated: true, campaignAssociated: true });
    expect(result).toMatchObject({ score: 100, severity: "CRITICAL" });
    expect(result.reasons).toHaveLength(5);
  });
  it.each([[20, "LOW"], [21, "MODERATE"], [40, "MODERATE"], [41, "MEDIUM"], [60, "MEDIUM"], [61, "HIGH"], [80, "HIGH"], [81, "CRITICAL"], [100, "CRITICAL"]] as const)("maps score %i to %s", (score, severity) => {
    const result = calculateRiskScore({ reputation: score >= 30 ? "MALICIOUS" : "UNKNOWN", sourceCount: score >= 50 ? 2 : 0, recentActivity: score >= 65, malwareAssociated: score >= 85, campaignAssociated: score >= 100 });
    expect(result.severity).toBe(severity);
  });
});
