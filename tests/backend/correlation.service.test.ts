import { describe, expect, it } from "vitest";
import { calculateRelationshipScore } from "../../apps/api/src/services/correlation.service";

describe("calculateRelationshipScore", () => {
  const empty = { sharedIp: false, sharedDomain: false, sharedHash: false, sharedCampaign: false, sharedTechnique: false, sharedInfrastructure: false };
  it("returns a weak zero-evidence relationship", () => expect(calculateRelationshipScore(empty)).toMatchObject({ score: 0, strength: "WEAK", reasons: [] }));
  it("adds evidence and caps at 100", () => {
    const result = calculateRelationshipScore({ sharedIp: true, sharedDomain: true, sharedHash: true, sharedCampaign: true, sharedTechnique: true, sharedInfrastructure: true });
    expect(result).toMatchObject({ score: 100, strength: "STRONG" });
    expect(result.reasons).toHaveLength(6);
  });
  it.each([[{ sharedIp: true, sharedDomain: false, sharedHash: false, sharedCampaign: false, sharedTechnique: false, sharedInfrastructure: false }, "WEAK"], [{ sharedIp: true, sharedDomain: false, sharedHash: false, sharedCampaign: false, sharedTechnique: true, sharedInfrastructure: false }, "POSSIBLE"], [{ sharedIp: true, sharedDomain: false, sharedHash: true, sharedCampaign: false, sharedTechnique: true, sharedInfrastructure: false }, "STRONG"]] as const)("assigns strength correctly", (input, strength) => {
    expect(calculateRelationshipScore(input).strength).toBe(strength);
  });
});
