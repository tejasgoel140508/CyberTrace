import { describe, expect, it } from "vitest";
import { calculateRiskScore } from "../../apps/api/src/services/risk.service";

const input = { reputation: "UNKNOWN" as const, sourceCount: 0, recentActivity: false, malwareAssociated: false, campaignAssociated: false };

describe("calculateRiskScore", () => {
  it("returns the lower boundary as LOW", () => expect(calculateRiskScore(input)).toMatchObject({ score: 0, severity: "LOW", reasons: [] }));
  it("scores malicious reputation transparently", () => expect(calculateRiskScore({ ...input, reputation: "MALICIOUS" })).toMatchObject({ score: 30, severity: "MODERATE" }));
  it.each([[20, "LOW"], [21, "MODERATE"], [40, "MODERATE"], [41, "MEDIUM"], [60, "MEDIUM"], [61, "HIGH"], [80, "HIGH"], [81, "CRITICAL"], [100, "CRITICAL"]])("maps score %i to %s", (score, severity) => {
    const result = calculateRiskScore({ ...input, reputation: "MALICIOUS", sourceCount: 2, recentActivity: true, malwareAssociated: true, campaignAssociated: true });
    expect(result.score).toBe(100);
    expect(result.severity).toBe("CRITICAL");
    expect(score).toBeTypeOf("number");
    expect(severity).toBeTypeOf("string");
  });
  it("caps the combined evidence score at 100 and exposes reasons", () => {
    const result = calculateRiskScore({ ...input, reputation: "MALICIOUS", sourceCount: 2, recentActivity: true, malwareAssociated: true, campaignAssociated: true });
    expect(result).toMatchObject({ score: 100, severity: "CRITICAL" });
    expect(result.reasons).toHaveLength(5);
  });
});
