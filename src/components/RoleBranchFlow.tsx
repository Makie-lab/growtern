"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { roleNodes, roleEdges, type RoleNodeData } from "@/data/roleFlow";
import { resources, type Role } from "@/data/features";
import { ExternalLink } from "lucide-react";
import RoleNode from "./RoleNode";

// Suppress ReactFlow error #002 in development (false positive with React strict mode + HMR)
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("It looks like you've created a new nodeTypes or edgeTypes")) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Module-level constant — never recreated
const NODE_TYPES = { roleNode: RoleNode };

export default function RoleBranchFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(roleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(roleEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedResources = useMemo(() => {
    if (!selectedNodeId) return [];
    const node = roleNodes.find((n) => n.id === selectedNodeId);
    if (!node) return [];
    return resources.filter((r) => r.roles.includes(node.data.label as Role)).slice(0, 5);
  }, [selectedNodeId]);

  const selectedNode = useMemo(
    () => roleNodes.find((n) => n.id === selectedNodeId),
    [selectedNodeId]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<RoleNodeData>) => {
      const clickedId = node.id;
      const newSelectedId = clickedId === selectedNodeId ? null : clickedId;
      setSelectedNodeId(newSelectedId);

      if (!newSelectedId) {
        setNodes((nds) =>
          nds.map((n) => ({ ...n, selected: false, style: { opacity: 1 } }))
        );
        setEdges((eds) =>
          eds.map((e) => ({
            ...e,
            animated: roleEdges.find((re) => re.id === e.id)?.animated || false,
            style: { opacity: 1, stroke: undefined, strokeWidth: 1.5 },
          }))
        );
        return;
      }

      const connected = new Set<string>([newSelectedId]);
      const connEdges = new Set<string>();
      roleEdges.forEach((edge) => {
        if (edge.source === newSelectedId || edge.target === newSelectedId) {
          connected.add(edge.source);
          connected.add(edge.target);
          connEdges.add(edge.id);
        }
      });

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === newSelectedId,
          style: { opacity: connected.has(n.id) ? 1 : 0.15, transition: "opacity 0.3s ease" },
        }))
      );

      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: connEdges.has(e.id),
          style: {
            opacity: connEdges.has(e.id) ? 1 : 0.08,
            stroke: connEdges.has(e.id) ? "#1e3a5f" : undefined,
            strokeWidth: connEdges.has(e.id) ? 2.5 : 1,
            transition: "opacity 0.3s ease",
          },
        }))
      );
    },
    [selectedNodeId, setNodes, setEdges]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false, style: { opacity: 1 } }))
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: roleEdges.find((re) => re.id === e.id)?.animated || false,
        style: { opacity: 1, stroke: undefined, strokeWidth: 1.5 },
      }))
    );
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={NODE_TYPES}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 1.5, stroke: "rgba(0,0,0,0.12)" },
        }}
      >
        <Controls
          className="!bg-white/90 !border-black/10 !rounded-xl !shadow-md"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white/80 !border-black/10 !rounded-xl !shadow-sm"
          maskColor="rgba(0,0,0,0.05)"
          nodeColor={(n) => {
            const cat = (n.data as RoleNodeData)?.category;
            const colors: Record<string, string> = {
              engineering: "#3b82f6",
              design: "#ec4899",
              data: "#8b5cf6",
              management: "#f59e0b",
              security: "#ef4444",
              cloud: "#06b6d4",
              creative: "#1e3a5f",
            };
            return colors[cat] || "#999";
          }}
          pannable
          zoomable
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="rgba(0,0,0,0.06)"
        />
      </ReactFlow>

      {selectedNode && selectedResources.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[320px] z-10 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl p-4 max-h-[280px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold">{selectedNode.data.label}</h4>
              <button
                onClick={onPaneClick}
                className="text-[10px] opacity-40 hover:opacity-100 px-2 py-0.5 rounded-full border border-black/10"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] uppercase tracking-wider opacity-40 font-semibold mb-2">
              Top resources
            </p>
            <div className="space-y-2">
              {selectedResources.map((r) => (
                <a
                  key={r.id}
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/[0.03] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{r.title}</p>
                    <p className="text-[10px] opacity-40">{r.provider}</p>
                  </div>
                  <ExternalLink size={11} className="opacity-20 group-hover:opacity-60 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
