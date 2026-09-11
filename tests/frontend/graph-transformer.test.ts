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
});
