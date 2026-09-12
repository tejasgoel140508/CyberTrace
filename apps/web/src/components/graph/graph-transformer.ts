import type { Edge, Node } from "@xyflow/react";
export function transformInvestigationToGraph(investigation: any): { nodes: Node[]; edges: Edge[] } {
  if (!investigation || typeof investigation !== "object") return { nodes: [], edges: [] };
  const raw = investigation.graph; const nodes = new Map<string, Node>();
  const add = (n: any, i: number) => { if (!n?.id || nodes.has(n.id)) return; nodes.set(n.id, { id: String(n.id), data: { label: String(n.label ?? n.value ?? n.id), type: n.type, metadata: n.metadata }, position: { x: (nodes.size % 4) * 210, y: Math.floor(nodes.size / 4) * 120 }, type: "default" }); };
  raw?.nodes?.forEach(add); add(investigation.ioc, 0);
  const sourceEdges = raw?.edges ?? investigation.relationships ?? [];
  const edges: Edge[] = [];
  sourceEdges.forEach((e: any, i: number) => { const source = String(e.source ?? e.sourceIocId ?? ""); const target = String(e.target ?? e.targetIocId ?? ""); if (e.target && typeof e.target === "object") add(e.target, i + 1); if (source && target) edges.push({ id: String(e.id ?? `${source}-${target}-${i}`), source, target, label: String(e.label ?? e.relationshipType ?? "RELATED"), animated: false }); });
  return { nodes: [...nodes.values()], edges };
}
