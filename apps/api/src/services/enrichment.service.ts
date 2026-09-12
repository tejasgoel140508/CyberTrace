import { lookupIpLocation } from "../providers/ipwhois.provider";
import { queryOtx } from "../providers/otx.provider";
import type { ProviderResult,ProviderReputation } from "../providers/provider.types";
import { providerError,skipped } from "../providers/provider.types";
import { queryUrlhaus } from "../providers/urlhaus.provider";

export type LiveEnrichment={providers:ProviderResult[];reputation:ProviderReputation;confidence:number;sources:string[];malwareAssociated:boolean;campaignAssociated:boolean;tags:string[];firstSeen:Date|null;lastSeen:Date|null;location:Awaited<ReturnType<typeof lookupIpLocation>>;warnings:string[]};
const validDate=(value:string|undefined|null)=>value&&Number.isFinite(new Date(value).getTime())?new Date(value):null;
const minDate=(dates:(Date|null)[])=>dates.filter((date):date is Date=>Boolean(date)).sort((a,b)=>a.getTime()-b.getTime())[0]??null;
const maxDate=(dates:(Date|null)[])=>dates.filter((date):date is Date=>Boolean(date)).sort((a,b)=>b.getTime()-a.getTime())[0]??null;

export async function enrichLiveIoc(value:string,type:string):Promise<LiveEnrichment>{
  const geoApplicable=type==="IP";
  const tasks=[queryOtx(value,type),queryUrlhaus(value,type),geoApplicable?lookupIpLocation(value):Promise.resolve(null)];
  const settled=await Promise.allSettled(tasks);
  const providerAt=(index:number,fallback:string)=>settled[index].status==="fulfilled"?settled[index].value as ProviderResult:providerError(fallback,(settled[index] as PromiseRejectedResult).reason);
  const providers=[providerAt(0,"AlienVault OTX"),providerAt(1,"URLhaus")];
  const geo=settled[2].status==="fulfilled"?(settled[2].value as Awaited<ReturnType<typeof lookupIpLocation>>):null;
  if(geo)providers.push({provider:"Infrastructure Intelligence",status:"SUCCESS",reputation:"UNKNOWN",confidence:100,country:geo.country,countryCode:geo.countryCode,latitude:geo.latitude,longitude:geo.longitude,asn:geo.asn,tags:[],references:[],evidence:["Public IP infrastructure geolocation was returned."],warnings:["Infrastructure location is not attacker location."]});
  else if(geoApplicable)providers.push(skipped("Infrastructure Intelligence","No public IP geolocation is available for this indicator."));
  const threatEvidence=providers.filter(provider=>provider.provider!=="Infrastructure Intelligence"&&provider.status==="SUCCESS");
  const malicious=threatEvidence.filter(provider=>provider.reputation==="MALICIOUS"); const suspicious=threatEvidence.filter(provider=>provider.reputation==="SUSPICIOUS"); const benign=threatEvidence.filter(provider=>provider.reputation==="BENIGN");
  const reputation:ProviderReputation=malicious.length?"MALICIOUS":suspicious.length?"SUSPICIOUS":benign.length?"BENIGN":"UNKNOWN";
  const confidence=threatEvidence.length?Math.round(threatEvidence.reduce((sum,provider)=>sum+(provider.confidence??0),0)/threatEvidence.length):0;
  const warnings=providers.flatMap(provider=>provider.warnings??[]); if(threatEvidence.length===1)warnings.push("Only one intelligence provider returned evidence."); if(!threatEvidence.length)warnings.push("No known malicious evidence was found from the available intelligence sources. This does not guarantee that the indicator is safe.");
  return {providers,reputation,confidence,sources:threatEvidence.map(provider=>provider.provider),malwareAssociated:threatEvidence.some(provider=>provider.malwareAssociated),campaignAssociated:threatEvidence.some(provider=>provider.campaignAssociated),tags:[...new Set(threatEvidence.flatMap(provider=>provider.tags??[]))].slice(0,20),firstSeen:minDate(threatEvidence.map(provider=>validDate(provider.firstSeen))),lastSeen:maxDate(threatEvidence.map(provider=>validDate(provider.lastSeen))),location:geo,warnings};
}
