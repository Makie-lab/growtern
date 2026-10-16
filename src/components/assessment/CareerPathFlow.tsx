"use client";

import { memo, useMemo } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, Handle, Position, type Edge, type Node, type NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import type { PathwayResult } from "@/lib/scoring";

type Kind = "pathway" | "competency" | "career";

interface FlowData {
  kind: Kind;
  title: string;
  subtitle: string;
  color: string;
  highlight: boolean;
}

function FlowNodeComponent({ data }: NodeProps<FlowData>) {
  return (
    <div
      style={{
        background: data.highlight ? `${data.color}33` : `${data.color}14`,
        border: `2px solid ${data.highlight ? data.color : `${data.color}66`}`,
        boxShadow: data.highlight ? `0 0 20px ${data.color}66` : "0 2px 12px rgba(0,0,0,0.08)",
        borderRadius: 14,
        padding: data.kind === "competency" ? "8px 12px" : "12px 18px",
        width: data.kind === "competency" ? 150 : 190,
        textAlign: "center",
      }}
    >
      {data.kind !== "pathway" && <Handle type="target" position={Position.Top} style={{ background: data.color, width: 6, height: 6 }} />}
      <p style={{ margin: 0, fontSize: data.kind === "competency" ? 11 : 13, fontWeight: 700, color: data.color, lineHeight: 1.25 }}>
        {data.title}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 10, opacity: 0.7, lineHeight: 1.2 }}>{data.subtitle}</p>
      {data.kind !== "career" && <Handle type="source" position={Position.Bottom} style={{ background: data.color, width: 6, height: 6 }} />}
    </div>
  );
}

const NODE_TYPES = { flow: memo(FlowNodeComponent) };

const COLORS: Record<string, string> = {
  "data-analytics": "#7c3aed",
  "software-development": "#2563eb",
  networking: "#0891b2",
  cybersecurity: "#dc2626",
};

/** AHP hierarchy: pathway → weighted competencies → careers, with the identified path highlighted. */
export default function CareerPathFlow({ results, primaryCareerId }: { results: PathwayResult[]; primaryCareerId: string }) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node<FlowData>[] = [];
    const edges: Edge[] = [];
    const COMP_GAP = 170;
    const COLUMN = COMP_GAP * 5 + 80;

    results.forEach((r, col) => {
      const color = COLORS[r.pathway] ?? "#1e3a5f";
      const x0 = col * COLUMN;
      const centre = x0 + (COMP_GAP * 4) / 2;
      const isPrimaryPathway = r.careers.some((c) => c.id === primaryCareerId);
      const pathwayId = `p-${r.pathway}`;

      nodes.push({
        id: pathwayId,
        type: "flow",
        position: { x: centre - 95 + 75, y: 0 },
        data: { kind: "pathway", title: r.name, subtitle: `AHP score ${r.ahpScore} · ${r.level}`, color, highlight: isPrimaryPathway },
      });

      r.competencies.forEach((c, i) => {
        const id = `c-${c.id}`;
        nodes.push({
          id,
          type: "flow",
          position: { x: x0 + i * COMP_GAP, y: 140 },
          data: { kind: "competency", title: c.name, subtitle: `w ${(c.weight * 100).toFixed(0)}% · score ${c.score}`, color, highlight: false },
        });
        edges.push({
          id: `${pathwayId}-${id}`,
          source: pathwayId,
          target: id,
          label: `${(c.weight * 100).toFixed(0)}%`,
          labelStyle: { fontSize: 9 },
          style: { stroke: color, strokeWidth: 1 + c.weight * 8, opacity: 0.6 },
        });
      });

      const careerGap = (COMP_GAP * 4) / Math.max(1, r.careers.length - 1);
      r.careers.forEach((career, i) => {
        const id = `k-${career.id}`;
        const primary = career.id === primaryCareerId;
        nodes.push({
          id,
          type: "flow",
          position: { x: x0 + i * careerGap - 20, y: 300 },
          data: { kind: "career", title: career.title, subtitle: `AHP fit ${career.fit}`, color, highlight: primary },
        });
        r.competencies.forEach((c) => {
          edges.push({
            id: `c-${c.id}-${id}`,
            source: `c-${c.id}`,
            target: id,
            animated: primary,
            style: { stroke: color, strokeWidth: primary ? 2 : 1, opacity: primary ? 0.8 : 0.15 },
          });
        });
      });
    });

    return { nodes, edges };
  }, [results, primaryCareerId]);

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-[var(--hairline)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
