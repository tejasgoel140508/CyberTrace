export type RelationshipInput = { sharedIp: boolean; sharedDomain: boolean; sharedHash: boolean; sharedCampaign: boolean; sharedTechnique: boolean; sharedInfrastructure: boolean };
export function calculateRelationshipScore(input: RelationshipInput) {
  let score = 0; const reasons: string[] = [];
  const add = (condition: boolean, points: number, reason: string) => { if (condition) { score += points; reasons.push(reason); } };
  add(input.sharedIp, 25, "Shared IP evidence (+25)"); add(input.sharedDomain, 20, "Shared domain evidence (+20)"); add(input.sharedHash, 30, "Shared hash evidence (+30)"); add(input.sharedCampaign, 30, "Shared Attack DNA profile (+30)"); add(input.sharedTechnique, 15, "Shared technique evidence (+15)"); add(input.sharedInfrastructure, 20, "Shared infrastructure location (+20)");
  score = Math.min(score, 100); return { score, strength: score < 40 ? "WEAK" : score < 70 ? "POSSIBLE" : "STRONG", reasons };
}
