import * as React from "react";
import { Book, Database, FileText, Settings, Shield, Tag, Users, Wrench } from "lucide-react";
import type { KnowledgeNode } from "../types";
import DraggableCanvas from "./DraggableCanvas";

export interface KnowledgeNodeMapProps {
  nodes: KnowledgeNode[];
  onNodeSelect: (id: string | null) => void;
  selectedNodeId: string | null;
  onNodeMove?: (id: string, position: { x: number; y: number }) => void;
}

export const defaultKnowledgeMapNodes: KnowledgeNode[] = [
  {
    id: "central",
    type: "central",
    title: "AI Context Library",
    content: "Central knowledge index for AI agents",
    position: { x: 520, y: 300 },
    relationships: [
      { targetId: "customer-data", label: "source" },
      { targetId: "product-req", label: "source" },
      { targetId: "clinical", label: "sensitive" },
      { targetId: "glossary", label: "reference" },
      { targetId: "mcp-tools", label: "tooling" },
    ],
  },
  {
    id: "customer-data",
    type: "knowledge",
    title: "Customer Data",
    content: "Contains CRM records for support, sales, and analytics.",
    position: { x: 250, y: 150 },
    metadata: { sensitivity: "High", accessLevel: "Restricted", sourceType: "Database" },
  },
  {
    id: "product-req",
    type: "knowledge",
    title: "Product Requirements",
    content: "Planning docs linked to roadmap milestones.",
    position: { x: 760, y: 150 },
    relatedDocuments: [
      {
        id: "prd-q2",
        kind: "markdown",
        name: "q2-prd.md",
        title: "Q2 Product Requirements",
        content: "# Q2 Requirements\n\n- Bulk edit MVP\n- Validation and retry controls\n- Rollout telemetry dashboards",
        tags: ["product", "requirements", "q2"],
        metadata: { owner: "Product", sensitivity: "internal" },
      },
    ],
    metadata: { sensitivity: "Low", accessLevel: "Internal", sourceType: "Documents", tags: ["product", "requirements"], documentCount: 1 },
  },
  {
    id: "clinical",
    type: "knowledge",
    title: "Clinical Records",
    content: "Sensitive data requiring strict access constraints.",
    position: { x: 200, y: 460 },
    relatedDocuments: [
      {
        id: "clinical-policies",
        kind: "pdf",
        name: "clinical-access-policy.pdf",
        title: "Clinical Access Policy",
        url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        tags: ["policy", "clinical", "restricted"],
        metadata: { owner: "Compliance", sensitivity: "critical" },
      },
    ],
    metadata: { sensitivity: "Critical", accessLevel: "Restricted", sourceType: "Database", tags: ["clinical", "policy"], documentCount: 1 },
  },
  {
    id: "glossary",
    type: "knowledge",
    title: "Glossary",
    content: "Business terminology to improve intent interpretation.",
    position: { x: 650, y: 540 },
    metadata: { sensitivity: "Low", accessLevel: "Public", sourceType: "Reference" },
  },
  {
    id: "mcp-tools",
    type: "knowledge",
    title: "MCP Tools",
    content: "Tool registry, capabilities, and usage policies.",
    position: { x: 900, y: 360 },
    relatedDocuments: [
      {
        id: "tool-inventory",
        kind: "spreadsheet",
        name: "tool-inventory.xlsx",
        title: "Tool Inventory",
        sheets: [
          {
            name: "Registry",
            columns: ["Tool", "Owner", "Status"],
            rows: [["Retriever", "Platform", "Active"], ["Indexer", "Search", "Pilot"]],
          },
        ],
        tags: ["tooling", "registry"],
        metadata: { owner: "Platform", sensitivity: "internal" },
      },
    ],
    metadata: { sensitivity: "Low", accessLevel: "Internal", sourceType: "API", tags: ["tooling", "registry"], documentCount: 1 },
  },
];

function getNodeIcon(node: KnowledgeNode) {
  const source = node.metadata?.sourceType?.toLowerCase();
  if (node.type === "central") return Users;
  if (source?.includes("database")) return Database;
  if (source?.includes("document")) return FileText;
  if (source?.includes("reference")) return Book;
  if (source?.includes("api")) return Wrench;
  if (source?.includes("policy")) return Shield;
  return Settings;
}

function getNodeColor(sensitivity?: string) {
  if (sensitivity === "Critical") return "from-red-50 to-red-100 border-red-300";
  if (sensitivity === "High") return "from-orange-50 to-orange-100 border-orange-300";
  if (sensitivity === "Low") return "from-green-50 to-green-100 border-green-300";
  return "from-blue-50 to-blue-100 border-blue-300";
}

function getAccessBadgeColor(accessLevel?: string) {
  if (accessLevel === "Restricted") return "bg-red-100 text-red-700 border-red-200";
  if (accessLevel === "Internal") return "bg-blue-100 text-blue-700 border-blue-200";
  if (accessLevel === "Public") return "bg-green-100 text-green-700 border-green-200";
  return "bg-neutral-100 text-neutral-700 border-neutral-200";
}

export default function KnowledgeNodeMap({
  nodes,
  onNodeSelect,
  selectedNodeId,
  onNodeMove,
}: KnowledgeNodeMapProps) {
  const mapNodes = nodes.length > 0 ? nodes : defaultKnowledgeMapNodes;
  const dragState = React.useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const zoomRef = React.useRef(1);

  const handleAutoArrange = () => {
    if (!onNodeMove || mapNodes.length === 0) return;
    const center = mapNodes.find((node) => node.type === "central") ?? mapNodes[0];
    const ring = mapNodes.filter((node) => node.id !== center.id);
    onNodeMove(center.id, { x: 540, y: 320 });
    const radius = 330;
    ring.forEach((node, index) => {
      const angle = (index / Math.max(1, ring.length)) * Math.PI * 2;
      onNodeMove(node.id, {
        x: 540 + Math.cos(angle) * radius,
        y: 320 + Math.sin(angle) * radius,
      });
    });
  };

  const handleNodeMouseDown = (event: React.MouseEvent<HTMLDivElement>, node: KnowledgeNode) => {
    if (!onNodeMove) return;
    event.stopPropagation();
    dragState.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      nodeX: node.position.x,
      nodeY: node.position.y,
    };
    onNodeSelect(node.id);
  };

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const active = dragState.current;
      if (!active || !onNodeMove) return;
      const dx = (event.clientX - active.startX) / zoomRef.current;
      const dy = (event.clientY - active.startY) / zoomRef.current;
      onNodeMove(active.id, { x: active.nodeX + dx, y: active.nodeY + dy });
    };

    const handleMouseUp = () => {
      dragState.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onNodeMove]);

  return (
    <DraggableCanvas
      className="relative h-full min-h-[78vh] w-full overflow-hidden bg-neutral-50"
      onBackgroundClick={() => onNodeSelect(null)}
      onArrange={onNodeMove ? handleAutoArrange : undefined}
      overlay={
        <>
        <div className="absolute left-6 top-6 max-w-md rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
          <h3 className="mb-2 text-sm font-medium text-neutral-900">Knowledge Map</h3>
          <p className="text-xs leading-relaxed text-neutral-600">
            This mode shows how brainstormed ideas can become a structured visual knowledge library. The map gives AI agents a
            structured index of what exists, where it lives, and how it relates to other things, without exposing raw data immediately.
          </p>
        </div>
        </>
      }
    >
      {({ zoom: canvasZoom }) => {
        zoomRef.current = canvasZoom;
        return (
          <>
            <svg className="pointer-events-none absolute inset-0" style={{ width: "100%", height: "100%" }}>
              {mapNodes.flatMap((node) =>
                (node.relationships ?? []).map((relationship) => {
                  const targetNode = mapNodes.find((candidate) => candidate.id === relationship.targetId);
                  if (!targetNode) return null;
                  const x1 = node.position.x + 150;
                  const y1 = node.position.y + 75;
                  const x2 = targetNode.position.x + 140;
                  const y2 = targetNode.position.y + 60;
                  return (
                    <line key={`${node.id}-${relationship.targetId}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth="2" opacity="0.45" />
                  );
                }),
              )}
            </svg>

            {mapNodes.map((node) => {
              const Icon = getNodeIcon(node);
              const isCentral = node.type === "central";
              const isSelected = selectedNodeId === node.id;
              const documentCount = node.relatedDocuments?.length ?? node.metadata?.documentCount ?? 0;
              const tags = node.metadata?.tags?.slice(0, 2) ?? node.tags?.slice(0, 2) ?? [];

              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all hover:shadow-xl ${isCentral ? "w-[300px]" : "w-[280px]"}`}
                  style={{ left: node.position.x, top: node.position.y }}
                  onClick={() => onNodeSelect(node.id)}
                  onMouseDown={(event) => handleNodeMouseDown(event, node)}
                >
                  <div
                    className={`rounded-xl border-2 bg-gradient-to-br p-5 shadow-md ${
                      isCentral ? "from-cyan-50 to-blue-50 border-cyan-300" : getNodeColor(node.metadata?.sensitivity)
                    } ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${isCentral ? "bg-cyan-100" : "bg-white"}`}>
                        <Icon className={`h-5 w-5 ${isCentral ? "text-cyan-700" : "text-neutral-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`${isCentral ? "text-base" : "text-sm"} mb-1 font-medium text-neutral-900`}>{node.title ?? "Untitled"}</h3>
                        <p className="text-xs text-neutral-600">{node.content}</p>
                        {!isCentral && (documentCount > 0 || tags.length > 0) ? (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {documentCount > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 px-2 py-0.5 text-[11px] text-neutral-700">
                                <FileText className="h-3 w-3" />
                                {documentCount} doc{documentCount === 1 ? "" : "s"}
                              </span>
                            ) : null}
                            {tags.map((tag) => (
                              <span key={`${node.id}-${tag}`} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 px-2 py-0.5 text-[11px] text-neutral-700">
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {!isCentral ? (
                      <div className="mt-4 space-y-2">
                        {node.metadata?.accessLevel ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Access</span>
                            <span className={`rounded-full border px-2 py-0.5 text-xs ${getAccessBadgeColor(node.metadata.accessLevel)}`}>
                              {node.metadata.accessLevel}
                            </span>
                          </div>
                        ) : null}
                        {node.metadata?.sensitivity ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Sensitivity</span>
                            <span className="text-xs font-medium text-neutral-900">{node.metadata.sensitivity}</span>
                          </div>
                        ) : null}
                        {node.metadata?.sourceType ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Type</span>
                            <span className="text-xs font-medium text-neutral-900">{node.metadata.sourceType}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </>
        );
      }}
    </DraggableCanvas>
  );
}
