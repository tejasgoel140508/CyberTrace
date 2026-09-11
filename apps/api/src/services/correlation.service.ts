export type CorrelationInput = { sharedIp: boolean; sharedDomain: boolean; sharedHash: boolean; sharedCampaign: boolean; sharedTechnique: boolean; sharedInfrastructure: boolean };
export function calculateRelationshipScore(input: CorrelationInput) {
  let score = 0; const reasons: string[] = [];
  const rules: Array<[keyof CorrelationInput, number, string]> = [["sharedIp",25,"Shared IP infrastructure"],["sharedDomain",20,"Shared domain"],["sharedHash",30,"Shared file hash"],["sharedCampaign",30,"Shared Attack DNA profile"],["sharedTechnique",15,"Shared technique"],["sharedInfrastructure",20,"Shared associated infrastructure"]];
  for (const [key, points, reason] of rules) if (input[key]) { score += points; reasons.push(`${reason} (+${points}).`); }
  score = Math.min(score, 100); const strength = score < 40 ? "WEAK" : score < 70 ? "POSSIBLE" : "STRONG";
  return { score, strength, reasons };
}
