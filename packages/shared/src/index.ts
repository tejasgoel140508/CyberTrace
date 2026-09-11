export type IOCType = "IP" | "DOMAIN" | "URL" | "HASH";
export type Severity = "LOW" | "MODERATE" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Reputation = "BENIGN" | "UNKNOWN" | "SUSPICIOUS" | "MALICIOUS";
export type RelationshipStrength = "WEAK" | "POSSIBLE" | "STRONG";

export interface IOC { id: string; type: IOCType; value: string; severity: Severity; riskScore: number; confidence: number; reputation: Reputation; country?: string | null; countryCode?: string | null; latitude?: number | null; longitude?: number | null; asn?: string | null; sources: string[]; firstSeen?: string | null; lastSeen?: string | null; malwareAssociated: boolean; campaignAssociated: boolean; isDemo: boolean; }
export interface RiskResult { score: number; severity: Severity; reasons: string[]; }
export interface IOCRelationship { id: string; sourceIocId: string; targetIocId: string; relationshipType: string; score: number; confidence: number; strength: RelationshipStrength; reasons: string[]; source?: IOC; target?: IOC; }
export interface Technique { id?: string; name: string; description?: string; }
export interface AttackDNA { id: string; name: string; attackType: string; severity: Severity; confidence: number; description: string; techniques: Technique[]; iocs: IOC[]; stats: { ips: number; domains: number; urls: number; hashes: number }; explanations: string[]; isDemo?: boolean; }
export interface ThreatGraphNode { id: string; label: string; type: string; severity?: string; metadata?: Record<string, unknown>; }
export interface ThreatGraphEdge { id: string; source: string; target: string; label: string; score?: number; }
export interface ThreatLocation { id: string; country: string; countryCode?: string; latitude: number; longitude: number; threatCount: number; criticalCount: number; iocIds: string[]; }
export interface EnrichmentProviderResult { provider: string; status: string; reputation?: string; confidence?: number; tags?: string[]; warnings?: string[]; }
export interface EnrichmentResult { providers: EnrichmentProviderResult[]; summary: string; }
export interface InvestigationResponse { query: string; generatedAt: string; ioc: IOC; enrichment: EnrichmentResult; risk: RiskResult; relationships: IOCRelationship[]; attackDNA: AttackDNA | null; graph: { nodes: ThreatGraphNode[]; edges: ThreatGraphEdge[] }; locations: ThreatLocation[]; warnings: string[]; }
export interface DashboardStats { totals: { iocs: number; ips: number; domains: number; urls: number; hashes: number; critical: number }; severityDistribution: { severity: Severity; count: number }[]; trend: { date: string; count: number }[]; recentCriticalIocs: IOC[]; }
export interface Report { id: string; title: string; iocId?: string | null; attackProfileId?: string | null; content: Record<string, unknown>; createdAt: string; }
export interface ApiError { error: { code: string; message: string }; }
