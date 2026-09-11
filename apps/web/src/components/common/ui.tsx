import type { Reputation, Severity } from "@cybertrace/shared"; import { reputationClass,severityClass } from "../../utils/severity";
export const Loading=()=> <div className="card text-slate-400">Loading intelligence…</div>;
export const ErrorState=({message}:{message:string})=><div className="card border-red-900 text-red-200">{message}</div>;
export const Empty=({children}:{children:React.ReactNode})=><div className="card text-slate-400">{children}</div>;
export const SeverityBadge=({value}:{value:Severity})=><span className={`rounded px-2 py-1 text-xs font-bold ${severityClass[value]}`}>{value}</span>;
export const ReputationBadge=({value}:{value:Reputation})=><span className={`rounded px-2 py-1 text-xs font-bold ${reputationClass[value]}`}>{value}</span>;
export const DemoBadge=()=> <span className="rounded border border-cyan-700 bg-cyan-950 px-2 py-1 text-xs font-bold text-cyan-200">DEMO DATA</span>;
export const RiskScore=({score}:{score:number})=><div className="text-3xl font-bold text-cyan-300">{score}<span className="text-sm text-slate-500"> / 100</span></div>;
