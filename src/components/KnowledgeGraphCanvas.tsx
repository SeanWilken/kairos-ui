import * as React from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
  type OnConnect,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import {
  type KnowledgeGraphData,
  type KnowledgeGraphNode as KnowledgeNode,
  type NodeRelation,
  type NodeFilterType,
} from "../types/knowledge";
import { KnowledgeNodeCard } from "./KnowledgeNodeCard";
import { RelationEdge } from "./RelationEdge";
import { GraphToolbar } from "./GraphToolbar";
import { cn } from "./ui/utils";

const NODE_TYPES: NodeTypes = {
  knowledgeNode: KnowledgeNodeCard as React.ComponentType<any>,
};

const EDGE_TYPES: EdgeTypes = {
  relationEdge: RelationEdge as React.ComponentType<any>,
};

const H_GAP = 280;
const V_GAP = 210;

function autoLayout(nodes: KnowledgeNode[]): Record<string, { x: number; y: number }> {
  const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
  return Object.fromEntries(
    nodes.map((n, i) => [
      n.id,
      { x: (i % cols) * H_GAP, y: Math.floor(i / cols) * V_GAP },
    ])
  );
}

function buildRfNodes(
  nodes: KnowledgeNode[],
  positions: Record<string, { x: number; y: number }>,
  onSelect: (node: KnowledgeNode) => void
): Node[] {
  return nodes.map((node) => ({
    id: node.id,
    type: "knowledgeNode",
    position: positions[node.id] ?? { x: 0, y: 0 },
    data: { ...node, onSelect } as Record<string, unknown>,
  }));
}

function buildRfEdges(
  relations: NodeRelation[],
  onEdgeClick: (edgeId: string) => void
): Edge[] {
  return relations.map((rel) => ({
    id: rel.id,
    source: rel.sourceId,
    target: rel.targetId,
    type: "relationEdge",
    markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
    data: {
      relationType: rel.type,
      label: rel.label,
      weight: rel.weight,
      onEdgeClick,
    } as Record<string, unknown>,
  }));
}

export type KnowledgeGraphCanvasProps = {
  data: KnowledgeGraphData;
  selectedNodeId?: string;
  onNodeSelect?: (node: KnowledgeNode | null) => void;
  onNodeConnect?: (sourceId: string, targetId: string) => void;
  onEdgeClick?: (relationId: string) => void;
  onAddNode?: () => void;
  activeFilter?: NodeFilterType;
  onFilterChange?: (filter: NodeFilterType) => void;
  showMinimap?: boolean;
  className?: string;
};

function KnowledgeGraphCanvasInner({
  data,
  selectedNodeId,
  onNodeSelect,
  onNodeConnect,
  onEdgeClick,
  onAddNode,
  activeFilter = "all",
  onFilterChange,
  showMinimap = true,
  className,
}: KnowledgeGraphCanvasProps) {
  const onNodeSelectRef = React.useRef(onNodeSelect);
  onNodeSelectRef.current = onNodeSelect;

  const onEdgeClickRef = React.useRef(onEdgeClick);
  onEdgeClickRef.current = onEdgeClick;

  const handleNodeSelect = React.useCallback((node: KnowledgeNode) => {
    onNodeSelectRef.current?.(node);
  }, []);

  const handleEdgeClick = React.useCallback((edgeId: string) => {
    onEdgeClickRef.current?.(edgeId);
  }, []);

  const filteredNodes = React.useMemo(
    () => activeFilter === "all" ? data.nodes : data.nodes.filter((n) => n.type === activeFilter),
    [data.nodes, activeFilter]
  );

  const filteredNodeIds = React.useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  const filteredRelations = React.useMemo(
    () => data.relations.filter((r) => filteredNodeIds.has(r.sourceId) && filteredNodeIds.has(r.targetId)),
    [data.relations, filteredNodeIds]
  );

  const availableTypes = React.useMemo(
    () => [...new Set(data.nodes.map((n) => n.type))],
    [data.nodes]
  );

  const positions = React.useMemo(() => {
    const auto = autoLayout(filteredNodes);
    filteredNodes.forEach((n) => {
      if (n.position) auto[n.id] = n.position;
    });
    return auto;
  }, [filteredNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    buildRfNodes(filteredNodes, positions, handleNodeSelect)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildRfEdges(filteredRelations, handleEdgeClick)
  );

  React.useEffect(() => {
    setNodes(buildRfNodes(filteredNodes, positions, handleNodeSelect));
  }, [filteredNodes, positions, handleNodeSelect, setNodes]);

  React.useEffect(() => {
    setEdges(buildRfEdges(filteredRelations, handleEdgeClick));
  }, [filteredRelations, handleEdgeClick, setEdges]);

  React.useEffect(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === selectedNodeId })));
  }, [selectedNodeId, setNodes]);

  const handleConnect: OnConnect = React.useCallback(
    ({ source, target }) => {
      if (source && target) onNodeConnect?.(source, target);
    },
    [onNodeConnect]
  );

  const handlePaneClick = React.useCallback(() => {
    onNodeSelectRef.current?.(null);
  }, []);

  const handleAutoLayout = React.useCallback(() => {
    const auto = autoLayout(filteredNodes);
    setNodes((nds) => nds.map((n) => ({ ...n, position: auto[n.id] ?? n.position })));
  }, [filteredNodes, setNodes]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div className="absolute top-3 left-3 z-10">
        <GraphToolbar
          onAutoLayout={handleAutoLayout}
          onAddNode={onAddNode}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          availableTypes={availableTypes}
        />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onPaneClick={handlePaneClick}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15, duration: 400 }}
        minZoom={0.05}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: "relationEdge",
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border)"
          className="opacity-60"
        />
        {showMinimap && (
          <MiniMap
            nodeStrokeWidth={2}
            zoomable
            pannable
            className="!bg-background !border !border-border !rounded-lg !shadow-sm !bottom-4 !right-4"
          />
        )}
      </ReactFlow>
    </div>
  );
}

export function KnowledgeGraphCanvas(props: KnowledgeGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
