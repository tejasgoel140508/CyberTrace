import bcrypt from "bcryptjs";
import { IOCType, PrismaClient, Reputation, Severity } from "@prisma/client";

const prisma = new PrismaClient();
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);

type DemoIOC = {
  value: string; type: IOCType; severity: Severity; riskScore: number; confidence: number;
  reputation: Reputation; country: string; countryCode: string; latitude: number; longitude: number;
  asn: string; malwareAssociated: boolean; campaignAssociated: boolean; malware?: string; campaign: string;
};

const baseIocs: DemoIOC[] = [
  { value: "login-m365-secure.test", type: "DOMAIN", severity: "HIGH", riskScore: 75, confidence: 88, reputation: "MALICIOUS", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64501", malwareAssociated: false, campaignAssociated: true, campaign: "Credential Phishing Cluster" },
  { value: "account-verification.test", type: "DOMAIN", severity: "HIGH", riskScore: 70, confidence: 82, reputation: "MALICIOUS", country: "Germany", countryCode: "DE", latitude: 50.1109, longitude: 8.6821, asn: "AS64502", malwareAssociated: false, campaignAssociated: true, campaign: "Credential Phishing Cluster" },
  { value: "https://login-m365-secure.test/signin", type: "URL", severity: "HIGH", riskScore: 78, confidence: 90, reputation: "MALICIOUS", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64501", malwareAssociated: false, campaignAssociated: true, campaign: "Credential Phishing Cluster" },
  { value: "192.0.2.25", type: "IP", severity: "HIGH", riskScore: 72, confidence: 84, reputation: "MALICIOUS", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, asn: "AS64501", malwareAssociated: false, campaignAssociated: true, campaign: "Credential Phishing Cluster" },
  { value: "payload-delivery.test", type: "DOMAIN", severity: "CRITICAL", riskScore: 92, confidence: 95, reputation: "MALICIOUS", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: true, campaignAssociated: true, malware: "DemoLock", campaign: "Ransomware Infrastructure Cluster" },
  { value: "https://payload-delivery.test/update.exe", type: "URL", severity: "CRITICAL", riskScore: 95, confidence: 96, reputation: "MALICIOUS", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: true, campaignAssociated: true, malware: "DemoLock", campaign: "Ransomware Infrastructure Cluster" },
  { value: "198.51.100.88", type: "IP", severity: "CRITICAL", riskScore: 88, confidence: 91, reputation: "MALICIOUS", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: true, campaignAssociated: true, malware: "DemoLock", campaign: "Ransomware Infrastructure Cluster" },
  { value: "a1b2c3d4e5f60718293a4b5c6d7e8f90", type: "HASH", severity: "CRITICAL", riskScore: 94, confidence: 94, reputation: "MALICIOUS", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: true, campaignAssociated: true, malware: "DemoLock", campaign: "Ransomware Infrastructure Cluster" },
  { value: "0123456789abcdef0123456789abcdef01234567", type: "HASH", severity: "HIGH", riskScore: 80, confidence: 86, reputation: "MALICIOUS", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, asn: "AS64503", malwareAssociated: true, campaignAssociated: true, malware: "DemoLock", campaign: "Ransomware Infrastructure Cluster" },
  { value: "auth-reset.test", type: "DOMAIN", severity: "HIGH", riskScore: 76, confidence: 87, reputation: "MALICIOUS", country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, asn: "AS64504", malwareAssociated: false, campaignAssociated: true, campaign: "Malware Command-and-Control Cluster" },
  { value: "command-node.test", type: "DOMAIN", severity: "CRITICAL", riskScore: 90, confidence: 93, reputation: "MALICIOUS", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, asn: "AS64505", malwareAssociated: true, campaignAssociated: true, malware: "TraceBeacon", campaign: "Malware Command-and-Control Cluster" },
  { value: "https://command-node.test/api/v1/checkin", type: "URL", severity: "CRITICAL", riskScore: 89, confidence: 92, reputation: "MALICIOUS", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, asn: "AS64505", malwareAssociated: true, campaignAssociated: true, malware: "TraceBeacon", campaign: "Malware Command-and-Control Cluster" },
  { value: "203.0.113.47", type: "IP", severity: "HIGH", riskScore: 83, confidence: 89, reputation: "MALICIOUS", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, asn: "AS64505", malwareAssociated: true, campaignAssociated: true, malware: "TraceBeacon", campaign: "Malware Command-and-Control Cluster" },
  { value: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789", type: "HASH", severity: "CRITICAL", riskScore: 91, confidence: 94, reputation: "MALICIOUS", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, asn: "AS64505", malwareAssociated: true, campaignAssociated: true, malware: "TraceBeacon", campaign: "Malware Command-and-Control Cluster" }
];

// 48 additional synthetic indicators make the demo useful for exploring
// trends, graph clustering, filtering, and map aggregation. These use only
// .test domains and RFC 5737 documentation addresses.
const demoRegions = [
  { country: "United Kingdom", countryCode: "GB", latitude: 51.5072, longitude: -0.1276 },
  { country: "Brazil", countryCode: "BR", latitude: -23.5505, longitude: -46.6333 },
  { country: "Australia", countryCode: "AU", latitude: -33.8688, longitude: 151.2093 },
  { country: "Canada", countryCode: "CA", latitude: 43.6532, longitude: -79.3832 },
  { country: "India", countryCode: "IN", latitude: 19.076, longitude: 72.8777 },
  { country: "France", countryCode: "FR", latitude: 48.8566, longitude: 2.3522 },
] as const;
const campaignCycle = ["Credential Phishing Cluster", "Ransomware Infrastructure Cluster", "Malware Command-and-Control Cluster"] as const;
const generatedCases = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const region = demoRegions[index % demoRegions.length];
  const campaign = campaignCycle[index % campaignCycle.length];
  const domain = `${campaign === "Credential Phishing Cluster" ? "secure-mail" : campaign === "Ransomware Infrastructure Cluster" ? "update-cache" : "beacon-gateway"}-${String(number).padStart(2, "0")}.test`;
  const ip = `${index % 2 === 0 ? "192.0.2" : "198.51.100"}.${41 + index}`;
  const url = `https://${domain}/${campaign === "Credential Phishing Cluster" ? "verify" : campaign === "Ransomware Infrastructure Cluster" ? "download" : "api/v2/checkin"}`;
  const hash = number.toString(16).padStart(2, "0").repeat(32);
  const critical = campaign !== "Credential Phishing Cluster" && index % 2 === 0;
  const malware = campaign === "Ransomware Infrastructure Cluster" ? "DemoLock" : campaign === "Malware Command-and-Control Cluster" ? "TraceBeacon" : undefined;
  const common = { ...region, asn: `AS${64600 + index}`, campaign, campaignAssociated: true, malwareAssociated: Boolean(malware), malware };
  return { domain, ip, url, hash, common, critical };
});
const generatedIocs: DemoIOC[] = generatedCases.flatMap(({ domain, ip, url, hash, common, critical }, index) => [
  { value: domain, type: "DOMAIN", severity: critical ? "CRITICAL" : "HIGH", riskScore: critical ? 88 : 68 + (index % 10), confidence: 78 + (index % 18), reputation: "MALICIOUS", ...common },
  { value: ip, type: "IP", severity: critical ? "CRITICAL" : "HIGH", riskScore: critical ? 86 : 65 + (index % 12), confidence: 75 + (index % 20), reputation: "MALICIOUS", ...common },
  { value: url, type: "URL", severity: critical ? "CRITICAL" : "HIGH", riskScore: critical ? 91 : 72 + (index % 10), confidence: 80 + (index % 15), reputation: "MALICIOUS", ...common },
  { value: hash, type: "HASH", severity: critical ? "CRITICAL" : "MEDIUM", riskScore: critical ? 90 : 58 + (index % 14), confidence: 70 + (index % 20), reputation: critical ? "MALICIOUS" : "SUSPICIOUS", ...common },
]);
const iocs: DemoIOC[] = [...baseIocs, ...generatedIocs];

const profiles = [
  ["Credential Phishing Cluster", "Phishing", "Synthetic credential-harvesting infrastructure used only for CyberTrace demonstrations.", "HIGH", 88, ["Phishing", "Credential Harvesting", "Malicious Redirect"]],
  ["Ransomware Infrastructure Cluster", "Ransomware", "Synthetic payload-delivery and file-hash cluster used only for CyberTrace demonstrations.", "CRITICAL", 95, ["Malware Distribution", "Ransomware Delivery", "Payload Execution"]],
  ["Malware Command-and-Control Cluster", "Command and Control", "Synthetic beaconing infrastructure cluster used only for CyberTrace demonstrations.", "CRITICAL", 93, ["Command and Control", "Payload Execution"]]
] as const;
const techniques = ["Phishing", "Credential Harvesting", "Malicious Redirect", "Malware Distribution", "Command and Control", "Ransomware Delivery", "Payload Execution"];

async function main() {
  const passwordHash = await bcrypt.hash("CyberTrace123!", 12);
  const user = await prisma.user.upsert({ where: { email: "analyst@cybertrace.local" }, update: { name: "CyberTrace Analyst", passwordHash }, create: { name: "CyberTrace Analyst", email: "analyst@cybertrace.local", passwordHash } });
  const byValue = new Map<string, string>();
  for (const item of iocs) {
    const { malware: _malware, campaign: _campaign, ...iocData } = item;
    const ageInDays = (iocs.indexOf(item) * 3) % 21;
    const firstSeen = daysAgo(ageInDays + 2);
    const lastSeen = daysAgo(ageInDays % 7);
    const ioc = await prisma.iOC.upsert({ where: { value: item.value }, update: { ...iocData, sources: ["DEMO_SEED"], firstSeen, lastSeen, isDemo: true }, create: { ...iocData, sources: ["DEMO_SEED"], firstSeen, lastSeen, isDemo: true } });
    byValue.set(item.value, ioc.id);
    const location = await prisma.location.upsert({ where: { countryCode_latitude_longitude: { countryCode: item.countryCode, latitude: item.latitude, longitude: item.longitude } }, update: { country: item.country }, create: { country: item.country, countryCode: item.countryCode, latitude: item.latitude, longitude: item.longitude } });
    await prisma.iOCLocation.upsert({ where: { iocId_locationId: { iocId: ioc.id, locationId: location.id } }, update: {}, create: { iocId: ioc.id, locationId: location.id } });
  }
  const techniqueIds = new Map<string, string>();
  for (const name of techniques) { const t = await prisma.technique.upsert({ where: { name }, update: {}, create: { name, description: `Synthetic demo technique: ${name}.` } }); techniqueIds.set(name, t.id); }
  for (const [name, attackType, description, severity, confidence, techniqueNames] of profiles) {
    const profile = await prisma.attackProfile.upsert({ where: { name }, update: { attackType, description, severity, confidence, isDemo: true }, create: { name, attackType, description, severity, confidence, isDemo: true } });
    for (const item of iocs.filter((i) => i.campaign === name)) await prisma.attackProfileIOC.upsert({ where: { attackProfileId_iocId: { attackProfileId: profile.id, iocId: byValue.get(item.value)! } }, update: {}, create: { attackProfileId: profile.id, iocId: byValue.get(item.value)! } });
    for (const techniqueName of techniqueNames) await prisma.attackProfileTechnique.upsert({ where: { attackProfileId_techniqueId: { attackProfileId: profile.id, techniqueId: techniqueIds.get(techniqueName)! } }, update: {}, create: { attackProfileId: profile.id, techniqueId: techniqueIds.get(techniqueName)! } });
  }
  const relationship = async (source: string, target: string, relationshipType: string, score: number, reasons: string[]) => prisma.iOCRelationship.upsert({ where: { sourceIocId_targetIocId_relationshipType: { sourceIocId: byValue.get(source)!, targetIocId: byValue.get(target)!, relationshipType } }, update: { score, confidence: 90, reasons }, create: { sourceIocId: byValue.get(source)!, targetIocId: byValue.get(target)!, relationshipType, score, confidence: 90, reasons } });
  await relationship("login-m365-secure.test", "192.0.2.25", "RESOLVES_TO", 80, ["Synthetic DNS association", "DEMO_SEED"]);
  await relationship("https://login-m365-secure.test/signin", "login-m365-secure.test", "HOSTS", 85, ["Synthetic URL host", "DEMO_SEED"]);
  await relationship("account-verification.test", "login-m365-secure.test", "REDIRECTS_TO", 75, ["Synthetic redirect path", "DEMO_SEED"]);
  await relationship("payload-delivery.test", "198.51.100.88", "RESOLVES_TO", 88, ["Synthetic DNS association", "DEMO_SEED"]);
  await relationship("https://payload-delivery.test/update.exe", "a1b2c3d4e5f60718293a4b5c6d7e8f90", "DISTRIBUTES", 95, ["Synthetic payload link", "DEMO_SEED"]);
  await relationship("a1b2c3d4e5f60718293a4b5c6d7e8f90", "0123456789abcdef0123456789abcdef01234567", "SHARES_HASH", 92, ["Synthetic hash family", "DEMO_SEED"]);
  await relationship("command-node.test", "203.0.113.47", "RESOLVES_TO", 90, ["Synthetic DNS association", "DEMO_SEED"]);
  await relationship("https://command-node.test/api/v1/checkin", "command-node.test", "SERVES", 87, ["Synthetic C2 endpoint", "DEMO_SEED"]);
  await relationship("command-node.test", "payload-delivery.test", "SHARED_INFRASTRUCTURE", 70, ["Synthetic demo infrastructure", "DEMO_SEED"]);
  await relationship("login-m365-secure.test", "account-verification.test", "RELATED_CAMPAIGN", 85, ["Synthetic phishing campaign", "DEMO_SEED"]);
  await relationship("command-node.test", "auth-reset.test", "USES_TECHNIQUE", 80, ["Synthetic command-and-control technique", "DEMO_SEED"]);
  for (const [index, item] of generatedCases.entries()) {
    await relationship(item.domain, item.ip, "RESOLVES_TO", 72 + (index % 20), ["Synthetic DNS association", "DEMO_SEED"]);
    await relationship(item.url, item.domain, "HOSTS", 76 + (index % 18), ["Synthetic service endpoint", "DEMO_SEED"]);
    await relationship(item.url, item.hash, "DISTRIBUTES", 74 + (index % 22), ["Synthetic delivery association", "DEMO_SEED"]);
    if (index > 0) await relationship(item.domain, generatedCases[index - 1].domain, "SHARED_INFRASTRUCTURE", 65 + (index % 20), ["Synthetic shared infrastructure", "DEMO_SEED"]);
  }
  await prisma.report.upsert({ where: { id: "demo-foundation-report" }, update: {}, create: { id: "demo-foundation-report", userId: user.id, title: "CyberTrace Demonstration Seed Summary", content: { isDemo: true, disclaimer: "Synthetic demonstration data only; infrastructure locations are associated observations, not attacker attribution." } } });
}
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
