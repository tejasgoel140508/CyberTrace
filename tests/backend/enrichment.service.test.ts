import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../apps/api/src/providers/otx.provider",()=>({queryOtx:vi.fn()}));
vi.mock("../../apps/api/src/providers/urlhaus.provider",()=>({queryUrlhaus:vi.fn()}));
vi.mock("../../apps/api/src/providers/ipwhois.provider",()=>({lookupIpLocation:vi.fn()}));

import { enrichLiveIoc } from "../../apps/api/src/services/enrichment.service";
import { queryOtx } from "../../apps/api/src/providers/otx.provider";
import { queryUrlhaus } from "../../apps/api/src/providers/urlhaus.provider";
import { lookupIpLocation } from "../../apps/api/src/providers/ipwhois.provider";

const otx=vi.mocked(queryOtx),urlhaus=vi.mocked(queryUrlhaus),geo=vi.mocked(lookupIpLocation);
describe("enrichLiveIoc",()=>{beforeEach(()=>{otx.mockReset();urlhaus.mockReset();geo.mockReset();geo.mockResolvedValue(null);});it("keeps an IOC UNKNOWN when providers return no evidence",async()=>{otx.mockResolvedValue({provider:"AlienVault OTX",status:"NO_DATA",reputation:"UNKNOWN"});urlhaus.mockResolvedValue({provider:"URLhaus",status:"NO_DATA",reputation:"UNKNOWN"});const result=await enrichLiveIoc("example.org","DOMAIN");expect(result.reputation).toBe("UNKNOWN");expect(result.confidence).toBe(0);});it("continues when one provider fails",async()=>{otx.mockResolvedValue({provider:"AlienVault OTX",status:"ERROR",warnings:["Provider is currently unavailable."]});urlhaus.mockResolvedValue({provider:"URLhaus",status:"SUCCESS",reputation:"MALICIOUS",confidence:88,malwareAssociated:true,tags:["payload"]});const result=await enrichLiveIoc("https://example.org/a","URL");expect(result.reputation).toBe("MALICIOUS");expect(result.malwareAssociated).toBe(true);expect(result.providers).toHaveLength(2);});it("keeps provider rate limiting as a safe status",async()=>{otx.mockResolvedValue({provider:"AlienVault OTX",status:"RATE_LIMITED",warnings:["AlienVault OTX rate limit reached."]});urlhaus.mockResolvedValue({provider:"URLhaus",status:"NO_DATA",reputation:"UNKNOWN"});const result=await enrichLiveIoc("example.org","DOMAIN");expect(result.providers[0].status).toBe("RATE_LIMITED");expect(result.reputation).toBe("UNKNOWN");});});
