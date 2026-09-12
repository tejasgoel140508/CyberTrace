import { describe, expect, it } from "vitest";
import { transformInvestigationToGraph } from "../../apps/web/src/components/graph/graph-transformer";

describe("transformInvestigationToGraph", () => {
  it("produces nodes and edges without mutating an investigation", () => {
    const investigation = { iocs: [{ id: "ioc-1", value: "example.test", type: "DOMAIN" }, { id: "ioc-2", value: "192.0.2.1", type: "IP" }], relationships: [{ sourceIocId: "ioc-1", targetIocId: "ioc-2", relationshipType: "RESOLVES_TO" }] };
    const original = structuredClone(investigation);
    const graph = transformInvestigationToGraph(investigation);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(investigation).toEqual(original);
  });
  it("handles an empty investigation safely", () => expect(transformInvestigationToGraph({ iocs: [], relationships: [] })).toMatchObject({ nodes: [], edges: [] }));
  it("adds Attack DNA and MITRE technique nodes when a profile is available", () => {
    const graph=transformInvestigationToGraph({ioc:{id:"ioc-1",value:"login-m365-secure.test",type:"DOMAIN"},iocs:[{id:"ioc-1",value:"login-m365-secure.test",type:"DOMAIN"}],attackDNA:{id:"profile-1",name:"Credential Phishing Cluster",severity:"HIGH",mitreTechniques:[{id:"T1566",name:"Phishing",tactic:"Initial Access"}]}});
    expect(graph.nodes.map(node=>node.id)).toEqual(expect.arrayContaining(["attack-dna-profile-1","mitre-profile-1-T1566"]));
    expect(graph.edges.map(edge=>edge.source)).toContain("attack-dna-profile-1");
  });
});
