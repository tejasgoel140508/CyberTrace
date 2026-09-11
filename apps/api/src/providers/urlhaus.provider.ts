import type { ProviderResult } from "./provider.types";
export async function queryUrlhaus():Promise<ProviderResult>{return {provider:"URLhaus",status:"skipped",reputation:"UNKNOWN",confidence:0,malwareAssociated:false,campaignAssociated:false,tags:[],references:[],warnings:["URLhaus is not configured or unavailable."]};}
