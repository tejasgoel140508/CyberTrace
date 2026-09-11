import { IOCType, Severity, type IOC } from "@prisma/client";
import { prisma } from "../config/prisma";
import { detectIocType } from "../utils/detect-ioc-type";
import { normalizeIoc } from "../utils/normalize-ioc";
import { calculateRiskScore } from "./risk.service";
import { calculateRelationshipScore } from "./correlation.service";

const iocSummary = (ioc: IOC) => ({ id: ioc.id, type: ioc.type, value: ioc.value, severity: ioc.severity, riskScore: ioc.riskScore, confidence: ioc.confidence, reputation: ioc.reputation, country: ioc.country, countryCode: ioc.countryCode, latitude: ioc.latitude, longitude: ioc.longitude, asn: ioc.asn, sources: ioc.sources, firstSeen: ioc.firstSeen, lastSeen: ioc.lastSeen, malwareAssociated: Boolean(ioc.malwareAssociated), campaignAssociated: Boolean(ioc.campaignAssociated), isDemo: ioc.isDemo });

export async function investigate(raw: string) {
  const type = detectIocType(raw); if (!type) throw new Error("Invalid IOC format.");
  const value = normalizeIoc(raw, type); let ioc = await prisma.iOC.findUnique({ where: { value } });
  if (!ioc) {
    const risk = calculateRiskScore({ reputation: "UNKNOWN", sourceCount: 0, recentActivity: false, malwareAssociated: false, campaignAssociated: false });
    ioc = await prisma.iOC.create({ data: { type: type as IOCType, value, severity: risk.severity as Severity, riskScore: risk.score, confidence: 0, reputation: "UNKNOWN", sources: [], isDemo: false } });
  }
  const [outgoing, incoming, profiles, locations] = await Promise.all([
    prisma.iOCRelationship.findMany({ where: { sourceIocId: ioc.id }, include: { targetIOC: true } }),
    prisma.iOCRelationship.findMany({ where: { targetIocId: ioc.id }, include: { sourceIOC: true } }),
    prisma.attackProfile.findMany({ where: { iocs: { some: { iocId: ioc.id } } }, include: { iocs: { include: { ioc: true } }, techniques: { include: { technique: true } } } }),
    prisma.iOCLocation.findMany({ where: { iocId: ioc.id }, include: { location: true } })
  ]);
  const relationships = [...outgoing.map(r => ({ ...r, peer: r.targetIOC })), ...incoming.map(r => ({ ...r, peer: r.sourceIOC }))].map(r => { const calculated = calculateRelationshipScore({ sharedIp: r.relationshipType.includes("IP") || r.relationshipType === "RESOLVES_TO", sharedDomain: r.relationshipType.includes("DOMAIN") || r.relationshipType === "HOSTS", sharedHash: r.relationshipType.includes("HASH") || r.relationshipType === "DISTRIBUTES", sharedCampaign: r.relationshipType.includes("CAMPAIGN"), sharedTechnique: false, sharedInfrastructure: r.relationshipType.includes("INFRASTRUCTURE") }); return { id: r.id, sourceIocId: r.sourceIocId, targetIocId: r.targetIocId, relationshipType: r.relationshipType, score: r.score, confidence: r.confidence, strength: calculated.strength, reasons: r.reasons, source: r.sourceIocId === ioc.id ? iocSummary(ioc) : iocSummary(r.peer), target: r.targetIocId === ioc.id ? iocSummary(ioc) : iocSummary(r.peer) }; });
  const profile = profiles[0];
  const attackDNA = profile ? { id: profile.id, name: profile.name, attackType: profile.attackType, severity: profile.severity, confidence: profile.confidence, description: profile.description, techniques: profile.techniques.map(t => ({ id: t.technique.id, name: t.technique.name, description: t.technique.description })), iocs: profile.iocs.map(p => iocSummary(p.ioc)), stats: profile.iocs.reduce((a, p) => { if (p.ioc.type === "IP") a.ips++; if (p.ioc.type === "DOMAIN") a.domains++; if (p.ioc.type === "URL") a.urls++; if (p.ioc.type === "HASH") a.hashes++; return a; }, { ips: 0, domains: 0, urls: 0, hashes: 0 }), explanations: ["Attack DNA is derived from stored, synthetic DEMO_SEED profile membership and techniques."] } : null;
  const risk = calculateRiskScore({ reputation: ioc.reputation, sourceCount: ioc.sources.length, recentActivity: Boolean(ioc.lastSeen && Date.now() - ioc.lastSeen.getTime() < 30 * 86400000), malwareAssociated: Boolean(ioc.malwareAssociated), campaignAssociated: Boolean(ioc.campaignAssociated) });
  const nodes: Array<{ id: string; label: string; type: string; severity: string; metadata: Record<string, unknown> }> = [iocSummary(ioc), ...relationships.map(r => r.sourceIocId === ioc.id ? r.target : r.source)].map(n => ({ id: n.id, label: n.value, type: n.type, severity: n.severity, metadata: { isDemo: n.isDemo } }));
  if (attackDNA) nodes.push({ id: attackDNA.id, label: attackDNA.name, type: "ATTACK_PROFILE", severity: attackDNA.severity, metadata: { confidence: attackDNA.confidence } });
  const edges = relationships.map(r => ({ id: r.id, source: r.sourceIocId, target: r.targetIocId, label: r.relationshipType, score: r.score }));
  const markers = locations.map(l => ({ id: l.location.id, country: l.location.country, countryCode: l.location.countryCode, latitude: l.location.latitude, longitude: l.location.longitude, threatCount: 1, criticalCount: ioc.severity === "CRITICAL" ? 1 : 0, iocIds: [ioc.id] }));
  const warnings = ioc.isDemo ? ["This is synthetic DEMO_SEED data; it is not live threat intelligence."] : ["Absence from a feed does not prove safety. Infrastructure location is not attacker attribution."];
  return { query: raw, generatedAt: new Date().toISOString(), ioc: iocSummary(ioc), enrichment: { providers: [], summary: ioc.isDemo ? "Loaded evidence-backed synthetic demonstration data." : "No configured provider evidence was available." }, risk, relationships, attackDNA, graph: { nodes: Array.from(new Map(nodes.map(n => [n.id, n])).values()), edges }, locations: markers, warnings };
}
