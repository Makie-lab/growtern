"use client";

import { ReactFlowProvider } from "reactflow";
import RoleBranchFlow from "./RoleBranchFlow";

const categoryColors: Record<string, { dot: string; label: string }> = {
  engineering: { dot: "bg-blue-500", label: "Engineering" },
  design: { dot: "bg-pink-500", label: "Design" },
  data: { dot: "bg-purple-500", label: "Data" },
  management: { dot: "bg-amber-500", label: "Management" },
  security: { dot: "bg-red-500", label: "Security" },
  cloud: { dot: "bg-cyan-500", label: "Cloud" },
  creative: { dot: "bg-emerald-500", label: "Creative" },
};

export default function RoleBranch() {
  return (
    <section
      id="roles"
      aria-label="Industry roles"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 deco-squares deco-dots relative overflow-hidden"
    >
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Career paths</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Roles in the{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            industry
          </span>
        </h2>
        <p className="text-base opacity-60 max-w-xl mx-auto">
          Click any role to highlight its career paths and see matching resources.
          Drag to pan, scroll to zoom.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        {Object.entries(categoryColors).map(([, { dot, label }]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
            <span className="text-xs font-medium opacity-50">{label}</span>
          </div>
        ))}
      </div>

      {/* Flow diagram */}
      <div className="w-full h-[550px] sm:h-[650px] lg:h-[750px] rounded-2xl overflow-hidden border border-[var(--hairline)] bg-[var(--background)] shadow-sm">
        <ReactFlowProvider>
          <RoleBranchFlow />
        </ReactFlowProvider>
      </div>

      <p className="text-center text-xs opacity-30 mt-3">
        Tip: Click a node to see connected paths and resources • Drag to pan • Scroll to zoom
      </p>
    </section>
  );
}
