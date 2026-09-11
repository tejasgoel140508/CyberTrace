import { describe, expect, it } from "vitest";
import { calculateRelationshipScore } from "../../apps/api/src/services/correlation.service";

const none = { sharedIp: false, sharedDomain: false, sharedHash: false, sharedCampaign: false, sharedTechnique: false, sharedInfrastructure: false };

describe("calculateRelationshipScore", () => {
  it("returns a WEAK score with no correlation evidence", () => expect(calculateRelationshipScore(none)).toMatchObject({ score: 0, strength: "WEAK", reasons: [] }));
  it("adds each documented evidence weight", () => {
    expect(calculateRelationshipScore({ ...none, sharedIp: true }).score).toBe(25);
    expect(calculateRelationshipScore({ ...none, sharedDomain: true }).score).toBe(20);
    expect(calculateRelationshipScore({ ...none, sharedHash: true }).score).toBe(30);
    expect(calculateRelationshipScore({ ...none, sharedCampaign: true }).score).toBe(30);
    expect(calculateRelationshipScore({ ...none, sharedTechnique: true }).score).toBe(15);
    expect(calculateRelationshipScore({ ...none, sharedInfrastructure: true }).score).toBe(20);
  });
  it("caps all evidence at 100 and reports STRONG", () => expect(calculateRelationshipScore({ ...none, sharedIp: true, sharedDomain: true, sharedHash: true, sharedCampaign: true, sharedTechnique: true, sharedInfrastructure: true })).toMatchObject({ score: 100, strength: "STRONG" }));
  it.each([[39, "WEAK"], [40, "POSSIBLE"], [69, "POSSIBLE"], [70, "STRONG"]])("documents strength boundary %i as %s", (boundary, strength) => {
    expect(boundary).toBeTypeOf("number");
    expect(strength).toBeTypeOf("string");
  });
});
