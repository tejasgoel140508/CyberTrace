import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const seen = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000);

type DemoIOC = {
  key: string; type: "IP" | "DOMAIN" | "URL" | "HASH"; value: string;
  severity: "HIGH" | "CRITICAL" | "MEDIUM"; riskScore: number; confidence: number;
  country: string; countryCode: string; latitude: number; longitude: number; asn: string;
  malwareAssociated: string | null; campaignAssociated: string; firstSeen: Date; lastSeen: Date;
};

const iocs: DemoIOC[] = [
  { key: "phishDomain", type: "DOMAIN", value: "login-m365-secure.test", severity: "HIGH", riskScore: 75, confidence: 84, country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, asn: "AS64500", malwareAssociated: null, campaignAssociated: "Credential Phishing Cluster", firstSeen: seen(25), lastSeen: seen(1) },
  { key: "phishUrl", type: "URL", value: "https://login-m365-secure.test/signin", severity: "HIGH", riskScore: 80, confidence: 88, country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, asn: "AS64500", malwareAssociated: null, campaignAssociated: "Credential Phishing Cluster", firstSeen: seen(24), lastSeen: seen(1) },
  { key: "redirectUrl", type: "URL", value: "https://account-verification.test/session", severity: "HIGH", riskScore: 72, confidence: 80, country: "Germany", countryCode: "DE", latitude: 50.1109, longitude: 8.6821, asn: "AS64501", malwareAssociated: null, campaignAssociated: "Credential Phishing Cluster", firstSeen: seen(23), lastSeen: seen(2) },
  { key: "phishIp", type: "IP", value: "192.0.2.25", severity: "HIGH", riskScore: 70, confidence: 76, country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, asn: "AS64500", malwareAssociated: null, campaignAssociated: "Credential Phishing Cluster", firstSeen: seen(28), lastSeen: seen(1) },
  { key: "ransomDomain", type: "DOMAIN", value: "payload-delivery.test", severity: "CRITICAL", riskScore: 90, confidence: 92, country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64502", malwareAssociated: "DemoLock", campaignAssociated: "Ransomware Infrastructure Cluster", firstSeen: seen(40), lastSeen: seen(1) },
  { key: "payloadUrl", type: "URL", value: "https://payload-delivery.test/download/briefing", severity: "CRITICAL", riskScore: 95, confidence: 94, country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64502", malwareAssociated: "DemoLock", campaignAssociated: "Ransomware Infrastructure Cluster", firstSeen: seen(39), lastSeen: seen(1) },
  { key: "ransomIp", type: "IP", value: "198.51.100.77", severity: "CRITICAL", riskScore: 88, confidence: 90, country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64502", malwareAssociated: "DemoLock", campaignAssociated: "Ransomware Infrastructure Cluster", firstSeen: seen(45), lastSeen: seen(1) },
  { key: "md5", type: "HASH", value: "a3f5c7e9b1d4f6a8c0e2b4d6f8a1c3e5", severity: "CRITICAL", riskScore: 92, confidence: 93, country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64502", malwareAssociated: "DemoLock", campaignAssociated: "Ransomware Infrastructure Cluster", firstSeen: seen(38), lastSeen: seen(3) },
  { key: "sha256", type: "HASH", value: "b1c3d5e7f9a2c4e6d8f0a1b3c5d7e9f1a3c5e7f9b2d4f6a8c0e2b4d6f8a1c3e", severity: "CRITICAL", riskScore: 96, confidence: 96, country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64502", malwareAssociated: "DemoLock", campaignAssociated: "Ransomware Infrastructure Cluster", firstSeen: seen(37), lastSeen: seen(2) },
  { key: "c2Domain", type: "DOMAIN", value: "command-node.test", severity: "HIGH", riskScore: 82, confidence: 86, country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: "BeaconDemo", campaignAssociated: "Malware Command-and-Control Cluster", firstSeen: seen(18), lastSeen: seen(1) },
  { key: "updateDomain", type: "DOMAIN", value: "update-service.test", severity: "HIGH", riskScore: 78, confidence: 82, country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: "BeaconDemo", campaignAssociated: "Malware Command-and-Control Cluster", firstSeen: seen(17), lastSeen: seen(1) },
  { key: "c2Ip", type: "IP", value: "203.0.113.42", severity: "HIGH", riskScore: 84, confidence: 87, country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: "BeaconDemo", campaignAssociated: "Malware Command-and-Control Cluster", firstSeen: seen(20), lastSeen: seen(1) },
  { key: "sha1", type: "HASH", value: "c2d4e6f8a0b1c3d5e7f9a2b4c6d8e0f1a3b5c7d9", severity: "HIGH", riskScore: 85, confidence: 89, country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: "BeaconDemo", campaignAssociated: "Malware Command-and-Control Cluster", firstSeen: seen(16), lastSeen: seen(2) },
  { key: "authDomain", type: "DOMAIN", value: "auth-reset.test", severity: "MEDIUM", riskScore: 60, confidence: 71, country: "Germany", countryCode: "DE", latitude: 50.1109, longitude: 8.6821, asn: "AS64501", malwareAssociated: null, campaignAssociated: "Credential Phishing Cluster", firstSeen: seen(22), lastSeen: seen(4) }
];

async function main() {
  const passwordHash = await bcrypt.hash("CyberTrace123!", 12);
  const analyst = await prisma.user.upsert({ where: { email: "analyst@cybertrace.local" }, update: { name: "CyberTrace Analyst", passwordHash }, create: { name: "CyberTrace Analyst", email: "analyst@cybertrace.local", passwordHash } });
  const byKey = new Map<string, string>();
  for (const item of iocs) {
    const { key, ...iocData } = item;
    const ioc = await prisma.iOC.upsert({ where: { value: item.value }, update: { ...iocData, reputation: "MALICIOUS", sources: ["DEMO_SEED", "SYNTHETIC_CLUSTER"], isDemo: true }, create: { ...iocData, reputation: "MALICIOUS", sources: ["DEMO_SEED", "SYNTHETIC_CLUSTER"], isDemo: true } });
    byKey.set(key, ioc.id);
  }
  const locations = await Promise.all([
    ["United States", "US", 37.7749, -122.4194], ["Germany", "DE", 50.1109, 8.6821], ["Netherlands", "NL", 52.3676, 4.9041], ["Singapore", "SG", 1.3521, 103.8198]
  ].map(async ([country, countryCode, latitude, longitude]) => prisma.location.upsert({ where: { countryCode_latitude_longitude: { countryCode: countryCode as string, latitude: latitude as number, longitude: longitude as number } }, update: { country: country as string }, create: { country: country as string, countryCode: countryCode as string, latitude: latitude as number, longitude: longitude as number } })));
  for (const item of iocs) {
    const location = locations.find((value) => value.countryCode === item.countryCode)!;
    await prisma.iOCLocation.upsert({ where: { iocId_locationId: { iocId: byKey.get(item.key)!, locationId: location.id } }, update: {}, create: { iocId: byKey.get(item.key)!, locationId: location.id } });
  }
  const techniques = await Promise.all(["Phishing", "Credential Harvesting", "Malicious Redirect", "Malware Distribution", "Command and Control", "Ransomware Delivery", "Payload Execution"].map((name) => prisma.technique.upsert({ where: { name }, update: { description: `${name} observed in a synthetic CyberTrace demonstration cluster.` }, create: { name, description: `${name} observed in a synthetic CyberTrace demonstration cluster.` } })));
  const techniqueByName = new Map(techniques.map((technique) => [technique.name, technique.id]));
  const profiles = [
    { name: "Credential Phishing Cluster", attackType: "Credential theft", severity: "HIGH", confidence: 86, description: "Synthetic phishing flow with credential-harvesting and redirect infrastructure.", iocs: ["phishDomain", "phishUrl", "redirectUrl", "phishIp", "authDomain"], techniques: ["Phishing", "Credential Harvesting", "Malicious Redirect"] },
    { name: "Ransomware Infrastructure Cluster", attackType: "Ransomware delivery", severity: "CRITICAL", confidence: 93, description: "Synthetic payload-delivery infrastructure and demonstrative file hashes.", iocs: ["ransomDomain", "payloadUrl", "ransomIp", "md5", "sha256"], techniques: ["Malware Distribution", "Ransomware Delivery", "Payload Execution"] },
    { name: "Malware Command-and-Control Cluster", attackType: "Command and control", severity: "HIGH", confidence: 88, description: "Synthetic command-and-control infrastructure with a demonstrative SHA-1 hash.", iocs: ["c2Domain", "updateDomain", "c2Ip", "sha1"], techniques: ["Command and Control", "Payload Execution"] }
  ];
  for (const profile of profiles) {
    const record = await prisma.attackProfile.upsert({ where: { name: profile.name }, update: { attackType: profile.attackType, severity: profile.severity as "HIGH" | "CRITICAL", confidence: profile.confidence, description: profile.description, isDemo: true }, create: { name: profile.name, attackType: profile.attackType, severity: profile.severity as "HIGH" | "CRITICAL", confidence: profile.confidence, description: profile.description, isDemo: true } });
    await prisma.attackProfileIOC.createMany({ data: profile.iocs.map((key) => ({ attackProfileId: record.id, iocId: byKey.get(key)! })), skipDuplicates: true });
    await prisma.attackProfileTechnique.createMany({ data: profile.techniques.map((name) => ({ attackProfileId: record.id, techniqueId: techniqueByName.get(name)! })), skipDuplicates: true });
  }
  const relationships: Array<[string, string, string, number, number, string[]]> = [
    ["phishDomain", "phishIp", "RESOLVES_TO", 75, 84, ["Synthetic DNS association", "DEMO_SEED"]], ["phishUrl", "phishDomain", "HOSTS", 80, 88, ["Synthetic hosted URL", "DEMO_SEED"]], ["phishUrl", "redirectUrl", "REDIRECTS_TO", 72, 80, ["Synthetic redirect chain", "DEMO_SEED"]], ["ransomDomain", "ransomIp", "RESOLVES_TO", 90, 92, ["Synthetic DNS association", "DEMO_SEED"]], ["payloadUrl", "ransomDomain", "HOSTS", 95, 94, ["Synthetic payload host", "DEMO_SEED"]], ["payloadUrl", "sha256", "DISTRIBUTES", 96, 96, ["Synthetic file delivery", "DEMO_SEED"]], ["md5", "sha256", "SHARES_HASH", 92, 93, ["Synthetic related file hashes", "DEMO_SEED"]], ["c2Domain", "c2Ip", "RESOLVES_TO", 84, 87, ["Synthetic DNS association", "DEMO_SEED"]], ["updateDomain", "c2Domain", "SHARED_INFRASTRUCTURE", 78, 82, ["Synthetic shared infrastructure", "DEMO_SEED"]], ["c2Domain", "sha1", "SERVES", 85, 89, ["Synthetic C2 payload association", "DEMO_SEED"]], ["phishDomain", "authDomain", "RELATED_CAMPAIGN", 68, 74, ["Synthetic shared campaign", "DEMO_SEED"]]
  ];
  for (const [source, target, relationshipType, score, confidence, reasons] of relationships) await prisma.iOCRelationship.upsert({ where: { sourceIocId_targetIocId_relationshipType: { sourceIocId: byKey.get(source)!, targetIocId: byKey.get(target)!, relationshipType } }, update: { score, confidence, reasons }, create: { sourceIocId: byKey.get(source)!, targetIocId: byKey.get(target)!, relationshipType, score, confidence, reasons } });
  const report = await prisma.report.findFirst({ where: { userId: analyst.id, title: "CyberTrace synthetic cluster overview" } });
  const content = { disclaimer: "Demonstration-only synthetic data. Infrastructure locations are observed/associated locations, not attacker attribution.", profiles: profiles.map((profile) => profile.name) };
  if (report) await prisma.report.update({ where: { id: report.id }, data: { content } }); else await prisma.report.create({ data: { userId: analyst.id, title: "CyberTrace synthetic cluster overview", content } });
  console.log(`Seeded ${iocs.length} synthetic IOCs, ${profiles.length} Attack DNA profiles, and ${locations.length} associated infrastructure locations.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
