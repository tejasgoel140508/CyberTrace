import { describe, expect, it } from "vitest";
import { transformInvestigationToGraph } from "../../apps/web/src/components/graph/graph-transformer";

describe("transformInvestigationToGraph", () => {
  it("creates nodes and edges without mutating an investigation", () => {
    const investigation = { ioc: { id: "ioc-1", value: "login-m365-secure.test", type: "DOMAIN" }, relationships: [{ sourceIocId: "ioc-1", targetIocId: "ioc-2", relationshipType: "RESOLVES_TO", target: { id: "ioc-2", value: "192.0.2.25", type: "IP" } }] };
    const before = structuredClone(investigation);
    const graph = transformInvestigationToGraph(investigation);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(investigation).toEqual(before);
  });

  it("handles an empty graph safely", () => expect(transformInvestigationToGraph({})).toMatchObject({ nodes: [], edges: [] }));
});
