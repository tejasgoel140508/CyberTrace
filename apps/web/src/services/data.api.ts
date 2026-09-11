import { api } from "./api-client"; import type { AttackDNA, DashboardStats, IOC, InvestigationResponse, IOCRelationship, Report, ThreatLocation } from "@cybertrace/shared";
export const dashboard=()=>api<DashboardStats>("/dashboard/stats");
export const listIocs=(query:string)=>api<{items:IOC[];pagination:{page:number;limit:number;total:number}}>(`/iocs?search=${encodeURIComponent(query)}`);
export const getIoc=(id:string)=>api<IOC>(`/iocs/${id}`); export const relations=(id:string)=>api<IOCRelationship[]>(`/iocs/${id}/relationships`);
export const investigate=(value:string)=>api<InvestigationResponse>("/iocs/search",{method:"POST",body:JSON.stringify({value})});
export const attackDna=()=>api<AttackDNA[]>("/attack-dna"); export const mapThreats=()=>api<ThreatLocation[]>("/map/threats");
export const reports=()=>api<Report[]>("/reports"); export const report=(iocId:string)=>api<Report>("/reports",{method:"POST",body:JSON.stringify({iocId})});
