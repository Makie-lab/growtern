"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { RoleNodeData } from "@/data/roleFlow";

const categoryStyles: Record<string, { gradient: string; border: string; glow: string }> = {
  engineering: { gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", border: "rgba(59,130,246,0.3)", glow: "0 0 20px rgba(59,130,246,0.4)" },
  design: { gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))", border: "rgba(236,72,153,0.3)", glow: "0 0 20px rgba(236,72,153,0.4)" },
  data: { gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))", border: "rgba(139,92,246,0.3)", glow: "0 0 20px rgba(139,92,246,0.4)" },
  management: { gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))", border: "rgba(245,158,11,0.3)", glow: "0 0 20px rgba(245,158,11,0.4)" },
  security: { gradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))", border: "rgba(239,68,68,0.3)", glow: "0 0 20px rgba(239,68,68,0.4)" },
  cloud: { gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))", border: "rgba(6,182,212,0.3)", glow: "0 0 20px rgba(6,182,212,0.4)" },
  creative: { gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))", border: "rgba(16,185,129,0.3)", glow: "0 0 20px rgba(16,185,129,0.4)" },
};

function RoleNodeComponent({ data, selected }: NodeProps<RoleNodeData>) {
  const style = categoryStyles[data.category] || categoryStyles.engineering;

  return (
    <div
      className="role-flow-node"
      style={{
        background: style.gradient,
        border: `1.5px solid ${style.border}`,
        borderRadius: "16px",
        padding: "12px 20px",
        minWidth: "140px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: selected ? style.glow : "0 2px 8px rgba(0,0,0,0.04)",
        transform: selected ? "scale(1.08)" : "scale(1)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none !w-3 !h-3" />
      <p style={{ fontSize: "13px", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
        {data.label}
      </p>
      <p style={{ fontSize: "10px", opacity: 0.5, margin: "4px 0 0", lineHeight: 1.2 }}>
        {data.description}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none !w-3 !h-3" />
    </div>
  );
}

const RoleNode = memo(RoleNodeComponent);
export default RoleNode;
