"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { RoleNodeData } from "@/data/roleFlow";

const categoryStyles: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  engineering: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)", glow: "0 0 20px rgba(59,130,246,0.4)", text: "#2563eb" },
  design: { bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.4)", glow: "0 0 20px rgba(236,72,153,0.4)", text: "#db2777" },
  data: { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.4)", glow: "0 0 20px rgba(139,92,246,0.4)", text: "#7c3aed" },
  management: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", glow: "0 0 20px rgba(245,158,11,0.4)", text: "#d97706" },
  security: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", glow: "0 0 20px rgba(239,68,68,0.4)", text: "#dc2626" },
  cloud: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", glow: "0 0 20px rgba(6,182,212,0.4)", text: "#0891b2" },
  creative: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", glow: "0 0 20px rgba(16,185,129,0.4)", text: "#059669" },
};

function RoleNodeComponent({ data, selected }: NodeProps<RoleNodeData>) {
  const style = categoryStyles[data.category] || categoryStyles.engineering;

  return (
    <div
      className="role-flow-node"
      style={{
        background: selected ? style.bg.replace("0.12", "0.25") : style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: "16px",
        padding: "14px 22px",
        minWidth: "150px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: selected ? style.glow : "0 2px 12px rgba(0,0,0,0.08)",
        transform: selected ? "scale(1.08)" : "scale(1)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: style.border, width: 8, height: 8, border: "2px solid white" }} />
      <p style={{ fontSize: "13px", fontWeight: 700, margin: 0, lineHeight: 1.3, color: style.text }}>
        {data.label}
      </p>
      <p style={{ fontSize: "10px", opacity: 0.6, margin: "4px 0 0", lineHeight: 1.2, color: "inherit" }}>
        {data.description}
      </p>
      <Handle type="source" position={Position.Bottom} style={{ background: style.border, width: 8, height: 8, border: "2px solid white" }} />
    </div>
  );
}

const RoleNode = memo(RoleNodeComponent);
export default RoleNode;
